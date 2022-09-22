import type { Writable } from 'svelte/store';
import type { courseMeta } from './course';
import type { Component } from '$lib/course-components/genericComponent';
import { PrimaryMeeting } from '$lib/course-components/primaryMeeting';

export interface calculatedResults {
	occurences: number;
	prepHoursPer: number;
	independantHoursPer: number;
	scheduledHoursPer: number;
	postActivityHoursPer: number;
	weeksRunning?: boolean[];
}

export interface derivedCalculated {
	perWeekI: number;
	perWeekS: number;
	perSemI: number;
	perSemS: number;
}

export const getComponentClass = (component: Component) => {
	return <typeof Component>component.constructor;
};

export interface serializedComponent {
	type: string;
	props: {
		[key: string]: any;
	};
}

// Type to allow the general idea of a component to be used for typing
export type ComponentSubClass = {
	new (courseMeta: Writable<courseMeta>): Component;
} & { [K in keyof typeof Component]: typeof Component[K] };

export const components: ComponentSubClass[] = [PrimaryMeeting];

export default components;
