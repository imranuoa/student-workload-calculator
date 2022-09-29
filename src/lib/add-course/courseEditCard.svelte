<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived';

	import type { Course } from '$lib/course';
	import { deleteCourse, openCourse } from '../../store';
	import CheckSelect from '$lib/form-elems/checkSelect.svelte';

	export let course: Course;
	export let courseIndex: number;
	$: meta = course.meta;
	let writableWeekTemplate;
	$: if ($meta) {
		writableWeekTemplate = propertyStore(meta, ['weekTemplate']);
	}
</script>

<div class="card">
	{#if $meta}
		<label class="coursename" for="courseName">
			<span class="prefix">Course:</span>
			<input type="text" bind:value={$meta.name} id="courseName" />
			<!-- <span class="suffix">✐</span> -->
		</label>

		<label class="block pt-4 mb-4" for="numberWeeks">
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
		{#if $writableWeekTemplate}
			<CheckSelect
				props={{
					options: derived(meta, (Dmeta) =>
						[...Array(Dmeta.weeks).keys()].map((e) => (e + 1).toString())
					),
					value: writableWeekTemplate,
					label: 'Default teaching weeks'
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
				deleteCourse(courseIndex);
				courseIndex = 0;
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
			.suffix {
				@apply block;
				@apply rounded-full outline outline-1 outline-slate-800 text-slate-800 cursor-pointer;
				@apply w-7 h-7 leading-7 text-center text-lg;
			}
		}
	}
</style>
