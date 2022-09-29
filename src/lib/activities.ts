import type { Writable } from 'svelte/store';
import type { courseMeta } from './course';
import type { Activity } from '$lib/course-activities/genericActivity';
import { PrimaryMeeting } from '$lib/course-activities/primaryMeeting';
import { CreativePractice } from '$lib/course-activities/creativePractice';
import { Discussion } from '$lib/course-activities/discussion';
import { Exam } from '$lib/course-activities/exam';
import { FinalExam } from '$lib/course-activities/finalExam';
import { Quiz } from '$lib/course-activities/quiz';
import { ReadingAssignment } from '$lib/course-activities/readingAssignment';
import { Lab } from '$lib/course-activities/lab';
import { Tutorial } from '$lib/course-activities/tutorial';
import { VideoOrPodcast } from '$lib/course-activities/videoOrPodcast';
import { WritingAssignment } from '$lib/course-activities/writingAssignment';
import { CustomAssignment } from '$lib/course-activities/customAssignment';
import { PracticalExperience } from '$lib/course-activities/practicalExperience';

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
	perCourseI: number;
	perCourseS: number;
	weeklyI: number[];
	weeklyS: number[];
	weeklyGrade: number[];
}

export const getActivityClass = (activity: Activity) => {
	return <typeof Activity>activity.constructor;
};

export interface serializedActivity {
	type: string;
	props: {
		[key: string]: any;
	};
}

// Type to allow the general idea of a activity to be used for typing
export type ActivitySubClass = {
	new (courseMeta: Writable<courseMeta>): Activity;
} & { [K in keyof typeof Activity]: typeof Activity[K] };

export const activities: ActivitySubClass[] = [
	PrimaryMeeting,
	CreativePractice,
	PracticalExperience,
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

export default activities;
