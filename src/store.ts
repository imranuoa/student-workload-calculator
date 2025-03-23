import { writable as localStorageStore } from 'svelte-local-storage-store';
import { Course, type serializedCourse } from '$lib/course';
import { get, writable, type Writable } from 'svelte/store';
import { PrimaryMeeting } from '$lib/course-activities/primaryMeeting';
import { goto } from '$app/navigation';
import { nanoid } from 'nanoid';
import { base } from '$app/paths';

const storeVersion = 'v2';

const serializer = {
	stringify(value: Course[]) {
		const serialized = value.map((c) => Course.serialize(c));
		return JSON.stringify(serialized);
	},
	parse(value: string) {
		const parsed: object[] = JSON.parse(value);
		const courseList: Course[] = [];
		parsed.forEach((c: any) => {
			const course = Course.deserialize(c);
			if (course) {
				course.subscribe(notifyStore);
				courseList.push(course);
			}
		});
		console.log(parsed);
		return courseList;
	}
};

const notifyStore = () => {
	courses.update((c) => c);
};

export const courses: Writable<Course[]> = localStorageStore(`${storeVersion}-courses`, [], {
	serializer
});
export const activeCourse: Writable<number> = localStorageStore(`${storeVersion}-activeCourse`, -1);
// export const courses: Writable<Course[]> = writable([]);
// export const activeCourse: Writable<number> = writable(0);




export const addCourse = (course = new Course('Your Course', 12), setActive = true) => {
	console.log('Adding Course!');
	course.subscribe(notifyStore);
	courses.update((c) => [...c, course]);
	if (setActive) {
		activeCourse.set(get(courses).length - 1);
	}
	// goto('/');
};

export const deleteCourse = (i: number) => {
	courses.update((c) => {
		c.splice(i, 1);
		return c;
	});
	activeCourse.set(-1);
};

export const openCourse = (i: number) => {
	activeCourse.set(i);
	goto(base + '/');
};

export const exportCourseData = (course: false | number = false) => {
	let courseData: serializedCourse[];
	if (course === false) {
		courseData = get(courses).map((c) => Course.serialize(c));
	} else {
		courseData = [Course.serialize(get(courses)[course])];
	}
	const json = JSON.stringify(courseData, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `course-${
		courseData.length === 1 ? Course.safeName(courseData[0].meta.name) : new Date().toISOString()
	}.json`;
	link.click();
};

export const importCourseData = (data?: string) => {
	if (!data) {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = false;
		input.accept = 'application/json';
		input.onchange = async () => {
			if (!input.files?.length) return;
			const file = input.files[0];
			const content = await file.text();
			importCourseData(content);
		};
		input.click();
		return;
	}
	try {
		const courseData = JSON.parse(data);
		courseData.forEach((c: serializedCourse) => {
			const matchedCourseId = get(courses).find((cx) => cx.id === c.id);
			if (matchedCourseId) {
				c.id = nanoid();
			}
			const course = Course.deserialize(c);
			if (course) {
				let nameAttempts = 0;
				while (
					get(courses).find((c) => get(c.meta).name === get(course.meta).name) !== undefined &&
					nameAttempts < 10
				) {
					nameAttempts++;
					if (nameAttempts === 1) {
						course.meta.update((m) => ({
							...m,
							name: m.name + ` (imported)`
						}));
					} else {
						course.meta.update((m) => ({
							...m,
							name: m.name.replace(/ \(\d+\)$/, '') + ` (${nameAttempts})`
						}));
					}
				}
				course.subscribe(notifyStore);
				courses.update((c) => [...c, course]);
			}
		});
	} catch (error) {
		console.error(error);
	}
};
