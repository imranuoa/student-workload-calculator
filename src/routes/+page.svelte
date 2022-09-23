<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import ResultTable from '$lib/result-table/resultTable.svelte';
	import { courses, activeCourse, addCourse } from '../store';
	import EditForm from '$lib/editForm.svelte';
	import ComponentList from '$lib/add-component/manageComponents.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
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

	onMount(async () => {
		if ($activeCourse === -1 || $courses.length === 0) {
			$activeCourse = -1;
			openCourseConfig();
		}
	});

	const openCourseConfig = () => {
		goto('/configure');
	};
</script>

{#if activeCourseInst && $activeCourseMeta && $activeCourseComponents}
	{#key $activeCourse}
		<div
			class="calculator-layout"
			class:expandComponents={addComponentOpen}
			class:hideConfig={!openComponentInst}
			class:noComponents={$activeCourseComponents.length === 0}
			class:hasComponents={$activeCourseComponents.length > 0}
		>
			<div
				class="components"
				use:clickOutside={() => {
					addComponentOpen = false;
				}}
			>
				<div class="title">
					<a href="/configure" class="btn configure" title="return to course list">&leftarrow;</a>
					{#if activeCourseMeta}
						<h2>{$activeCourseMeta.name}</h2>
					{/if}
				</div>
				<hr class="my-2" />
				<ComponentList bind:activeCourse={activeCourseInst} bind:addComponentOpen />
			</div>
			{#if activeCourseInst}
				<div class="config">
					<EditForm components={activeCourseComponents} {openComponent} />
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
{/if}

<style lang="postcss">
	.calculator-layout {
		@apply flex gap-8 p-8 min-h-full pb-5 flex-wrap;
		--components-pane-width: 20rem;
		--components-pane-extra-width: 0rem;
		--config-pane-width: 25rem;

		.components {
			@apply shadow-lg bg-white p-4 rounded-r-lg transition-all z-10 -ml-8;
			width: calc(var(--components-pane-width) + var(--components-pane-extra-width));
			.title {
				@apply grid items-center gap-4;
				grid-template-columns: auto 1fr;
				grid-template-areas: 'button title';
				.h1 {
					grid-area: title;
				}
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
			.components {
				@apply shadow-xl;
				--components-pane-extra-width: 10rem;
				z-index: 10;
			}
			&.expandComponents {
				.components {
					@apply shadow-2xl;
					--components-pane-extra-width: 20rem;
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

		&.expandComponents {
			--components-pane-extra-width: 20rem;
			.components {
				@apply shadow-xl;
				z-index: 10;
			}
			.config,
			.results {
				@apply opacity-30 pointer-events-none;
			}
			.config {
				margin-left: calc(var(--components-pane-extra-width) * -1);
			}
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
	.pulsehint {
		animation: pulseHint 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		animation-direction: alternate;
	}

	@media screen and (max-width: 1024px) {
		.calculator-layout.hasComponents {
			.components,
			.config {
				@apply grow ml-0 rounded-lg basis-80;
				width: 50%;
			}
			.results {
				@apply basis-full overflow-x-auto;
			}
			&.hideConfig {
				.components {
					@apply shadow-lg;
				}
				.components,
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
		.calculator-layout.noComponents {
			.no-components-results {
				@apply hidden;
			}
			.components {
				@apply ml-0 rounded-lg w-full;
			}
		}
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
