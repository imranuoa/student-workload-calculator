import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '../form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { calculatedResults, derivedCalculated } from '../activities';

enum format {
	Independent = 0,
	Scheduled = 1
}

export class Exam extends Activity {
	static readonly writables = ['instanceName', 'format', 'perCourse', 'prepLength', 'examLength'];
	static type = 'Exam';
	static label = 'Exam';
	static icon = '⏰';
	static description =
		'This component is focused on major assessments, which can be either be held in an asynchronous (typically online) or synchronous (within a Primary Class Meeting) manner.';
	freq = readable(Frequency.Course);
	instanceName = writable('Exam');
	format: Writable<format> = writable(format.Independent);
	perCourse = writable(1);
	prepLength = writable(0);
	examLength = writable(60);

	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;
	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new form.TextInput('activityName', this.instanceName, 'Exam Name'),
			new form.SingleSelectInput('format', this.format, 'Exam Format', {
				options: readable(['Independent', 'Scheduled'])
			}),
			new form.RangeInput('perCourse', this.perCourse, 'Exams Per Course', {
				min: 0,
				max: 10
			}),
			new form.RangeInput('prepLength', this.prepLength, 'Study Hours per Exam', {
				min: 0,
				max: 100
			}),
			new form.ConditionalInput(
				'isIndependent',
				derived(this.format, ($f) => $f === format.Independent),
				'',
				{
					elements: [
						new form.RangeInput('examLength', this.examLength, 'Exam Duration (Minutes)', {
							min: 0,
							max: 300,
							step: 15
						})
					]
				}
			)
		];
		this.results = derived(
			[this.format, this.perCourse, this.prepLength, this.examLength],
			([$format, $perCourse, $prepLength, $examLength]) => {
				return {
					occurences: $perCourse,
					prepHoursPer: $prepLength,
					IndependentHoursPer: $format === format.Independent ? $examLength / 60 : 0,
					scheduledHoursPer: 0,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
