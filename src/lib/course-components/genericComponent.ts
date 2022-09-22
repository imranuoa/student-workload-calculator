import { derived, type Readable, type Writable } from 'svelte/store';
import type { courseMeta } from '../course';
import type { FormElement } from '../form';
import { getComponentClass } from '../components';
import type { serializedComponent, calculatedResults, derivedCalculated } from '../components';

export enum Frequency {
	Weekly,
	Semester
}

export abstract class Component {
	static serialize(component: Component): serializedComponent {
		throw new Error("Method 'serialize' not implemented.");
	}
	static deserialize(obj: serializedComponent, courseMeta: Writable<courseMeta>): Component {
		throw new Error("Method 'deserialize' not implemented.");
	}
	// About the component
	static type = 'Component';
	static label: string;
	static icon: string;
	static description: string;
	static freq: Frequency;
	abstract form: FormElement[];
	abstract instanceName: Writable<string>;
	abstract readonly results: Readable<calculatedResults>;
	abstract derivedCalculated: Readable<derivedCalculated>;
	// Data for the instance of the component type
	setDerived(courseMeta: Readable<courseMeta>) {
		return derived([this.results, courseMeta], ([$results, $courseMeta]) => {
			if (!$results) return { perWeekI: 0, perWeekS: 0, perSemI: 0, perSemS: 0 };
			let perWeek, perSem;
			if (getComponentClass(this).freq === Frequency.Weekly) {
				perWeek = $results.occurences;
				const weeksRunning = $results.weeksRunning?.filter((x) => x).length;
				perSem =
					$results.occurences * (weeksRunning === undefined ? $courseMeta.weeks : weeksRunning);
			} else {
				perWeek = $results.occurences / $courseMeta.weeks;
				perSem = $results.occurences;
			}
			let IPerOcc =
				$results.independantHoursPer + $results.prepHoursPer + $results.postActivityHoursPer;
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
