import type { SvelteComponent } from 'svelte';
import type { courseMeta } from './course';
import primaryMeeting from './component-forms/primary-meeting.svelte';

// Component type
export interface Component {
	name: string;
	short: string;
	icon: string;
	description: string;
	form: any;
	dataTemplate: ComponentData;
}
// An instance of the component type
export interface componentInstance {
	type: string;
	data: ComponentData;
}

export enum Frequency {
	Weekly,
	Semester
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

export const additionalCalculated = (data: ComponentData, courseInfo: courseMeta) => {
	if (!data.calculated) return { perWeekI: 0, perWeekS: 0, perSemI: 0, perSemS: 0 };
	let perWeek =
		data.freq === Frequency.Weekly
			? data.calculated.occurences
			: data.calculated.occurences / courseInfo.weeks;
	let perSem =
		data.freq === Frequency.Semester
			? data.calculated.occurences
			: data.calculated.occurences *
			  (data.calculated.weeksRunning?.filter((x) => x).length || courseInfo.weeks);
	let IPerOcc =
		data.calculated.independantHoursPer +
		data.calculated.prepHoursPer +
		data.calculated.postActivityHoursPer;
	let SPerOcc = data.calculated.scheduledHoursPer;
	return {
		perWeekI: perWeek * IPerOcc,
		perWeekS: perWeek * SPerOcc,
		perSemI: perSem * IPerOcc,
		perSemS: perSem * SPerOcc
	};
};

const components: Component[] = [
	{
		name: 'Primary Class Meeting',
		short: 'Primary Meeting',
		icon: '🧑‍🏫',
		description: ``,
		form: primaryMeeting,
		dataTemplate: {
			name: 'Lectures',
			freq: Frequency.Weekly,
			meetingsPerWeek: 1,
			meetingLength: 1
		}
	}
];

components.push(components[0]);
components.push(components[0]);
components.push(components[0]);

export default components;
