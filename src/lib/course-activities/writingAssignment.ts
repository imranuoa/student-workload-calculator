import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '$lib/form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { calculatedResults, derivedCalculated } from '../activities';

enum format {
	Independent = 0,
	Scheduled = 1
}

enum pageDensity {
	low = 0,
	high = 1
}

enum genre {
	ReflNarr = 0,
	Argument = 1,
	Research = 2
}

enum drafting {
	none = 0,
	minimal = 1,
	extensive = 2
}

export class WritingAssignment extends Activity {
	static readonly writables = [
		'instanceName',
		'gradeWorth',
		'perCourse',
		'pagesPerAssignment',
		'pageDensity',
		'drafting',
		'genre',
		'manualPageSpeed',
		'pagesPerHour'
	];
	static type = 'WritingAssignment';
	static label = 'Writing Assignment';
	static icon = '📝';
	static description =
		'This activity is focused on writing assignments or activities such as essays, creating short stories, and research papers. A writing assignment may be independent or scheduled (for in-class writing assignments).';
	freq = readable(Frequency.Course);
	instanceName = writable('Writing Assignment');
	format: Writable<format> = writable(format.Independent);
	perCourse = writable(1);
	pagesPerAssignment = writable(0);
	pageDensity = writable(pageDensity.low);
	drafting = writable(drafting.none);
	genre = writable(genre.Argument);
	manualPageSpeed = writable(false);
	prepTime = writable(0);
	pagesPerHour = writable(0);

	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;
	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new form.TextInput('activityName', this.instanceName, 'Assignment Name'),
			new form.RangeInput('perCourse', this.perCourse, 'Assignments Per Course', {
				min: 0,
				max: 14
			}),
			new form.SingleSelectInput('format', this.format, 'Assignment Format', {
				options: readable(['Independent', 'Scheduled'])
			}),
			new form.ConditionalInput(
				'isIndependent',
				derived(this.format, ($f) => $f === format.Independent),
				'',
				{
					elements: [
						new form.RangeInput(
							'pagesPerAssignment',
							this.pagesPerAssignment,
							'Pages Per Assignment',
							{
								min: 0,
								max: 100
							}
						),
						new form.CheckboxInput(
							'manualPageSpeed',
							this.manualPageSpeed,
							'Manually Adjust Writing Speed'
						),
						new form.ConditionalInput(
							'showWritingCalculator',
							derived(this.manualPageSpeed, ($speed) => !$speed),
							'',
							{
								elements: [
									new form.SingleSelectInput('pageDensity', this.pageDensity, 'Page Density', {
										options: readable(['250 Words', '500 Words'])
									}),
									new form.SingleSelectInput('genre', this.genre, 'Genre', {
										options: readable(['Reflection / Narrative', 'Argument', 'Research'])
									}),
									new form.SingleSelectInput('drafting', this.drafting, 'Drafting', {
										options: readable(['None', 'Minimal', 'Extensive'])
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
					]
				}
			),
			new form.ConditionalInput(
				'isScheduled',
				derived(this.format, ($f) => $f === format.Scheduled),
				'',
				{
					elements: [
						new form.RangeInput('prepTime', this.prepTime, 'Preparation Time (Minutes)', {
							min: 0,
							max: 120
						})
					]
				}
			)
		];
		this.results = derived(
			[
				this.perCourse,
				this.pagesPerAssignment,
				this.pageDensity,
				this.genre,
				this.drafting,
				this.manualPageSpeed,
				this.pagesPerHour,
				this.format,
				this.prepTime
			],
			([
				$perCourse,
				$pagesPerAssignment,
				$pageDensity,
				$genre,
				$drafting,
				$manualPageSpeed,
				$pagesPerHour,
				$format,
				$prepTime
			]) => {
				let pageSpeedPerHr = 0;
				if ($manualPageSpeed) {
					pageSpeedPerHr = $pagesPerHour;
				} else {
					const wordsPerPage = [250, 500][$pageDensity];
					// Minutes per word
					let hoursPer250Words = Infinity;
					// Source: https://cte.rice.edu/workload#howcalculated
					switch ($genre) {
						case genre.ReflNarr:
							hoursPer250Words = [0.75, 1, 1.25][$drafting];
							break;
						case genre.Argument:
							hoursPer250Words = [1.5, 2, 2.5][$drafting];
							break;
						case genre.Research:
							hoursPer250Words = [3, 4, 5][$drafting];
							break;
						default:
							break;
					}
					const hoursPerPage = (hoursPer250Words / 250) * wordsPerPage;
					pageSpeedPerHr = 1 / hoursPerPage;
				}
				return {
					occurences: $perCourse,
					prepHoursPer: $format === format.Scheduled ? $prepTime / 60 : 0,
					IndependentHoursPer: $pagesPerAssignment / pageSpeedPerHr,
					scheduledHoursPer: 0,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
