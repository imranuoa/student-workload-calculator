<script lang="ts">
	import { getComponentClass } from '$lib/components';
	import { Frequency, type Component } from '$lib/course-components/genericComponent';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let active: boolean;
	export let component: Component;

	$: instanceName = component.instanceName;
	$: freq = component.freq;
	$: derivedCalculated = component.derivedCalculated;
</script>

<div
	class="component-row"
	class:active
	role="button"
	on:click={() => {
		dispatch('select', component);
	}}
>
	<span class="icon">
		{getComponentClass(component).icon}
	</span>
	<span class="name">{$instanceName}</span>
	<span class="hours">
		{#if $freq == Frequency.Weekly}
			{$derivedCalculated.perWeekI + $derivedCalculated.perWeekS} Hrs per Week
		{:else}
			{$derivedCalculated.perSemI + $derivedCalculated.perSemS} Hrs per Sem
		{/if}
	</span>
	<button
		class="btn btn-block btn-danger"
		aria-label="delete"
		on:click|stopPropagation={() => {
			dispatch('delete', component);
		}}
	>
		<span class="icon">-</span>
	</button>
</div>

<style lang="postcss">
	.component-row {
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
