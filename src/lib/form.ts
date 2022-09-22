import type { Readable, Writable } from 'svelte/store';
import rangeInput from './form-elems/rangeInput.svelte';
import checkSelect from './form-elems/checkSelect.svelte';
import textInput from './form-elems/textInput.svelte';
import SingleSelect from './form-elems/singleSelect.svelte';
import numberInput from './form-elems/numberInput.svelte';

export type formProps = { id: string; label: string; value: Writable<any>; [key: string]: any };

export abstract class FormElement {
	abstract component: any;
	abstract props: formProps;
	constructor(id: string, value: Writable<any>, label: string, props?: object) {}
}

export class TextInput extends FormElement {
	component = textInput;
	props;
	constructor(id: string, value: Writable<string>, label: string) {
		super(id, value, label);
		this.props = { id, label, value };
	}
}

export class NumberInput extends FormElement {
	component = numberInput;
	props;
	constructor(id: string, value: Writable<number>, label: string) {
		super(id, value, label);
		this.props = { id, label, value };
	}
}

export class RangeInput extends FormElement {
	props;
	component = rangeInput;
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
	component = checkSelect;
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
	component = SingleSelect;
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

export const formTypes = [TextInput, NumberInput, RangeInput, CheckSelectInput, SingleSelectInput];
