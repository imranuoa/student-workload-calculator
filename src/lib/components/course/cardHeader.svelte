<script lang="ts">
	import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';
	import RangeInput from '$lib/components/form-elems/rangeInput.svelte';
	import { Course, getCourseData, type courseData, type courseDataValid } from '$lib/course';
	import { propertyStore } from 'svelte-writable-derived';
	import { cardState } from './card';
	import autoAnimate from '$lib/autoAnimate';
	import { error } from '@sveltejs/kit';
	import AlertCircle from 'svelte-material-icons/AlertCircle.svelte';
	import { base } from '$app/paths';

	export let course: Course;
	export let state: cardState;
	export let errorMessage: string = '';

	$: meta = course?.meta;
	$: activities = course?.activities;
	$: totals = $activities && Course.getTotal($activities);

	$: writableWeeks = propertyStore(meta, ['weeks']);
	$: writableTarget = propertyStore(meta, ['target']);
	$: writableTargetFreq = propertyStore(meta, ['targetFreq']);
	$: writableWeekTemplate = propertyStore(meta, ['weekTemplate']);

	const toggleState = (e: MouseEvent) => {
		if (state === cardState.editExpanded) {
			state = cardState.edit;
		} else if (state === cardState.edit) {
			state = cardState.editExpanded;
		}
		e.stopPropagation();
		return false;
	};

	console.log(errorMessage);
</script>

<div class="header-block">
	<div class="header-row">
		<img src="{base}/calculator_logo.svg" alt="Logo" class="logo" />
		<h1 class="title">Student Workload Calculator</h1>
	</div>

	<div class="header-content">
		<!-- <h1 class="title">Student Workload Calculator</h1> -->
		{#if state === cardState.view}
			<label class="coursename" for="courseEdit-{course.id}-courseName">
				<div class="input-wrapper">
					<span class="prefix">Course:</span>
					<input
						type="text"
						bind:value={$meta.name}
						id="courseEdit-{course.id}-courseName"
						placeholder="Enter course name"
					/>
				</div>
			</label>
		{:else}
			<!-- svelte-ignore a11y-click-events-have-key-events -->

			<div
				class="course-row"
				class:cursor-pointer={state === cardState.edit}
				use:autoAnimate
				on:click={(e) => {
					if (state === cardState.edit) toggleState(e);
				}}
			>
				{#if state === cardState.editExpanded || state === cardState.create}
					<label class="coursename" for="courseEdit-{course.id}-courseName">
						<div class="input-wrapper">
							<span class="prefix">Course:</span>
							<input
								type="text"
								bind:value={$meta.name}
								id="courseEdit-{course.id}-courseName"
								placeholder="Enter course name"
							/>
						</div>
					</label>
				{:else}
					<h3 class="title">{$meta.name}</h3>
				{/if}

				{#if state !== cardState.create}
					<button
						class="edit-button"
						class:expanded={state === cardState.editExpanded}
						on:click={(e) => {
							toggleState(e);
						}}
						title={state === cardState.editExpanded ? 'Collapse' : 'Expand'}
					>
						{#if state === cardState.editExpanded}
							<span class="icon">❌</span>
							<span>Close</span>
						{:else}
							<!-- <span class="icon">📝</span>
							<span>Edit</span> -->
							<span class="icon" aria-hidden="true">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <!-- Notebook -->
    <rect x="3" y="4" width="14" height="16" rx="2" fill="#fff" stroke="#4caf50"/>
    <line x1="7" y1="8" x2="15" y2="8" stroke="#4caf50"/>
    <line x1="7" y1="12" x2="15" y2="12" stroke="#4caf50"/>
    <line x1="7" y1="16" x2="13" y2="16" stroke="#4caf50"/>
    <!-- Pencil -->
    <path d="M16.5 7.5l4 4-7 7H9.5v-4.5l7-7z" fill="#ffc107" stroke="#ff9800"/>
    <path d="M18.5 9.5l-2-2" stroke="#ff9800"/>
  </svg>
							</span>
							<span>Edit</span>
						{/if}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.header-block {
		@apply bg-green-900 w-full text-white font-bold z-30 relative; /* Add rounded corners */
		display: grid; /* Use grid layout */
		grid-template-rows: 30% 70%; /* 20% for logo, 1fr for content, auto for button */
		align-items: center; /* Vertically align items */
		gap: 0.5rem; /* Add spacing between columns */
		/* Add padding around the block */
		border-radius: 10px 10px 0 0;
		background: radial-gradient(
			ellipse farthest-corner at 100% 100%,
			#6dff88 0%,
			#2e4632 60%,
			#002f09 100%
		);
	}

	.logo {
		width: 80px; /* Set a fixed width for the logo */
		height: auto; /* Maintain aspect ratio */
		display: block; /* Ensure the logo is treated as a block element */
	}

	.header-content {
		display: flex;
		flex-direction: column; /* Stack title and course info vertically */
		gap: 0.5rem; /* Add spacing between elements */
	}

	.course-row {
		display: flex; /* Use flexbox for alignment */
		justify-content: space-between; /* Align course name to the left and button to the right */
		align-items: center; /* Vertically align items */
		gap: 0.5rem;
		width: 100%; /* Ensure the row spans the full width */
	}

	.header-row {
		display: flex;
		align-items: center;
		gap: 1rem; /* space between logo and title */
		margin-top: 2rem;
	}

	.input-wrapper {
		flex: 1; /* Allow the input field to take up the remaining space */
		display: flex;
		align-items: center;
		gap: 0.5rem; /* Add spacing between the prefix and input */
	}

	.title {
		font-size: 1.5rem; /* Adjust font size */
		font-weight: bold; /* Make the title bold */
		margin: 0; /* Remove default margin */
	}

	.course-info {
		display: flex;
		align-items: center; /* Align text vertically */
		gap: 0.5rem; /* Add spacing between prefix and course name */
	}

	.prefix {
		/* font-style: italic;  */
		opacity: 1; /* Slightly reduce opacity */
	}

	.course-name {
		font-weight: bold; /* Make the course name bold */
	}

	.edit-button {
		margin-left: 0.5rem;
		font-size: 0.8rem; /* Reduce the font size of the button text */
		padding: 0.1rem 0.3rem; /* Adjust padding for a smaller button */
		/* gap: 0.1rem;  */
		background-color: #fff; /* Keep the white background */
		color: #4caf50; /* Adjust text color */
		border: 1px solid #ccc; /* Add a light border */
		border-radius: 4px; /* Keep rounded corners */
		display: flex;
		align-items: center;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.edit-button:hover {
		background-color: #274b30; /* Lighten the background on hover */
		color: #fff;
	}

	.edit-button svg {
		width: 20px;
		height: 20px;
	}

	.header-text {
		padding: 0 var(--card-padding);
		@apply pt-4;
		.uni-header {
			@apply text-2xl font-semibold font-display italic;
			&:after {
				@apply w-3/5;
			}
		}
	}
	.header-block {
		/* @apply bg-green-900  w-full text-white text-left font-bold flex flex-col items-center gap-3 z-30 relative; */
		padding: 0 var(--card-padding);
		@apply py-4;
		.error {
			@apply text-red-300 text-lg;
		}
		.title {
			@apply w-full m-0 text-2xl font-semibold font-display;
		}
		/* .coursename {
			@apply text-2xl font-semibold font-display flex flex-col items-center gap-2 border-b-2 border-gray-200;
			.prefix {
				@apply block opacity-50 flex flex-row;
			}
			input {
				@apply flex-grow border-0 p-0 px-2 text-2xl bg-white bg-opacity-30  placeholder-white placeholder-opacity-50 w-full rounded focus:ring-0 transition focus:bg-opacity-0 focus:placeholder-transparent;
			}


			@apply text-2xl font-semibold font-display  flex items-center gap-2;

			.input-wrapper {
				@apply flex   pb-1;
			}
		} */

		.header-toggle {
			@apply text-3xl transition transform;
			&.expanded {
				@apply rotate-180;
			}
		}
	}

	.coursename {
		font-size: 0.9rem; /* Reduce the font size of the label */
		font-weight: normal; /* Adjust the font weight */
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.coursename .prefix {
		font-size: 1rem; /* Reduce the font size of the "Course:" prefix */
		opacity: 0.8; /* Slightly reduce opacity for a lighter look */
	}

	.coursename input {
		flex: 1;
		background-color: rgba(
			197,
			228,
			172,
			0.9
		); /* Add a solid white background with slight transparency */
		color: #000; /* Set text color to black for better contrast */
		border: 1px solid #ccc; /* Add a light gray border */
		padding: 0.5rem; /* Add padding for better spacing */
		border-radius: 4px; /* Add rounded corners */
		font-size: 0.9rem; /* Adjust font size */
		width: 100%; /* Ensure the input takes the full width */
		transition: background-color 0.3s ease, border-color 0.3s ease; /* Add smooth transitions */
	}

	.coursename input:focus {
		background-color: #fff; /* Make the background fully white on focus */
		border-color: #4caf50; /* Highlight the border with a green color on focus */
		outline: none; /* Remove the default outline */
	}

	.coursename input::placeholder {
		color: #888; /* Set placeholder text color */
		opacity: 1; /* Ensure the placeholder is fully visible */
	}
</style>
