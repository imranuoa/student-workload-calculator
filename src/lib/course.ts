import activities, { getActivityClass, type serializedActivity } from '$lib/activities';
import type { Activity } from '$lib/course-activities/genericActivity';
import { derived, get, writable, type Writable } from 'svelte/store';

export interface courseMeta {
	name: string;
	weeks: number;
}

export interface serializedCourse {
	meta: courseMeta;
	openActivity: number;
	activities: serializedActivity[];
}

export class Course {
	static serialize(c: Course): serializedCourse {
		const activities = get(c.activities).map((activity) => {
			const compClass = getActivityClass(activity);
			return compClass.serialize(activity);
		});

		return {
			meta: get(c.meta),
			openActivity: get(c.openActivity),
			activities
		};
	}
	static deserialize(c: serializedCourse) {
		try {
			const course = new Course(c.meta.name, c.meta.weeks, [], c.openActivity);
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
		activities: Activity[] = [],
		openActivity = 0,
		private subscribers: Function[] = []
	) {
		this.openActivity = writable(openActivity);
		this.meta = writable({ name, weeks });
		activities.forEach((c) => this.addActivity(c));
		this.watchDerived();
	}
}
