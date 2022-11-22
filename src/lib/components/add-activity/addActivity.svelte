<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import type { ActivitySubClass } from '../activities';
	import { activeCourse, courses } from '../../store';
	import { writable } from 'svelte/store';

	$: courseMeta = $activeCourse >= 0 ? $courses[$activeCourse].meta : undefined;

	const dispatch = createEventDispatcher();

	export let activities: ActivitySubClass[];

	export let hoveredActivity = -1;
	let hoveredTimeout: number;

	let isFocused = false;
</script>

<div
	on:mouseleave={() => {
		hoveredTimeout = window.setTimeout(() => {
			if (!isFocused) hoveredActivity = -1;
		}, 300);
	}}
	class="activityWrapper"
>
	<div class="activity-grid mb-5" transition:slide>
		{#each activities as activity, i}
			<button
				class="btn"
				on:click={() => dispatch('add', activity)}
				on:mouseenter={() => {
					clearTimeout(hoveredTimeout);
					hoveredActivity = i;
				}}
				on:focus={() => {
					isFocused = true;
					clearTimeout(hoveredTimeout);
					hoveredActivity = i;
				}}
				on:blur={() => {
					isFocused = false;
					hoveredTimeout = window.setTimeout(() => {
						if (!isFocused) hoveredActivity = -1;
					}, 300);
				}}
				aria-details="activity-info"
			>
				<span class="icon">{activity.icon}</span>
				<span class="label">{activity.label}</span>
			</button>
		{/each}
	</div>
	<div class="activity-info-wrapper">
		{#if hoveredActivity >= 0}
			{#key hoveredActivity}
				<div
					id="activity-info"
					transition:fly={{ y: 10 }}
					on:mouseenter={() => {
						clearTimeout(hoveredTimeout);
					}}
				>
					<h3>
						{activities[hoveredActivity].icon}
						{activities[hoveredActivity].label}
					</h3>
					<p>{activities[hoveredActivity].description}</p>
				</div>
			{/key}
		{/if}
	</div>
</div>

<style lang="postcss">
	.activityWrapper {
		@apply relative;
		.activity-grid {
			@apply grid grid-cols-4 gap-2;
			.btn {
				/* Default */
				@apply flex flex-col items-center justify-center w-full relative rounded-lg  outline-blue-400 outline-0 outline overflow-hidden bg-gray-50 text-black;
				/* On Hover */
				@apply transition hover:shadow-md hover:outline-2 focus:shadow-md
focus:outline-2;
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

		.activity-info-wrapper {
			@apply grid absolute z-20;
			grid-template-areas: 'content';
			#activity-info {
				@apply m-3 p-4 rounded-lg shadow-md  bg-white;
				grid-area: content;
				h3 {
					@apply text-xl text-center;
				}
				p {
					@apply text-sm;
				}
			}
		}
	}
</style>
