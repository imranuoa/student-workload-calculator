<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import { Frequency, type Component } from '$lib/course-components/genericComponent';
	import { getComponentClass } from '$lib/components';

	const dispatch = createEventDispatcher();

	export let component: Component;

	$: freq = component.freq;

	export let totals: {
		perWeekI: { median: number; total: number };
		perWeekS: { median: number; total: number };
		perSemI: { median: number; total: number };
		perSemS: { median: number; total: number };
		perSem: { median: number; total: number };
		perWeek: { median: number; total: number };
	};
	export let courseWeeks: number;
	export let active: boolean | null = null;

	$: derivedCalculated = component.derivedCalculated;
	$: instanceName = component.instanceName;

	$: perWeekI = $derivedCalculated.perWeekI;
	$: perWeekS = $derivedCalculated.perWeekS;
	$: perSemI = $derivedCalculated.perSemI;
	$: perSemS = $derivedCalculated.perSemS;
</script>

<tr class:active class:clickable={active !== null}>
	<td class="name" on:click={() => dispatch('click', component)}>
		{#if $freq == Frequency.Weekly}
			<span class="pill weekly" title="Occurs Weekly"> W </span>
		{:else}
			<span class="pill semesterly" title="Occurs once"> C </span>
		{/if}
		{$instanceName}
		<span class="icon">
			{getComponentClass(component).icon}
		</span>
	</td>
	<td
		class:warning={perWeekI > 4}
		class:danger={perWeekI > 10}
		style="--comparison: {totals.perWeek.median > 0
			? (perWeekI / totals.perWeek.median) * 100
			: 100}%"
	>
		{perWeekI}
		<div class="comparison" />
	</td>
	<td
		class:warning={perWeekS > 4}
		class:danger={perWeekS > 10}
		style="--comparison: {totals.perWeek.median > 0
			? (perWeekS / totals.perWeek.median) * 100
			: 100}%"
	>
		{perWeekS}
		<div class="comparison" />
	</td>
	<td
		class:warning={perSemI / courseWeeks > 4}
		class:danger={perSemI / courseWeeks > 10}
		style="--comparison: {totals.perSem.median ? (perSemI / totals.perSem.median) * 100 : 100}%"
	>
		{perSemI}
		<div class="comparison" />
	</td>
	<td
		class:warning={perSemS / courseWeeks > 4}
		class:danger={perSemS / courseWeeks > 10}
		style="--comparison: {totals.perSem.median ? (perSemS / totals.perSem.median) * 100 : 100}%"
	>
		{perSemS}
		<div class="comparison" />
	</td>
</tr>

<style lang="postcss">
	.pill {
		@apply rounded-full text-xs p-1 mr-1 bg-white inline-block w-6 h-6 align-middle text-center font-bold leading-4 float-left;
		&.weekly {
			@apply bg-blue-300;
		}
		&.semesterly {
			@apply bg-green-400;
		}
	}

	tr {
		@apply h-10 text-center relative;
		@apply border-b border-slate-300;
		&.clickable .name {
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
		@apply border-l border-slate-300 relative transition px-3;
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
