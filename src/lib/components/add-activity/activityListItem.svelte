<script lang="ts">
	import { getActivityClass } from '$lib/activities';
	import { Frequency, type Activity } from '$lib/course-activities/genericActivity';
	import { createEventDispatcher } from 'svelte';
	import Duration from 'humanize-duration';

	const dispatch = createEventDispatcher();

	export let active: boolean;
	export let activity: Activity;

	$: instanceName = activity.instanceName;
	$: freq = activity.freq;
	$: derivedCalculated = activity.derivedCalculated;

	const shortEnglishHumanizer = Duration.humanizer({
		language: 'shortEn',
		languages: {
			shortEn: {
				y: (v) => (v === 1 ? 'y' : 'yrs'),
				mo: (v) => (v === 1 ? 'mo' : 'months'),
				w: (v) => (v === 1 ? 'w' : 'wks'),
				d: (v) => (v === 1 ? 'd' : 'days'),
				h: (v) => (v === 1 ? 'h' : 'hrs'),
				m: (v) => (v === 1 ? 'min' : 'mins'),
				s: (v) => (v === 1 ? 's' : 'secs'),
				ms: (v) => (v === 1 ? 'ms' : 'ms')
			}
		}
	});

	$: perOccurance = (value: number): string => {
		return shortEnglishHumanizer(value * 60 * 60 * 1000, {
			units: ['h'],
			round: true,
			spacer: '',
			serialComma: false,
			language: 'shortEn'
		});
	};
</script>

<label class="activity-row" class:active for="select-activity-{$instanceName}">
	<input
		type="checkbox"
		id="select-activity-{$instanceName}"
		on:change={() => {
			dispatch('select', activity);
		}}
		checked={active}
	/>
	<span class="icon">
		{getActivityClass(activity).icon}
	</span>
	<span class="name">
		{$instanceName}
	</span>
	<span class="hours">
		{#if $freq == Frequency.Weekly}
			{perOccurance($derivedCalculated.perWeekI + $derivedCalculated.perWeekS)} per Week
		{:else}
			{perOccurance($derivedCalculated.perCourseI + $derivedCalculated.perCourseS)} per Course
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
</label>

<style lang="postcss">
	.activity-row {
		@apply grid p-1 items-center rounded transition relative;
		grid-template-columns: 4ch 1fr auto auto;
		grid-template-areas: 'icon name hours delete';
		input {
			@apply m-auto z-10 outline outline-2 outline-blue-500 opacity-0 pointer-events-none;
			grid-area: icon;
			&:focus-visible {
				@apply opacity-100;
			}
		}
		&:hover {
			@apply bg-gray-100;
		}
		&.active {
			@apply bg-gray-200;
		}
		.icon {
			@apply text-center;
			grid-area: icon;
		}
		.name {
			@apply text-gray-700 font-bold;
			grid-area: name;
		}
		.hours {
			@apply text-gray-500 text-sm italic mx-2;
			grid-area: hours;
		}
		.btn {
			grid-area: delete;
		}
	}
</style>
