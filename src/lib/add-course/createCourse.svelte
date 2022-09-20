<script lang="ts">
	import { Course } from '$lib/course';
	import { courses, activeCourse, addCourse } from '../../store';

	const newCourseData = {
		name: 'Your Course',
		weeks: 12
	};
</script>

<div class="creation-layout">
	<h2>Course Information</h2>
	<p>To begin, fill out some information about the course:</p>
	<label class="block pt-4">
		<span class="text-gray-700">Course Name</span>
		<input type="text" class="form-input mt-1 block w-full" bind:value={newCourseData.name} />
	</label>
	<label class="block pt-4" for="numberWeeks">
		<span class="text-gray-700"> Number of Weeks </span>
		<div class="rangeInputFlex mt-1 flex gap-4">
			<input
				type="number"
				id="numberWeeks"
				class="form-input w-16"
				bind:value={newCourseData.weeks}
			/>
			<input
				type="range"
				bind:value={newCourseData.weeks}
				class="block w-full flex-grow"
				min="1"
				max="52"
			/>
		</div>
	</label>
	<br />
	<button
		class="btn btn-lg btn-primary"
		on:click={() => {
			addCourse(new Course(newCourseData.name, newCourseData.weeks));
		}}>Create Course</button
	>
</div>

<style lang="postcss">
	.creation-layout {
		@apply max-w-prose w-full mx-auto mt-4 bg-white shadow rounded-lg px-10 py-7;
		h1 {
			@apply text-2xl font-bold text-center mb-4;
		}
	}
</style>
