<script lang="ts">
	import { Course } from '$lib/course';
	import { courses, addCourse, exportCourseData, importCourseData } from '../../store';
	import CourseEditCard from '$lib/components/add-course/courseEditCard.svelte';

	let editingCourse = 0;

	const newCourseData = {
		name: 'Your Course',
		weeks: 12
	};

	const findImport = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = false;
		input.accept = 'application/json';
		input.onchange = async () => {
			if (!input.files?.length) return;
			const file = input.files[0];
			const content = await file.text();
			importCourseData(content);
		};
		input.click();
	};
</script>

<svelte:head>
	<title>Student Workload Calculator: Configure Courses</title>
</svelte:head>

<div class="layout">
	{#if $courses.length > 0}
		<div class="courses">
			<h2 class="text-2xl mb-4">Student Workload Calculator Dashboard</h2>
			<div class="editPane-items">
				{#each $courses as course, courseIndex (course.id)}
					<CourseEditCard {course} {courseIndex} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.layout {
		.courses {
			@apply w-full;

			h2 {
				@apply text-3xl;
			}
			.editPane-items {
				@apply gap-8 grid grid-cols-3  items-center md:items-start;
			}
		}
	}
</style>
