<script lang="ts">
	import Check from 'svelte-material-icons/Check.svelte';
	import './formStyles.postcss';
	import type { ButtonRadioInput } from '$lib/form';
	export let props: ButtonRadioInput['props'];
	let { id, value, label, options } = props;
</script>

<div class="block field-block">
	<span class="text-gray-700" id={`${id}-label`}>{label}</span>
	<div class="btn-group" role="group" aria-labelledby={`${id}-label`}>
		{#each $options as option, i}
			<input type="radio" id={`${id}-option${i}`} name={id} value={i} bind:group={$value} />
			<label for={`${id}-option${i}`} class="btn btn-icon">
				<span class="icon">
					{#if $value === i}
						<Check />
					{:else}
						&nbsp;
					{/if}
				</span>
				<span>{option}</span>
			</label>
		{/each}
	</div>
</div>

<style lang="postcss">
	.btn-group {
		&:has(:focus-visible) {
			@apply ring-2 ring-offset-2;
		}
		.btn {
			@apply relative;
		}
		input:checked + .btn {
			@apply bg-uni-color-green text-white;
		}
		input:checked:focus-visible + .btn {
			@apply bg-uni-color-dark-green;
		}
		input {
			@apply absolute pointer-events-none opacity-0;
		}
	}
</style>
