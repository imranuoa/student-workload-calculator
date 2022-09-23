import type { Readable, Writable } from 'svelte/store';
import rangeInput from './form-elems/rangeInput.svelte';
import checkSelect from './form-elems/checkSelect.svelte';
import textInput from './form-elems/textInput.svelte';
import SingleSelect from './form-elems/singleSelect.svelte';
import numberInput from './form-elems/numberInput.svelte';
import conditionalInputs from './form-elems/conditionalInputs.svelte';
import checkboxInput from './form-elems/checkboxInput.svelte';

export type formProps = { id: string; label: string; value: Readable<any>; [key: string]: any };

export abstract class FormElement {
	abstract activity: any;
	abstract props: formProps;
	constructor(id: string, value: Readable<any>, label: string, props?: object) {}
}

export class ConditionalInput extends FormElement {
	activity = conditionalInputs;
	props;
	constructor(
		id: string,
		value: Readable<boolean>,
		label: string,
		props: {
			elements: FormElement[];
		}
	) {
		super(id, value, label);
		this.props = { id, label, value, elements: props.elements };
	}
}

export class TextInput extends FormElement {
	activity = textInput;
	props;
	constructor(id: string, value: Writable<string>, label: string) {
		super(id, value, label);
		this.props = { id, label, value };
	}
}

export class NumberInput extends FormElement {
	activity = numberInput;
	props;
	constructor(id: string, value: Writable<number>, label: string) {
		super(id, value, label);
		this.props = { id, label, value };
	}
}

export class CheckboxInput extends FormElement {
	activity = checkboxInput;
	props;
	constructor(id: string, value: Writable<boolean>, label: string) {
		super(id, value, label);
		this.props = { id, label, value };
	}
}

export class RangeInput extends FormElement {
	props;
	activity = rangeInput;
	constructor(
		id: string,
		value: Writable<number>,
		label: string,
		props: {
			min: number;
			max: number;
			step?: number;
		}
	) {
		super(id, value, label);
		this.props = { id, label, value, ...props };
	}
}

export class CheckSelectInput extends FormElement {
	props;
	activity = checkSelect;
	constructor(
		id: string,
		value: Writable<string[]>,
		label: string,
		props: { options: Readable<string[]> }
	) {
		super(id, value, label);
		this.props = { id, label, value, ...props };
	}
}

export class SingleSelectInput extends FormElement {
	props;
	activity = SingleSelect;
	constructor(
		id: string,
		value: Writable<number>, // Index
		label: string,
		props: {
			options: Readable<string[] | any[]>;
			key?: (option: any) => string;
		}
	) {
		super(id, value, label);
		this.props = { id, label, value, ...props };
	}
}

export const formTypes = [
	TextInput,
	NumberInput,
	RangeInput,
	CheckSelectInput,
	SingleSelectInput,
	conditionalInputs
];
