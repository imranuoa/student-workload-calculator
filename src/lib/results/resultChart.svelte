<script lang="ts">
	import { derived, get, readable, type Readable } from 'svelte/store';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler,
		LineController
	} from 'chart.js';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	);
	ChartJS.register(LineController);

	import type { Activity } from '$lib/course-activities/genericActivity';
	import { onMount } from 'svelte';
	import type { Course, courseMeta } from '$lib/course';

	export let activities: Readable<Activity[]>;
	export let meta: Readable<courseMeta>;
	$: courseWeeks = $meta?.weeks || 0;

	const transpose = <T>(a: T[][]) => a[0].map((_, c) => a.map((r) => r[c]));

	// Calculation of Independant Data
	$: independant = derived(
		$activities.map((a) => a.derivedCalculated),
		(derived) => {
			const independantItemised = derived.map((d) => d.weeklyI);
			// Flip the array so that the indicies are the weeks and each week has a list of the activities
			// Transposition of the matrix
			if (independantItemised.length) return transpose(independantItemised);
			return [];
		}
	);
	$: independantSum = derived(independant, (derivedIndependant) =>
		derivedIndependant.map((week) => week.reduce((a, b) => a + b, 0))
	);

	// Calculation of Scheduled Data
	$: scheduled = derived(
		$activities.map((a) => a.derivedCalculated),
		(derived) => {
			const scheduledItemised = derived.map((d) => d.weeklyS);
			// Flip the array so that the indicies are the weeks and each week has a list of the activities
			// Transposition of the matrix
			if (scheduledItemised.length) return transpose(scheduledItemised);
			return [];
		}
	);
	$: scheduledSum = derived(scheduled, (derivedScheduled) =>
		derivedScheduled.map((week) => week.reduce((a, b) => a + b, 0))
	);

	const datasetPrefs = {
		tension: 0.1,
		stepped: true,
		stack: 'Sums',
		fill: true
	};

	let canvas: HTMLCanvasElement;

	$: data = {
		labels: Array.from({ length: courseWeeks }, (_, i) => `Week ${i + 1}`),
		datasets: [
			{
				...datasetPrefs,
				label: 'Independent',
				data: $independantSum,
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192,1)'
			},
			{
				...datasetPrefs,
				label: 'Scheduled',
				data: $scheduledSum,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132,1)'
			}
		]
	};

	let chart: ChartJS;

	$: if (chart && $activities) {
		chart.data.datasets[0].data = $independantSum;
		chart.data.datasets[1].data = $scheduledSum;
		chart.update();
	}

	onMount(() => {
		chart = new ChartJS(canvas, {
			type: 'line',
			data,
			options: {
				responsive: true,
				maintainAspectRatio: true,
				aspectRatio: 2,
				resizeDelay: 100,
				plugins: {
					legend: {
						position: 'bottom'
					},
					title: {
						display: true,
						text: 'Workload by week (estimated)'
					}
				},
				interaction: {
					mode: 'index',
					intersect: false
				},
				scales: {
					y: {
						min: 0,
						title: {
							display: true,
							text: 'Hours'
						},
						ticks: {
							precision: 1
						}
					}
				}
			}
		});
	});
</script>

<div class="chartWrapper" style="width: 100%; position: relative;">
	<canvas id="resultsChart" bind:this={canvas} />
</div>

<style lang="postcss">
	.chartWrapper {
		@apply max-w-4xl mx-auto mt-10;
	}
</style>
