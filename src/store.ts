import { JsonSerializer, throwError } from 'typescript-json-serializer';
// import { writable } from 'svelte-local-storage-store';
import { Course } from '$lib/course';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

const defaultSerializer = new JsonSerializer();

const serializer = {
	stringify(value: Course[]) {
		const serialized = defaultSerializer.serialize(value);
		return JSON.stringify(serialized);
	},
	parse(value: string) {
		const parsed: object[] = JSON.parse(value);
		let deserialized: Course[] = [];
		parsed.forEach((courseJSON) => {
			const course = defaultSerializer.deserializeObject(courseJSON, Course);
			if (!course) {
				console.error('Failed to deserialize course:', courseJSON);
				return;
			}
			deserialized.push(course);
		});
		return deserialized;
	}
};

// export const courses: Writable<Course[]> = writable('courses', [], { serializer });
// export const activeCourse: Writable<number> = writable('activeCourse', 0);
export const courses: Writable<Course[]> = writable([]);
export const activeCourse: Writable<number> = writable(0);
