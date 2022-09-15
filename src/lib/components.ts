import { JsonObject, JsonProperty } from 'typescript-json-serializer';
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
	@JsonProperty() abstract form: FormElement[];
	@JsonProperty() abstract instanceName: Writable<string>;
	results: Readable<calculatedResults> = readable({
		occurences: 0,
		prepHoursPer: 0,
		independantHoursPer: 0,
		scheduledHoursPer: 0,
		postActivityHoursPer: 0
	});
	// Data for the instance of the component type
	derivedCalculated;
	constructor(courseMeta: Writable<courseMeta>) {
		this.derivedCalculated = derived([this.results, courseMeta], ([$results, $courseMeta]) => {
			if (!$results) return { perWeekI: 0, perWeekS: 0, perSemI: 0, perSemS: 0 };
			let perWeek, perSem;
			if (this.freq === Frequency.Weekly) {
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
}

export class PrimaryMeeting extends Component {
	static label = 'Primary Meeting';
	static icon = '🧑‍🏫';
	static description =
		'Primary meeting time for the course. This is the time that students are expected to be in class.';
	static freq = Frequency.Weekly;
	instanceName = writable('Lecture');
	@JsonProperty() meetingsPerWeek = writable(1);
	@JsonProperty() meetingLength = writable(1);
	@JsonProperty() weeksRunning: Writable<string[]>;
	readonly weeksList: Readable<string[]>;
	readonly results: Readable<calculatedResults>;
	form;

	constructor(courseMeta: Writable<courseMeta>) {
		super(courseMeta);
		this.weeksList = derived(courseMeta, ($courseMeta) =>
			[...Array($courseMeta.weeks).keys()].map((e) => (e + 1).toString())
		);
		this.weeksRunning = writable(get(this.weeksList));
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
		this.form = [
			new TextInput('componentName', this.instanceName, 'Component Name'),
			new RangeInput('meetingsPerWeek', this.meetingsPerWeek, 'Meetings per week', 0, 14),
			new RangeInput('meetingLength', this.meetingLength, 'Meeting Duration (Hours)', 0, 12),
			new CheckSelectInput('weeksRunning', this.weeksRunning, 'Weeks class runs', this.weeksList)
		];
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

export default components;
