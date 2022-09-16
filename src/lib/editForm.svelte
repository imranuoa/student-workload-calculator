<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import type { Component } from './components';
	import type { FormElement } from './form';
	import CheckSelect from './form-elems/checkSelect.svelte';
	import RangeInput from './form-elems/rangeInput.svelte';
	import TextInput from './form-elems/textInput.svelte';

	export let components: Component[] | undefined;
	export let openComponent: Readable<number> | undefined;
</script>

{#if components?.length && $openComponent !== undefined && $openComponent >= 0}
	<div class="config" transition:fade={{ duration: 150 }}>
		<h2>Configuration</h2>
		{#key $openComponent}
			{#each components[$openComponent].form as formElem}
				<svelte:component this={formElem && formElem.component} props={formElem.props} />
			{/each}
		{/key}
	</div>
{/if}
