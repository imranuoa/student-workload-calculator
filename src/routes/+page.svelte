<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import ResultTable from '$lib/result-table/resultTable.svelte';
	import { courses, activeCourse, addCourse } from '../store';
	import { Course } from '$lib/course';
	import EditForm from '$lib/editForm.svelte';
	import ComponentList from '$lib/add-component/componentList.svelte';
	import CourseSelect from '$lib/add-course/courseSelect.svelte';
	import CreateCourse from '$lib/add-course/createCourse.svelte';

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
			class:expandResults={!openComponentInst}
		>
			<div
				class="components"
				use:clickOutside={() => {
					addComponentOpen = false;
				}}
			>
				<CourseSelect {courses} {activeCourse} />

				<hr />
				<ComponentList bind:activeCourse={activeCourseInst} bind:addComponentOpen />
			</div>
			{#if activeCourseInst}
				<div class="config">
					<EditForm bind:components={$activeCourseComponents} {openComponent} />
				</div>
				<div class="results">
					{#if $activeCourseComponents && $activeCourseMeta}
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
					{/if}
				</div>
			{/if}
		</div>
	{/key}
{:else}
	<CreateCourse />
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

		.config,
		.results {
			@apply duration-150 ease-in-out z-0;
			transition-property: margin-left;
			margin-left: 0;
		}
		.config {
			width: 25rem;
		}
		&.expandResults {
			.config {
				margin-left: -25rem;
			}
			.results {
				margin-left: -2.5rem;
			}
		}

		.results {
			@media screen and (max-width: 60rem) {
				grid-row-start: 2;
				grid-column: 1 / -1;
			}
		}

		.config,
		.results {
			@apply pt-4;
		}
	}
</style>
