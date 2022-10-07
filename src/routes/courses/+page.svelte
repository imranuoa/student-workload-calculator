<script lang="ts">
	import { Course } from '$lib/course';
	import { courses, addCourse, exportCourseData, importCourseData } from '../../store';
	import CourseEditCard from '$lib/add-course/courseEditCard.svelte';

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
	<div class="createPane">
		<div class="card">
			<h2>Create a Course</h2>
			<p>To begin, fill out some information about the course:</p>
			<label class="block pt-4">
				<span class="text-gray-700">Course Name</span>
				<input type="text" class="form-input mt-1 block w-full" bind:value={newCourseData.name} />
			</label>
			<div class="block pt-4">
				<label class="text-gray-700" for="createCourseNumberWeeks"> Number of Weeks </label>
				<div class="rangeInputFlex mt-1 flex gap-4">
					<input
						type="number"
						id="createCourseNumberWeeks"
						class="form-input w-16"
						bind:value={newCourseData.weeks}
					/>
					<input
						type="range"
						bind:value={newCourseData.weeks}
						class="block w-full flex-grow"
						min="1"
						max="52"
						aria-hidden="true"
						tabindex="-1"
					/>
				</div>
			</div>
			<br />
			<button
				class="btn btn-lg btn-primary"
				on:click={() => {
					addCourse(new Course(newCourseData.name, newCourseData.weeks));
				}}>Create Course</button
			>
		</div>
		<div class="card">
			<h2>Export</h2>
			<p>
				You can export all of your work as a JSON file. This is useful for sharing, backing up, or
				accessing the data programatically. <b
					>Note: if you want to download a copy of the calculated results, you can do this in
					individual courses.</b
				>
			</p>
			<div class="mt-4">
				<button class="btn btn-lg btn-primary" on:click={exportCourseData}>Export my data</button>
				<button class="btn btn-lg" on:click={findImport}>Import my data</button>
			</div>
		</div>
	</div>
	{#if $courses.length > 0}
		<div class="editPane">
			<h2 class="text-2xl mb-4">Your Courses:</h2>
			<div class="editPane-items">
				{#each $courses as course, courseIndex (course.id)}
					<CourseEditCard {course} {courseIndex} />
				{/each}
			</div>
		</div>
		<div class="divider" />
	{/if}
</div>

<style lang="postcss">
	.layout {
		@apply grid xl:grid-cols-2 grid-cols-1 min-h-full justify-center justify-items-center p-8 gap-8;
		.createPane {
			@apply flex flex-col gap-8 order-3 xl:order-none;
			@apply bg-white rounded-lg shadow-lg p-6;
			.card {
				@apply shadow-inner  border-blue-500 border-2;
			}
		}
		.divider {
			@apply block xl:hidden col-span-2 order-2;
			@apply h-1 w-full rounded-full bg-black bg-opacity-20;
		}
		.editPane {
			@apply grow order-1 xl:order-none w-full;
			h2 {
				@apply text-3xl;
			}
			.editPane-items {
				@apply gap-8 grid grid-cols-1  items-center md:items-start;
			}
		}
	}
</style>
