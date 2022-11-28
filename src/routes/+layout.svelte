<script lang="ts">
	import { BarLoader } from 'svelte-loading-spinners';

	import '../app.postcss';
	import { fade, fly, slide } from 'svelte/transition';
	import { courses, activeCourse, exportCourseData } from '../store';
	import Logo from '$lib/assets/logo.svelte';
	import { page } from '$app/stores';
	import { Course } from '$lib/course';
	import { Frequency } from '$lib/course-activities/genericActivity';

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
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="wrapper">
	<div class="layout">
		<header>
			<Logo score={$totals?.perWeek.total} {isDanger} />
			<h1>
				Student Workload
				<br />Calculator
			</h1>
		</header>
		<div class="page">
			<!-- {#if !$hasLoaded}
				<div class="absolute top-0 left-0 w-full h-full text-center flex justify-center items-center">
					<BarLoader size="60" color="#000" unit="px" />
				</div>
			{/if} -->
			<slot />
		</div>
		<div class="footer-push" />
	</div>
	<div class="footer">
		<div class="reset-data">
			<button on:click={() => resetPrompt()}>Reset Data</button>
		</div>
		<div class="export-data">
			<button on:click={() => exportCourseData()}>Export Data</button>
		</div>
	</div>
</div>

<style lang="postcss">
	.layout {
		@apply grid gap-5 -mb-24 min-h-screen;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			'header'
			'page'
			'footer';
	}
	header {
		@apply flex gap-5 m-5 mb-0;
		grid-area: header;
		justify-content: center;
		flex-wrap: wrap;
		:global(svg) {
			@apply w-32 h-32;
		}
		h1 {
			@apply text-5xl leading-none font-light font-display italic;
			align-self: center;
		}
		@media screen and (max-width: 640px) {
			& {
				@apply h-auto;
			}
			:global(svg) {
				@apply w-24 h-24;
			}
			h1 {
				@apply text-3xl hidden;
			}
		}
		@media screen and (max-width: 280px) {
			:global(svg) {
				@apply hidden;
			}
			h1 {
				@apply text-xl text-center;
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
		@apply h-12;
	}

	.footer {
		@apply fixed bottom-0 flex justify-end p-5 pt-0 w-full h-12 items-end gap-4;
		.reset-data button {
			@apply text-red-700 border-red-700;
			@apply border-b border-dashed leading-4;
		}
		.export-data button {
			@apply text-uni-color-green font-semibold;
		}
	}
</style>
