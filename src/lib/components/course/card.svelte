<script lang="ts">
	import autoAnimate from '$lib/autoAnimate';
	import ArrowRight from 'svelte-material-icons/ArrowRight.svelte';
	import { Course, getCourseData, type courseMeta } from '$lib/course';
	import type { Activity } from '$lib/course-activities/genericActivity';
	import type { Readable } from 'svelte/store';
	import Duration from './stats/duration.svelte';
	import Time from './stats/time.svelte';
	import Total from './stats/total.svelte';
	import { cardState } from './card';
	import { addCourse, openCourse } from '$lib/../store';
	import CardHeader from './cardHeader.svelte';
	import ManageActivities from '../add-activity/manageActivities.svelte';
	import { goto } from '$app/navigation';

	export let course: Course | undefined = undefined;
	export let courseIndex: number | undefined = undefined;
	export let state: cardState = course ? cardState.view : cardState.blank;

	$: meta = course?.meta;
	$: activities = course?.activities;
	$: totals = $activities && Course.getTotal($activities);

	$: data = getCourseData(course, $meta, $activities, $totals);

	const createCourse = () => {
		course = new Course('Your Course', 12);
		state = cardState.create;
	};
</script>

<div
	class="uni-card"
	class:createCard={!data.course}
	class:expand={state === cardState.expanded}
	class:create={state === cardState.create}
	use:autoAnimate
>
	{#if data.course}
		<CardHeader course={data.course} bind:state />
		{#if state !== cardState.edit}
			<div class="stats">
				<Duration course={data.course} bind:state />
				<Time course={data.course} bind:state />
				{#if state === cardState.view}
					<Total course={data.course} bind:state />
				{/if}
			</div>
		{/if}
		{#if state === cardState.edit || state === cardState.expanded}
			<div class="body">
				<ManageActivities course={data.course} />
			</div>
		{/if}
		<div class="footer">
			{#if state === cardState.view}
				<button
					class="btn btn-md btn-text btn-icon"
					on:click={() => {
						courseIndex !== undefined && openCourse(courseIndex);
					}}
				>
					<div class="icon">
						<ArrowRight />
					</div>
					Open
				</button>
			{:else if state === cardState.create}
				<button
					class="btn btn-md btn-primary btn-icon"
					on:click={() => {
						console.log('add course', course);
						course && addCourse(course);
						course = undefined;
						state = cardState.blank;
						goto('/');
					}}
				>
					<div class="icon">
						<ArrowRight />
					</div>
					Continue
				</button>
			{/if}
		</div>
	{:else}
		<div class="createInfo">
			<button
				on:click={() => {
					createCourse();
				}}
			>
				<h3>Create course</h3>
			</button>
			<!-- svelte-ignore a11y-invalid-attribute -->
			<p>Or <button class="link">upload a course</button></p>
		</div>
	{/if}
</div>

<style lang="postcss">
	.uni-card {
		--card-padding: theme('spacing.7');
		@apply w-full bg-white shadow pb-0 border-t-4 border-uni-blue overflow-auto m-auto;
		@apply transition;
		.stats {
			@apply flex flex-col justify-between gap-2 relative z-10 bg-white;
			padding: 0 var(--card-padding);
		}
		&.expand .stats,
		&.create .stats {
			@apply px-0;
		}
		&:after {
			@apply absolute inset-0 bg-black opacity-0 transition;
			content: '';
			visibility: hidden;
		}
		&.expand {
			.stats {
				@apply shadow-lg pb-4 mb-4;
			}
			&:after {
				@apply visible opacity-50;
			}
		}

		.body {
			padding: 0 var(--card-padding);
			@apply mt-4 mb-8;
		}

		.footer {
			@apply flex justify-end gap-2 mt-4 h-9;
			@apply bg-uni-gray-100 border-t-2 border-uni-gray-300 border-opacity-30 text-uni-gray-400 text-sm;
		}
		&.create .footer {
			@apply bg-white border-0 m-2;
		}
		.createInfo {
			@apply text-center;
			h3 {
				@apply text-3xl text-uni-blue;
			}
			p {
				@apply text-lg;
				.link {
					@apply text-uni-blue underline underline-offset-2;
				}
			}
		}
	}
	.createCard {
		@apply uni-card;
		@apply shadow-none border-dashed border-4 border-uni-blue border-opacity-20;
		padding: 0 var(--card-padding);
		@apply w-full max-w-sm max-h-full h-72 flex flex-col items-center justify-center;
	}
</style>
