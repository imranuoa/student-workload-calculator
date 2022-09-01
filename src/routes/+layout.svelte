<script>
	import '../app.postcss';
</script>

<div class="wrapper">
	<header>
		<h1>Course Time Estimator</h1>
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
		<slot />
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply grid gap-5;
		height: 100vh;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'header'
			'page';
		background: linear-gradient(180deg, #f5f5f5 0%, #e5e5e5 100%);
	}
	header {
		@apply flex gap-5 pt-5 pl-5 pr-5;
		grid-area: 'header';
		justify-content: space-evenly;
		flex-wrap: wrap;
		h1 {
			@apply text-5xl font-light;
			min-width: 7ch;
			max-width: 10ch;
			align-self: center;
		}
		p {
			max-width: 70ch;
			min-width: 40ch;
			@apply font-light italic text-justify;
		}
	}
	.page {
		grid-area: 'page';
	}
</style>
