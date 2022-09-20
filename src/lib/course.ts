import components, {
	PrimaryMeeting,
	Component,
	getComponentClass,
	type serializedComponent
} from '$lib/components';
import { derived, get, writable, type Writable } from 'svelte/store';
import { writableSerialize } from '$lib/serialize';

export interface courseMeta {
	name: string;
	weeks: number;
}

export interface serializedCourse {
	meta: courseMeta;
	openComponent: number;
	components: serializedComponent[];
}

export class Course {
	static serialize(c: Course): serializedCourse {
		const components = get(c.components).map((component) => {
			const compClass = getComponentClass(component);
			return compClass.serialize(component);
		});

		return {
			meta: get(c.meta),
			openComponent: get(c.openComponent),
			components
		};
	}
	static deserialize(c: serializedCourse) {
		const componentList = c.components.map((component) => {
			const componentClass = components.find((cClass) => cClass.name === component.type);
			if (!componentClass) throw new Error(`Component type ${component.type} not found`);
			return componentClass.deserialize(component);
		});
		return new Course(c.meta.name, c.meta.weeks, componentList, c.openComponent);
	}
	openComponent: Writable<number>;
	meta: Writable<courseMeta>;
	components: Writable<Component[]>;
	updated = 0;
	watchDerived() {
		const watcher = derived(
			[this.openComponent, this.meta, this.components],
			(() => {
				console.log('Triggering course update on:', this);
				this.updated += 1;
				return true;
			}).bind(this)
		);
		this.components.subscribe(
			(() => {
				console.log('Triggering course update on:', this);
				this.updated += 1;
				return true;
			}).bind(this)
		);
		console.log('Watching course:', this, watcher);
	}
	constructor(name = '', weeks = 0, components: Component[] = [], openComponent = 0) {
		this.openComponent = writable(openComponent);
		this.meta = writable({ name, weeks });
		this.components = writable(components);
		this.watchDerived();
	}
}
