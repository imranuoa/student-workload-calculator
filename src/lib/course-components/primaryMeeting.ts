import { get, derived, writable, type Readable, type Writable } from 'svelte/store';
import type { courseMeta } from '../course';
import { RangeInput, TextInput, CheckSelectInput } from '../form';
import { Component, Frequency } from '$lib/course-components/genericComponent';
import type { serializedComponent, calculatedResults, derivedCalculated } from '../components';

export class PrimaryMeeting extends Component {
	static serialize(instance: PrimaryMeeting): serializedComponent {
		return {
			type: 'PrimaryMeeting',
			props: {
				instanceName: get(instance.instanceName),
				meetingsPerWeek: get(instance.meetingsPerWeek),
				meetingLength: get(instance.meetingLength),
				weeksRunning: get(instance.weeksRunning)
			}
		};
	}
	static deserialize(obj: serializedComponent, courseMeta: Writable<courseMeta>): PrimaryMeeting {
		const component = new PrimaryMeeting(courseMeta);
		if (obj.props.hasOwnProperty('instanceName'))
			component.instanceName.set(obj.props.instanceName);
		if (obj.props.hasOwnProperty('meetingsPerWeek'))
			component.meetingsPerWeek.set(obj.props.meetingsPerWeek);
		if (obj.props.hasOwnProperty('meetingLength'))
			component.meetingLength.set(obj.props.meetingLength);
		if (obj.props.hasOwnProperty('weeksRunning'))
			component.weeksRunning.set(obj.props.weeksRunning);
		return component;
	}
	static type = 'PrimaryMeeting';
	static label = 'Primary Meeting';
	static icon = '🧑‍🏫';
	static description =
		'Primary meeting time for the course. This is the time that students are expected to be in class.';
	static freq = Frequency.Weekly;
	instanceName = writable('Lecture');
	meetingsPerWeek = writable(1);
	meetingLength = writable(1);
	weeksRunning: Writable<string[]>;
	readonly weeksList: Readable<string[]>;
	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;

	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.weeksList = derived(courseMeta, ($courseMeta) =>
			[...Array($courseMeta.weeks).keys()].map((e) => (e + 1).toString())
		);
		this.weeksRunning = writable(get(this.weeksList));
		this.form = [
			new TextInput('componentName', this.instanceName, 'Component Name'),
			new RangeInput('meetingsPerWeek', this.meetingsPerWeek, 'Meetings per week', {
				min: 0,
				max: 14
			}),
			new RangeInput('meetingLength', this.meetingLength, 'Meeting Duration (Hours)', {
				min: 0,
				max: 12
			}),
			new CheckSelectInput('weeksRunning', this.weeksRunning, 'Weeks class runs', {
				options: this.weeksList
			})
		];
		this.results = derived(
			[this.meetingsPerWeek, this.meetingLength, this.weeksRunning, this.weeksList],
			([$meetingsPerWeek, $meetingLength, $weeksRunning, $weeksList]) => {
				return {
					occurences: $meetingsPerWeek,
					prepHoursPer: 0,
					independantHoursPer: 0,
					scheduledHoursPer: $meetingLength,
					postActivityHoursPer: 0,
					weeksRunning: $weeksList.map((w) => $weeksRunning?.includes(w) || false)
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
