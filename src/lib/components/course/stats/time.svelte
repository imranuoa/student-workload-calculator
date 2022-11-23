<script lang="ts">
	import RangeInput from '$lib/components/form-elems/rangeInput.svelte';
	import { Course, getCourseData, type courseData, type courseDataValid } from '$lib/course';
	import { propertyStore } from 'svelte-writable-derived';
	import { cardState } from '../card';
	import Generic from './generic.svelte';

	export let course: Course;
	export let state: cardState;

	$: meta = course?.meta;
	$: activities = course?.activities;
	$: totals = $activities && Course.getTotal($activities);

	$: writableTarget = propertyStore(meta, ['target']);
	$: writableTargetFreq = propertyStore(meta, ['targetFreq']);
</script>

<Generic type="Time">
	<slot name="data" slot="data">
		{$meta.weeks} week{$meta.weeks === 1 ? '' : 's'}
	</slot>
	<svelte:fragment slot="details">
		{#if state !== cardState.view}
			<RangeInput
				props={{
					value: writableTarget,
					label: 'Target Hours Per Week / Total',
					min: 1,
					max: 40,
					step: 1,
					id: 'duration'
				}}
			/>
		{/if}
	</svelte:fragment>
</Generic>
