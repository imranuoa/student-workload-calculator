<script lang="ts">
	import './formStyles.postcss';
	import type { RangeInput } from '../form';

	export let props: RangeInput['props'];
	let { value, label, min, max, step } = props;
</script>

<label class="block" for="rangeInput">
	<span class="text-gray-700"> {label} </span>
	<div class="rangeInputFlex mt-1">
		<input type="number" id="rangeInput" class="form-input" bind:value={$value} />
		<input type="range" bind:value={$value} class="block w-full" {min} {max} {step} />
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
