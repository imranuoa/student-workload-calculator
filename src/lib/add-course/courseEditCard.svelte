<script lang="ts">
	import { writable, derived, type Writable } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived';

	import type { Course } from '$lib/course';
	import { deleteCourse, openCourse } from '../../store';
	import CheckSelect from '$lib/form-elems/checkSelect.svelte';
	import { scale } from 'svelte/transition';

	export let course: Course;
	export let courseIndex: number;
	$: meta = course.meta;
	let writableWeekTemplate: Writable<string[]>;
	$: if ($meta) {
		writableWeekTemplate = propertyStore(meta, ['weekTemplate']);
	}
</script>

<div class="card" transition:scale>
	{#if $meta}
		<label class="coursename" for="courseEdit-{course.id}-courseName">
			<span class="prefix">Course:</span>
			<input type="text" bind:value={$meta.name} id="courseEdit-{course.id}-courseName" />
			<!-- <span class="suffix">✐</span> -->
		</label>

		<div class="block pt-4 mb-4">
			<label class="text-gray-700" for="courseEdit-{course.id}-numWeeks"> Number of Weeks </label>
			<div class="rangeInputFlex mt-1 flex gap-4">
				<input
					type="number"
					id="courseEdit-{course.id}-numWeeks"
					class="form-input w-16"
					bind:value={$meta.weeks}
				/>
				<input
					type="range"
					bind:value={$meta.weeks}
					class="block w-full flex-grow"
					min="1"
					max="52"
					aria-hidden="true"
					tabindex="-1"
				/>
			</div>
		</div>
		{#if $writableWeekTemplate}
			<CheckSelect
				props={{
					options: derived(meta, (Dmeta) =>
						[...Array(Dmeta.weeks).keys()].map((e) => (e + 1).toString())
					),
					value: writableWeekTemplate,
					label: 'Default teaching weeks',
					id: `courseEdit-${course.id}-defaultWeeks`
				}}
			/>
		{/if}
		<br />
		<button class="btn btn-lg btn-primary" on:click={() => openCourse(courseIndex)}
			>Go to Course</button
		>
		<button
			class="btn btn-lg btn-danger"
			on:click={() => {
				if (confirm('Are you sure you want to delete this course?')) {
					deleteCourse(courseIndex);
					courseIndex = 0;
				}
			}}>Delete Course</button
		>
	{/if}
</div>

<style lang="postcss">
	.card {
		.coursename {
			@apply text-2xl flex items-center gap-4 border-b-2 border-dashed;
			.prefix {
				@apply block opacity-50;
			}
			input {
				@apply flex-grow border-0 p-2 text-2xl;
			}
		}
	}
</style>
