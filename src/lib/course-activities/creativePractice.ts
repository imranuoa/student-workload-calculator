import { get, derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import { RangeInput, TextInput, CheckSelectInput, NumberInput } from '$lib/form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { serializedActivity, calculatedResults, derivedCalculated } from '../activities';

export class CreativePractice extends Activity {
	static readonly writables = [
		'instanceName',
		'gradeWorth',
		'sessionsPerSem',
		'prepLength',
		'sessionLength',
		'postLength',
		'scheduled'
	];
	static type = 'CreativePractice';
	static label = 'Creative Practice';
	static icon = '🎨';
	static description =
		'This activity is focused on Creative Practice Sessions, which include activities that fall within the creative arts. This component can have scheduled and independent activities. When the scheduled box is checked (the default state), the Preparation per Session portion is added to scheduled hours; preparation and post-session inputs are added to independent hours. If the check is removed, all hours are assigned to the independent category and reflected in workload summary accordingly.';
	freq = readable(Frequency.Course);
	instanceName = writable('Creative Practice Sessions');
	sessionsPerSem = writable(1);
	prepLength = writable(1);
	sessionLength = writable(1);
	postLength = writable(1);
	scheduled = writable(true);
	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;

	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new TextInput('activityName', this.instanceName, 'Activity Name'),
			new NumberInput('sessionsPerSem', this.sessionsPerSem, 'Sessions Per Course'),
			new RangeInput('prepLength', this.prepLength, 'Session Prep Time (Hours)', {
				min: 0,
				max: 14,
				step: 0.5
			}),
			new RangeInput('sessionLength', this.sessionLength, 'Session Duration (hours)', {
				min: 0,
				max: 12,
				step: 0.5
			}),
			new RangeInput('postLength', this.postLength, 'Post-Session time (hours)', {
				min: 0,
				max: 12,
				step: 0.5
			})
		];
		this.results = derived(
			[this.sessionsPerSem, this.prepLength, this.sessionLength, this.postLength],
			([$sessionsPerSem, $prepLength, $sessionLength, $postLength]) => {
				return {
					occurences: $sessionsPerSem,
					prepHoursPer: $prepLength,
					IndependentHoursPer: $postLength,
					scheduledHoursPer: $sessionLength,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
