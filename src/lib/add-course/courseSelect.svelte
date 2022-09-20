<script lang="ts">
	import type { Course } from '$lib/course';
	import type { Writable } from 'svelte/store';
	import CoursePickerOption from './coursePickerOption.svelte';

	export let courses: Writable<Course[]>;
	export let activeCourse: Writable<number>;

	$: activeCourseMeta = $courses[$activeCourse]?.meta;
</script>

<div>
	{#if activeCourseMeta}
		<h2>{$activeCourseMeta.name}</h2>
	{/if}
	<!-- Select list of courses -->
	<label class="block mt-2">
		<span class="text-gray-700">Select Course</span>
		<select class="form-select block w-full" bind:value={$activeCourse} on:change>
			{#each $courses as option, i}
				<CoursePickerOption {option} {i} />
			{/each}
			<option value={-1} disabled>----</option>
			<option value={-1}>Create New</option>
		</select>
	</label>

	<label class="block mt-2">
		<span class="text-gray-700">Weeks in Semester</span>
		<input
			type="number"
			class="form-input mt-1 block w-full"
			bind:value={$activeCourseMeta.weeks}
		/>
	</label>
</div>
