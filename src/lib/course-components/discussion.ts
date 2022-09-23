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
} from '../form';
import { Component, Frequency } from '$lib/course-components/genericComponent';
import type { calculatedResults, derivedCalculated } from '../components';

enum isSync {
	Asynchronous = 0,
	Synchronous = 1
}

export class Discussion extends Component {
	static readonly writables = [
		'instanceName',
		'perSem',
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
	static icon = '💬';
	static description =
		'This component is focused on discussions, which can be either be held in an asynchronous (typically online) or synchronous (within a live session) manner.';
	static freq = Frequency.Semester;
	instanceName = writable('Discussion');
	perSem = writable(1);
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
			new TextInput('componentName', this.instanceName, 'Discussion Name'),
			new RangeInput('perSem', this.perSem, 'Discussions Per Course', {
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
				this.perSem,
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
				$perSem,
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
					occurences: $perSem,
					prepHoursPer: $prepTime / 60,
					independantHoursPer: $isSynchronous ? 0 : totalTime,
					scheduledHoursPer: $isSynchronous ? totalTime : 0,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
