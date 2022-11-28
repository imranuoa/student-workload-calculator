import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import type { courseMeta } from '../course';
import type { FormElement } from '$lib/form';
import type {
	serializedActivity,
	calculatedResults,
	derivedCalculated,
	ActivitySubClass
} from '../activities';

export enum Frequency {
	Weekly = 0,
	Course = 1
}

export type writableProperties = string[];

export abstract class Activity {
	static readonly writables: writableProperties = ['instanceName'];
	static serialize(instance: Activity): serializedActivity {
		return {
			type: this.type,
			props: this.writables.reduce((acc, cur) => {
				acc[cur] = get((instance as any)[cur] as Readable<any>);
				return acc;
			}, {} as Record<string, any>)
		};
	}
	static deserialize(obj: serializedActivity, courseMeta: Writable<courseMeta>): Activity {
		try {
			const activity = new (this as ActivitySubClass)(courseMeta);
			try {
				for (const prop of this.writables) {
					if (obj.props[prop] !== undefined) {
						((activity as any)[prop] as Writable<any>).set(obj.props[prop]);
					}
				}
			} catch (error) {
				console.error(
					`Failed to deserialize '${this.type}' activity. Failed while setting writables. Returning instance with some default values`,
					error
				);
			}
			return activity;
		} catch (error) {
			throw new Error(
				`Failed to deserialize activity: '${this.type}'. Failed while creating instance`
			);
		}
	}
	// About the activity
	static type = 'Activity';
	static label: string;
	static icon: string;
	static description: string;
	gradeWorth = writable(0); // Percent 1-100
	abstract form: FormElement[];
	abstract instanceName: Writable<string>;
	abstract freq: Readable<Frequency>;
	abstract readonly results: Readable<calculatedResults>;
	abstract derivedCalculated: Readable<derivedCalculated>;
	// Data for the instance of the activity type
	setDerived(courseMeta: Readable<courseMeta>): Readable<derivedCalculated> {
		return derived(
			[this.results, courseMeta, this.freq, this.gradeWorth],
			([$results, $courseMeta, $freq, $gradeWorth]) => {
				if (!$results)
					return {
						perWeekI: 0,
						perWeekS: 0,
						perCourseI: 0,
						perCourseS: 0,
						weeklyI: [],
						weeklyS: [],
						weeklyGrade: []
					};
				let perWeek: number, perCourse: number;
				if ($freq === Frequency.Weekly) {
					perWeek = $results.occurences;
					const weeksRunning = $results.weeksRunning?.filter((x) => x).length;
					perCourse =
						$results.occurences * (weeksRunning === undefined ? $courseMeta.weeks : weeksRunning);
				} else {
					perWeek = $results.occurences / $courseMeta.weeks;
					perCourse = $results.occurences;
				}
				let IPerOcc =
					$results.IndependentHoursPer + $results.prepHoursPer + $results.postActivityHoursPer;
				let SPerOcc = $results.scheduledHoursPer;
				let weeklyI = new Array($courseMeta.weeks).fill(IPerOcc * perWeek);
				let weeklyS = new Array($courseMeta.weeks).fill(SPerOcc * perWeek);
				let weeklyGrade = new Array($courseMeta.weeks).fill($gradeWorth * perWeek);
				if ($results.weeksRunning) {
					weeklyI = $results.weeksRunning.map((w) => (w ? IPerOcc * perWeek : 0));
					weeklyS = $results.weeksRunning.map((w) => (w ? SPerOcc * perWeek : 0));
					weeklyGrade = $results.weeksRunning.map((w) => (w ? $gradeWorth * perWeek : 0));
				}
				return {
					perWeekI: Math.round(perWeek * IPerOcc * 100) / 100,
					perWeekS: Math.round(perWeek * SPerOcc * 100) / 100,
					perCourseI: Math.round(perCourse * IPerOcc * 100) / 100,
					perCourseS: Math.round(perCourse * SPerOcc * 100) / 100,
					weeklyI,
					weeklyS,
					weeklyGrade
				};
			}
		);
	}
	constructor(
		courseMeta: Writable<courseMeta>,
		private subscribers: Function[] = [],
		gradeWorth?: number
	) {
		this.gradeWorth.set(gradeWorth || 0);
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
	watchDerived() {
		this.derivedCalculated.subscribe(this.notify);
		this.instanceName.subscribe(this.notify);
	}
}
