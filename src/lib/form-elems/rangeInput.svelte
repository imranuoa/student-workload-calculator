<script lang="ts">
	import './formStyles.postcss';
	import type { RangeInput } from '../form';

	export let props: RangeInput['props'];
	let { value, label, min, max, step, id } = props;
</script>

<div class="block">
	<label for={id} class="text-gray-700"> {label} </label>
	<div class="rangeInputFlex mt-1">
		<input type="number" {id} class="form-input" bind:value={$value} {step} />
		<input
			type="range"
			bind:value={$value}
			class="block w-full"
			{min}
			{max}
			{step}
			aria-hidden="true"
			tabindex="-1"
		/>
	</div>
</div>

<style lang="postcss">
	.rangeInputFlex {
		@apply flex gap-4;
		input[type='number'] {
			@apply w-20;
		}
		input[type='range'] {
			@apply flex-grow;
		}
	}
</style>
