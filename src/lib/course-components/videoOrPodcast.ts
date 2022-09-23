import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '../form';
import { Component, Frequency } from '$lib/course-components/genericComponent';
import type { calculatedResults, derivedCalculated } from '../components';

export class VideoOrPodcast extends Component {
	static readonly writables = ['instanceName', 'perSem', 'length'];
	static type = 'VideoOrPodcast';
	static label = 'Video / Podcast';
	static icon = '📼';
	static description =
		'This component accommodates the time involved in watching or listening to media (e.g., recorded lectures, assigned films). The hours from this component are assigned to the independent category and reflected in workload summary accordingly.';
	freq = readable(Frequency.Semester);
	instanceName = writable('Video / Podcast');
	perSem = writable(1);
	length = writable(60);

	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;
	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new form.TextInput('componentName', this.instanceName, 'Video/Podcast Name'),
			new form.RangeInput('perSem', this.perSem, 'Video/Podcasts Per Course', {
				min: 0,
				max: 10
			}),
			new form.RangeInput('length', this.length, 'Video/Podcast Duration (Minutes)', {
				min: 0,
				max: 300,
				step: 5
			})
		];
		this.results = derived([this.perSem, this.length], ([$perSem, $length]) => {
			return {
				occurences: $perSem,
				prepHoursPer: 0,
				IndependentHoursPer: 0,
				scheduledHoursPer: $length / 60,
				postActivityHoursPer: 0
			};
		});
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
