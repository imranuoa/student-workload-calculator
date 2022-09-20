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
</script>

<div class="componentList">
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
		<AddComponentMenu
			{components}
			on:add={({ detail }) => {
				activeCourse?.addComponent(new detail(activeCourse.meta));
				addComponentOpen = false;
			}}
		/>
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
					on:delete={() => activeCourse?.removeComponent(i)}
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
