<script lang="ts">
	import AddActivityMenu from '$lib/add-activity/addActivity.svelte';
	import type { Course } from '$lib/course';
	import { activities } from '$lib/activities';
	import { fade } from 'svelte/transition';
	import ActivityListItem from './activityListItem.svelte';

	export let addActivityOpen = false;
	export let course: Course;

	$: courseMeta = course.meta;
	$: courseActivities = course.activities;
	$: courseOpenActivity = course.openActivity;
</script>

<div class="activityList">
	<h2>
		<span> Activities: </span>
		<button
			class="btn add-activity"
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
			{activities}
			on:add={({ detail }) => {
				course?.addActivity(new detail(course.meta));
				addActivityOpen = false;
			}}
		/>
	{/if}
	{#if $courseActivities.length === 0 && !addActivityOpen}
		<p in:fade class="text-gray-500 text-center italic m-5">
			You don't have any activities to this course yet! Why not <button
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
	{/if}
</div>

<style lang="postcss">
</style>
