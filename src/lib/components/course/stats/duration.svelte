<script lang="ts">
	import CheckSelect from '$lib/components/form-elems/checkSelect.svelte';
	import RangeInput from '$lib/components/form-elems/rangeInput.svelte';
	import { Course, getCourseData, type courseData, type courseDataValid } from '$lib/course';
	import { propertyStore } from 'svelte-writable-derived';
	import { derived } from 'svelte/store';
	import { cardState } from '../card';
	import Generic from './generic.svelte';

	export let course: Course;
	export let state: cardState;

	$: meta = course?.meta;
	$: activities = course?.activities;
	$: totals = $activities && Course.getTotal($activities);

	$: writableWeeks = propertyStore(meta, ['weeks']);
	$: writableWeekTemplate = propertyStore(meta, ['weekTemplate']);
</script>

<Generic type="Duration">
	<slot name="data" slot="data">
		{$meta.weeks} week{$meta.weeks === 1 ? '' : 's'}
	</slot>
	<svelte:fragment slot="details">
		{#if state !== cardState.view}
			<div class="form">
				<p class="hint">
					Select how many weeks your course will run, and which weeks are non-teaching weeks.
					babababa
				</p>
				<RangeInput
					colour="#D2492A"
					colourActive="#BF3313"
					props={{
						value: writableWeeks,
						label: 'Number of Weeks',
						min: 1,
						max: 52,
						step: 1,
						id: 'duration'
					}}
				/>
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
			</div>
		{/if}
	</svelte:fragment>
</Generic>

<style lang="postcss">
	.form {
		@apply grid grid-flow-row gap-4;
	}

	.hint {
		@apply text-sm mb-0 mt-2;
	}
</style>
