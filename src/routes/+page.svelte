<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import ResultTable from '$lib/results/resultTable.svelte';
	import { courses, activeCourse, addCourse } from '$lib/../store';
	import Config from '$lib/edit-activity/config.svelte';
	import ActivityList from '$lib/add-activity/manageActivities.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { durationToString } from '$lib/serialize';
	import { Frequency } from '$lib/course-activities/genericActivity';
	import ResultChart from '$lib/results/resultChart.svelte';
	import { Course } from '$lib/course';
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
		<div class="main card">
			<div class="header">
				<div class="coursename">
					<label for="courseName">Course:</label>
					<input
						id="courseName"
						type="text"
						bind:value={$activeCourseMeta.name}
						placeholder="Course Name"
					/>
				</div>
				<div class="actions">
					<button class="btn btn-primary" on:click={openCourseConfig}>Manage Courses</button>
				</div>
			</div>
			<div class="activity-list">
				<ActivityList bind:course={activeCourseInst} bind:addActivityOpen />
			</div>
			<div class="activity-config">
				{#if openActivityInst}
					<Config course={activeCourseInst} />
				{:else}
					<div class="placeholder">
						<h2>Activity Configuration</h2>
						<p>Select an activity to configure it.</p>
					</div>
				{/if}
			</div>
		</div>
		{@debug $totals}
		<div class="results card" class:danger={$totals.perCourse.total > 40}>
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
			<div class="indicator">
				<div
					class="scheduled"
					style:width={`${
						($totals.perCourseS.total / Math.max(40, $totals.perCourse.total)) * 100
					}%`}
				/>
				<div
					class="independant"
					style:width={`${
						($totals.perCourseI.total / Math.max(40, $totals.perCourse.total)) * 100
					}%`}
				/>
			</div>
		</div>
		{#if showReport}
			<div class="results-details card" transition:slide>
				<ResultTable
					activities={activeCourseInst.activities}
					meta={activeCourseInst.meta}
					openActivity={activeCourseInst.openActivity}
				/>
				<ResultChart activities={activeCourseInst.activities} meta={activeCourseInst.meta} />
			</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
	.layout {
		@apply grid grid-flow-row auto-rows-auto gap-10 w-full;
		grid-template-areas:
			'main'
			'summary'
			'details';
	}
	.card {
		@apply p-5 rounded-lg shadow bg-uni-gray-100;
	}
	.main {
		@apply grid auto-rows-auto gap-5;
		grid-area: main;
		grid-template-columns: 2fr 3fr;
		grid-template-areas:
			'header header'
			'activity-list activity-config';

		.header {
			grid-area: header;
			@apply grid gap-5;
			grid-template-columns: 1fr auto;
			.coursename {
				@apply text-2xl flex items-center gap-4;
				label {
					@apply block opacity-50 select-none;
				}
				input {
					@apply flex-grow border-0 p-2 text-2xl bg-transparent;
				}
			}
			.actions {
				@apply flex gap-4 select-none items-center;
				button {
					@apply text-lg;
				}
			}
		}
		.activity-config,
		.activity-list {
			@apply p-4 rounded-lg shadow bg-white;
		}
		.activity-list {
			grid-area: activity-list;
		}
		.activity-config {
			grid-area: activity-config;
		}

		&.noActivities {
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
					@apply text-center italic max-w-lg bg-white px-6 py-4 rounded shadow border-dashed border-4 border-slate-200 z-10;
				}
			}
		}
	}

	.results {
		@apply grid items-center relative overflow-auto;
		@apply outline outline-0 ring-red-500 ring-0 transition-all;
		grid-area: summary;
		grid-template-columns: 1fr auto;

		.more {
			@apply flex gap-4 items-center;
		}

		.scheduled,
		.independant {
			@apply bg-uni-color-green;
		}

		&.danger {
			@apply ring-2;
			.scheduled,
			.independant {
				@apply bg-red-500;
			}
		}
		.indicator {
			@apply rounded-full overflow-hidden h-1 absolute w-full bottom-0 left-0 flex;
			.scheduled,
			.independant {
				@apply h-full transition-all;
			}
			.independant {
				@apply opacity-40;
			}
		}
	}

	.results-details {
		@apply bg-white ring-black ring-2 relative z-20;
		grid-area: details;
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
