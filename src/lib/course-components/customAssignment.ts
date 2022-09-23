import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '../form';
import { Component, Frequency } from '$lib/course-components/genericComponent';
import type { calculatedResults, derivedCalculated } from '../components';

export class CustomAssignment extends Component {
	static readonly writables = [
		'instanceName',
		'freq',
		'occurences',
		'prepHoursPer',
		'IndependentHoursPer',
		'scheduledHoursPer',
		'postActivityHoursPer'
	];
	static type = 'CustomAssignment';
	static label = 'Custom Assignment';
	static icon = '✨';
	static description =
		'This component may be used for assignments that fall outside of the categories above such as group work, projects, and discipline-specific assignments. The hours in this component can be assigned to either the scheduled or independent categories based on whether the scheduled checkbox is checked. When the scheduled box is checked (the default state), the hours are assigned to the scheduled totals. If the check is removed, all hours are assigned to the independent category and reflected in workload summary accordingly. Note that you may optionally add preparation time (e.g., for group meetings) and post-assignment time (e.g., a reflection).';
	instanceName = writable('Custom Assignment');
	freq = writable(Frequency.Semester);
	occurences = writable(1);
	prepHoursPer = writable(0);
	IndependentHoursPer = writable(0);
	scheduledHoursPer = writable(0);
	postActivityHoursPer = writable(0);

	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;
	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new form.TextInput('componentName', this.instanceName, 'Assignment Name'),
			new form.SingleSelectInput('freq', this.freq, 'Frequency', {
				options: readable(['Weekly', 'Semester'])
			}),
			new form.NumberInput(
				'occurences',
				this.occurences,
				'Number of Assignments Per week / semester'
			),
			new form.NumberInput('prepHoursPer', this.prepHoursPer, 'Preparation Time (Hours)'),
			new form.NumberInput('IndependentHoursPer', this.IndependentHoursPer, 'Independent Hours'),
			new form.NumberInput('scheduledHoursPer', this.scheduledHoursPer, 'Scheduled Hours'),
			new form.NumberInput('postActivityHoursPer', this.postActivityHoursPer, 'Post-Activity Hours')
		];
		this.results = derived(
			[
				this.occurences,
				this.prepHoursPer,
				this.IndependentHoursPer,
				this.scheduledHoursPer,
				this.postActivityHoursPer
			],
			([
				occurences,
				prepHoursPer,
				IndependentHoursPer,
				scheduledHoursPer,
				postActivityHoursPer
			]) => {
				return {
					occurences,
					prepHoursPer,
					IndependentHoursPer,
					scheduledHoursPer,
					postActivityHoursPer
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
