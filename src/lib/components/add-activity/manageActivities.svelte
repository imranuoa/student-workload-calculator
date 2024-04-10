<script lang="ts">
	import AddActivityMenu from '$lib/components/add-activity/addActivity.svelte';
	import { Course } from '$lib/course';
	import { activities } from '$lib/activities';
	import { fade } from 'svelte/transition';
	import ActivityListItem from './activityListItem.svelte';
	import CourseIndicator from '../course/course-indicator.svelte';
	import { durationToString } from '@/lib/serialize';
	import type { Readable } from 'svelte/store';
	import { Frequency } from '@/lib/course-activities/genericActivity';

	export let addActivityOpen = false;
	export let course: Course;
	export let hoveredActivity = -1;

	let isDanger: Readable<Boolean>;

	$: courseMeta = course.meta;
	$: courseActivities = course.activities;
	$: courseOpenActivity = course.openActivity;
	$: totals = $courseActivities && Course.getTotal($courseActivities);
</script>

<div class="activityList">
	<h2 class="header">
		<span> Activities: </span>
		<button
			class="btn btn-primary add-activity"
			title="Add Activity"
			on:click={() => {
				addActivityOpen = !addActivityOpen;
			}}
		>
			<span class="icon" aria-hidden="false">+</span>
		</button>
	</h2>
	{#if addActivityOpen}
		<AddActivityMenu
			bind:hoveredActivity
			{activities}
			on:add={({ detail }) => {
				course?.addActivity(new detail(course.meta));
				addActivityOpen = false;
			}}
		/>
	{/if}
	{#if $courseActivities.length === 0 && !addActivityOpen}
		<p in:fade class="text-gray-500 text-center italic m-5">
			You don't have any activities in this course yet! Why not <button
				class="italic font-bold underline"
				on:click={() => {
					addActivityOpen = !addActivityOpen;
				}}>add one</button
			>?
		</p>
	{:else}
		<div class="activity-instance-list">
			{#each $courseActivities as activity, i}
				<ActivityListItem
					{activity}
					active={$courseOpenActivity === i}
					on:delete={() => course?.removeActivity(i)}
					on:select={() => {
						if ($courseOpenActivity === i) course.openActivity.set(-1);
						else course.openActivity.set(i);
					}}
				/>
			{/each}
		</div>
		<div class="activity-total-list" class:isDanger={$isDanger}>
			<div
				class="bg-percent-hint"
				style:width="calc(5rem + {$courseMeta.weeks > 0 && $totals.perCourse.total > 0
					? `${
							($totals.perCourse.total /
								($courseMeta.target *
									($courseMeta.targetFreq === Frequency.Weekly ? $courseMeta.weeks : 1))) *
							100
					  }%`
					: '100%'})"
			/>
			<h2>Totals:</h2>
			<p>
				<strong>{durationToString($totals.perCourse.total)}</strong> in course
			</p>
			<p>
				<strong>
					{durationToString($totals.perWeek.total)}
				</strong>
				per week
			</p>
			<div class="m-px">
				<CourseIndicator
					{totals}
					activeCourseMeta={courseMeta}
					options={{
						bottomOfScreen: false,
						background: true
					}}
					bind:isDanger
				/>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.header {
		@apply flex justify-between mr-1 mb-0;
	}

	.activityList {
		@apply flex flex-col h-full gap-4;
		.activity-instance-list {
			@apply grow;
		}
	}

	.activity-total-list {
		@apply relative overflow-clip;
		@apply flex flex-col gap-2;
		/* @apply bg-uni-color-green; */
		@apply border-t-4 border-uni-color-green;
		@apply p-4 -mx-7 -mb-12;
		@apply z-0;
		p {
			@apply leading-none;
		}
		.bg-percent-hint {
			@apply blur-lg bg-uni-color-light-green absolute -inset-10 -z-10 pointer-events-none transition;
		}
		&.isDanger {
			@apply bg-red-100;
			@apply border-uni-color-red;
			.bg-percent-hint {
				@apply bg-red-200;
			}
		}
	}
</style>
