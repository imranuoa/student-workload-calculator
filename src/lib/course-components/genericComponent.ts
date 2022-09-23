import { derived, get, type Readable, type Writable } from 'svelte/store';
import type { courseMeta } from '../course';
import type { FormElement } from '../form';
import type {
	serializedComponent,
	calculatedResults,
	derivedCalculated,
	ComponentSubClass
} from '../components';

export enum Frequency {
	Weekly = 0,
	Semester = 1
}

export type writableProperties = string[];

export abstract class Component {
	static readonly writables: writableProperties = ['instanceName'];
	static serialize(instance: Component): serializedComponent {
		return {
			type: this.type,
			props: this.writables.reduce((acc, cur) => {
				acc[cur] = get((instance as any)[cur] as Readable<any>);
				return acc;
			}, {} as Record<string, any>)
		};
	}
	static deserialize(obj: serializedComponent, courseMeta: Writable<courseMeta>): Component {
		try {
			const component = new (this as ComponentSubClass)(courseMeta);
			try {
				for (const prop of this.writables) {
					if (obj.props[prop] !== undefined) {
						((component as any)[prop] as Writable<any>).set(obj.props[prop]);
					}
				}
			} catch (error) {
				console.error(
					`Failed to deserialize '${this.type}' component. Failed while setting writables. Returning instance with some default values`,
					error
				);
			}
			return component;
		} catch (error) {
			throw new Error(
				`Failed to deserialize component: '${this.type}'. Failed while creating instance`
			);
		}
	}
	// About the component
	static type = 'Component';
	static label: string;
	static icon: string;
	static description: string;
	abstract form: FormElement[];
	abstract instanceName: Writable<string>;
	abstract freq: Readable<Frequency>;
	abstract readonly results: Readable<calculatedResults>;
	abstract derivedCalculated: Readable<derivedCalculated>;
	// Data for the instance of the component type
	setDerived(courseMeta: Readable<courseMeta>) {
		return derived([this.results, courseMeta, this.freq], ([$results, $courseMeta, $freq]) => {
			if (!$results) return { perWeekI: 0, perWeekS: 0, perSemI: 0, perSemS: 0 };
			let perWeek, perSem;
			if ($freq === Frequency.Weekly) {
				perWeek = $results.occurences;
				const weeksRunning = $results.weeksRunning?.filter((x) => x).length;
				perSem =
					$results.occurences * (weeksRunning === undefined ? $courseMeta.weeks : weeksRunning);
			} else {
				perWeek = $results.occurences / $courseMeta.weeks;
				perSem = $results.occurences;
			}
			let IPerOcc =
				$results.IndependentHoursPer + $results.prepHoursPer + $results.postActivityHoursPer;
			let SPerOcc = $results.scheduledHoursPer;
			return {
				perWeekI: Math.round(perWeek * IPerOcc * 100) / 100,
				perWeekS: Math.round(perWeek * SPerOcc * 100) / 100,
				perSemI: Math.round(perSem * IPerOcc * 100) / 100,
				perSemS: Math.round(perSem * SPerOcc * 100) / 100
			};
		});
	}
	constructor(courseMeta: Writable<courseMeta>, private subscribers: Function[] = []) {}
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
