import type { Readable, Writable } from 'svelte/store';
import rangeInput from './form-elems/rangeInput.svelte';
import checkSelect from './form-elems/checkSelect.svelte';
import textInput from './form-elems/textInput.svelte';

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

export const formTypes = [TextInput, RangeInput, CheckSelectInput];
