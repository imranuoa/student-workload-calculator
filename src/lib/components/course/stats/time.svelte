<script lang="ts">
	import ButtonRadio from '$lib/components/form-elems/buttonRadio.svelte';
	import RangeInput from '$lib/components/form-elems/rangeInput.svelte';
	import { Course, getCourseData, type courseData, type courseDataValid } from '$lib/course';
	import { Frequency } from '$lib/course-activities/genericActivity';
	import { propertyStore } from 'svelte-writable-derived';
	import { derived } from 'svelte/store';
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
			<div class="form">
				<RangeInput
					colour="#55A51C"
					colourActive="#55A51C"
					props={{
						value: writableTarget,
						label: `Workload target (hours)`,
						min: 1,
						max: 40,
						step: 1,
						id: `${course.id}-TargetHours`
					}}
				/>
				<ButtonRadio
					props={{
						id: `${course.id}-TargetFreq`,
						value: writableTargetFreq,
						label: 'Target Frequency',
						prefix: derived(writableTarget, (wt) => `${wt} Hour${wt === 1 ? '' : 's'}`),
						options: derived(writableTarget, (wt) => [
							`Per week`,
							`Overall`
						])
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
</style>
