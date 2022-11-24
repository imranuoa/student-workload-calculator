<script lang="ts">
	import './formStyles.postcss';
	import type { CheckboxInput } from '$lib/form';

	export let props: CheckboxInput['props'];
	let { value, label } = props;
</script>

<label class="flex items-center field-block">
	<input type="checkbox" bind:checked={$value} />
	<span class="ml-2 text-gray-700">{label}</span>
</label>
