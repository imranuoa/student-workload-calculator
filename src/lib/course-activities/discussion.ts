import { get, derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import {
	RangeInput,
	TextInput,
	CheckSelectInput,
	ConditionalInput,
	NumberInput,
	SingleSelectInput,
	CheckboxInput
} from '$lib/form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { calculatedResults, derivedCalculated } from '../activities';
import ForumOutline from 'svelte-material-icons/ForumOutline.svelte';

enum isSync {
	Asynchronous = 0,
	Synchronous = 1
}

export class Discussion extends Activity {
	static readonly writables = [
		'instanceName',
		'gradeWorth',
		'perCourse',
		'originalPosts',
		'postLength',
		'responses',
		'responseLength',
		'prepTime',
		'isManual',
		'manualTime',
		'isSynchronous'
	];
	static type = 'Discussion';
	static label = 'Discussion';
	static icon = ForumOutline;
	static colour: typeof Activity.colour = 'uni-color.fushia'; //💬';
	static description =
		'This activity is focused on discussions, which can be either be held in an asynchronous (typically online) or synchronous (within a live session) manner.';
	freq = readable(Frequency.Course);
	instanceName = writable('Discussion');
	perCourse = writable(1);
	originalPosts = writable(1);
	postLength = writable(250);
	responses = writable(1);
	responseLength = writable(250);
	prepTime = writable(0);
	isManual = writable(false);
	manualTime = writable(0);
	isSynchronous: Writable<isSync> = writable(isSync.Asynchronous);
	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;

	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new TextInput('activityName', this.instanceName, 'Discussion Name'),
			new RangeInput('perCourse', this.perCourse, 'Discussions Per Course', {
				min: 0,
				max: 20
			}),
			new SingleSelectInput('isSync', this.isSynchronous, 'Synchronous or Asynchronous', {
				options: readable(['Asynchronous', 'Synchronous'])
			}),
			new CheckboxInput('isManual', this.isManual, 'Manually set time'),
			new ConditionalInput('isManual', this.isManual, '', {
				elements: [
					new RangeInput('manualTime', this.manualTime, 'Hours per discussion', {
						min: 0,
						max: 20
					})
				]
			}),
			new ConditionalInput(
				'isManual',
				derived(this.isManual, (m) => !m),
				'',
				{
					elements: [
						new ConditionalInput(
							'isSynchronous',
							derived(this.isSynchronous, (v) => v === isSync.Asynchronous),
							'',
							{
								elements: [
									new RangeInput(
										'originalPosts',
										this.originalPosts,
										'Original Posts Per Discussion',
										{
											min: 0,
											max: 20
										}
									),
									new RangeInput('postLength', this.postLength, 'Avg. Post Length (words)', {
										min: 0,
										max: 3000,
										step: 50
									}),
									new RangeInput('responses', this.responses, 'Responses', {
										min: 0,
										max: 20
									})
								]
							}
						),
						new RangeInput('responseLength', this.responseLength, 'Avg. Response Length (words)', {
							min: 0,
							max: 3000,
							step: 50
						})
					]
				}
			),
			new RangeInput('prepTime', this.prepTime, 'Prep Time (minutes)', {
				min: 0,
				max: 300,
				step: 15
			})
		];
		this.results = derived(
			[
				this.perCourse,
				this.originalPosts,
				this.postLength,
				this.responses,
				this.responseLength,
				this.prepTime,
				this.isManual,
				this.manualTime,
				this.isSynchronous
			],
			([
				$perCourse,
				$originalPosts,
				$postLength,
				$responses,
				$responseLength,
				$prepTime,
				$isManual,
				$manualTime,
				$isSynchronous
			]) => {
				let totalTime = 0;
				if ($isManual) {
					totalTime = $manualTime;
				} else if ($isSynchronous === isSync.Asynchronous) {
					totalTime = ($originalPosts * $postLength) / 250 + ($responses * $responseLength) / 250;
				} else {
					totalTime = $responseLength / 250;
				}
				return {
					occurences: $perCourse,
					prepHoursPer: $prepTime / 60,
					IndependentHoursPer: $isSynchronous ? 0 : totalTime,
					scheduledHoursPer: $isSynchronous ? totalTime : 0,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
