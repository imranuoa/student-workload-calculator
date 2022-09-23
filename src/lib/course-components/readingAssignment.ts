import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '../form';
import { Component, Frequency } from '$lib/course-components/genericComponent';
import type { calculatedResults, derivedCalculated } from '../components';

enum pageDensity {
	low = 0,
	medium = 1,
	high = 2
}

enum newConcepts {
	none = 0,
	some = 1,
	many = 2
}

enum purpose {
	survey = 0,
	understand = 1,
	engage = 2
}

export class ReadingAssignment extends Component {
	static readonly writables = [
		'instanceName',
		'perWeek',
		'pagesPerWeek',
		'pageDensity',
		'difficulty',
		'purpose',
		'manualPageSpeed',
		'pagesPerHour'
	];
	static type = 'ReadingAssignment';
	static label = 'Reading Assignment';
	static icon = '📚';
	static description =
		'This component is focused on independent readings such as assigned textbook readings, readings of short stories, novel excerpts, etc. The hours from this component will be assigned to the independent category and reflected in workload summary accordingly.';
	freq = readable(Frequency.Weekly);
	instanceName = writable('Reading Assignment');
	pagesPerWeek = writable(0);
	pageDensity = writable(pageDensity.low);
	difficulty = writable(newConcepts.none);
	purpose = writable(purpose.understand);
	manualPageSpeed = writable(false);
	pagesPerHour = writable(1);

	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;
	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new form.TextInput('componentName', this.instanceName, 'Assignment Name'),
			new form.RangeInput('pagesPerWeek', this.pagesPerWeek, 'Pages Per Week', {
				min: 0,
				max: 100
			}),
			new form.CheckboxInput('manualPageSpeed', this.manualPageSpeed, 'Manually Adjust Page Speed'),
			new form.ConditionalInput(
				'showPagesPerHour',
				derived(this.manualPageSpeed, ($speed) => !$speed),
				'',
				{
					elements: [
						new form.SingleSelectInput('pageDensity', this.pageDensity, 'Page Density', {
							options: readable(['450 Words', '600 Words', '750 Words'])
						}),
						new form.SingleSelectInput('difficulty', this.difficulty, 'Difficulty', {
							options: readable(['No New Concepts', 'Some New Concepts', 'Many New Concepts'])
						}),
						new form.SingleSelectInput('purpose', this.purpose, 'Purpose', {
							options: readable(['Survey', 'Understand', 'Engage'])
						})
					]
				}
			),
			new form.ConditionalInput('showPagesPerHour', this.manualPageSpeed, '', {
				elements: [
					new form.RangeInput('pagesPerHour', this.pagesPerHour, 'Pages Per Hour', {
						min: 1,
						max: 100
					})
				]
			})
		];
		this.results = derived(
			[
				this.pagesPerWeek,
				this.pageDensity,
				this.difficulty,
				this.purpose,
				this.manualPageSpeed,
				this.pagesPerHour
			],
			([$pagesPerWeek, $pageDensity, $difficulty, $purpose, $manualPageSpeed, $pagesPerHour]) => {
				let pageSpeed = 0;
				if ($manualPageSpeed) {
					pageSpeed = $pagesPerHour;
				} else {
					const wordsPerPage = [450, 600, 750][$pageDensity];
					// Source: https://cte.rice.edu/workload#howcalculated
					let minutesPerPage = Infinity;
					switch ($purpose) {
						case purpose.survey:
							minutesPerPage = wordsPerPage / [500, 350, 250][$difficulty];
							break;
						case purpose.understand:
							minutesPerPage = wordsPerPage / [250, 180, 130][$difficulty];
							break;
						case purpose.engage:
							minutesPerPage = wordsPerPage / [130, 90, 65][$difficulty];
							break;
						default:
							break;
					}
					pageSpeed = 60 / minutesPerPage;
				}
				return {
					occurences: 1,
					prepHoursPer: 0,
					IndependentHoursPer: $pagesPerWeek / pageSpeed,
					scheduledHoursPer: 0,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
