import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '../form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { calculatedResults, derivedCalculated } from '../activities';

enum format {
	Independent = 0,
	Scheduled = 1
}

export class Quiz extends Activity {
	static readonly writables = [
		'instanceName',
		'gradeWorth',
		'format',
		'perCourse',
		'prepLength',
		'QuizLength'
	];
	static type = 'Quiz';
	static label = 'Quiz';
	static icon = '⁉️';
	static description =
		'This activity is focused on quizzes, which can be either be held in an asynchronous (typically online) or synchronous (within a Primary Class Meeting) manner.';
	freq = readable(Frequency.Course);
	instanceName = writable('Quiz');
	format: Writable<format> = writable(format.Independent);
	perCourse = writable(1);
	prepLength = writable(0);
	QuizLength = writable(30);

	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;
	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new form.TextInput('activityName', this.instanceName, 'Quiz Name'),
			new form.SingleSelectInput('format', this.format, 'Quiz Format', {
				options: readable(['Independent', 'Scheduled'])
			}),
			new form.RangeInput('perCourse', this.perCourse, 'Quizzes Per Course', {
				min: 0,
				max: 10
			}),
			new form.RangeInput('prepLength', this.prepLength, 'Study Hours per Quiz', {
				min: 0,
				max: 100
			}),
			new form.ConditionalInput(
				'isIndependent',
				derived(this.format, ($f) => $f === format.Independent),
				'',
				{
					elements: [
						new form.RangeInput('QuizLength', this.QuizLength, 'Quiz Duration (Minutes)', {
							min: 0,
							max: 300,
							step: 15
						})
					]
				}
			)
		];
		this.results = derived(
			[this.format, this.perCourse, this.prepLength, this.QuizLength],
			([$format, $perCourse, $prepLength, $QuizLength]) => {
				return {
					occurences: $perCourse,
					prepHoursPer: $prepLength,
					IndependentHoursPer: $format === format.Independent ? $QuizLength / 60 : 0,
					scheduledHoursPer: 0,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
