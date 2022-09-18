<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { Component } from '$lib/components';

	const dispatch = createEventDispatcher();

	export let component: Component;
	export let perWeekMedian: Readable<number>;
	export let perSemMedian: Readable<number>;
	export let courseWeeks: number;
	export let active: boolean | null = null;

	$: derivedCalculated = component.derivedCalculated;
	$: instanceName = component.instanceName;

	$: perWeekI = $derivedCalculated.perWeekI;
	$: perWeekS = $derivedCalculated.perWeekS;
	$: perSemI = $derivedCalculated.perSemI;
	$: perSemS = $derivedCalculated.perSemS;
</script>

<tr on:click={() => dispatch('click', component)} class:clickable={active !== null} class:active>
	<td>{$instanceName}</td>
	<td
		class:warning={perWeekI > 4}
		class:danger={perWeekI > 10}
		style="--comparison: {(perWeekI / $perWeekMedian) * 100}%"
	>
		{perWeekI}
		<div class="comparison" />
	</td>
	<td
		class:warning={perWeekS > 4}
		class:danger={perWeekS > 10}
		style="--comparison: {(perWeekS / $perWeekMedian) * 100}%"
	>
		{perWeekS}
		<div class="comparison" />
	</td>
	<td
		class:warning={perSemI / courseWeeks > 4}
		class:danger={perSemI / courseWeeks > 10}
		style="--comparison: {(perSemI / $perSemMedian) * 100}%"
	>
		{perSemI}
		<div class="comparison" />
	</td>
	<td
		class:warning={perSemS / courseWeeks > 4}
		class:danger={perSemS / courseWeeks > 10}
		style="--comparison: {(perSemS / $perSemMedian) * 100}%"
	>
		{perSemS}
		<div class="comparison" />
	</td>
</tr>

<style lang="postcss">
	tr {
		@apply h-10 text-center relative;
		@apply border-b border-slate-300;
		&.clickable {
			@apply cursor-pointer;
		}
		&:last-child {
			@apply border-b-0;
		}
		&:hover {
			@apply bg-gray-200;
		}

		&::after {
			content: ' ';
			@apply block absolute w-1 h-0 rounded-full top-0 bottom-0 left-0 m-auto;
			@apply transition-all duration-300 opacity-0 bg-slate-700;
		}
		&.active::after {
			@apply opacity-100 h-full;
		}
	}
	td {
		@apply border-l border-slate-300 relative transition;
		&.warning {
			@apply bg-yellow-200;
		}
		&.danger {
			@apply bg-red-200;
		}
		.comparison {
			@apply block absolute bottom-0 left-0 h-1;
			@apply bg-slate-700;
			width: min(var(--comparison), 100%);
		}
	}
	td:first-child {
		@apply border-l-0;
	}
</style>
