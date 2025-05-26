<script lang="ts">
	import { BarLoader } from 'svelte-loading-spinners';

	import '../app.postcss';
	import { fade, fly, slide } from 'svelte/transition';
	import Check from 'svelte-material-icons/Check.svelte';
	import { courses, activeCourse, exportCourseData } from '../store';
	import Logo from '$lib/assets/logo.svelte';
	import { page } from '$app/stores';
	import { Course } from '$lib/course';
	import { Frequency } from '$lib/course-activities/genericActivity';
	import { writable as storedWritable } from 'svelte-local-storage-store';
	import { base } from '$app/paths';
	import FileUpload from '@/lib/components/file-operations/fileUpload.svelte';
	import { addCourse, deleteCourse, importCourseData, openCourse } from '$lib/../store';


	// This can be false if you're using a fallback (i.e. SPA mode)
	export const prerender = true;
	const resetPrompt = () => {
		if (
			confirm(
				'WARNING: This is for testing purposes. It wipes all data across ALL courses. Are you sure you want to do this? This cannot be undone.'
			)
		) {
			localStorage.clear();
			location.reload();
		}
	};

	$: activeCourseInst = $activeCourse >= 0 ? $courses[$activeCourse] : undefined;
	$: activeCourseMeta = activeCourseInst?.meta;
	$: activeCourseActivities = activeCourseInst?.activities;
	$: totals = $activeCourseActivities && Course.getTotal($activeCourseActivities);

	$: isDanger = (() => {
		if ($totals && $activeCourseMeta) {
			return (
				$totals.perCourse.total >
				$activeCourseMeta.target *
					($activeCourseMeta.targetFreq === Frequency.Weekly ? $activeCourseMeta.weeks : 1)
			);
		}
		return false;
	})();

	const noticeName = 'beta-v1.0.0';
	const showNotice = storedWritable(`showNotice-${noticeName}`, true);

	// const handleFileUpload = (content: string) => {
	// 	console.log('File content:', content);
	//     importCourseData(content); // Handle the uploaded file content
	// };
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.svg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="wrapper">
	<div class="layout">
		<div class="layout grid grid-cols-[450px_1fr] h-screen">
			<div class="flex min-h-screen">
				<!-- Left Panel -->
				<aside
					class="left-panel aside-gradient bg-green-900 text-white p-6 flex flex-col justify-between"
				>
					<!-- Logo + Title -->
					<div>
						<img src="{base}/Learning and TDT - logo.svg" alt="Logo" class="mb-10 mt-4" />
						<h1 class="text-5xl font-bold">Student Workload Calculator</h1>
					</div>
					<!-- Illustration -->
					<img
						src="{base}/calculator_logo.svg"
						alt="Calculator Illustration"
						class="self-center mt-40"
					/>
					<div>
						Created by <a
							href="https://uoaprod.service-now.com/sp?id=sc_cat_item&table=sc_cat_item&sys_id=ce73ca981bfb65147f9952c91d4bcb32"
							target="_blank"
							rel="noopener noreferrer">Ranga Auaha Ako</a
						>
					</div>
				</aside>
			</div>

			<!-- Right Panel -->
			<main class="right-panel bg-white p-10 flex flex-col justify-between">
				<!-- Dashboard Header and Description -->
				<section>
					<h2 class="text-3xl font-bold text-green-800 mb-4">Dashboard</h2>

					<p class="text-gray-600 mb-6">
						<slot />
					</p>

					<!-- <div class="flex w-full justify-center mb-10 mt-20">
					<div class="flex w-full max-w-full items-center px-4">
						<div class="flex-grow border-t border-gray-300"></div>
						<span class="mx-4 text-sm text-gray-500">or</span>
						<div class="flex-grow border-t border-gray-300"></div>
					</div>
				</div>



				<div class="border-2 border-dashed border-green-400 p-10 text-center">
					<p>Upload a workload <strong>calculator file</strong></p>
					<div class="mt-4">
					<FileUpload onFileUpload={handleFileUpload} />
					
					</div>
					<p class="text-xs text-gray-500 mt-2">Supported file format: CSV. Max size: 20MB</p>
				</div> -->
				</section>

				<!-- Bottom Buttons -->
				<!-- <div class="flex justify-between mt-10">
				<button class="text-gray-500">Cancel</button>
				<div class="reset-data flex gap-4">
					<button class=" bg-white border border-green-600 text-green-600 px-4 py-2 rounded" on:click={() => resetPrompt()}>Reset Data</button>
					<button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded" on:click={() => exportCourseData()}>Export Data</button>
				</div>
				</div> -->
			</main>
		</div>
		<!-- <div class="footer-push" /> -->
	</div>
	{#if $page.url.pathname.startsWith('/student-workload-calculator/courses')}
			<div class="floating-buttons">
				<div
					class="reset-button  bg-white border border-green-600 text-green-600 px-4 py-2 rounded"
				>
					<button class="text-uni-color-light-white" on:click={() => resetPrompt()}
						>Reset Data</button
					>
				</div>
				<div class="export-button bg-green-700 hover:bg-green-700 text-white-900 px-6 py-2 rounded">
					<button on:click={() => exportCourseData()}>Export Data</button>
				</div>
			</div>
		{/if}
	<!-- <div class="reset-data  bg-white border border-green-600 text-green-600 px-4 py-2 rounded">
			<button  class="text-uni-color-light-white"  on:click={() => resetPrompt()}>Reset Data</button>
		</div>
		<div class="export-data bg-green-700 hover:bg-green-700 text-white-900 px-6 py-2 rounded">
				<button on:click={() => exportCourseData()}>Export Data</button>
			</div> -->
	<!-- <div class="send-info">
			Created by <a
				href="https://uoaprod.service-now.com/sp?id=sc_cat_item&table=sc_cat_item&sys_id=ce73ca981bfb65147f9952c91d4bcb32"
				>Ranga Auaha Ako</a
			>
		</div> -->
	<!-- <footer class="footer">
		{#if $page.url.pathname.startsWith('/courses')}
			<div class="floating-buttons">
				<div
					class="reset-data  bg-white border border-green-600 text-green-600 px-4 py-2 rounded"
				>
					<button class="text-uni-color-light-white" on:click={() => resetPrompt()}
						>Reset Data</button
					>
				</div>
				<div class="export-data bg-green-700 hover:bg-green-700 text-white-900 px-6 py-2 rounded">
					<button on:click={() => exportCourseData()}>Export Data</button>
				</div>
			</div>
		{/if}
	</footer> -->
</div>

<style lang="postcss">
	/* .layout {
		@apply grid gap-5 -mb-24 min-h-screen;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			'header'
			'page'
			'footer';
		display: flex; 
		width: 100%; 
	} */

	.layout {
		display: flex;
		flex: 1;
		flex-direction: row; /* Default: Left and right panels side by side */
		width: 100%; /* Full width of the container */
	}

	.wrapper {
		display: flex;
		flex-direction: column; /* Stack panels vertically on smaller screens */
		min-height: 100vh;
	}

	.left-panel {
		flex: none; /* Prevent the left panel from resizing */
		width: 100%; /* Fixed width for the left panel */
		max-width: 450px; /* Optional: Set a maximum width */
		min-width: 180px; /* Optional: Set a minimum width */
		background: linear-gradient(135deg, #002f09, #2e4632, #6dff88); /* Gradient background */
		color: white; /* Text color */
		padding: 1rem; /* Add padding */
		display: flex;
		flex-direction: column;
		justify-content: space-between; /* Space out the content vertically */
		overflow-y: auto;
	}

	.right-panel {
		flex: 1; /* Allow the right panel to grow and shrink */
		background-color: white; /* Background color for the right panel */
		padding: 2rem; /* Add padding */
		display: flex;
		flex-direction: column;
		justify-content: flex-start; /* Align content to the top */
	}

	header {
		@apply flex gap-5 m-5 mb-0;
		grid-area: header;
		justify-content: center;
		flex-wrap: wrap;
		& > :global(svg) {
			@apply w-32 h-32;
		}
		h1 {
			@apply text-5xl leading-none font-light font-display italic;
			align-self: center;
		}
		.notice-wrapper {
			@apply w-full flex flex-wrap flex-col align-middle items-center;
			.notice {
				@apply text-center mt-5 rounded shadow bg-uni-color-light-orange;
				.notice-header {
					@apply px-6 py-4 text-2xl font-bold w-full block;
				}
				.note {
					@apply px-6 py-4;
					a {
						@apply underline text-uni-color-dark-orange font-bold;
					}
				}
				.action {
					@apply flex justify-center mt-4;
					button {
						@apply w-full rounded-t-none hover:scale-100 hover:opacity-80;
					}
				}
			}
		}

		@media screen and (max-width: 640px) {
			& {
				@apply h-auto;
			}
			& > :global(svg) {
				@apply w-24 h-24;
			}
			h1 {
				@apply text-3xl hidden;
			}
		}
		@media screen and (max-width: 280px) {
			& > :global(svg) {
				@apply hidden;
			}
			h1 {
				@apply text-xl text-center;
			}
		}

		@media screen and (max-width: 768px) {
			.layout {
				flex-direction: column; /* Stack panels vertically */
			}

			.left-panel {
				width: 100%; /* Full width for the left panel */
				max-width: none; /* Remove max-width restriction */
				padding: 1rem; /* Adjust padding */
			}

			.right-panel {
				padding: 1rem; /* Reduce padding for smaller screens */
			}
		}

		@media screen and (max-width: 480px) {
			.left-panel {
				padding: 0.5rem; /* Further reduce padding */
			}

			.right-panel {
				padding: 0.5rem; /* Further reduce padding */
			}

			.create-course-button {
				font-size: 1rem; /* Reduce button font size */
				padding: 0.8rem 1.5rem; /* Adjust button padding */
			}

			.text-5xl {
				font-size: 2rem; /* Reduce title font size */
			}
		}
	}
	.page {
		grid-area: page;
		height: 100%;
		@apply max-w-screen-xl w-full m-auto px-4;
	}

	.footer-push,
	.footer {
		@apply h-10;
	}

	.footer {
		@apply fixed bottom-0 flex justify-end p-5 pt-0 w-full h-12 items-end gap-4;
		.reset-data button {
			@apply text-red-700;
			@apply border-b border-dashed leading-4;
		}
		.export-data button {
			@apply text-white font-semibold;
		}
	}

	.divider-with-text {
		@apply flex w-full justify-center;

		.divider-inner {
			@apply flex w-full max-w-full items-center px-4;

			.line {
				@apply flex-grow border-t border-gray-300;
			}

			.text {
				@apply mx-4 text-sm text-gray-500;
			}
		}
	}

	.aside-gradient {
		background: linear-gradient(
			135deg,
			#002f09,
			#2e4632,
			#6dff88
		); /* Gradient from dark green to light green */
		color: white; /* Ensure text remains readable */
	}

	.aside-gradient a {
		color: #d1fae5; /* Light green for links */
		text-decoration: underline;
		pointer-events: auto; /* Ensure the link is clickable */
		visibility: visible; /* Ensure the link is visible */
		z-index: 10; /* Ensure it is above other elements */
	}

	.aside-gradient a:hover {
		color: #a7f3d0; /* Slightly lighter green on hover */
	}

	.create-course-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		margin: 2rem auto;
		max-width: 100%;
		text-align: center;
	}

	.create-course-button {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-size: 1.2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: background-color 0.3s ease;
	}

	.create-course-button:hover {
		background-color: #45a049;
	}

	.icon-text {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.footer {
		background-color: #f8f9fa; /* Light background for the footer */
		padding: 1rem 2rem; /* Add padding around the footer */
		text-align: right; /* Center-align footer content */
		border-top: 2px solid #ddd; /* Optional: Add a border at the top */
		display: flex;
		justify-content: flex-end; /* Center the buttons horizontally */
		align-items: center; /* Align buttons vertically */
		gap: 1rem; /* Add spacing between buttons */
	}

	.footer-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 1rem; /* Add spacing between the buttons */
	}

	.reset-button,
	.export-button {
		background-color: #4caf50; /* Green background */
		color: white; /* White text */
		border: none; /* Remove default border */
		padding: 0.8rem 1.5rem; /* Add padding for consistent button size */
		border-radius: 8px; /* Rounded corners */
		font-size: 1rem; /* Adjust font size */
		cursor: pointer; /* Pointer cursor on hover */
		transition: background-color 0.3s ease; /* Smooth hover effect */
	}

	.reset-button:hover {
		background-color: #e57373; /* Light red for reset button hover */
	}

	.export-button:hover {
		background-color: #45a049; /* Darker green for export button hover */
	}
	.floating-buttons {
    position: fixed;
    bottom: 2rem;   /* Distance from the bottom of the viewport */
    right: 2rem;    /* Distance from the right of the viewport */
    display: flex;
    gap: 1rem;
    z-index: 1000;  /* Make sure it stays above other content */
}

.reset-button,
.export-button {
    background-color: #18afd4;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.reset-button:hover {
    background-color: #e57373;
}

.export-button:hover {
    background-color: #45a049;
}
</style>
