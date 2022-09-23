<script lang="ts">
	import './formStyles.postcss';
	import type { ConditionalInput } from '../form';

	export let props: ConditionalInput['props'];
	let { value, label, elements } = props;
</script>

<div>
	{#if label !== ''}
		<span class="text-gray-700">{label}</span>
	{/if}
	{#if $value}
		{#each elements as element}
			<svelte:component this={element.activity} props={element.props} />
		{/each}
	{/if}
</div>
