<script lang="ts">
	import './formStyles.postcss';
	import type { NumberInput } from '$lib/form';

	export let props: NumberInput['props'];
	let { value, label } = props;
</script>

<label class="block">
	<span class="text-gray-700">{label}</span>
	<input type="number" class="form-input mt-1 block w-full" bind:value={$value} />
</label>
