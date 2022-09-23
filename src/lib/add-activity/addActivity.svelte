<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import type { ActivitySubClass } from '../activities';
	import { activeCourse, courses } from '../../store';

	$: courseMeta = $activeCourse >= 0 ? $courses[$activeCourse].meta : undefined;

	const dispatch = createEventDispatcher();

	export let activities: ActivitySubClass[];
</script>

<div class="activity-grid mb-5" transition:slide>
	{#each activities as activity, i}
		<button class="btn" on:click={() => dispatch('add', activity)}>
			<span class="icon">{activity.icon}</span>
			<span class="label">{activity.label}</span>
		</button>
	{/each}
</div>

<style lang="postcss">
	.activity-grid {
		@apply grid grid-cols-5 gap-2;
		.btn {
			/* Default */
			@apply flex flex-col items-center justify-center w-full relative rounded-lg  outline-blue-400 outline-0 outline overflow-hidden bg-gray-50 text-black;
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
