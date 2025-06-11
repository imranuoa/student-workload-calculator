<script lang="ts">
	// Import dependencies and components
	import '../app.postcss';
	import { courses, activeCourse, exportCourseData } from '../store';
	import { page } from '$app/stores';
	import { Course } from '$lib/course';
	import { Frequency } from '$lib/course-activities/genericActivity';
	import { writable as storedWritable } from 'svelte-local-storage-store';
	import { base } from '$app/paths';
	

	// Enable static prerendering
	export const prerender = true;

	// Reset all data prompt
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

	// Reactive declarations for course data
	$: activeCourseInst = $activeCourse >= 0 ? $courses[$activeCourse] : undefined;
	$: activeCourseMeta = activeCourseInst?.meta;
	$: activeCourseActivities = activeCourseInst?.activities;
	$: totals = $activeCourseActivities && Course.getTotal($activeCourseActivities);

	// Danger state calculation
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

	//Adding a hanbuger to toggle Sidebar
	let sidebarOpen = false;

	// Optional: close sidebar when route changes
	$: if (!$page.url.pathname.startsWith('/courses')) {
		sidebarOpen = false;
	}


	
	
    // let steps = ['Create a course', 'Add activities', 'Check analysis'], currentActive = 1, progressBar;
    // let currentStep = 1; // Change this as the user progresses

	// const handleProgress = (stepIncrement) => {
	// 	progressBar.handleProgress(stepIncrement)
	// }
</script>

<svelte:head>
	<!-- Responsive and font meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" href="{base}/favicon.svg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Main layout wrapper -->

<div class="wrapper">
	<div class="layout">
		<div class="layout grid grid-cols-[450px_1fr] h-screen">
			<!-- Left Panel: Logo, Title, Illustration, Credits -->
			<div class="flex min-h-screen">
				<aside
					class="left-panel aside-gradient bg-green-900 text-white p-6 flex flex-col justify-between {sidebarOpen
						? 'open'
						: ''}"
				>
					<div>
						<img src="{base}/Learning and TDT - logo.svg" alt="Logo" class="mb-10 mt-4" />
						<h1 class="text-5xl font-bold">Student Workload Calculator</h1>
					</div>
					<img
						src="{base}/calculator_logo.svg"
						alt="Calculator Illustration"
						class="self-center mt-40"
					/>
					<div>
						Created by
						<a
							href="https://uoaprod.service-now.com/sp?id=sc_cat_item&table=sc_cat_item&sys_id=ce73ca981bfb65147f9952c91d4bcb32"
							target="_blank"
							rel="noopener noreferrer">Ranga Auaha Ako</a
						>
					</div>
				</aside>
			</div>
			<!-- Burger icon for mobile -->

			<!-- Right Panel: Dashboard and slot for page content -->
			<main class="right-panel bg-white p-10 flex flex-col justify-between">
				<section class="dashboard-header">
					<!-- Burger icon for mobile, aligned with Dashboard heading -->
					<button
						class="burger {sidebarOpen ? 'open' : ''}"
						aria-label="Toggle sidebar"
						on:click={() => (sidebarOpen = !sidebarOpen)}
					>
						<span />
						<span />
						<span />
					</button>
					<h2 class="text-3xl font-bold text-green-800 mb-4">Dashboard</h2>
					
				</section>
				<div class="text-gray-600 mb-6 mt-4">
					<slot />
				</div>
			</main>
		</div>
		{#if sidebarOpen}
			<div class="sidebar-overlay" on:click={() => (sidebarOpen = false)} />
		{/if}
	</div>

	<!-- Floating action buttons for /courses route -->
	{#if $page.url.pathname.startsWith('/courses')}
		<div class="floating-buttons">
			<div class="reset-button">
				<button class="text-uni-color-light-white" on:click={() => resetPrompt()}>
					Reset Data
				</button>
			</div>
			<div class="export-button">
				<button on:click={() => exportCourseData()}>Export Data</button>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	/* Layout styles */
	.layout {
		display: flex;
		flex: 1;
		flex-direction: row;
		width: 100%;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.left-panel {
		flex: none;
		width: 100%;
		max-width: 450px;
		min-width: 180px;
		background: linear-gradient(135deg, #002f09, #2e4632, #6dff88);
		color: white;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow-y: auto;
	}
	.right-panel {
		flex: 1;
		background-color: white;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	/* Burger icon styles */
	.burger {
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 28px;
		height: 28px;
		background: transparent;
		border: none;
		cursor: pointer;
		z-index: 1100;
		padding: 0;
		margin: 0;
	}
	.burger span {
		display: block;
		width: 20px;
		height: 3px;
		background: #002f09;
		border-radius: 2px;
		margin: 2.5px 0;
		transition: all 0.3s cubic-bezier(0.4, 2.08, 0.55, 0.44);
	}
	.burger:hover span {
		background: #18afd4; /* Optional: highlight on hover */
	}

	.burger:focus {
		outline: none;
	}

	.burger.open span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}
	.burger.open span:nth-child(2) {
		opacity: 0;
	}
	.burger.open span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}
	.dashboard-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.dashboard-header h2 {
		margin-bottom: 0; /* Remove bottom margin for better alignment */
	}

	/* Responsive adjustments */
	@media screen and (max-width: 768px) {
		.layout {
			flex-direction: column;
		}
		.dashboard-header {
			flex-direction: row;
		}
		.burger {
			display: flex;
			position: static; /* So it stays in the flow, not fixed */
			margin-right: 0.5rem;
		}
		.left-panel {
			position: fixed;
			top: 0;
			left: 0;
			height: 100vh;
			width: 80vw;
			max-width: 320px;
			transform: translateX(-100%);
			transition: transform 0.3s;
			z-index: 1050;
		}
		.left-panel.open {
			transform: translateX(0);
			box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
		}
		/* Optional: overlay when sidebar is open */
		.sidebar-overlay {
			display: block;
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.2);
			z-index: 1040;
		}
		.left-panel {
			min-height: unset; /* Remove min-height */
			height: auto; /* Let it shrink to fit content */
			width: 100%;
			max-width: none;
			padding: 1rem;
			align-items: center; /* Center content horizontally */
			text-align: center; /* Center text */
		}
		.flex.min-h-screen {
			min-height: unset; /* Remove min-height from parent */
			height: auto;
		}
		.left-panel img {
			margin: 1rem auto;
			max-width: 80%;
		}
		.right-panel {
			padding: 1rem;
			padding-bottom: 5rem;
		}
		.floating-buttons {
			position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 0.5rem;
        padding: 0.5rem 0;
        background: rgba(255,255,255,0.95); /* Optional: subtle background for visibility */
        box-shadow: 0 -2px 8px rgba(0,0,0,0.04); /* Optional: subtle shadow */
        z-index: 1000;
		}
		.reset-button,
		.export-button {
			padding: 0.5rem 1rem;
			font-size: 0.95rem;
			border-radius: 8px;
		}
	}
	@media screen and (max-width: 480px) {
		.left-panel img.mt-40 {
			display: none; /* Hide large illustration */
		}
		.left-panel div:last-child {
			font-size: 0.9rem;
		}
		.left-panel {
			min-height: unset;
			height: auto;
			padding: 0.5rem;
		}
		.flex.min-h-screen {
			min-height: unset;
			height: auto;
		}
		.left-panel img {
			max-width: 60%;
		}
		.left-panel .mt-40 {
			margin-top: 1.5rem; /* Reduce large top margin on illustration */
		}
		.right-panel {
			padding: 0.5rem;
			padding-bottom: 5rem;
		}
		.text-5xl {
			font-size: 2rem;
		}
		.floating-buttons {
			bottom: 1rem;
			right: 1rem;
			gap: 0.5rem;
		}
		.reset-button,
		.export-button {
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}
	}

	/* Floating action buttons */
	.floating-buttons {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		display: flex;
		gap: 1rem;
		z-index: 1000;
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

	/* Aside gradient and link styles */
	.aside-gradient {
		background: linear-gradient(135deg, #002f09, #2e4632, #6dff88);
		color: white;
	}
	.aside-gradient a {
		color: #d1fae5;
		text-decoration: underline;
		pointer-events: auto;
		visibility: visible;
		z-index: 10;
	}
	.aside-gradient a:hover {
		color: #a7f3d0;
	}
	.left-panel img,
	.right-panel img {
		max-width: 100%;
		height: auto;
	}

	/* Burger icon styles */
	.burger {
		display: none;
		flex-direction: column;
		justify-content: space-between;
		width: 30px;
		height: 24px;
		background: transparent;
		border: none;
		cursor: pointer;
		z-index: 1100;
		position: relative;
	}

	.burger span {
		display: block;
		height: 3px;
		width: 100%;
		background: #002f09;
		transition: all 0.3s ease;
	}

	.burger:hover span {
		background: #a7f3d0;
	}

	.burger:focus {
		outline: none;
	}

	.burger.open span:nth-child(1) {
		transform: translateY(10px) rotate(45deg);
	}

	.burger.open span:nth-child(2) {
		opacity: 0;
	}

	.burger.open span:nth-child(3) {
		transform: translateY(-10px) rotate(-45deg);
	}

	@media screen and (max-width: 768px) {
		.burger {
			display: flex;
		}
		.left-panel {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			transform: translateX(-100%);
			transition: transform 0.3s ease;
			z-index: 1000;
		}
		.left-panel.open {
			transform: translateX(0);
		}
		.right-panel {
			flex: 1;
			padding: 1rem;
		}
		.floating-buttons {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 0.5rem;
        padding: 0.5rem 0;
        background: rgba(255,255,255,0.95); /* Optional: subtle background for visibility */
        box-shadow: 0 -2px 8px rgba(0,0,0,0.04); /* Optional: subtle shadow */
        z-index: 1000;
    }
	}
</style>
