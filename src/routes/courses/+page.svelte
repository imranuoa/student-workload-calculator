<script lang="ts">
	import { Course } from '$lib/course';
	import { courses, addCourse, exportCourseData, importCourseData } from '$lib/../store';
	import CourseCard from '$lib/components/course/card.svelte';
	import { cardState } from '$lib/components/course/card';
	import FileUpload from '@/lib/components/file-operations/fileUpload.svelte';
	

	let editingCourse = 0;

	const newCourseData = {
		name: 'Your Course',
		weeks: 12
	};

	const handleFileUpload = (content: string) => {
		console.log('File content:', content);
        importCourseData(content); // Handle the uploaded file content
    };
</script>

<svelte:head>
	<title>Student Workload Calculator: Configure Courses</title>
</svelte:head>

{#if $courses.length > 0}
	<div class="courses">
		<!-- <h2 class="text-2xl mb-4">Student Workload Calculator Dashboard</h2> -->
		<div class="editPane-items">
			{#each $courses as course, courseIndex (course.id)}
				<CourseCard {course} {courseIndex} />
			{/each}
			<CourseCard state={cardState.blank} />
		</div>
	</div>
{:else}
	<div class="empty">
		<div class="onboarding">
			<!--<h2 class="uni-header">Student Workload Calculator Dashboard</h2>-->
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
			<CourseCard state={cardState.blank} />
		</div>
		<!-- <div class="">
			<CourseCard state={cardState.blank} />
		</div> -->


		<div class="flex w-full justify-center mb-2 mt-2">
					<div class="flex w-full max-w-full items-center px-4">
						<div class="flex-grow border-t border-gray-300"></div>
						<span class="mx-4 text-sm text-gray-500">or</span>
						<div class="flex-grow border-t border-gray-300"></div>
					</div>
				</div>

				<div class="create-course-container">
					<div class="">
					<p>Upload a workload <strong>calculator file</strong></p>
					<div class="mt-4">
					<FileUpload onFileUpload={handleFileUpload} />
					
					</div>
					<p class="text-xs text-gray-500 mt-2">Supported file format: CSV. Max size: 20MB</p>
				</div>
				</div>

				
				

	</div>
{/if}

<style lang="postcss">
	.courses {
		@apply w-full;

		h2 {
			@apply text-3xl;
		}
		.editPane-items {
			@apply gap-8 grid grid-cols-3  items-center md:items-start;
			@media screen and (min-width: 768px) and (max-width: 1100px) {
				@apply grid-cols-2;
			}
			@media screen and (max-width: 768px) {
				@apply grid-cols-1;
			}
		}
	}
	.empty {
		@apply flex flex-row flex-wrap justify-center items-center content-start gap-10 pt-5;
		.onboarding {
			@apply w-96 max-w-screen-sm;
			@apply grow self-start;
			h2 {
				@apply text-3xl;
			}
			p {
				@apply mb-4;
			}
		}
		.create-block {
			@apply w-full max-w-md;
		}
	}

	/* Container for the create course section */
.create-course-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 30rem 3rem 30rem;
        background-color: #f9f9f9;
        border: 2px dashed #4caf50;
        border-radius: 8px;
        margin: 2rem auto;
        max-width: 1200px;
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
        align-items: center;
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
