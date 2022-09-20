import { writable } from 'svelte-local-storage-store';
import { Course } from '$lib/course';
import type { Writable } from 'svelte/store';
// import { writable } from 'svelte/store';

const serializer = {
	stringify(value: Course[]) {
		const serialized = value.map((c) => Course.serialize(c));
		console.log(serialized);
		return JSON.stringify(serialized);
	},
	parse(value: string) {
		return [];
	}
};

export const courses: Writable<Course[]> = writable('courses', [], { serializer });
export const activeCourse: Writable<number> = writable('activeCourse', 0);
// export const courses: Writable<Course[]> = writable([]);
// export const activeCourse: Writable<number> = writable(0);
