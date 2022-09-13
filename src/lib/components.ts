import deepClone from 'deep-clone';
import type { courseMeta } from './course';
import primaryMeeting from './component-forms/primary-meeting.svelte';
import { derived, writable, type Writable } from 'svelte/store';

export enum Frequency {
	Weekly,
	Semester
}

export interface FormElement {
	id: string;
	component: any;
}

// Data for the instance of the component type
export interface ComponentData {
	name: string;
	freq: Frequency;
	[key: string]: any;
	calculated?: calculatedResults;
}

export interface calculatedResults {
	occurences: number;
	prepHoursPer: number;
	independantHoursPer: number;
	scheduledHoursPer: number;
	postActivityHoursPer: number;
	weeksRunning?: boolean[];
}

export class componentInstance {
	data;
	calculatedData;
	constructor(public type: Component, data: ComponentData, courseMeta: Writable<courseMeta>) {
		this.data = writable(data);
		this.calculatedData = derived([this.data, courseMeta], ([$data, $courseMeta]) => {
			if (!$data.calculated) return { perWeekI: 0, perWeekS: 0, perSemI: 0, perSemS: 0 };
			let perWeek, perSem;
			if ($data.freq === Frequency.Weekly) {
				perWeek = $data.calculated.occurences;
				const weeksRunning = $data.calculated.weeksRunning?.filter((x) => x).length;
				perSem =
					$data.calculated.occurences *
					(weeksRunning === undefined ? $courseMeta.weeks : weeksRunning);
			} else {
				perWeek = $data.calculated.occurences / $courseMeta.weeks;
				perSem = $data.calculated.occurences;
			}
			let IPerOcc =
				$data.calculated.independantHoursPer +
				$data.calculated.prepHoursPer +
				$data.calculated.postActivityHoursPer;
			let SPerOcc = $data.calculated.scheduledHoursPer;
			return {
				perWeekI: perWeek * IPerOcc,
				perWeekS: perWeek * SPerOcc,
				perSemI: perSem * IPerOcc,
				perSemS: perSem * SPerOcc
			};
		});
	}
}

class Component {
	constructor(
		public name: string,
		public short: string,
		public icon: string,
		public description: string,
		public form: any,
		private dataTemplate: ComponentData
	) {}
	newInstance(courseMeta: Writable<courseMeta>) {
		return new componentInstance(this, deepClone(this.dataTemplate), courseMeta);
	}
}


const components: Component[] = [
	new Component('Primary Class Meeting', 'Primary Meeting', '🧑‍🏫', ``, primaryMeeting, {
		name: 'Lectures',
		freq: Frequency.Weekly,
		meetingsPerWeek: 1,
		meetingLength: 1
	})
];

const test = components[0].newInstance(writable({name:'',weeks:0}))
test.data.subscribe(x=>{
	x.
})

components.push(components[0]);
components.push(components[0]);
components.push(components[0]);

export default components;
