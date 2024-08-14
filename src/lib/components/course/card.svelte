<script lang="ts">
	import autoAnimate from '$lib/autoAnimate';
	import ArrowRight from 'svelte-material-icons/ArrowRight.svelte';
	import ArrowLeft from 'svelte-material-icons/ArrowLeft.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import Download from 'svelte-material-icons/Download.svelte';
	import TableArrowDown from 'svelte-material-icons/TableArrowDown.svelte';
	import FileExportOutline from 'svelte-material-icons/FileExportOutline.svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import { Course, downloadJSON, downloadCSV, getCourseData, type courseMeta } from '$lib/course';
	import type { Activity } from '$lib/course-activities/genericActivity';
	import type { Readable } from 'svelte/store';
	import Duration from './stats/duration.svelte';
	import Time from './stats/time.svelte';
	import Total from './stats/total.svelte';
	import { cardState } from './card';
	import {
		activeCourse,
		addCourse,
		deleteCourse,
		exportCourseData,
		importCourseData,
		openCourse
	} from '$lib/../store';
	import CardHeader from './cardHeader.svelte';
	import ManageActivities from '../add-activity/manageActivities.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	export let course: Course | undefined = undefined;
	export let courseIndex: number | undefined = undefined;
	export let state: cardState = course ? cardState.view : cardState.blank;

	let isEditing = false;

	$: meta = course?.meta;
	$: activities = course?.activities;
	$: totals = $activities && Course.getTotal($activities);

	$: data = getCourseData(course, $meta, $activities, $totals);

	const createCourse = () => {
		course = new Course('Your Course', 12);
		state = cardState.create;
	};

	const handleFileUpload = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (!target.files?.length) return;
		const file = target.files[0];
		const content = await file.text();
		importCourseData(content);
		target.value = '';
	};
</script>

<div
	class="uni-card"
	class:createCard={!data.course}
	class:expand={state === cardState.editExpanded}
	class:create={state === cardState.create}
	class:edit={state === cardState.edit}
	use:autoAnimate
>
	{#if data.course}
		<CardHeader course={data.course} bind:state />
		{#if state !== cardState.edit}
			<div class="stats">
				<Duration course={data.course} bind:state />
				<Time course={data.course} bind:state />
				{#if state === cardState.view}
					<Total course={data.course} />
				{/if}
			</div>
		{/if}
		{#if state === cardState.editExpanded}
			<button
				aria-label="Close Overlay"
				class="expanded-overlay"
				on:click={() => {
					state = cardState.edit;
				}}
			/>
		{/if}
		{#if state === cardState.edit || state === cardState.editExpanded}
			<div class="body">
				<ManageActivities course={data.course} />
			</div>
		{/if}
		<div class="footer">
			{#if state === cardState.view}
				<div class="group flex">
					<button
						class="btn btn-md btn-text btn-icon"
						on:click={() => {
							isEditing = true;
							state = cardState.create;
						}}
					>
						<div class="icon">
							<Pencil />
						</div>
						Edit
					</button>
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
				</div>
				<button
					class="btn btn-md btn-text btn-icon"
					on:click={() => {
						confirm(`Are you sure you want to delete this course ("${$meta?.name}")?`) &&
							courseIndex !== undefined &&
							deleteCourse(courseIndex);
					}}
				>
					<div class="icon">
						<Delete />
					</div>
					Delete
				</button>
			{:else if state === cardState.create}
				<button
					class="btn btn-md btn-primary btn-icon"
					on:click={() => {
						if (!isEditing) {
							console.log('add course', course);
							course && addCourse(course);
						} else {
							if (courseIndex !== undefined) $activeCourse = courseIndex;
						}
						goto(base + '/');
						isEditing = false;
					}}
				>
					<div class="icon">
						<ArrowRight />
					</div>
					Continue
				</button>
				<button
					class="btn btn-md btn-text btn-icon"
					on:click={() => {
						if (isEditing) {
							state = cardState.view;
							isEditing = false;
						} else {
							course = undefined;
							state = cardState.blank;
						}
					}}
				>
					<div class="icon">
						<Close />
					</div>
					{#if isEditing}
						Close
					{:else}
						Cancel
					{/if}
				</button>
			{:else if state == cardState.edit || state === cardState.editExpanded}
				<div class="group flex">
					<button
						class="btn btn-text btn-icon"
						on:click={() => {
							if (!data.course) return;
							downloadJSON(data.activities, data.meta.name);
						}}
					>
						<div class="icon">
							<Download />
						</div>
						Download (JSON)
					</button>
					<button
						class="btn btn-text btn-icon"
						on:click={() => {
							if (!data.course) return;
							downloadCSV(data.activities, data.meta.name);
						}}
					>
						<div class="icon">
							<TableArrowDown />
						</div>
						Download (CSV)
					</button>
					<button
						class="btn btn-text btn-icon"
						on:click={() => {
							if (!data.course || courseIndex === undefined) return;
							exportCourseData(courseIndex);
						}}
					>
						<div class="icon">
							<FileExportOutline />
						</div>
						Export
					</button>
				</div>
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
			<p>
				Or <label class="link">
					upload a Workload Calculator file
					<input
						class="hidden"
						type="file"
						accept="application/json"
						on:change={handleFileUpload}
					/>
				</label>
			</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	.uni-card {
		--card-padding: theme('spacing.7');
		@apply px-0 py-0 m-0 grow flex flex-col relative;
		@apply transition;
		.stats {
			@apply flex flex-col justify-between gap-2 relative z-30 bg-white transition;
			padding: 0 var(--card-padding);
			transition-property: padding;
		}

		&.edit,
		&.expand {
			@apply border-t-0;
		}

		&.edit .stats,
		&.expand .stats,
		&.create .stats {
			@apply px-0;
		}
		&.expand {
			.stats {
				@apply shadow-lg pb-4 mb-4;
			}
			.expanded-overlay {
				@apply absolute inset-0 bg-black opacity-50 z-20;
			}
		}

		.body {
			padding: 0 var(--card-padding);
			@apply mt-4 mb-8 grow relative;
		}

		.footer {
			@apply flex justify-between flex-row-reverse gap-2 mt-4 h-9;
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
					@apply text-uni-blue underline underline-offset-2 cursor-pointer;
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
