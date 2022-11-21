<script lang="ts">
	import './formStyles.postcss';
	import RangeSlider from 'svelte-range-slider-pips';
	import type { RangeInput } from '../form';
	import writableDerived from 'svelte-writable-derived';

	export let props: RangeInput['props'];
	let { value, label, min, max, step, id } = props;

	const values = writableDerived(
		value,
		(v) => [v],
		(v) => v[0]
	);
</script>

<div class="block">
	<label for={id} class="text-gray-700"> {label} </label>
	<div class="rangeInputFlex mt-1">
		<input type="number" {id} class="form-input" bind:value={$value} {step} />
		<div class="range">
			<RangeSlider range="min" bind:values={$values} {min} {max} {step} />
		</div>
	</div>
</div>

<style lang="postcss">
	.rangeInputFlex {
		@apply flex gap-4;
		input[type='number'] {
			@apply w-20;
		}
		.range {
			@apply flex-grow;
			--range-handle-inactive: theme(colors.uni-blue.light);
			--range-handle-focus: theme(colors.uni-blue.DEFAULT);
			/*--range-handle-inactive: theme(colors.white);
			--range-handle: theme(colors.uni-blue.light);
			--range-handle-focus: theme(colors.uni-blue.DEFAULT); */
		}
	}
</style>
