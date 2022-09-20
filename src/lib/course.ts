import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { PrimaryMeeting, Component } from '$lib/components';
import { get, writable, type Writable } from 'svelte/store';
import { writableSerialize } from '$lib/serialize';

export interface courseMeta {
	name: string;
	weeks: number;
}

@JsonObject()
export class Course {
	@JsonProperty(writableSerialize) openComponent: Writable<number>;
	@JsonProperty(writableSerialize) meta: Writable<courseMeta>;
	@JsonProperty({
		...writableSerialize,
		type: () => {
			return PrimaryMeeting;
		}
	})
	components: Writable<Component[]>;
	constructor(name = '', weeks = 0, components = [], openComponent = 0) {
		this.openComponent = writable(openComponent);
		this.meta = writable({ name, weeks });
		this.components = writable(components);
	}
}
