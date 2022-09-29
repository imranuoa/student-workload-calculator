import { get, derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import { RangeInput, TextInput, CheckSelectInput, NumberInput } from '../form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { serializedActivity, calculatedResults, derivedCalculated } from '../activities';

export class PracticalExperience extends Activity {
	static readonly writables = [
		'instanceName',
		'prepLength',
		'sessionLength',
		'postLength',
		'scheduled'
	];
	static type = 'PracticalExperience';
	static label = 'Practical Experience';
	static icon = '🌏';
	static description =
		'This activity is focused on practical experience within a course. This could be a field trip, practicum, or placement. This activity is not scheduled, but is instead a part of the course.';
	freq = readable(Frequency.Course);
	instanceName = writable('Practical Experience');
	prepLength = writable(1);
	sessionLength = writable(1);
	postLength = writable(1);
	scheduled = writable(false);
	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;

	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new TextInput('activityName', this.instanceName, 'Activity Name'),
			new RangeInput('prepLength', this.prepLength, 'Preparation time (Hours)', {
				min: 0,
				max: 14,
				step: 0.5
			}),
			new RangeInput('sessionLength', this.sessionLength, 'Hours of experience required', {
				min: 0,
				max: 12,
				step: 0.5
			}),
			new RangeInput('postLength', this.postLength, 'Post-practicum time', {
				min: 0,
				max: 12,
				step: 0.5
			})
		];
		this.results = derived(
			[this.prepLength, this.sessionLength, this.postLength],
			([$prepLength, $sessionLength, $postLength]) => {
				return {
					occurences: 1,
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
