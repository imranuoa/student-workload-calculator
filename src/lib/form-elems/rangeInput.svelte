<script lang="ts">
	import './formStyles.postcss';

	export let value: number;
	export let label: string;
	export let min: number = 0;
	export let max: number;
</script>

<label class="block" for="rangeInput">
	<span class="text-gray-700"> {label} </span>
	<div class="rangeInputFlex mt-1">
		<input type="number" id="rangeInput" class="form-input" bind:value />
		<input type="range" bind:value class="block w-full" {min} {max} />
	</div>
</label>

<style lang="postcss">
	.rangeInputFlex {
		@apply flex gap-4;
		input[type='number'] {
			@apply w-16;
		}
		input[type='range'] {
			@apply flex-grow;
		}
	}
</style>
