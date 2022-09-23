import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '../form';
import { Component, Frequency } from '$lib/course-components/genericComponent';
import type { calculatedResults, derivedCalculated } from '../components';

export class FinalExam extends Component {
	static readonly writables = ['instanceName', 'perSem', 'prepLength', 'examLength'];
	static type = 'FinalExam';
	static label = 'Final Exam';
	static icon = '🕰';
	static description =
		'This is the Final Exam component where you can choose to either include your exam within your allocated class weeks or independent of them. The Final Exam hours will be tracked seperately so that you are easily able to differentiate between the two.';
	freq = readable(Frequency.Semester);
	instanceName = writable('Final Exam');
	perSem = writable(1);
	prepLength = writable(0);
	examLength = writable(60);

	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;
	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new form.TextInput('componentName', this.instanceName, 'Exam Name'),
			new form.RangeInput('perSem', this.perSem, 'Exams Per Course', {
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
			[this.perSem, this.prepLength, this.examLength],
			([$perSem, $prepLength, $examLength]) => {
				return {
					occurences: $perSem,
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
