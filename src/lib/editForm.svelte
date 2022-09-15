<script lang="ts">
	import type { FormElement } from './form';
	import CheckSelect from './form-elems/checkSelect.svelte';
	import RangeInput from './form-elems/rangeInput.svelte';
	import TextInput from './form-elems/textInput.svelte';

	export let formData: FormElement[];
</script>

<div class="config">
	<h2>Configuration</h2>
	{#each formData as formElem}
		<svelte:component this={formElem.component} props={formElem.props} />
	{/each}
</div>
