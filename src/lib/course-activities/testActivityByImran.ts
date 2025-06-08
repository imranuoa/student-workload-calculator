import { get, derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import { RangeInput, TextInput, CheckSelectInput, NumberInput } from '$lib/form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { serializedActivity, calculatedResults, derivedCalculated } from '../activities';
import mdiAccountCog from 'svelte-material-icons/AccountCog.svelte';

export class TestActivityByImran extends Activity {
	static readonly writables = [
		'instanceName',
		'gradeWorth',
		'sessionsPerSem',
		'prepLength',
		'sessionLength',
		'postLength',
		'scheduled',
		'codeTestActivity'
	];
	static type = 'CodeTestActivityByImran';
	static label = 'Code Test Actvity By Imran';
	static icon = mdiAccountCog;
	//static infoIcon = infoIcon;
	static colour: typeof Activity.colour = 'uni-color.teal-alt';
	static description =
		'This activity is focused on Creative Practice Sessions, which include activities that fall within the creative arts. This component can have scheduled and independent activities. When the scheduled box is checked (the default state), the Preparation per Session portion is added to scheduled hours; preparation and post-session inputs are added to independent hours. If the check is removed, all hours are assigned to the independent category and reflected in workload summary accordingly.';
	freq = readable(Frequency.Course);
	instanceName = writable('Code Test');
	sessionsPerSem = writable(1);
	prepLength = writable(1);
	sessionLength = writable(1);
	postLength = writable(1);
	codeTestActivity = writable(1);
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
			}),
			new RangeInput('codeTestActivity', this.codeTestActivity, 'Code Test Activity (hours)', {
				min: 0,
				max: 12,
				step: 0.5
			})
		];
		this.results = derived(
			[
				this.sessionsPerSem,
				this.prepLength,
				this.sessionLength,
				this.postLength,
				this.codeTestActivity
			],
			([$sessionsPerSem, $prepLength, $sessionLength, $postLength, $codeTestActivity]) => {
				return {
					occurences: $sessionsPerSem,
					prepHoursPer: $prepLength,
					IndependentHoursPer: $postLength + $codeTestActivity,
					scheduledHoursPer: $sessionLength,
					postActivityHoursPer: 0,
					codeTestActivityHoursPer: $codeTestActivity
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
