import { get, readable, writable, type Readable, type Writable } from 'svelte/store';
import { formTypes, type FormElement, type formProps, type TextInput } from './form';

const formElems = import.meta.glob('$lib/form-elems/*.svelte', { eager: true });

type serializedFormElem = {
	type: string;
	// props: {id: string, label: string, value: any, [key: string]: any}
	// Can't use specific typing as we don't know the full list of Props, and TS freaks out when instantiating the classes
	props: any;
};

export const formArraySerialize = {
	afterDeserialize: (parsed: any) => {
		return parsed.map((form: serializedFormElem) => {
			const { type, props: propData } = form;
			const { id, label, value, ...props } = propData;
			const FormElem = formTypes.find((elem) => elem.name === type);
			if (!FormElem) {
				console.error(`Form element ${type} not found`);
				return undefined;
			}
			return new FormElem(id, writable(value), label, props);
		});
	},
	beforeSerialize: (form: any) => {
		console.log('Serializing form:', form);
		return JSON.stringify({
			type: form.constructor.name,
			props: form.props
		});
	}
};

// For any object or array containing writables, this function will return a new object or array with the same values, but the writables will be unwrapped to their values.
export const serializeObjectOfWritables = (value: any) => {
	if (typeof value === 'object') {
		const writableProps: [string, unknown][] = Object.entries(value).map(([key, prop]) => {
			if (
				prop &&
				typeof prop === 'object' &&
				Object.keys(prop).sort().join(',') === 'subscribe,set,update'
			) {
				// Object is a Writable! Let's get it
				return [key, { type: '_writableSerialized', value: get(prop as Writable<any>) }];
			}
			// Object isn't a writable, but might contain writables. Recurse just in case.
			return [key, serializeObjectOfWritables(prop)];
		});
		const rebuiltObject = Object.fromEntries(writableProps);
		return rebuiltObject;
	}
	return value;
};

export const deserializeObjectOfWritables = (value: any) => {
	if (typeof value === 'object') {
		const writableProps: [string, unknown][] = Object.entries(value).map(([key, prop]) => {
			if (
				prop &&
				typeof prop === 'object' &&
				prop['type' as keyof typeof prop] === '_writableSerialized'
			) {
				// Object is a Writable! Let's turn it back into one.
				return [key, writable(prop)];
			}
			// Object isn't a writable, but might contain writables. Recurse just in case.
			return [key, deserializeObjectOfWritables(prop)];
		});
		const rebuiltObject = Object.fromEntries(writableProps);
		return rebuiltObject;
	}
	return value;
};

export const nestedWritableSerialize = {
	afterDeserialize: (value: any) => {
		return deserializeObjectOfWritables(value);
	},
	beforeSerialize: (props: any) => {
		const propsGotten = serializeObjectOfWritables(props);
		return JSON.stringify(propsGotten);
	}
};

export const writableSerialize = {
	afterDeserialize: (value: any) => {
		return writable(value);
	},
	beforeSerialize: (value: Writable<any>) => {
		return get(value);
	},
	afterSerialize: (value: any) => {
		console.log('Serialized value:', value);
	}
};

export const readableSerialize = {
	afterDeserialize: (value: any) => {
		return readable(value);
	},
	beforeSerialize: (value: Readable<any>) => {
		return get(value);
	}
};
