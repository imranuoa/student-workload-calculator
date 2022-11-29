import { derived, writable, type Readable, type Writable, readable } from 'svelte/store';
import type { courseMeta } from '../course';
import * as form from '$lib/form';
import { Activity, Frequency } from '$lib/course-activities/genericActivity';
import type { calculatedResults, derivedCalculated } from '../activities';
import vhs from 'svelte-material-icons/vhs.svelte';

export class VideoOrPodcast extends Activity {
	static readonly writables = ['instanceName', 'gradeWorth', 'perCourse', 'length'];
	static type = 'VideoOrPodcast';
	static label = 'Video / Podcast';
	static icon = vhs;
	static colour: typeof Activity.colour = 'uni-color.purple'; //📼';
	static description =
		'This activity accommodates the time involved in watching or listening to media (e.g., recorded lectures, assigned films). The hours from this activity are assigned to the independent category and reflected in workload summary accordingly.';
	freq = readable(Frequency.Course);
	instanceName = writable('Video / Podcast');
	perCourse = writable(1);
	length = writable(60);

	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;
	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new form.TextInput('activityName', this.instanceName, 'Video/Podcast Name'),
			new form.RangeInput('perCourse', this.perCourse, 'Video/Podcasts Per Course', {
				min: 0,
				max: 10
			}),
			new form.RangeInput('length', this.length, 'Video/Podcast Duration (Minutes)', {
				min: 0,
				max: 300,
				step: 5
			})
		];
		this.results = derived([this.perCourse, this.length], ([$perCourse, $length]) => {
			return {
				occurences: $perCourse,
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
