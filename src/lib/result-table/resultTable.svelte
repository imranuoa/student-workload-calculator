<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { derived, get } from 'svelte/store';
	import { onMount } from 'svelte';
	import csvDownload from 'json-to-csv-export';
	import type { Component } from '$lib/components';
	import ResultTableRow from './resultTableRow.svelte';

	const dispatch = createEventDispatcher();

	export let components: Component[];
	export let courseWeeks: number;
	export let openComponent: number | null = null;

	const columns = [
		{ name: 'Name', detail: 'Name' },
		{ name: 'hrs/wk (I)', detail: 'Independant Hours per Week' },
		{ name: 'hrs/wk (S)', detail: 'Scheduled Hours per Week' },
		{ name: 'hrs/semester (I)', detail: 'Independant Hours per Semester' },
		{ name: 'hrs/semester (S)', detail: 'Scheduled Hours per Semester' }
	];

	const median = (numbers: number[]) => {
		const sorted = Array.from(numbers).sort((a, b) => a - b);
		const middle = Math.floor(sorted.length / 2);

		if (sorted.length % 2 === 0) {
			return (sorted[middle - 1] + sorted[middle]) / 2;
		}

		return sorted[middle];
	};

	$: totals = derived(
		components.map((c) => c.derivedCalculated),
		(values) => ({
			perWeekI: {
				median: median(values.map((v) => v.perWeekI)),
				total: values.reduce((a, v) => a + v.perWeekI, 0)
			},
			perWeekS: {
				median: median(values.map((v) => v.perWeekS)),
				total: values.reduce((a, v) => a + v.perWeekS, 0)
			},
			perSemI: {
				median: median(values.map((v) => v.perSemI)),
				total: values.reduce((a, v) => a + v.perSemI, 0)
			},
			perSemS: {
				median: median(values.map((v) => v.perSemS)),
				total: values.reduce((a, v) => a + v.perSemS, 0)
			},
			perSem: {
				median: median(values.map((v) => v.perSemI + v.perSemS)),
				total: values.reduce((a, v) => a + v.perSemI + v.perSemS, 0)
			},
			perWeek: {
				median: median(values.map((v) => v.perWeekI + v.perWeekS)),
				total: values.reduce((a, v) => a + v.perSemI + v.perSemS, 0)
			}
		})
	);

	const buildData = () =>
		components.map((c) => ({
			name: get(c.instanceName),
			results: get(c.results),
			derived: get(c.derivedCalculated)
		}));

	let downloadJSON: Function;
	let downloadXLSX: Function;
	onMount(() => {
		downloadJSON = () => {
			const data = buildData();
			console.log('download files');
			const json = JSON.stringify(data, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'components.json';
			link.click();
		};
		downloadXLSX = () => {
			const data = buildData();
			csvDownload({
				data: data.map((c) => ({
					name: c.name,
					...c.derived,
					...c.results
				})),
				filename: 'components.csv'
			});
		};
	});
</script>

<table>
	<thead>
		<tr class="head">
			{#each columns as column}
				<th title={column.detail}>{column.name}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each components as component}
			<ResultTableRow
				{component}
				totals={$totals}
				{courseWeeks}
				active={openComponent === null ? null : components[openComponent] === component}
				on:click={() => dispatch('selectComponent', component)}
			/>
		{/each}
	</tbody>
	<tfoot>
		<tr class="foot">
			<td>Median / Total</td>
			<td>{$totals.perWeekI.median} / {$totals.perWeekI.total}</td>
			<td>{$totals.perWeekS.median} / {$totals.perWeekS.total}</td>
			<td>{$totals.perSemI.median} / {$totals.perSemI.total}</td>
			<td>{$totals.perSemS.median} / {$totals.perSemS.total}</td>
		</tr>
	</tfoot>
</table>

<div class="mt-4">
	<!-- Download -->
	<button class="btn" on:click={() => downloadJSON()}>Download (JSON)</button>
	<button class="btn" on:click={() => downloadXLSX()}>Download (XLSX)</button>
</div>

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
