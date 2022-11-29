import { get, derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import { RangeInput, TextInput, CheckSelectInput, CheckboxInput } from '$lib/form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { serializedActivity, calculatedResults, derivedCalculated } from '../activities';
import AccountGroupOutline from 'svelte-material-icons/AccountGroupOutline.svelte';

export class Tutorial extends Activity {
	static readonly writables = [
		'instanceName',
		'gradeWorth',
		'tutorialsPerWeek',
		'tutorialLength',
		'prepTime',
		'isScheduled',
		'weeksRunning'
	];
	static type = 'Tutorial';
	static label = 'Tutorial';
	static icon = AccountGroupOutline;
	static colour: typeof Activity.colour = 'uni-color.turqoise'; //🙋';
	static description =
		'This activity is focused on the tutorial portion of courses; these sessions are commonly focused on providing students with an opportunity to practice and/or reinforce learning. The Tutorial activity has both scheduled and independent components. When the scheduled box is checked (the default state), the hours per tutorial portion is added to scheduled hours; and the preparation time is added to independent hours. If the check is removed, all hours are assigned to the independent category and reflected in workload summary accordingly.';
	freq = readable(Frequency.Weekly);
	instanceName = writable('Tutorial');
	tutorialsPerWeek = writable(1);
	tutorialLength = writable(1);
	prepTime = writable(30);
	isScheduled = writable(true);
	postTutorial = writable(30);
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
			new RangeInput('tutorialsPerWeek', this.tutorialsPerWeek, 'Tutorials per week', {
				min: 0,
				max: 14
			}),
			new RangeInput('tutorialLength', this.tutorialLength, 'Tutorial Duration (Hours)', {
				min: 0,
				max: 12
			}),
			new RangeInput('prepTime', this.prepTime, 'Preparation Time (Minutes)', {
				min: 0,
				max: 120,
				step: 5
			}),
			new CheckboxInput('isScheduled', this.isScheduled, 'Tutorial is scheduled'),
			new CheckSelectInput('weeksRunning', this.weeksRunning, 'Weeks class runs', {
				options: this.weeksList
			})
		];
		this.results = derived(
			[
				this.tutorialsPerWeek,
				this.tutorialLength,
				this.prepTime,
				this.isScheduled,
				this.weeksRunning,
				this.weeksList
			],
			([
				$tutorialsPerWeek,
				$tutorialLength,
				$prepTime,
				$isScheduled,
				$weeksRunning,
				$weeksList
			]) => {
				return {
					occurences: $tutorialsPerWeek,
					prepHoursPer: $prepTime / 60,
					IndependentHoursPer: $isScheduled ? 0 : $tutorialLength,
					scheduledHoursPer: $isScheduled ? $tutorialLength : 0,
					postActivityHoursPer: 0,
					weeksRunning: $weeksList.map((w) => $weeksRunning?.includes(w) || false)
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
