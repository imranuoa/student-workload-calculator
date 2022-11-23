import { nanoid } from 'nanoid';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import activities, {
	getActivityClass,
	type derivedCalculated,
	type serializedActivity
} from '$lib/activities';
import { Frequency, type Activity } from '$lib/course-activities/genericActivity';

const median = (numbers: number[]) => {
	const sorted = Array.from(numbers).sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 0) {
		return (sorted[middle - 1] + sorted[middle]) / 2;
	}

	return sorted[middle];
};

export interface courseMeta {
	name: string;
	weeks: number;
	weekTemplate: string[];
	target: number;
	targetFreq: Frequency;
}

export interface serializedCourse {
	meta: courseMeta;
	openActivity: number;
	activities: serializedActivity[];
	id: string;
}

interface totalValues {
	median: number;
	total: number;
}

export interface Totals {
	perWeekI: totalValues;
	perWeekS: totalValues;
	perCourseI: totalValues;
	perCourseS: totalValues;
	perCourse: totalValues;
	perWeek: totalValues;
}

export class Course {
	public get id() {
		return this._id;
	}
	static serialize(c: Course): serializedCourse {
		const activities = get(c.activities).map((activity) => {
			const compClass = getActivityClass(activity);
			return compClass.serialize(activity);
		});

		return {
			meta: get(c.meta),
			openActivity: get(c.openActivity),
			activities,
			id: c.id
		};
	}
	static deserialize(c: serializedCourse) {
		try {
			const course = new Course(
				c.meta.name,
				c.meta.weeks,
				c.meta.target,
				c.meta.targetFreq,
				[],
				c.openActivity,
				[],
				c.id
			);
			if (c.meta.weekTemplate)
				course.meta.update((m) => ({ ...m, weekTemplate: c.meta.weekTemplate }));
			try {
				c.activities.forEach((activity) => {
					const activityClass = activities.find((cClass) => cClass.type === activity.type);
					if (!activityClass) throw new Error(`Activity type ${activity.type} not found`);
					course.addActivity(activityClass.deserialize(activity, course.meta));
				});
			} catch (error) {
				console.error('Error deserializing activities', error);
			}
			return course;
		} catch (error) {
			console.error('Error deserializing course', error);
		}
	}
	static getTotal(activities: Activity[]) {
		return derived<Readable<derivedCalculated>[], Totals>(
			activities.map((a) => a.derivedCalculated),
			(values) => {
				return {
					perWeekI: {
						median: median(values.map((v) => v.perWeekI)),
						total: values.reduce((a, v) => a + v.perWeekI, 0)
					},
					perWeekS: {
						median: median(values.map((v) => v.perWeekS)),
						total: values.reduce((a, v) => a + v.perWeekS, 0)
					},
					perCourseI: {
						median: median(values.map((v) => v.perCourseI)),
						total: values.reduce((a, v) => a + v.perCourseI, 0)
					},
					perCourseS: {
						median: median(values.map((v) => v.perCourseS)),
						total: values.reduce((a, v) => a + v.perCourseS, 0)
					},
					perCourse: {
						median: median(values.map((v) => v.perCourseI + v.perCourseS)),
						total: values.reduce((a, v) => a + v.perCourseI + v.perCourseS, 0)
					},
					perWeek: {
						median: median(values.map((v) => v.perWeekI + v.perWeekS)),
						total: values.reduce((a, v) => a + v.perWeekI + v.perWeekS, 0)
					}
				};
			}
		);
	}
	static getGradeTotals(activities: Activity[]) {
		return derived(
			activities.map((a) => a.gradeWorth),
			(grades) => {
				return {
					median: median(grades),
					total: grades.reduce((a, v) => a + v, 0)
				};
			}
		);
	}
	openActivity: Writable<number>;
	meta: Writable<courseMeta>;
	private _activities: Writable<Activity[]> = writable([]);
	public get activities(): Writable<Activity[]> {
		return this._activities;
	}
	watchDerived() {
		const d = derived([this.openActivity, this.meta, this._activities], (e) => e);
		d.subscribe(this.notify);
	}
	subscribe(f: Function) {
		this.subscribers.push(f);
		return () => {
			const index = this.subscribers.indexOf(f);
			if (index !== -1) {
				this.subscribers.splice(index, 1);
			}
		};
	}
	notify = () => this.subscribers.forEach((f) => f());
	addActivity(activity: Activity, open = true) {
		activity.subscribe(() => {
			this.notify();
		});
		this._activities.update((c) => {
			return [...c, activity];
		});
		if (open) this.openActivity.set(get(this.activities).length - 1);
	}
	removeActivity(i: number) {
		const numActivities = get(this.activities).length;
		if (numActivities === 1) {
			this._activities.set([]);
			this.openActivity.set(-1);
		} else {
			this._activities.update((c) => {
				c.splice(i, 1);
				return c;
			});
			if (get(this.openActivity) === i) {
				if (numActivities === i + 1) {
					this.openActivity.set(i - 1);
				} else {
					this.openActivity.set(i);
				}
			} else {
				this.openActivity.update((o) => {
					if (o > i) return o - 1;
					return o;
				});
			}
			console.log(get(this.openActivity));
		}
	}
	constructor(
		name = '',
		weeks = 0,
		target = 10,
		targetFreq = Frequency.Weekly,
		activities: Activity[] = [],
		openActivity = 0,
		private subscribers: Function[] = [],
		private _id = nanoid()
	) {
		this.openActivity = writable(openActivity);
		this.meta = writable({
			name,
			weeks,
			weekTemplate: [...Array(weeks).keys()].map((e) => (e + 1).toString()),
			target,
			targetFreq
		});
		activities.forEach((c) => this.addActivity(c));
		this.watchDerived();
	}
}

// Utility functions to handle type narrowing in Svelte components
export interface courseDataValid {
	course: Course;
	meta: courseMeta;
	activities: Activity[];
	totals: Totals;
}
export interface courseDataMissing {
	course: undefined;
	meta: undefined;
	activities: undefined;
	totals: undefined;
}

export type courseData = courseDataValid | courseDataMissing;
export const getCourseData = (
	course: Course | undefined,
	meta: courseMeta | undefined,
	activities: Activity[] | undefined,
	totals: Totals | undefined
) =>
	({
		course,
		meta: meta!,
		activities: activities!,
		totals: totals!
	} as courseData);
