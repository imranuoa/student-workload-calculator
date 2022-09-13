<script lang="ts">
	import { tick } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { clickOutside } from 'svelte-use-click-outside';
	import components from '$lib/components';
	import { additionalCalculated } from '$lib/components';
	import type { course } from '$lib/course';
	import deepClone from 'deep-clone';
	import ResultTable from '$lib/resultTable.svelte';
	import ComponentList from '$lib/add-component/addComponent.svelte';

	let courses: course[] = [];
	let activeCourse: number = -1;
	let initialFormEl: HTMLElement;

	let addComponentOpen = false;

	$: activeComponentType =
		activeCourse >= 0
			? courses[activeCourse].components[courses[activeCourse].openComponent]?.type
			: null;
	$: activeComponentTypeData = components.find((c) => c.name === activeComponentType);
	$: openComponent =
		activeCourse >= 0 && courses[activeCourse].openComponent >= 0
			? courses[activeCourse].components[courses[activeCourse].openComponent]
			: null;

	const getComponentModel = (type: string) => {
		return components.find((c) => c.name === type);
	};

	const addCourse = () => {
		courses = [
			...courses,
			{
				meta: {
					name: '',
					weeks: 12
				},
				openComponent: -1,
				components: []
			}
		];
	};

	const addComponent = async (i: number) => {
		// TODO: Handle unsaved changes
		courses[activeCourse].components = [
			...courses[activeCourse].components,
			{
				type: components[i].name,
				data: deepClone(components[i].dataTemplate)
			}
		];
		courses[activeCourse].openComponent = courses[activeCourse].components.length - 1;
		addComponentOpen = false;
		await tick();
		initialFormEl?.focus();
	};
	const deleteComponent = async (i: number) => {
		courses[activeCourse].components.splice(i, 1);
		await tick();
		courses[activeCourse].openComponent = -1;
	};

	const init = async () => {
		if (courses.length === 0) {
			addCourse();
			activeCourse = 0;
			await tick();
			if (courses[activeCourse].components.length === 0) {
				addComponent(0);
			}
		}
	};
	init();
</script>

<div
	class="calculator-layout"
	class:expandComponents={addComponentOpen}
	class:expandResults={openComponent === null}
>
	<div
		class="components"
		use:clickOutside={() => {
			addComponentOpen = false;
		}}
	>
		{#if activeCourse === -1}
			<h2>Select a Course</h2>
			{#each courses as course, i}
				<button
					class="btn"
					on:click={() => {
						activeCourse = i;
					}}>{course.meta.name}</button
				>
			{/each}
		{:else}
			<label class="block">
				<span class="text-gray-700">Weeks in Semester</span>
				<input
					type="number"
					class="form-input mt-1 block w-full"
					bind:value={courses[activeCourse].meta.weeks}
				/>
			</label>
			<h2>
				<span> Components: </span>
				<button
					class="btn"
					on:click={() => {
						addComponentOpen = !addComponentOpen;
					}}
				>
					<span class="icon">+</span>
				</button>
			</h2>
			{#if addComponentOpen}
				<ComponentList {components} on:add={({ detail }) => addComponent(detail.i)} />
			{/if}
			{#if courses[activeCourse].components.length === 0 && !addComponentOpen}
				<p in:fade class="text-gray-500 text-center italic m-5">
					You don't have any components to this course yet! Why not <button
						class="italic font-bold underline"
						on:click={() => {
							addComponentOpen = !addComponentOpen;
						}}>add one</button
					>?
				</p>
			{:else}
				<div class="component-instance-list">
					{#each courses[activeCourse].components as component, i}
						<div
							class="component-row"
							class:active={i === courses[activeCourse].openComponent}
							role="button"
							on:click={() => {
								if (i === courses[activeCourse].openComponent)
									courses[activeCourse].openComponent = -1;
								else courses[activeCourse].openComponent = i;
							}}
						>
							<span class="icon">
								{getComponentModel(component.type)?.icon}
							</span>
							<span class="name">{component.data.name}</span>
							<span class="hours">
								{additionalCalculated(component.data, courses[activeCourse].meta).perWeekI +
									additionalCalculated(component.data, courses[activeCourse].meta).perWeekS} Hrs per
								Week
							</span>
							<button
								class="btn btn-block"
								aria-label="delete"
								on:click={() => {
									deleteComponent(i);
								}}
							>
								<span class="icon">-</span>
							</button>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
	{#if activeComponentType && activeComponentTypeData && openComponent}
		<div class="config" transition:fade={{ duration: 200 }}>
			<h2>Configuration</h2>
			<svelte:component
				this={activeComponentTypeData.form}
				bind:data={openComponent.data}
				bind:initialFormEl
				weeks={courses[activeCourse].meta.weeks}
			/>
		</div>
	{/if}
	<div class="results">
		<ResultTable
			components={courses[activeCourse].components}
			courseInfo={courses[activeCourse].meta}
		/>
	</div>
</div>

<style lang="postcss">
	.calculator-layout {
		@apply grid gap-10 h-full pb-5 grid-cols-3;
		--components-pane-default-width: 20rem;
		grid-template-columns: var(--components-pane-default-width) 25rem 3fr;

		.results {
			@media screen and (max-width: 60rem) {
				grid-row-start: 2;
				grid-span: 2;
			}
		}

		.config,
		.results {
			@apply transition;
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
	}
	.components {
		@apply shadow-lg bg-white p-4 rounded-r-lg h-full transition-all;
		width: var(--components-pane-default-width);
		h2 {
			@apply text-xl flex justify-between my-2;
		}
		.component-instance-list {
			.component-row {
				@apply grid p-1 items-center rounded;
				grid-template-columns: 4ch 1fr auto auto;
				&.active {
					@apply bg-gray-200;
				}
				.icon {
					@apply text-center;
				}
				.name {
					@apply text-gray-700 font-bold;
				}
				.hours {
					@apply text-gray-500 text-sm italic mx-2;
				}
			}
		}
	}
</style>
