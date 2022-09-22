<script lang="ts">
	import './formStyles.postcss';
	import type { CheckboxInput } from '../form';

	export let props: CheckboxInput['props'];
	let { value, label } = props;
</script>

<label class="my-4 flex items-center">
	<input type="checkbox" bind:checked={$value} />
	<span class="ml-2 text-gray-700">{label}</span>
</label>
