<script lang="ts">
	import type { Course } from '$lib/course';
	import { courses, activeCourse, addCourse, deleteCourse, openCourse } from '../../store';
	import CoursePickerOption from '$lib/add-course/coursePickerOption.svelte';

	export let course: Course;
	export let courseIndex: number;
	$: meta = course.meta;
</script>

<div class="card">
	{#if $meta}
		<label class="block">
			<span class="text-gray-700">Course Name</span>
			<input type="text" class="form-input mt-1 block w-full" bind:value={$meta.name} />
		</label>

		<label class="block pt-4" for="numberWeeks">
			<span class="text-gray-700"> Number of Weeks </span>
			<div class="rangeInputFlex mt-1 flex gap-4">
				<input type="number" id="numberWeeks" class="form-input w-16" bind:value={$meta.weeks} />
				<input
					type="range"
					bind:value={$meta.weeks}
					class="block w-full flex-grow"
					min="1"
					max="52"
				/>
			</div>
		</label>
		<br />
		<button class="btn btn-lg btn-primary" on:click={() => openCourse(courseIndex)}
			>Go to Course</button
		>
		<button
			class="btn btn-lg btn-danger"
			on:click={() => {
				deleteCourse(courseIndex);
				courseIndex = 0;
			}}>Delete Course</button
		>
	{/if}
</div>
