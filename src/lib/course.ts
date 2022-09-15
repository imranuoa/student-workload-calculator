import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import type { Component } from '$lib/components';
import { writable, type Writable } from 'svelte/store';

export interface courseMeta {
	name: string;
	weeks: number;
}

@JsonObject()
export class Course {
	@JsonProperty() openComponent: Writable<number>;
	@JsonProperty() meta: Writable<courseMeta>;
	@JsonProperty() components: Writable<Component[]>;
	constructor(name = '', weeks = 0, components = [], openComponent = 0) {
		this.openComponent = writable(openComponent);
		this.meta = writable({ name, weeks });
		this.components = writable(components);
	}
}
