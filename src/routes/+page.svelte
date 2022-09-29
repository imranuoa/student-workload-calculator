<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import ResultTable from '$lib/results/resultTable.svelte';
	import { courses, activeCourse, addCourse } from '../store';
	import Config from '$lib/edit-activity/config.svelte';
	import ActivityList from '$lib/add-activity/manageActivities.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ResultChart from '$lib/results/resultChart.svelte';
	// import arrowPattern from '$lib/assets/arrow-left.svg';

	let addActivityOpen: boolean;

	$: activeCourseInst = $activeCourse >= 0 ? $courses[$activeCourse] : undefined;
	$: activeCourseMeta = activeCourseInst?.meta;
	$: activeCourseActivities = activeCourseInst?.activities;
	$: openActivity = activeCourseInst?.openActivity;
	$: openActivityInst =
		$openActivity !== undefined && $openActivity >= 0
			? $activeCourseActivities?.[$openActivity]
			: undefined;

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
		goto('/configure');
	};

	let resultsWidth: number;
	let resultsHeight: number;
</script>

{#if activeCourseInst && $activeCourseMeta && $activeCourseActivities}
	{#key $activeCourse}
		<div
			class="calculator-layout"
			class:expandActivities={addActivityOpen}
			class:hideConfig={!openActivityInst}
			class:noActivities={$activeCourseActivities.length === 0}
			class:hasActivities={$activeCourseActivities.length > 0}
		>
			<div
				class="activities"
				use:clickOutside={() => {
					addActivityOpen = false;
				}}
			>
				<div class="title">
					<a href="/configure" class="btn configure" title="return to course list">&leftarrow;</a>
					{#if activeCourseMeta}
						<h2>{$activeCourseMeta.name}</h2>
					{/if}
				</div>
				<hr class="my-2" />
				<ActivityList bind:activeCourse={activeCourseInst} bind:addActivityOpen />
			</div>
			{#if activeCourseInst}
				<div class="config">
					<Config activities={activeCourseActivities} {openActivity} />
				</div>
				<div class="results" bind:clientWidth={resultsWidth} bind:clientHeight={resultsHeight}>
					{#if activeCourseActivities && activeCourseMeta && $activeCourseActivities && $activeCourseMeta && $activeCourseActivities.length > 0}
						<ResultTable
							activities={$activeCourseActivities}
							courseWeeks={$activeCourseMeta.weeks}
							bind:openActivity={$openActivity}
							on:selectActivity={({ detail }) => {
								const matchedIndex = $activeCourseActivities?.findIndex((c) => c == detail);
								if (matchedIndex === $openActivity) $openActivity = -1;
								else if (matchedIndex !== -1) $openActivity = matchedIndex;
							}}
						/>
						<ResultChart activities={activeCourseActivities} meta={activeCourseMeta} />
					{:else}
						<div class="no-activities-results" in:fade>
							<div class="arrows-wrap">
								<div class="arrows" />
							</div>
							<p class="hint">
								This course doesn't have anything in it! To get started, use the menu to the left to
								add a activity.
							</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/key}
{/if}

<style lang="postcss">
	.calculator-layout {
		@apply flex gap-8 p-8 min-h-full pb-5;
		--activities-pane-width: 20rem;
		--activities-pane-extra-width: 0rem;
		--config-pane-width: 25rem;

		.activities {
			@apply shadow-lg bg-white p-4 rounded-r-lg transition-all z-10 -ml-8;
			width: calc(var(--activities-pane-width) + var(--activities-pane-extra-width));
			.title {
				@apply grid items-center gap-4;
				grid-template-columns: auto 1fr;
				grid-template-areas: 'button title';
				.btn {
					grid-area: button;
				}
			}
		}

		.config,
		.results {
			@apply duration-150 ease-in-out z-0;
			@apply pt-4;
			transition-property: margin-left, opacity;
			margin-left: 0;
		}
		.results {
			@apply basis-0;
			flex-grow: 999;
		}
		.config {
			@apply flex-grow;
			flex-basis: var(--config-pane-width);
		}
		&.hideConfig {
			.activities {
				@apply shadow-xl;
				--activities-pane-extra-width: 10rem;
				z-index: 10;
			}
			&.expandActivities {
				.activities {
					@apply shadow-2xl;
					--activities-pane-extra-width: 20rem;
					margin-right: -10rem;
				}
			}
			.config {
				margin-left: calc(var(--config-pane-width) * -1);
			}
			.results {
				margin-left: -2.5rem;
			}
		}

		&.expandActivities {
			--activities-pane-extra-width: 20rem;
			.activities {
				@apply shadow-xl;
				z-index: 10;
			}
			.config,
			.results {
				@apply opacity-30 pointer-events-none;
			}
			.config {
				margin-left: calc(var(--activities-pane-extra-width) * -1);
			}
		}

		&.noActivities {
			.activities {
				@apply shadow-2xl pulsehint;
				:global(.add-activity) {
					@apply pulsehint transition;
					@apply bg-blue-600;
				}
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
					@apply text-center italic max-w-lg bg-white px-6 py-4 rounded shadow border-dashed border-4 border-slate-200 z-10;
				}
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

	@media screen and (max-width: 1400px) {
		.calculator-layout {
			@apply flex-wrap;
			.results {
				@apply w-full basis-full;
			}
		}
	}
	@media screen and (max-width: 1024px) {
		.calculator-layout.hasActivities {
			.activities,
			.config {
				@apply grow ml-0 rounded-lg basis-80;
				width: 50%;
			}
			.results {
				@apply basis-full overflow-x-auto;
			}
			&.hideConfig {
				.activities {
					@apply shadow-lg;
				}
				.activities,
				.config,
				.results {
					@apply mx-0;
				}
				.config {
					@apply hidden;
				}
			}
		}
	}
	@media screen and (max-width: 53rem) {
		.calculator-layout.noActivities {
			.no-activities-results {
				@apply hidden;
			}
			.activities {
				@apply ml-0 rounded-lg w-full;
			}
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
