<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { derived, get } from 'svelte/store';
	import { onMount } from 'svelte';
	import csvDownload from 'json-to-csv-export';
	import type { Activity } from '$lib/course-activities/genericActivity';
	import ResultTableRow from './resultTableRow.svelte';

	const dispatch = createEventDispatcher();

	export let activities: Activity[];
	export let courseWeeks: number;
	export let openActivity: number | null = null;

	const columns = [
		{ name: 'Name', detail: 'Name' },
		{ name: 'hrs/wk (I)', detail: 'Independent Hours per Week' },
		{ name: 'hrs/wk (S)', detail: 'Scheduled Hours per Week' },
		{ name: 'hrs/course (I)', detail: 'Independent Hours Per Course' },
		{ name: 'hrs/course (S)', detail: 'Scheduled Hours Per Course' }
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
		activities.map((c) => c.derivedCalculated),
		(values) => ({
			perWeekI: {
				median: median(values.map((v) => v.perWeekI)),
				total: values.reduce((a, v) => a + v.perWeekI, 0)
			},
			perWeekS: {
				median: median(values.map((v) => v.perWeekS)),
				total: values.reduce((a, v) => a + v.perWeekS, 0)
			},
			perCourseI: {
				median: median(values.map((v) => v.perCourseI)),
				total: values.reduce((a, v) => a + v.perCourseI, 0)
			},
			perCourseS: {
				median: median(values.map((v) => v.perCourseS)),
				total: values.reduce((a, v) => a + v.perCourseS, 0)
			},
			perCourse: {
				median: median(values.map((v) => v.perCourseI + v.perCourseS)),
				total: values.reduce((a, v) => a + v.perCourseI + v.perCourseS, 0)
			},
			perWeek: {
				median: median(values.map((v) => v.perWeekI + v.perWeekS)),
				total: values.reduce((a, v) => a + v.perCourseI + v.perCourseS, 0)
			}
		})
	);

	const buildData = () =>
		activities.map((c) => ({
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
			link.download = 'activities.json';
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
				filename: 'activities.csv'
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
		{#each activities as activity}
			<ResultTableRow
				{activity}
				totals={$totals}
				{courseWeeks}
				active={openActivity === null ? null : activities[openActivity] === activity}
				on:click={() => dispatch('selectActivity', activity)}
			/>
		{/each}
	</tbody>
	<tfoot>
		<tr class="foot">
			<td>Median / Total</td>
			<td
				>{Math.round($totals.perWeekI.median * 100) / 100} / {Math.round(
					$totals.perWeekI.total * 100
				) / 100}</td
			>
			<td
				>{Math.round($totals.perWeekS.median * 100) / 100} / {Math.round(
					$totals.perWeekS.total * 100
				) / 100}</td
			>
			<td
				>{Math.round($totals.perCourseI.median * 100) / 100} / {Math.round(
					$totals.perCourseI.total * 100
				) / 100}</td
			>
			<td
				>{Math.round($totals.perCourseS.median * 100) / 100} / {Math.round(
					$totals.perCourseS.total * 100
				) / 100}</td
			>
		</tr>
	</tfoot>
</table>

<div class="mt-4">
	<!-- Download -->
	<button class="btn" on:click={() => downloadJSON()}>Download (JSON)</button>
	<button class="btn" on:click={() => downloadXLSX()}>Download (CSV)</button>
</div>

<style lang="postcss">
	table {
		@apply w-full border-collapse;
		tr.head {
			@apply h-10 bg-slate-700 text-white shadow;
			th {
				@apply border-l border-slate-600 px-3;
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
					@apply border-l border-slate-300 px-3;
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
