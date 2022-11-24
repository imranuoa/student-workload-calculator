<script lang="ts">
	import CalendarExpandHorizontal from 'svelte-material-icons/CalendarExpandHorizontal.svelte';
	import ClockTimeFiveOutline from 'svelte-material-icons/ClockTimeFiveOutline.svelte';
	import Summit from 'svelte-material-icons/Summit.svelte';
	import { slide } from 'svelte/transition';
	export let type: 'Duration' | 'Time' | 'Total';
</script>

<div
	class="stat"
	class:duration={type === 'Duration'}
	class:time={type === 'Time'}
	class:total={type === 'Total'}
>
	<div class="icon">
		<slot name="icon">
			{#if type === 'Duration'}
				<CalendarExpandHorizontal />
			{:else if type === 'Time'}
				<ClockTimeFiveOutline />
			{:else if type === 'Total'}
				<Summit />
			{/if}
		</slot>
	</div>
	<div class="title">
		<slot name="title">
			{#if type === 'Duration'}
				Duration
			{:else if type === 'Time'}
				Workload Per Week
			{:else if type === 'Total'}
				Total Workload
			{/if}
		</slot>
	</div>
	<div class="data">
		<slot name="data" />
	</div>
</div>
<div class="details">
	<slot name="details" />
</div>

<style lang="postcss">
	.stat {
		@apply grid gap-3 align-middle;
		@apply w-full p-4;
		@apply text-sm;
		grid-template-columns: auto 1fr auto;
		.icon {
			@apply text-xl flex items-center justify-center;
		}
		.title {
			@apply font-semibold;
		}
		&.duration {
			@apply bg-uni-color-light-orange text-uni-color-dark-orange;
		}
		&.time {
			@apply bg-uni-color-light-green text-uni-color-dark-green;
		}
		&.total {
			@apply bg-uni-color-light-blue text-uni-color-dark-blue;
		}
	}
	.details {
		@apply px-4;
		padding-left: var(--card-padding);
		padding-right: var(--card-padding);
		> :global(:last-child) {
			@apply mb-4;
		}
	}
</style>
