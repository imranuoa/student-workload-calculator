<script lang="ts">
	import ArrowLeft from 'svelte-material-icons/ArrowLeft.svelte';
	import { clickOutside } from 'svelte-use-click-outside';
	import ResultTable from '$lib/components/results/resultTable.svelte';
	import { courses, activeCourse, addCourse } from '$lib/../store';
	import Config from '$lib/components/edit-activity/config.svelte';
	import ActivityList from '$lib/components/add-activity/manageActivities.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { durationToString } from '$lib/serialize';
	import { Frequency } from '$lib/course-activities/genericActivity';
	import ResultChart from '$lib/components/results/resultChart.svelte';
	import { Course } from '$lib/course';
	import CourseCard from '$lib/components/course/card.svelte';
	import { cardState } from '$lib/components/course/card';
	// import arrowPattern from '$lib/assets/arrow-left.svg';

	let addActivityOpen: boolean;
	let showReport: boolean = false;

	$: activeCourseInst = $activeCourse >= 0 ? $courses[$activeCourse] : undefined;
	$: activeCourseMeta = activeCourseInst?.meta;
	$: activeCourseActivities = activeCourseInst?.activities;
	$: totals = $activeCourseActivities && Course.getTotal($activeCourseActivities);
	$: gradeTotals = $activeCourseActivities && Course.getGradeTotals($activeCourseActivities);
	$: openActivity = activeCourseInst?.openActivity;
	$: openActivityInst = $activeCourseActivities?.[$openActivity !== undefined ? $openActivity : -1];

	$: isDanger =
		$totals &&
		$activeCourseMeta &&
		$totals.perCourse.total >
			$activeCourseMeta.target *
				($activeCourseMeta.targetFreq === Frequency.Weekly ? $activeCourseMeta.weeks : 1);

	// If openActivity is >0 and doesn't resolve, reset it to -1
	$: if (
		$openActivity &&
		$openActivity > 0 &&
		$activeCourseActivities &&
		$activeCourseActivities[$openActivity] === undefined
	) {
		$openActivity = -1;
	}

	onMount(async () => {
		if ($activeCourse === -1 || $courses.length === 0) {
			$activeCourse = -1;
			openCourseConfig();
		}
	});

	const openCourseConfig = () => {
		goto('/courses');
	};
</script>

<svelte:head>
	{#if $activeCourseMeta}
		<title>Student Workload Calculator: {$activeCourseMeta.name}</title>
	{:else}
		<title>Student Workload Calculator</title>
	{/if}
</svelte:head>

{#if activeCourseInst && $activeCourseMeta && $activeCourseActivities && $totals}
	<div class="layout">
		<div class="header">
			<div class="actions">
				<button class="btn btn-primary btn-icon" on:click={openCourseConfig}>
					<div class="icon">
						<ArrowLeft />
					</div>
					Dashboard
				</button>
			</div>
			<div class="coursename">
				<label for="courseName">Course:</label>
				<input
					id="courseName"
					type="text"
					bind:value={$activeCourseMeta.name}
					placeholder="Course Name"
				/>
			</div>
		</div>
		<div class="main card">
			<div class="activity-list">
				<CourseCard
					bind:course={activeCourseInst}
					courseIndex={$activeCourse}
					state={cardState.edit}
				/>
			</div>
			<div class="activity-config uni-card">
				{#if openActivityInst}
					<Config course={activeCourseInst} />
				{:else}
					<div class="no-activities-results" in:fade>
						<div class="arrows-wrap">
							<div class="arrows" />
						</div>
						<div class="hint">
							<h2>Activity Configuration</h2>
							<p>
								This course doesn't have anything in it! To get started, use the menu to the left to
								add a activity.
							</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="results card">
			<div class="stats">
				<strong>{durationToString($totals.perCourse.total)}</strong> in course /
				<strong>
					{durationToString($totals.perWeek.total)}
				</strong>
				per week
			</div>
			<div class="more">
				<i
					>({$activeCourseMeta.target} hr{#if $activeCourseMeta.targetFreq == Frequency.Weekly}/week{/if}
					target)
				</i>
				<button
					class="btn btn-primary"
					class:active={showReport}
					on:click={() => {
						showReport = !showReport;
					}}
				>
					Details...</button
				>
			</div>
		</div>
		{#if showReport}
			<div class="results-details" transition:slide>
				<div class="table">
					<ResultTable
						activities={activeCourseInst.activities}
						meta={activeCourseInst.meta}
						openActivity={activeCourseInst.openActivity}
					/>
				</div>
				<div class="chart">
					<ResultChart
						{isDanger}
						activities={activeCourseInst.activities}
						meta={activeCourseInst.meta}
					/>
				</div>
			</div>
		{/if}
	</div>
	<div class="indicator" class:danger={isDanger}>
		<div
			class="scheduled"
			style:width={`${
				($totals.perCourseS.total /
					Math.max(
						$activeCourseMeta.target *
							($activeCourseMeta.targetFreq === Frequency.Weekly ? $activeCourseMeta.weeks : 1),
						$totals.perCourse.total
					)) *
				100
			}%`}
		/>
		<div
			class="independant"
			style:width={`${
				($totals.perCourseI.total /
					Math.max(
						$activeCourseMeta.target *
							($activeCourseMeta.targetFreq === Frequency.Weekly ? $activeCourseMeta.weeks : 1),
						$totals.perCourse.total
					)) *
				100
			}%`}
		/>
	</div>
{/if}

<style lang="postcss">
	.layout {
		@apply w-full;
	}
	/* .card {
		@apply p-5 shadow bg-uni-gray-100;
	} */

	.header {
		@apply w-full flex flex-wrap gap-x-5 gap-y-2 mb-4 justify-start;
		.coursename {
			@apply text-2xl leading-none flex items-center gap-4 grow;
			@media (max-width: 640px) {
				@apply hidden;
			}
			label {
				@apply block opacity-50 select-none;
			}
			input {
				@apply flex-grow border-0 px-2 py-0 text-2xl bg-transparent;
			}
		}
		.actions {
			@apply flex gap-4 select-none items-center;
			button {
				@apply text-lg;
			}
		}
	}

	.main {
		@apply grid gap-5 mb-4;
		grid-template-columns: 380px 1fr;
		@media screen and (min-width: 768px) and (max-width: 1000px) {
			grid-template-columns: 2fr 3fr;
		}
		@media screen and (max-width: 768px) {
			grid-template-columns: 1fr;
			.arrows-wrap {
				@apply hidden;
			}
		}
		.activity-list {
			@apply flex flex-col grow w-full;
		}
		.activity-config {
			@apply w-full h-full my-0;
			flex-grow: 100;
		}

		.no-activities-results {
			@apply h-96 flex items-center justify-center  relative overflow-clip;
			.arrows-wrap {
				@apply absolute top-0 bottom-0 m-auto right-0 z-0 opacity-20 w-full;
				--arrow-size: 3rem;
				--num-arrows: 4;
				height: calc(var(--arrow-size) * var(--num-arrows));
				.arrows {
					@apply absolute top-0 right-0 h-full;
					width: calc(100% + var(--arrow-size));
					background-image: url('$lib/assets/arrow-left.svg');
					background-repeat: repeat;
					background-size: var(--arrow-size);
					animation: shiftBackground 6s linear infinite;
				}
				mask-image: linear-gradient(to left, transparent, black, transparent);
			}
			.hint {
				@apply italic max-w-lg bg-white px-6 py-4 border-2 border-slate-200 z-10 w-full shrink;
			}
		}
	}

	.results {
		@apply grid items-center relative mb-4;
		grid-template-columns: 1fr auto;

		.more {
			@apply flex gap-4 items-center;
		}
	}
	.results-details {
		@apply w-full flex flex-wrap gap-4;
		.table {
			@apply grow w-96;
		}
		.chart {
			@apply grow w-96;
		}
	}
	.indicator {
		@apply overflow-hidden h-2 fixed w-full bottom-0 left-0 flex z-40;
		width: calc(100% + theme(width.2));
		.scheduled,
		.independant {
			@apply h-full transition-all rounded-r-full;
		}
		.independant {
			@apply bg-[#bddbab] -ml-2 z-10;
		}

		.scheduled {
			@apply bg-uni-color-green z-20;
		}

		&.danger {
			.independant {
				@apply bg-[#f7b5b5];
			}
			.scheduled {
				@apply bg-red-500;
			}
		}
	}

	:global(.pulsehint) {
		animation: pulseHint 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		animation-direction: alternate;
	}
	@keyframes pulseHint {
		from {
			box-shadow: 0 0 10px 3px #4daafb;
		}
		to {
			box-shadow: 0 0 10px -6px #4daafb;
		}
	}

	@keyframes shiftBackground {
		from {
			transform: translateX(3rem);
		}
		to {
			transform: translateX(0);
		}
	}
</style>
