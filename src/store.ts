import { writable } from 'svelte-local-storage-store';
import type { course } from '$lib/course';
import type { Writable } from 'svelte/store';
// import categories from '$lib/icons';
// import rfdc from 'rfdc';

// const clone = rfdc();
// export const unsavedStateCategories = writable('preferences', clone(categories))

export const courses: Writable<course[]> = writable('courses', []);
export const activeCourse: Writable<number> = writable('activeCourse', 0);
