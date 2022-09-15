<script lang="ts">
	import { tick } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { clickOutside } from 'svelte-use-click-outside';
	import components, { Component, type ComponentSubClass } from '$lib/components';
	import deepClone from 'deep-clone';
	import ResultTable from '$lib/resultTable.svelte';
	import ComponentList from '$lib/add-component/addComponent.svelte';
	import { courses, activeCourse } from '../store';
	import { get } from 'svelte/store';
	import { Course } from '$lib/course';
	import EditForm from '$lib/editForm.svelte';

	let initialFormEl: HTMLElement;

	let addComponentOpen = false;

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

	const addCourse = () => {
		console.log('Adding Course!');
		$courses = [...$courses, new Course('Your Course', 12)];
	};
	$: console.log($courses);
	$: console.log(activeCourseInst);
	$: console.log($activeCourseMeta);
	$: console.log($activeCourseComponents);
	$: console.log(openComponentInst);

	const addComponent = async (component: ComponentSubClass) => {
		// TODO: Handle unsaved changes
		if (!activeCourseInst) return; // Need to have a course open
		activeCourseInst.components.set([
			...get(activeCourseInst.components),
			new component(activeCourseInst.meta)
		]);
		const numCourses = get(activeCourseInst.components).length;
		activeCourseInst.openComponent.set(numCourses - 1);
		addComponentOpen = false;
		await tick();
		// initialFormEl?.focus();
	};
	const deleteComponent = async (i: number) => {
		if (!$activeCourseComponents || !activeCourseInst) return; // Need to have a course open
		$activeCourseComponents = $activeCourseComponents.splice(i, 1);
		await tick();
		activeCourseInst.openComponent.set(-1);
	};

	const getComponentClass = (component: Component) => {
		return <typeof Component>component.constructor;
	};

	const init = async () => {
		if ($courses.length === 0) {
			addCourse();
			$activeCourse = 0;
			await tick();
			addComponent(components[0]);
		}
	};
	init();
</script>

<div
	class="calculator-layout"
	class:expandComponents={addComponentOpen}
	class:expandResults={openComponent === undefined}
>
	<div
		class="components"
		use:clickOutside={() => {
			addComponentOpen = false;
		}}
	>
		{#if !activeCourseInst}
			<h2>Select a Course</h2>
			{#each $courses as course, i}
				<button
					class="btn"
					on:click={() => {
						$activeCourse = i;
					}}>{get(course.meta).name}</button
				>
			{/each}
		{:else if $activeCourseMeta && $activeCourseComponents}
			<label class="block">
				<span class="text-gray-700">Weeks in Semester</span>
				<input
					type="number"
					class="form-input mt-1 block w-full"
					bind:value={$activeCourseMeta.weeks}
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
				<ComponentList {components} on:add={({ detail }) => addComponent(detail)} />
			{/if}
			{#if $activeCourseComponents.length === 0 && !addComponentOpen}
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
					{#each $activeCourseComponents as component, i}
						<div
							class="component-row"
							class:active={i === $openComponent}
							role="button"
							on:click={() => {
								if (i === $openComponent) $openComponent = -1;
								else $openComponent = i;
							}}
						>
							<span class="icon">
								{getComponentClass(component).icon}
							</span>
							<span class="name">{get(component.instanceName)}</span>
							<span class="hours">
								{get(component.derivedCalculated).perWeekI +
									get(component.derivedCalculated).perWeekS} Hrs per Week
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
	{#if openComponentInst}
		<EditForm formData={openComponentInst.form} />
	{/if}
	<div class="results" class:expandResults={!openComponent}>
		{#if $activeCourseComponents}
			<ResultTable components={$activeCourseComponents} />
		{/if}
	</div>
</div>

<style lang="postcss">
	.calculator-layout {
		@apply grid gap-10 h-full pb-5 grid-cols-3;
		--components-pane-default-width: 20rem;
		grid-template-columns: var(--components-pane-default-width) 25rem 3fr;

		.results {
			&.expandResults {
				grid-column: 2 / -1;
			}
			@media screen and (max-width: 60rem) {
				grid-row-start: 2;
				grid-column: 1 / -1;
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
