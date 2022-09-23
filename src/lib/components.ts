import type { Writable } from 'svelte/store';
import type { courseMeta } from './course';
import type { Component } from '$lib/course-components/genericComponent';
import { PrimaryMeeting } from '$lib/course-components/primaryMeeting';
import { CreativePractice } from '$lib/course-components/creativePractice';
import { Discussion } from '$lib/course-components/discussion';
import { Exam } from '$lib/course-components/exam';
import { FinalExam } from '$lib/course-components/finalExam';
import { Quiz } from '$lib/course-components/quiz';
import { ReadingAssignment } from '$lib/course-components/readingAssignment';
import { Lab } from '$lib/course-components/lab';
import { Tutorial } from '$lib/course-components/tutorial';
import { VideoOrPodcast } from '$lib/course-components/videoOrPodcast';
import { WritingAssignment } from '$lib/course-components/writingAssignment';
import { CustomAssignment } from '$lib/course-components/customAssignment';

export interface calculatedResults {
	occurences: number;
	prepHoursPer: number;
	IndependentHoursPer: number;
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

export const components: ComponentSubClass[] = [
	PrimaryMeeting,
	CreativePractice,
	Discussion,
	Exam,
	FinalExam,
	Lab,
	Quiz,
	ReadingAssignment,
	Tutorial,
	VideoOrPodcast,
	WritingAssignment,
	CustomAssignment
];

export default components;
