import { get, derived, writable, type Readable, type Writable } from 'svelte/store';
import type { courseMeta } from '../course';
import { RangeInput, TextInput, CheckSelectInput, NumberInput } from '../form';
import { Component, Frequency } from '$lib/course-components/genericComponent';
import type { serializedComponent, calculatedResults, derivedCalculated } from '../components';

export class CreativePractice extends Component {
	static serialize(instance: CreativePractice): serializedComponent {
		return {
			type: 'CreativePractice',
			props: {
				instanceName: get(instance.instanceName),
				sessionsPerSem: get(instance.sessionsPerSem),
				prepLength: get(instance.prepLength),
				sessionLength: get(instance.sessionLength),
				postLength: get(instance.postLength),
				scheduled: get(instance.scheduled)
			}
		};
	}
	static deserialize(obj: serializedComponent, courseMeta: Writable<courseMeta>): CreativePractice {
		const component = new CreativePractice(courseMeta);
		if (obj.props.hasOwnProperty('instanceName'))
			component.instanceName.set(obj.props.instanceName);
		if (obj.props.hasOwnProperty('sessionsPerSem'))
			component.sessionsPerSem.set(obj.props.sessionsPerSem);
		if (obj.props.hasOwnProperty('prepLength')) component.prepLength.set(obj.props.prepLength);
		if (obj.props.hasOwnProperty('sessionLength'))
			component.sessionLength.set(obj.props.sessionLength);
		if (obj.props.hasOwnProperty('postLength')) component.postLength.set(obj.props.postLength);
		return component;
	}
	static type = 'CreativePractice';
	static label = 'Creative Practice';
	static icon = '🎨';
	static description =
		'This component is focused on Creative Practice Sessions, which include activities that fall within the creative arts. This component can have scheduled and independent activities. When the scheduled box is checked (the default state), the Preparation per Session portion is added to scheduled hours; preparation and post-session inputs are added to independent hours. If the check is removed, all hours are assigned to the independent category and reflected in workload summary accordingly.';
	static freq = Frequency.Semester;
	instanceName = writable('Creative Practice Sessions');
	sessionsPerSem = writable(1);
	prepLength = writable(1);
	sessionLength = writable(1);
	postLength = writable(1);
	scheduled = writable(true);
	readonly results: Readable<calculatedResults>;
	form;
	derivedCalculated: Readable<derivedCalculated>;

	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.form = [
			new TextInput('componentName', this.instanceName, 'Component Name'),
			new NumberInput('sessionsPerSem', this.sessionsPerSem, 'Meetings per week'),
			new RangeInput('prepLength', this.prepLength, 'Session Prep Time (Hours)', {
				min: 0,
				max: 14
			}),
			new RangeInput('sessionLength', this.sessionLength, 'Session Duration (hours)', {
				min: 0,
				max: 12
			}),
			new RangeInput('postLength', this.postLength, 'Post-Session time (hours)', {
				min: 0,
				max: 12
			})
		];
		this.results = derived(
			[this.sessionsPerSem, this.prepLength, this.sessionLength, this.postLength],
			([$sessionsPerSem, $prepLength, $sessionLength, $postLength]) => {
				return {
					occurences: $sessionsPerSem,
					prepHoursPer: $prepLength,
					independantHoursPer: $postLength,
					scheduledHoursPer: $sessionLength,
					postActivityHoursPer: 0
				};
			}
		);
		this.derivedCalculated = this.setDerived(courseMeta);
		this.watchDerived();
	}
}
