<script lang="ts">
	import components from '$lib/components';
	import type { componentInstance } from '$lib/components';
	import type { course } from '$lib/course';
	import deepClone from 'deep-clone';
	import ResultTable from '$lib/resultTable.svelte';

	let courses: course[] = [];
	let activeCourse: number = -1;

	$: activeComponentType =
		activeCourse >= 0
			? courses[activeCourse].components[courses[activeCourse].openComponent]?.type
			: null;
	$: activeComponentTypeData = components.find((c) => c.name === activeComponentType);
	$: openComponent =
		activeCourse >= 0 && courses[activeCourse].openComponent >= 0
			? courses[activeCourse].components[courses[activeCourse].openComponent]
			: null;

	const addCourse = () => {
		courses = [
			...courses,
			{
				meta: {
					name: '',
					weeks: 0
				},
				openComponent: -1,
				components: []
			}
		];
	};

	const addComponent = (i: number) => {
		// TODO: Handle unsaved changes
		courses[activeCourse].components = [
			...courses[activeCourse].components,
			{
				type: components[i].name,
				data: deepClone(components[i].dataTemplate)
			}
		];
		courses[activeCourse].openComponent = courses[activeCourse].components.length - 1;
	};

	if (courses.length === 0) {
		addCourse();
		activeCourse = 0;
	}
</script>

<div class="calculator-layout">
	<div class="components">
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
			<h2>Select a Course Component</h2>
			{#each components as component, i}
				<button
					class="btn btn-block"
					on:click={() => {
						addComponent(i);
					}}>{component.name}</button
				>
			{/each}
			<p>Components: {courses[activeCourse].openComponent}</p>
			{#each courses[activeCourse].components as component, i}
				<button
					class="btn btn-block"
					class:active={i === courses[activeCourse].openComponent}
					on:click={() => {
						if (i === courses[activeCourse].openComponent) courses[activeCourse].openComponent = -1;
						else courses[activeCourse].openComponent = i;
					}}>{component.data.name}</button
				>
			{/each}
		{/if}
	</div>
	<div class="config">
		{#if activeComponentType && activeComponentTypeData && openComponent}
			<h2>Configuration</h2>
			<svelte:component
				this={activeComponentTypeData.form}
				bind:data={openComponent.data}
				courseInfo={courses[activeCourse].meta}
			/>
		{/if}
	</div>
	<div class="results">
		<ResultTable
			components={courses[activeCourse].components}
			courseInfo={courses[activeCourse].meta}
		/>
	</div>
</div>

<style lang="postcss">
	.calculator-layout {
		@apply grid gap-10 h-full pb-5;
		grid-template-columns: 1fr 2fr 3fr;
	}
	.components {
		@apply shadow-lg bg-white p-4 rounded-r-lg h-full;
		h2 {
			@apply text-xl text-center;
		}
	}
</style>
