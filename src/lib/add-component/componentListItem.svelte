<script lang="ts">
	import { Component, getComponentClass } from '$lib/components';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let active: boolean;
	export let component: Component;

	$: instanceName = component.instanceName;
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
		{$derivedCalculated.perWeekI + $derivedCalculated.perWeekS} Hrs per Week
	</span>
	<button
		class="btn btn-block"
		aria-label="delete"
		on:click={() => {
			dispatch('delete', component);
		}}
	>
		<span class="icon">-</span>
	</button>
</div>

<style lang="postcss">
	.component-row {
		@apply grid p-1 items-center rounded;
		grid-template-columns: 4ch 1fr auto auto;
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
