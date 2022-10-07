<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { derived, get, type Writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import csvDownload from 'json-to-csv-export';

	import type { Activity } from '$lib/course-activities/genericActivity';
	import ResultTableRow from '$lib/results/resultTableRow.svelte';
	import { Course, type courseMeta } from '$lib/course';

	const dispatch = createEventDispatcher();

	export let meta: Writable<courseMeta>;
	export let activities: Writable<Activity[]>;
	export let openActivity: Writable<number>;
	$: openActivityInst = $activities?.[$openActivity !== undefined ? $openActivity : -1];
	$: totals = Course.getTotal($activities);
	$: gradeTotals = Course.getGradeTotals($activities);

	const columns = [
		{ name: 'Name', detail: 'Name' },
		{ name: 'hrs/wk (I)', detail: 'Independent Hours per Week' },
		{ name: 'hrs/wk (S)', detail: 'Scheduled Hours per Week' },
		{ name: 'hrs/course (I)', detail: 'Independent Hours Per Course' },
		{ name: 'hrs/course (S)', detail: 'Scheduled Hours Per Course' },
		{ name: 'Grade %', detail: 'The amount the activity is worth as a percent of the grade' }
	];

	const buildData = () => {
		if (!$activities) return [];
		return $activities.map((a) => {
			const derived = get(a.derivedCalculated);
			return {
				name: get(a.instanceName),
				results: get(a.results),
				gradeWorth: get(a.gradeWorth),
				derived: {
					perWeekI: derived.perWeekI,
					perWeekS: derived.perWeekS,
					perCourseI: derived.perCourseI,
					perCourseS: derived.perCourseS
				}
			};
		});
	};

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
					worth: `${c.gradeWorth}%`,
					...c.derived,
					...c.results
				})),
				filename: 'activities.csv'
			});
		};
	});

	let data = {
		labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
		datasets: [
			{
				values: [10, 12, 3, 9, 8, 15, 9]
			}
		]
	};
</script>

<table>
	<thead>
		<tr class="head">
			{#each columns as column}
				<th title={column.detail} aria-label={column.detail}>
					<span aria-hidden="false">{column.name}</span>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each $activities as activity}
			<ResultTableRow
				{activity}
				totals={$totals}
				gradeTotals={$gradeTotals}
				courseWeeks={$meta.weeks}
				active={openActivityInst === activity}
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
			<td
				>{Math.round($gradeTotals.median * 100) / 100} / {Math.round($gradeTotals.total * 100) /
					100}</td
			>
		</tr>
	</tfoot>
</table>

<div class="mt-4 flex gap-4 flex-wrap">
	<!-- Download -->
	<button class="btn" on:click={() => downloadJSON()}>Download (JSON for data analysis)</button>
	<button class="btn" on:click={() => downloadXLSX()}>Download (Spreadsheet for viewing)</button>
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
