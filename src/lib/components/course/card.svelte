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
	import Creation from 'svelte-material-icons/Creation.svelte';
	import Upload from 'svelte-material-icons/Upload.svelte';
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
	$: errorMessage = '';

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

	//Course name validation

	const validateCourseName = (name: string): boolean => {
		if (name === 'Your Course' || name.trim() === '') {
			errorMessage = 'Please enter the course name.';
			return false;
		} else if (name.length < 5) {
			errorMessage = 'The course name must be at least 5 characters long.';
			return false;
		} else {
			errorMessage = '';
			return true;
		}
	};
</script>

{#if data.course}
	<div
		class="uni-card"
		class:createCard={!data.course}
		class:expand={state === cardState.editExpanded}
		class:create={state === cardState.create}
		class:edit={state === cardState.edit}
		use:autoAnimate
	>
		<CardHeader course={data.course} bind:state {errorMessage} />
		<!-- state is {cardState[state]} -->
		{#if state === cardState.editExpanded}
			<div class="header">
				<button
					class="btn btn-text btn-icon"
					on:click={() => {
						state = cardState.view;
					}}
				>
					<div class="icon">
						<ArrowLeft />
					</div>
					Back
				</button>
			</div>
		{/if}
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
				<!-- Display error message if it exists -->

				<button
					class="btn btn-md btn-primary btn-icon"
					on:click={() => {
						if (validateCourseName($meta.name)) {
							if (!isEditing) {
								console.log('add course', course);
								course && addCourse(course);
							} else {
								if (courseIndex !== undefined) $activeCourse = courseIndex;
							}
							goto(base + '/');
							isEditing = false;
						}
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
	</div>
{:else}
	<div class="create-course-container">
		<button
			class="create-course-button"
			on:click={() => {
				createCourse();
			}}
		>
			<div class="icon-text">
				<h3><Creation /></h3>
				<p>Create course</p>
			</div>
		</button>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<!--
			<div class="icon-text">
			<p>Or</p>
			<Upload  />
			<p>
				 <label class="link">
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
		-->
	</div>
{/if}

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
		/*@apply uni-card;*/
		/*@apply shadow-none border-dashed border-2 border-uni-color-green border-opacity-100;*/
		@apply shadow-none;
		padding: 0 var(--card-padding);
		@apply w-full max-w-sm max-h-full h-72 flex flex-col items-center justify-center;
	}

	.icon-text {
		display: flex;
		align-items: center;
		gap: 0.5rem; /* Adjust the gap between the icon and the text as needed */
	}

	/* Create course custome styles */
	/* Container for the create course section */
	.create-course-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		/* background-color: #f9f9f9;
        border: 2px dashed #4caf50;
        border-radius: 8px; */
		margin: 2rem auto;
		max-width: 100%;
		text-align: center;
	}

	/* Button for creating a course */
	.create-course-button {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-size: 1.2rem;
		cursor: pointer;
		display: flex;
		align-items: right;
		gap: 0.5rem;
		transition: background-color 0.3s ease;
	}

	.create-course-button:hover {
		background-color: #45a049;
	}

	/* Icon and text alignment */
	.icon-text {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* File upload section */
	.file-upload {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: #555;
	}

	.file-upload-label {
		color: #4caf50;
		text-decoration: underline;
		cursor: pointer;
	}

	.file-input {
		display: none; /* Hide the file input */
	}
</style>
