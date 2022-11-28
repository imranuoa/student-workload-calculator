import { get, derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import { RangeInput, TextInput, CheckSelectInput } from '$lib/form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { serializedActivity, calculatedResults, derivedCalculated } from '../activities';

export class PrimaryMeeting extends Activity {
	static readonly writables = [
		'instanceName',
		'gradeWorth',
		'meetingsPerWeek',
		'meetingLength',
		'weeksRunning'
	];
	static type = 'PrimaryMeeting';
	static label = 'Primary Meeting';
	static icon = '🧑‍🏫';
	static description =
		'Primary meeting time for the course. This is the time that students are expected to be in class.';
	freq = readable(Frequency.Weekly);
	instanceName = writable('Lecture');
	meetingsPerWeek = writable(1);
	meetingLength = writable(1);
	weeksRunning: Writable<string[]>;
	readonly weeksList: Readable<string[]>;
	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;

	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.weeksList = derived(courseMeta, ($courseMeta) =>
			[...Array($courseMeta.weeks).keys()].map((e) => (e + 1).toString())
		);
		this.weeksRunning = writable(get(courseMeta).weekTemplate);
		this.form = [
			new TextInput('activityName', this.instanceName, 'Activity Name'),
			new RangeInput('meetingsPerWeek', this.meetingsPerWeek, 'Meetings per week', {
				min: 0,
				max: 14
			}),
			new RangeInput('meetingLength', this.meetingLength, 'Meeting Duration (Hours)', {
				min: 0,
				max: 12
			}),
			new CheckSelectInput('weeksRunning', this.weeksRunning, 'Weeks class runs', {
				options: this.weeksList
			})
		];
		this.results = derived(
			[this.meetingsPerWeek, this.meetingLength, this.weeksRunning, this.weeksList],
			([$meetingsPerWeek, $meetingLength, $weeksRunning, $weeksList]) => {
				return {
					occurences: $meetingsPerWeek,
					prepHoursPer: 0,
					IndependentHoursPer: 0,
					scheduledHoursPer: $meetingLength,
					postActivityHoursPer: 0,
					weeksRunning: $weeksList.map((w) => $weeksRunning?.includes(w) || false)
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
