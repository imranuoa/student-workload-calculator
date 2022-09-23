import components, { getComponentClass, type serializedComponent } from '$lib/components';
import type { Component } from '$lib/course-components/genericComponent';
import { derived, get, writable, type Writable } from 'svelte/store';

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
		const course = new Course(c.meta.name, c.meta.weeks, [], c.openComponent);
		c.components.forEach((component) => {
			const componentClass = components.find((cClass) => cClass.type === component.type);
			if (!componentClass) throw new Error(`Component type ${component.type} not found`);
			course.addComponent(componentClass.deserialize(component, course.meta));
		});
		return course;
	}
	openComponent: Writable<number>;
	meta: Writable<courseMeta>;
	private _components: Writable<Component[]> = writable([]);
	public get components(): Writable<Component[]> {
		return this._components;
	}
	watchDerived() {
		const d = derived([this.openComponent, this.meta, this._components], (e) => e);
		d.subscribe(this.notify);
	}
	subscribe(f: Function) {
		this.subscribers.push(f);
		return () => {
			const index = this.subscribers.indexOf(f);
			if (index !== -1) {
				this.subscribers.splice(index, 1);
			}
		};
	}
	notify = () => this.subscribers.forEach((f) => f());
	addComponent(component: Component, open = true) {
		component.subscribe(() => {
			this.notify();
		});
		this._components.update((c) => {
			return [...c, component];
		});
		if (open) this.openComponent.set(get(this.components).length - 1);
	}
	removeComponent(i: number) {
		const numComponents = get(this.components).length;
		if (numComponents === 1) {
			this._components.set([]);
			this.openComponent.set(-1);
		} else {
			this._components.update((c) => {
				c.splice(i, 1);
				return c;
			});
			if (get(this.openComponent) === i) {
				if (numComponents === i + 1) {
					this.openComponent.set(i - 1);
				} else {
					this.openComponent.set(i);
				}
			} else {
				this.openComponent.update((o) => {
					if (o > i) return o - 1;
					return o;
				});
			}
			console.log(get(this.openComponent));
		}
	}
	constructor(
		name = '',
		weeks = 0,
		components: Component[] = [],
		openComponent = 0,
		private subscribers: Function[] = []
	) {
		this.openComponent = writable(openComponent);
		this.meta = writable({ name, weeks });
		components.forEach((c) => this.addComponent(c));
		this.watchDerived();
	}
}
