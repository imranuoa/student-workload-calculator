<script lang="ts">
	import { getActivityClass } from '$lib/activities';
	import { Frequency, type Activity } from '$lib/course-activities/genericActivity';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let active: boolean;
	export let activity: Activity;

	$: instanceName = activity.instanceName;
	$: freq = activity.freq;
	$: derivedCalculated = activity.derivedCalculated;
</script>

<div
	class="activity-row"
	class:active
	role="button"
	on:click={() => {
		dispatch('select', activity);
	}}
>
	<span class="icon">
		{getActivityClass(activity).icon}
	</span>
	<span class="name">{$instanceName}</span>
	<span class="hours">
		{#if $freq == Frequency.Weekly}
			{$derivedCalculated.perWeekI + $derivedCalculated.perWeekS} Hrs per Week
		{:else}
			{$derivedCalculated.perCourseI + $derivedCalculated.perCourseS} Hrs per Course
		{/if}
	</span>
	<button
		class="btn btn-block btn-danger"
		aria-label="delete"
		on:click|stopPropagation={() => {
			dispatch('delete', activity);
		}}
	>
		<span class="icon">-</span>
	</button>
</div>

<style lang="postcss">
	.activity-row {
		@apply grid p-1 items-center rounded transition;
		grid-template-columns: 4ch 1fr auto auto;
		&:hover {
			@apply bg-gray-100;
		}
		&.active {
			@apply bg-gray-200;
		}
		.icon {
			@apply text-center;
		}
		.name {
			@apply text-gray-700 font-bold;
		}
		.hours {
			@apply text-gray-500 text-sm italic mx-2;
		}
	}
</style>
