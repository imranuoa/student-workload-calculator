<script lang="ts">
	import { Course } from '$lib/course';
	import { courses, activeCourse, addCourse, deleteCourse } from '../../store';
	import CoursePickerOption from './coursePickerOption.svelte';

	let editingCourse = 0;

	$: activeCourseMeta = $courses[editingCourse]?.meta;

	const newCourseData = {
		name: 'Your Course',
		weeks: 12
	};
</script>

{#if $courses.length > 0}
	<div class="card">
		<label class="block mt-2">
			<span class="text-gray-700">Select Course</span>
			<select class="form-select block w-full" bind:value={editingCourse} on:change>
				{#each $courses as option, i}
					<CoursePickerOption {option} {i} />
				{/each}
			</select>
		</label>

		{#if $activeCourseMeta}
			<label class="block pt-4" for="numberWeeks">
				<span class="text-gray-700"> Number of Weeks </span>
				<div class="rangeInputFlex mt-1 flex gap-4">
					<input
						type="number"
						id="numberWeeks"
						class="form-input w-16"
						bind:value={$activeCourseMeta.weeks}
					/>
					<input
						type="range"
						bind:value={$activeCourseMeta.weeks}
						class="block w-full flex-grow"
						min="1"
						max="52"
					/>
				</div>
			</label>
			<br />
			<button class="btn btn-lg btn-primary" on:click={() => ($activeCourse = editingCourse)}
				>Go to Course</button
			>
			<button
				class="btn btn-lg btn-danger"
				on:click={() => {
					deleteCourse(editingCourse);
					editingCourse = 0;
				}}>Delete Course</button
			>
		{/if}
	</div>
{/if}
<div class="card creation-layout">
	<h2>Create a Course</h2>
	<p>To begin, fill out some information about the course:</p>
	<label class="block pt-4">
		<span class="text-gray-700">Course Name</span>
		<input type="text" class="form-input mt-1 block w-full" bind:value={newCourseData.name} />
	</label>
	<label class="block pt-4" for="numberWeeks">
		<span class="text-gray-700"> Number of Weeks </span>
		<div class="rangeInputFlex mt-1 flex gap-4">
			<input
				type="number"
				id="numberWeeks"
				class="form-input w-16"
				bind:value={newCourseData.weeks}
			/>
			<input
				type="range"
				bind:value={newCourseData.weeks}
				class="block w-full flex-grow"
				min="1"
				max="52"
			/>
		</div>
	</label>
	<br />
	<button
		class="btn btn-lg btn-primary"
		on:click={() => {
			addCourse(new Course(newCourseData.name, newCourseData.weeks));
		}}>Create Course</button
	>
</div>

<style lang="postcss">
	.card {
		@apply max-w-prose w-full mx-auto mt-4 bg-white shadow rounded-lg px-10 py-7;
	}
</style>
