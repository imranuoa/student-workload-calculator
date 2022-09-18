<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { derived, get } from 'svelte/store';
	import type { Component } from '$lib/components';
	import ResultTableRow from './resultTableRow.svelte';

	const dispatch = createEventDispatcher();

	export let components: Component[];
	export let courseWeeks: number;
	export let openComponent: number | null = null;

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
	const perWeekIMedian = derived(
		components.map((c) => c.derivedCalculated),
		(values) => median(values.map((v) => v.perWeekI))
	);
	const perWeekSMedian = derived(
		components.map((c) => c.derivedCalculated),
		(values) => median(values.map((v) => v.perWeekS))
	);
	const perSemMedian = derived(
		components.map((c) => c.derivedCalculated),
		(values) => median(values.map((v) => v.perSemI + v.perSemS))
	);
	const perSemIMedian = derived(
		components.map((c) => c.derivedCalculated),
		(values) => median(values.map((v) => v.perSemI))
	);
	const perSemSMedian = derived(
		components.map((c) => c.derivedCalculated),
		(values) => median(values.map((v) => v.perSemS))
	);

	$: console.log($perWeekMedian);
</script>

<table>
	<thead>
		<tr class="head">
			{#each columns as column}
				<th>{column}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each components as component}
			<ResultTableRow
				{component}
				{perWeekMedian}
				{perSemMedian}
				{courseWeeks}
				active={openComponent === null ? null : components[openComponent] === component}
				on:click={() => dispatch('selectComponent', component)}
			/>
		{/each}
	</tbody>
	<tfoot>
		<tr class="foot">
			<td>Median</td>
			<td>{$perWeekIMedian}</td>
			<td>{$perWeekSMedian}</td>
			<td>{$perSemIMedian}</td>
			<td>{$perSemSMedian}</td>
		</tr>
	</tfoot>
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
		tfoot {
			tr.foot {
				@apply h-10 text-center text-gray-700 font-bold border-slate-300 border-t;
				td {
					@apply border-l border-slate-300;
				}
				td:first-child {
					@apply rounded-tl rounded-bl border-l-0;
				}
				td:last-child {
					@apply rounded-tr rounded-br;
				}
			}
		}
	}
</style>
