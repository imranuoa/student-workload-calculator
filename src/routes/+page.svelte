<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import ResultTable from '$lib/result-table/resultTable.svelte';
	import { courses, activeCourse, addCourse } from '../store';
	import { Course } from '$lib/course';
	import EditForm from '$lib/editForm.svelte';
	import ComponentList from '$lib/add-component/manageComponents.svelte';
	import CourseSelect from '$lib/add-course/courseSelect.svelte';
	import ManageCourses from '$lib/add-course/manageCourses.svelte';
	import { fade } from 'svelte/transition';
	// import arrowPattern from '$lib/assets/arrow-left.svg';

	let addComponentOpen: boolean;

	$: activeCourseInst = $activeCourse >= 0 ? $courses[$activeCourse] : undefined;
	$: activeCourseMeta = activeCourseInst?.meta;
	$: activeCourseComponents = activeCourseInst?.components;
	$: openComponent = activeCourseInst?.openComponent;
	$: openComponentInst =
		$openComponent !== undefined && $openComponent >= 0
			? $activeCourseComponents?.[$openComponent]
			: undefined;

	// If openComponent is >0 and doesn't resolve, reset it to -1
	$: if (
		$openComponent &&
		$openComponent > 0 &&
		$activeCourseComponents &&
		$activeCourseComponents[$openComponent] === undefined
	) {
		$openComponent = -1;
	}
</script>

{#if activeCourseInst && $activeCourseMeta && $activeCourseComponents}
	{#key $activeCourse}
		<div
			class="calculator-layout"
			class:expandComponents={addComponentOpen}
			class:hideConfig={!openComponentInst}
			class:noComponents={$activeCourseComponents.length === 0}
		>
			<div
				class="components"
				use:clickOutside={() => {
					addComponentOpen = false;
				}}
			>
				<CourseSelect {courses} {activeCourse} />

				<hr class="my-2" />
				<ComponentList bind:activeCourse={activeCourseInst} bind:addComponentOpen />
			</div>
			{#if activeCourseInst}
				<div class="config">
					<EditForm bind:components={$activeCourseComponents} {openComponent} />
				</div>
				<div class="results">
					{#if $activeCourseComponents && $activeCourseMeta && $activeCourseComponents.length > 0}
						<ResultTable
							components={$activeCourseComponents}
							courseWeeks={$activeCourseMeta.weeks}
							bind:openComponent={$openComponent}
							on:selectComponent={({ detail }) => {
								const matchedIndex = $activeCourseComponents?.findIndex((c) => c == detail);
								if (matchedIndex === $openComponent) $openComponent = -1;
								else if (matchedIndex !== -1) $openComponent = matchedIndex;
							}}
						/>
					{:else}
						<div class="no-components-results" in:fade>
							<div class="arrows-wrap">
								<div class="arrows" />
							</div>
							<p class="hint">
								This course doesn't have anything in it! To get started, use the menu to the left to
								add a component.
							</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/key}
{:else}
	<ManageCourses />
{/if}

<style lang="postcss">
	.calculator-layout {
		@apply grid gap-10 mr-10 h-full pb-5 grid-cols-3;
		--components-pane-default-width: 20rem;
		grid-template-columns: var(--components-pane-default-width) auto 3fr;

		.components {
			@apply shadow-lg bg-white p-4 rounded-r-lg h-full transition-all z-10;
			width: var(--components-pane-default-width);
		}

		.config,
		.results {
			@apply duration-150 ease-in-out z-0;
			transition-property: margin-left, opacity;
			margin-left: 0;
		}
		.config {
			width: 25rem;
		}
		&.hideConfig {
			.components {
				@apply shadow-xl;
				width: 30rem;
				z-index: 10;
			}
			.config {
				margin-left: -15rem;
			}
			.results {
				margin-left: -2.5rem;
			}
		}

		&.expandComponents {
			.components {
				@apply shadow-xl;
				width: 40rem;
				z-index: 10;
			}
			.config,
			.results {
				@apply opacity-30;
			}
		}

		@media screen and (max-width: 60rem) {
			.results {
				grid-row-start: 2;
				grid-column: 1 / -1;
			}
		}

		.config,
		.results {
			@apply pt-4;
		}
		&.noComponents {
			.components {
				@apply shadow-2xl pulsehint;
				:global(.add-component) {
					@apply pulsehint transition;
					@apply bg-blue-600;
				}
			}
			.no-components-results {
				@apply w-full h-96 flex items-center justify-center  relative overflow-clip;
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
					@apply text-center italic m-5 max-w-lg bg-white p-10 rounded shadow border-dashed border-4 border-slate-200 z-10;
				}
			}
		}
	}
	.pulsehint {
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
