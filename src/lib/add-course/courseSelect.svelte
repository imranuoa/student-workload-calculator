<script lang="ts">
	import type { Course } from '$lib/course';
	import type { Writable } from 'svelte/store';
	import CoursePickerOption from './coursePickerOption.svelte';

	export let courses: Writable<Course[]>;
	export let activeCourse: Writable<number>;

	$: activeCourseMeta = $courses[$activeCourse]?.meta;
</script>

<div>
	<button class="btn float-right" on:click={() => ($activeCourse = -1)}>Manage</button>
	{#if activeCourseMeta}
		<h2>{$activeCourseMeta.name}</h2>
	{/if}
</div>
