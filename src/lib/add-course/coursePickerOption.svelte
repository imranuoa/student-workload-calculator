<script lang="ts">
	import type { Course } from '$lib/course';

	export let option: Course;
	export let i: number;

	$: meta = option.meta;
</script>

{#if $meta}
	<option value={i}>{$meta.name}</option>
{/if}
