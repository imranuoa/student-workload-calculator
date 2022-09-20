<script lang="ts">
	import './formStyles.postcss';
	import type { SingleSelectInput } from '../form';

	export let props: SingleSelectInput['props'];
	let { value, label, options, key } = props;
</script>

<label class="block">
	<span class="text-gray-700">{label}</span>
	<select class="form-select block w-full" bind:value={$value} on:change>
		{#each $options as option, i}
			{#if key}
				<option value={i}>{key(option)}</option>
			{:else}
				<option value={i}>{option}</option>
			{/if}
		{/each}
	</select>
</label>
