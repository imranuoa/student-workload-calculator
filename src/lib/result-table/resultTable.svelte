<script lang="ts">
	import type { Component } from '$lib/components';
	import { derived, get } from 'svelte/store';
	import ResultTableRow from './resultTableRow.svelte';

	export let components: Component[];
	export let courseWeeks: number;

	const columns = ['Name', 'hrs/wk (I)', 'hrs/wk (S)', 'hrs/semester (I)', 'hrs/semester (S)'];

	const median = (numbers: number[]) => {
		const sorted = Array.from(numbers).sort((a, b) => a - b);
		const middle = Math.floor(sorted.length / 2);

		if (sorted.length % 2 === 0) {
			return (sorted[middle - 1] + sorted[middle]) / 2;
		}

		return sorted[middle];
	};
	const perWeekMedian = derived(
		components.map((c) => c.derivedCalculated),
		(values) => median(values.map((v) => v.perWeekI + v.perWeekS))
	);
	const perSemMedian = derived(
		components.map((c) => c.derivedCalculated),
		(values) => median(values.map((v) => v.perSemI + v.perSemS))
	);

	$: console.log($perWeekMedian);
</script>

<table>
	<tr class="head">
		{#each columns as column}
			<th>{column}</th>
		{/each}
	</tr>
	<tbody>
		{#each components as component}
			<ResultTableRow {component} {perWeekMedian} {perSemMedian} {courseWeeks} />
		{/each}
	</tbody>
</table>

<style lang="postcss">
	table {
		@apply w-full border-collapse;
		tr.head {
			@apply h-10 bg-slate-700 text-white shadow;
			th {
				@apply border-l border-slate-600;
			}
			th:first-child {
				@apply rounded-tl rounded-bl border-l-0;
			}
			th:last-child {
				@apply rounded-tr rounded-br;
			}
		}
	}
</style>
