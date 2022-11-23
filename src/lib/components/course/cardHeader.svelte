<script lang="ts">
	import ChevronUp from 'svelte-material-icons/ChevronUp.svelte';
	import RangeInput from '$lib/components/form-elems/rangeInput.svelte';
	import { Course, getCourseData, type courseData, type courseDataValid } from '$lib/course';
	import { propertyStore } from 'svelte-writable-derived';
	import { cardState } from './card';
	import autoAnimate from '$lib/autoAnimate';

	export let course: Course;
	export let state: cardState;

	$: meta = course?.meta;
	$: activities = course?.activities;
	$: totals = $activities && Course.getTotal($activities);

	$: writableWeeks = propertyStore(meta, ['weeks']);
	$: writableTarget = propertyStore(meta, ['target']);
	$: writableTargetFreq = propertyStore(meta, ['targetFreq']);
	$: writableWeekTemplate = propertyStore(meta, ['weekTemplate']);

	const toggleState = () => {
		if (state === cardState.expanded) {
			state = cardState.edit;
		} else if (state === cardState.edit) {
			state = cardState.expanded;
		}
	};
</script>

{#if state === cardState.view}
	<div class="header-text">
		<h3 class="uni-header">{$meta.name}</h3>
	</div>
{:else}
	<div class="header-block" use:autoAnimate>
		{#if state === cardState.expanded || state === cardState.create}
			<label class="coursename" for="courseEdit-{course.id}-courseName">
				<span class="prefix">Course:</span>
				<input
					type="text"
					bind:value={$meta.name}
					id="courseEdit-{course.id}-courseName"
					placeholder="Title"
				/>
				<!-- <span class="suffix">✐</span> -->
			</label>
		{:else}
			<h3 class="title">{$meta.name}</h3>
		{/if}
		{#if state !== cardState.create}
			<button
				class="header-toggle"
				class:expanded={state === cardState.expanded}
				on:click={toggleState}
			>
				<ChevronUp />
			</button>
		{/if}
	</div>
{/if}

<style lang="postcss">
	.header-text {
		padding: 0 var(--card-padding);
		@apply pt-4;
		.uni-header {
			@apply text-2xl uppercase font-semibold font-sans;
			&:after {
				@apply w-3/5;
			}
		}
	}
	.header-block {
		@apply bg-uni-blue w-full text-white font-bold flex items-center gap-3 z-10 relative;
		padding: 0 var(--card-padding);
		@apply pb-4 pt-3;
		.title {
			@apply w-full m-0 text-2xl uppercase font-semibold font-sans;
		}
		.coursename {
			@apply text-2xl flex items-center gap-2 border-b-2 border-gray-200;
			.prefix {
				@apply block opacity-50;
			}
			input {
				@apply flex-grow border-0 p-0 px-2 text-2xl bg-white bg-opacity-0 text-white placeholder-white placeholder-opacity-50 w-full rounded focus:ring-0 transition focus:bg-opacity-10 focus:placeholder-transparent;
			}
		}
		.header-toggle {
			@apply text-3xl transition transform;
			&.expanded {
				@apply rotate-180;
			}
		}
	}
</style>
