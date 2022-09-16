<script lang="ts">
	import AddComponentMenu from '$lib/add-component/addComponent.svelte';
	import components, { Component, getComponentClass } from '$lib/components';
	import type { ComponentSubClass } from '$lib/components';
	import type { Course, courseMeta as courseMetaType } from '$lib/course';
	import type { Writable } from 'svelte/store';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import ComponentListItem from './componentListItem.svelte';

	export let addComponentOpen = false;
	export let activeCourse: Course;

	$: courseMeta = activeCourse.meta;
	$: courseComponents = activeCourse.components;
	$: courseOpenComponent = activeCourse.openComponent;

	const addComponent = async (component: ComponentSubClass) => {
		// TODO: Handle unsaved changes
		if (!activeCourse) return; // Need to have a course open
		$courseComponents = [...$courseComponents, new component(activeCourse.meta)];
		const numCourses = $courseComponents.length;
		activeCourse.openComponent.set(numCourses - 1);
		addComponentOpen = false;
		await tick();
		// initialFormEl?.focus();
	};
	const deleteComponent = async (i: number) => {
		if ($courseComponents.length === 1) {
			$courseComponents = [];
		} else {
			$courseComponents = $courseComponents.splice(i, 1);
		}
		await tick();
		activeCourse.openComponent.set(-1);
	};
</script>

<div class="componentList">
	<label class="block">
		<span class="text-gray-700">Weeks in Semester</span>
		<input type="number" class="form-input mt-1 block w-full" bind:value={$courseMeta.weeks} />
	</label>
	<h2>
		<span> Components: </span>
		<button
			class="btn"
			title="Add Component"
			on:click={() => {
				addComponentOpen = !addComponentOpen;
			}}
		>
			<span class="icon">+</span>
		</button>
	</h2>
	{#if addComponentOpen}
		<AddComponentMenu {components} on:add={({ detail }) => addComponent(detail)} />
	{/if}
	{#if $courseComponents.length === 0 && !addComponentOpen}
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
			{#each $courseComponents as component, i}
				<ComponentListItem
					{component}
					active={$courseOpenComponent === i}
					on:delete={() => deleteComponent(i)}
					on:select={() => {
						if ($courseOpenComponent === i) activeCourse.openComponent.set(-1);
						else activeCourse.openComponent.set(i);
					}}
				/>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
</style>
