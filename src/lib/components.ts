import { JsonObject, JsonProperty } from 'typescript-json-serializer';
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

@JsonObject()
export abstract class Component {
	// About the component
	@JsonProperty() static label: string;
	@JsonProperty() static icon: string;
	@JsonProperty() static description: string;
	@JsonProperty() static freq: Frequency;
	@JsonProperty(formArraySerialize) abstract form: FormElement[];
	@JsonProperty(writableSerialize) abstract instanceName: Writable<string>;
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
}

@JsonObject()
export class PrimaryMeeting extends Component {
	static label = 'Primary Meeting';
	static icon = '🧑‍🏫';
	static description =
		'Primary meeting time for the course. This is the time that students are expected to be in class.';
	static freq = Frequency.Weekly;
	instanceName = writable('Lecture');
	@JsonProperty(writableSerialize) meetingsPerWeek = writable(1);
	@JsonProperty(writableSerialize) meetingLength = writable(1);
	@JsonProperty(writableSerialize) weeksRunning: Writable<string[]>;
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
