<script lang="ts">
	// Import core store and components
	import { courses, importCourseData } from '$lib/../store';
	import CourseCard from '$lib/components/course/card.svelte';
	import { cardState } from '$lib/components/course/card';
	import FileUpload from '@/lib/components/file-operations/fileUpload.svelte';

	// Handle file upload event from FileUpload component
	const handleFileUpload = (content: string) => {
		importCourseData(content);
	};
</script>

<svelte:head>
	<title>Student Workload Calculator: Configure Courses</title>
</svelte:head>

{#if $courses.length > 0}
	<!-- Show course cards if courses exist -->
	<div class="courses">
		<div class="editPane-items">
			{#each $courses as course, courseIndex (course.id)}
				<CourseCard {course} {courseIndex} />
			{/each}
			<!-- Blank card for adding a new course -->
			<CourseCard state={cardState.blank} />
		</div>
	</div>
{:else}
	<!-- Onboarding and file upload UI if no courses exist -->
	<div class="empty">
		<div class="onboarding">
			<!-- Onboarding instructions for new users -->
			<p>
				This planning tool is for instructors who wish to estimate the expected student time
				commitment in a course based on the assigned learning activities. The tool is designed to be
				used for courses that represent the blended learning spectrum from face-to-face to fully
				online. Based on the input provided, the tool calculates the total time commitment expected,
				and allocates activities into scheduled (set by the institution, typically live meetings)
				and independent (at the discretion of the student within the parameters set by course
				deadlines) activities.
			</p>
			<p>
				When you are ready to get started, use the “Create Course” button to begin estimating your
				course workload.
			</p>
			<!-- Blank card for creating the first course -->
			<CourseCard state={cardState.blank} />
		</div>

		<!-- Divider with "or" text for visual separation -->
		<div class="flex w-full justify-center mb-2 mt-2">
			<div class="flex w-full max-w-full items-center px-4">
				<div class="flex-grow border-t border-gray-300" />
				<span class="mx-4 text-sm text-gray-500">or</span>
				<div class="flex-grow border-t border-gray-300" />
			</div>
		</div>

		<!-- File upload section for importing course data -->
		<div class="create-course-container">
			<p>Upload a workload <strong>calculator file</strong></p>
			<div class="mt-4">
				<FileUpload onFileUpload={handleFileUpload} />
			</div>
			<p class="text-xs text-gray-500 mt-2">Supported file format: CSV. Max size: 20MB</p>
		</div>
	</div>
{/if}

<style lang="postcss">
	/* Main courses container and grid for course cards */
	.courses {
		@apply w-full;
		.editPane-items {
			@apply gap-8 grid grid-cols-3 items-center md:items-start;
			/* Responsive grid for course cards */
			@media screen and (min-width: 768px) and (max-width: 1100px) {
				@apply grid-cols-2;
			}
			@media screen and (max-width: 768px) {
				@apply grid-cols-1;
			}
		}
	}

	/* Empty state container for onboarding and upload */
	.empty {
		@apply flex flex-row flex-wrap justify-center items-center content-start gap-10 pt-5;
		.onboarding {
			@apply w-96 max-w-screen-sm grow self-start;
			p {
				@apply mb-4;
			}
		}
	}

	/* Container for the create course/upload section
   Large paddings are preserved for desktop, responsive for smaller screens */
	.create-course-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 30rem 3rem 30rem; /* Large horizontal padding for desktop */
		background-color: #f9f9f9;
		border: 2px dashed #4caf50;
		border-radius: 8px;
		margin: 2rem auto;
		max-width: 1200px;
		text-align: center;
	}
	@media (max-width: 1200px) {
		.create-course-container {
			padding: 3rem 4rem;
		}
	}
	@media (max-width: 768px) {
		.create-course-container {
			padding: 2rem 1rem;
		}
	}

	/* Button for creating a course (if used elsewhere) */
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

	/* Icon and text alignment utility */
	.icon-text {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* File upload section styles */
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
