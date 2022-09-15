<script lang="ts">
	import './formStyles.postcss';
	import type { TextInput } from '../form';

	export let props: TextInput['props'];
	let { value, label } = props;
</script>

<label class="block">
	<span class="text-gray-700">{label}</span>
	<input type="text" class="form-input mt-1 block w-full" bind:value={$value} />
</label>
