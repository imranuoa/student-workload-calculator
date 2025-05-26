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
		<header>
			
				<Logo score={$totals?.perWeek.total} {isDanger} />
				
				<h1 class="text-left font-display ">
					Student Workload
					<br />Calculator 
				</h1>
							
			{#if $showNotice}
				<div class="notice-wrapper" transition:slide>
					<div class="notice">
						<span class="notice-header">Heads up! You're using a new tool 🛠️</span>
						<span class="note">
							This tool is in open beta and is available for general testing. Please report any bugs
							or issues to <a
								href="https://uoaprod.service-now.com/sp?id=sc_cat_item&table=sc_cat_item&sys_id=ce73ca981bfb65147f9952c91d4bcb32"
								>Ranga Auaha Ako</a
							>.
						</span>
						<div class="action">
							<button
								class="btn btn-icon btn-primary notice-close"
								on:click={() => {
									$showNotice = false;
								}}
							>
								<div class="icon">
									<Check />
								</div>
								Hide
							</button>
						</div>
						
						
					</div>
				</div>
			{/if}
			
		</header>

		
		
		<div class="page">
			<!-- {#if !$hasLoaded}
				<div class="absolute top-0 left-0 w-full h-full text-center flex justify-center items-center">
					<BarLoader size="60" color="#000" unit="px" />
				</div>
			{/if} -->
			
			<div class="grid grid-cols-2 gap-1">
				<div class="flex flex-col bg-white border shadow-sm   dark:shadow-blue-700/10">
					<div class="bg-gray-100   py-1 px-1 md:py-[2px] md:px-4 bg-blue-900 dark:border-blue-200">
						
					  </div>
					
					<div class="p-4 md:p-5">
						<h3 class="text-lg font-bold text-gray-800 dark:text-black">
							About this tool
						  </h3>
						  <div class="uni-header"></div>
						<p class="mt-2 text-black text-justify">
							This planning tool is for instructors who wish to estimate the expected student time commitment in a course based on the assigned learning activities. The tool is designed to be used for courses that represent the blended learning spectrum from face-to-face to fully online. Based on the input provided, the tool calculates the total time commitment expected, and allocates activities into scheduled (set by the institution, typically live meetings) and independent (at the discretion of the student within the parameters set by course deadlines) activities.
						</p>
						
					  </div>
				</div>
				<div class="flex flex-col bg-white border shadow-sm  dark:border-orage-700 dark:shadow-orage-700/70">
					<div class="bg-gray-100   py-1 px-1 md:py-[2px] md:px-4 bg-blue-900 dark:border-blue-200">
						
					</div>
					
					<div class="p-4 md:p-5">
						<h3 class="text-lg font-bold text-gray-800 dark:text-black">
							Instructions
						  </h3>
						  <div class="uni-header"></div>
						<ol type="1" class="list-decimal mt-2 px-9 marker:text-black list-disc ps-5 space-y-2 text-sm text-black dark:text-black text-left">
							<li>
								Set your course duration (in weeks). Once any component has been added to the Workload, the course duration can not be changed.
							</li>
							<li>
								Add a course component by selecting the radio button next to the component, adjusting the provided options and clicking on “Add to Workload Summary”. Note that information about each component will appear in Background panel.
							</li>
							<li>
								Once a component is added, the “Workload Summary” panel will document the components and provide a summary.
							</li>
							<li>
								Note that items can be removed by clicking on the x next to the component in the summary.
							</li>
							<li>
								Keep adding components until complete.
							</li>
							<li>
								Download a detailed workload summary by using the button provided.
							</li>
						  </ol>
						
					  </div>
				</div>
			</div>
			<slot />
		</div>
		<div class="footer-push" />
	</div>
	<div class="footer">
		<div class="reset-data">
			<button on:click={() => resetPrompt()}>Reset Data</button>
		</div>
		<div class="send-info">
			Created by <a
				href="https://uoaprod.service-now.com/sp?id=sc_cat_item&table=sc_cat_item&sys_id=ce73ca981bfb65147f9952c91d4bcb32"
				>Ranga Auaha Ako</a
			>
		</div>
		{#if $page.url.pathname.startsWith('/courses')}
			<div class="export-data">
				<button on:click={() => exportCourseData()}>Export Data</button>
			</div>
		{/if}
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
