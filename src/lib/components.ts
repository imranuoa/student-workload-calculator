import { formArraySerialize, writableSerialize } from '$lib/serialize';
import { get, derived, readable, writable, type Readable, type Writable } from 'svelte/store';
import type { courseMeta } from './course';
import { type FormElement, RangeInput, TextInput, CheckSelectInput } from './form';

export enum Frequency {
	Weekly,
	Semester
}

export interface calculatedResults {
	occurences: number;
	prepHoursPer: number;
	independantHoursPer: number;
	scheduledHoursPer: number;
	postActivityHoursPer: number;
	weeksRunning?: boolean[];
}

export interface derivedCalculated {
	perWeekI: number;
	perWeekS: number;
	perSemI: number;
	perSemS: number;
}

export const getComponentClass = (component: Component) => {
	return <typeof Component>component.constructor;
};

export interface serializedComponent {
	type: string;
	props: Object;
}

export abstract class Component {
	static serialize(component: Component): serializedComponent {
		throw new Error("Method 'serialize' not implemented.");
	}
	static deserialize(obj: serializedComponent): Component {
		throw new Error("Method 'deserialize' not implemented.");
	}
	// About the component
	static label: string;
	static icon: string;
	static description: string;
	static freq: Frequency;
	abstract form: FormElement[];
	abstract instanceName: Writable<string>;
	abstract readonly results: Readable<calculatedResults>;
	abstract derivedCalculated: Readable<derivedCalculated>;
	// Data for the instance of the component type
	setDerived(courseMeta: Readable<courseMeta>) {
		return derived([this.results, courseMeta], ([$results, $courseMeta]) => {
			if (!$results) return { perWeekI: 0, perWeekS: 0, perSemI: 0, perSemS: 0 };
			let perWeek, perSem;
			if (getComponentClass(this).freq === Frequency.Weekly) {
				perWeek = $results.occurences;
				const weeksRunning = $results.weeksRunning?.filter((x) => x).length;
				perSem =
					$results.occurences * (weeksRunning === undefined ? $courseMeta.weeks : weeksRunning);
			} else {
				perWeek = $results.occurences / $courseMeta.weeks;
				perSem = $results.occurences;
			}
			let IPerOcc =
				$results.independantHoursPer + $results.prepHoursPer + $results.postActivityHoursPer;
			let SPerOcc = $results.scheduledHoursPer;
			return {
				perWeekI: perWeek * IPerOcc,
				perWeekS: perWeek * SPerOcc,
				perSemI: perSem * IPerOcc,
				perSemS: perSem * SPerOcc
			};
		});
	}
	constructor(courseMeta: Writable<courseMeta>) {}
	updated = 0;
	watchDerived() {
		console.log('Watching component:', this);
		this.derivedCalculated.subscribe(
			(() => {
				console.log('Triggering update on:', this);
				this = this;
				return true;
			}).bind(this)
		);
	}
}

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

// Type to allow the general idea of a component to be used for typing
export type ComponentSubClass = {
	new (courseMeta: Writable<courseMeta>): Component;
} & typeof Component;
const components: ComponentSubClass[] = [PrimaryMeeting];

components.push(components[0]);
components.push(components[0]);
components.push(components[0]);

components.push(components[0]);
components.push(components[0]);
components.push(components[0]);

export default components;
