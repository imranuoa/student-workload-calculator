<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import type { Component } from './components';

	const dispatch = createEventDispatcher();

	export let components: Component[];
</script>

<div class="component-grid mb-5" transition:slide>
	{#each components as component, i}
		<button class="btn" on:click={() => dispatch('add', { type: components[i].name, i })}>
			<span class="icon">{component.icon}</span>
			<span class="label">{component.short}</span>
		</button>
	{/each}
</div>

<style lang="postcss">
	.component-grid {
		@apply grid grid-cols-5 gap-2;
		.btn {
			/* Default */
			@apply flex flex-col items-center justify-center w-full relative rounded-lg bg-gray-100 text-gray-700 outline-gray-400 outline-0 outline overflow-hidden;
			/* On Hover */
			@apply transition hover:shadow-md hover:outline-2;
			.icon {
				@apply text-2xl;
			}
			.label {
				@apply text-xs;
				/* @apply text-xs absolute w-full h-full opacity-0 transition bg-gray-100 flex items-center; */
			}
			&:hover {
				.label {
					@apply opacity-100;
				}
			}
		}
	}
</style>
