<script lang="ts">
	import { Course } from '$lib/course';
	import { courses, addCourse, exportCourseData, importCourseData } from '$lib/../store';
	import CourseCard from '$lib/components/course/card.svelte';
	import { cardState } from '$lib/components/course/card';

	let editingCourse = 0;

	const newCourseData = {
		name: 'Your Course',
		weeks: 12
	};
</script>

<svelte:head>
	<title>Student Workload Calculator: Configure Courses</title>
</svelte:head>

{#if $courses.length > 0}
	<div class="courses">
		<h2 class="text-2xl mb-4">Student Workload Calculator Dashboard</h2>
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
			<h2 class="uni-header">Student Workload Calculator Dashboard</h2>
			<!-- <p>
				This planning tool is for instructors who wish to estimate the expected student time
				commitment in a course based on the assigned learning activities. The tool is designed to be
				used for courses that represent the blended learning spectrum from face-to-face to fully
				online. Based on the input provided, the tool calculates the total time commitment expected,
				and allocates activities into scheduled (set by the institution, typically live meetings)
				and independent (at the discretion of the student within the parameters set by course
				deadlines) activities.
			</p> -->
			<p>
				When you are ready to get started, use the “Create Course” button to begin estimating your
				course workload.
			</p>
		</div>
		<div class="create-block">
			<CourseCard state={cardState.blank} />
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
</style>
