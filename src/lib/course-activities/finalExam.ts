import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '$lib/form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { calculatedResults, derivedCalculated } from '../activities';

export class FinalExam extends Activity {
	static readonly writables = [
		'instanceName',
		'gradeWorth',
		'perCourse',
		'prepLength',
		'examLength'
	];
	static type = 'FinalExam';
	static label = 'Final Exam';
	static icon = '🕰';
	static description =
		'This is the Final Exam activity where you can choose to either include your exam within your allocated class weeks or independent of them. The Final Exam hours will be tracked seperately so that you are easily able to differentiate between the two.';
	freq = readable(Frequency.Course);
	instanceName = writable('Final Exam');
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
			new form.RangeInput('perCourse', this.perCourse, 'Exams Per Course', {
				min: 0,
				max: 10
			}),
			new form.RangeInput('prepLength', this.prepLength, 'Study Hours per Exam', {
				min: 0,
				max: 100
			}),
			new form.RangeInput('examLength', this.examLength, 'Exam Duration (Minutes)', {
				min: 0,
				max: 300,
				step: 15
			})
		];
		this.results = derived(
			[this.perCourse, this.prepLength, this.examLength],
			([$perCourse, $prepLength, $examLength]) => {
				return {
					occurences: $perCourse,
					prepHoursPer: $prepLength,
					IndependentHoursPer: 0,
					scheduledHoursPer: $examLength / 60,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
