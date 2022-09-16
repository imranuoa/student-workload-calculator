<script lang="ts">
	import type { Component } from '$lib/components';
	import type { Readable } from 'svelte/store';

	export let component: Component;
	export let perWeekMedian: Readable<number>;
	export let perSemMedian: Readable<number>;
	export let courseWeeks: number;

	$: derivedCalculated = component.derivedCalculated;
	$: instanceName = component.instanceName;

	$: perWeekI = $derivedCalculated.perWeekI;
	$: perWeekS = $derivedCalculated.perWeekS;
	$: perSemI = $derivedCalculated.perSemI;
	$: perSemS = $derivedCalculated.perSemS;

	// $: console.log($perSemMedian, $perWeekMedian);
</script>

<tr>
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
		@apply h-10 text-center;
		@apply border-b border-slate-300;
		&:last-child {
			@apply border-b-0;
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
