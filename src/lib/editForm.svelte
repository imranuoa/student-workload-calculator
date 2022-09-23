<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import type { Component } from '$lib/course-components/genericComponent';

	export let components: Readable<Component[]> | undefined;
	export let openComponent: Readable<number> | undefined;
</script>

{#if $components?.length && $openComponent !== undefined && $openComponent >= 0}
	<div transition:fade={{ duration: 150 }}>
		<h2>Configuration</h2>
		{#each $components[$openComponent].form as formElem}
			<svelte:component this={formElem && formElem.component} props={formElem.props} />
		{/each}
	</div>
{/if}
