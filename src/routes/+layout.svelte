<script lang="ts">
	import { BarLoader } from 'svelte-loading-spinners';

	import '../app.postcss';
	import { fade } from 'svelte/transition';

	const resetPrompt = () => {
		if (confirm('Are you sure you want to reset the calculator?')) {
			localStorage.clear();
			location.reload();
		}
	};
</script>

<div class="wrapper">
	<header>
		<h1>Student Workload Calculator</h1>
		<p>
			This planning tool is for instructors who wish to estimate the expected student time
			commitment in a course based on the assigned learning activities. The tool is designed to be
			used for courses that represent the blended learning spectrum from face-to-face to fully
			online. Based on the input provided, the tool calculates the total time commitment expected,
			and allocates activities into scheduled (set by the institution, typically live meetings) and
			independent (at the discretion of the student within the parameters set by course deadlines)
			activities.
		</p>
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
</div>

<style lang="postcss">
	.wrapper {
		@apply grid gap-5 -mb-24 min-h-screen;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'header'
			'page';
		background: linear-gradient(180deg, #f5f5f5 0%, #e5e5e5 100%);
	}
	header {
		@apply flex gap-5 pt-5 pl-5 pr-5;
		grid-area: header;
		justify-content: space-evenly;
		flex-wrap: wrap;
		h1 {
			@apply text-5xl font-light;
			min-width: 7ch;
			max-width: 10ch;
			align-self: center;
		}
		p {
			max-width: 85ch;
			min-width: 40ch;
			@apply font-light italic text-justify;
		}
	}
	.page {
		grid-area: page;
		overflow-x: auto;
		height: fit-content;
	}

	.footer-push,
	.footer {
		@apply h-24;
	}

	.footer {
		@apply w-full relative;
		.reset-data {
			@apply absolute bottom-0 right-0 p-6 max-h-24;
			button {
				@apply text-red-700 border-red-700;
				@apply border-b border-dashed leading-4;
			}
		}
	}
</style>
