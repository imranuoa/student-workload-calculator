import { JsonSerializer, throwError } from 'typescript-json-serializer';
import { writable } from 'svelte-local-storage-store';
import { Course } from '$lib/course';
import type { Writable } from 'svelte/store';
// import { writable } from 'svelte/store';

const defaultSerializer = new JsonSerializer({
	nullishPolicy: {
		undefined: 'remove',
		null: 'allow'
	},
	errorCallback: (error) => console.log(error)
});

const serializer = {
	stringify(value: Course[]) {
		const serialized = defaultSerializer.serialize(value);
		console.log(serialized);
		return JSON.stringify(serialized);
	},
	parse(value: string) {
		const courses = defaultSerializer.deserializeObjectArray(value, Course);
		if (!courses) return [];
		// return courses.filter((c) => c) as Course[];
		return [];
	}
};

export const courses: Writable<Course[]> = writable('courses', [], { serializer });
export const activeCourse: Writable<number> = writable('activeCourse', 0);
// export const courses: Writable<Course[]> = writable([]);
// export const activeCourse: Writable<number> = writable(0);
