<script lang="ts">
	import { derived, get, readable, type Readable } from 'svelte/store';

	// import { Chart, registerables } from 'chart.js/dist/chart.mjs';
	import { Chart, registerables } from 'chart.js';
	import annotationPlugin from 'chartjs-plugin-annotation';

	Chart.register(...registerables);
	Chart.register(annotationPlugin);

	import { Frequency, type Activity } from '$lib/course-activities/genericActivity';
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

	// Calculation of Grade worth %
	$: grades = derived(
		$activities.map((a) => a.derivedCalculated),
		(derived) => {
			const gradesItemised = derived.map((d) => d.weeklyGrade);
			// Flip the array so that the indicies are the weeks and each week has a list of the activities
			// Transposition of the matrix
			if (gradesItemised.length) return transpose(gradesItemised);
			return [];
		}
	);
	$: gradesSum = derived(grades, (derivedgrades) =>
		derivedgrades.map((week) => week.reduce((a, b) => a + b, 0))
	);

	const datasetPrefs = {
		tension: 0.1,
		stepped: true,
		stack: 'Sums',
		fill: true
	};

	let canvas: HTMLCanvasElement;

	$: target = $meta.targetFreq === Frequency.Course ? $meta.target / courseWeeks : $meta.target;
	export let isDanger = false;

	$: data = {
		labels: Array.from({ length: courseWeeks }, (_, i) => `W${i + 1}`),
		datasets: [
			{
				...datasetPrefs,
				label: 'Independent',
				data: $independantSum,
				// borderColor: 'rgb(75, 192, 192)',
				backgroundColor: isDanger ? '#f7b5b5' : '#bddbab',
				order: 3
			},
			{
				...datasetPrefs,
				label: 'Scheduled',
				data: $scheduledSum,
				// borderColor: 'rgb(255, 99, 132)',
				backgroundColor: isDanger ? '#A71930' : '#55a51c',
				order: 2
			},
			{
				...datasetPrefs,
				fill: false,
				label: 'Grade',
				data: $gradesSum,
				borderColor: '#FFD700',
				backgroundColor: 'transparent',
				yAxisID: 'grade',
				order: 1,
				hidden: true
			}
		]
	};

	$: average = ({ chart }: { chart: Chart }) => {
		const values = ctx.chart.data.datasets[0].data;
		return values.reduce((a, b) => a + b, 0) / values.length;
	};

	let chart: Chart;

	$: if (chart && $activities) {
		console.log(isDanger);
		chart.data.datasets.forEach((dataset: any, i: number) => {
			dataset.data = data.datasets[i].data;
			dataset.backgroundColor = data.datasets[i]?.backgroundColor;
		});
		chart.update();
	}

	onMount(() => {
		chart = new Chart(canvas, {
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
						text: 'Workload by week (estimated)' + `${target}`
					},
					annotation: {
						annotations: {
							target: {
								type: 'line',
								yMin: (ctx) => target,
								yMax: (ctx) => target,
								label: {
									content: 'Target',
									backgroundColor: '#00467F',
									position: 'end',
									display: true
								},
								borderColor: '#00467F',
								borderWidth: 3,
								z: 2,
								yScaleID: 'y'
							}
						}
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
					},
					grade: {
						min: 0,
						title: {
							display: true,
							text: 'Grade %'
						},
						ticks: {
							precision: 1
						},
						position: 'right',
						display: 'auto'
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
		@apply max-w-4xl mx-auto;
	}
</style>
