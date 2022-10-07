<script lang="ts">
	import { writable, derived, type Writable, readable } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived';

	import type { Course } from '$lib/course';
	import { deleteCourse, openCourse } from '../../store';
	import CheckSelect from '$lib/form-elems/checkSelect.svelte';
	import { scale } from 'svelte/transition';
	import NumberInput from '$lib/form-elems/numberInput.svelte';
	import RangeInput from '$lib/form-elems/rangeInput.svelte';
	import type { Frequency } from '$lib/course-activities/genericActivity';
	import SingleSelect from '$lib/form-elems/singleSelect.svelte';

	export let course: Course;
	export let courseIndex: number;
	$: meta = course.meta;
	let writableWeekTemplate: Writable<string[]>;
	let writableWeeks: Writable<number>;
	let writableTarget: Writable<Frequency>;
	let writableTargetFreq: Writable<number>;
	$: if ($meta) {
		writableWeeks = propertyStore(meta, ['weeks']);
		writableTarget = propertyStore(meta, ['target']);
		writableTargetFreq = propertyStore(meta, ['targetFreq']);
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
		<RangeInput
			props={{
				id: 'courseEdit-{course.id}-weeks',
				value: writableWeeks,
				label: 'Number of Weeks',
				min: 1,
				max: 20,
				step: 1
			}}
		/>
		<RangeInput
			props={{
				id: 'courseEdit-{course.id}-target',
				value: writableTarget,
				label: 'Target Hours',
				min: 1,
				max: 20,
				step: 1
			}}
		/>
		<SingleSelect
			props={{
				id: 'courseEdit-{course.id}-targetFreq',
				value: writableTargetFreq,
				label: 'Is this a weekly or total target?',
				options: readable(['Weekly', 'Total'])
			}}
		/>
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
		@apply ring-2 ring-orange-300;
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
