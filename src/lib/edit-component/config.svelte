<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { Frequency, type Component } from '$lib/course-components/genericComponent';

	export let components: Readable<Component[]> | undefined;
	export let openComponent: Readable<number> | undefined;

	$: componentInst =
		$components && $openComponent !== undefined ? $components[$openComponent] : undefined;
	$: results = componentInst ? componentInst.results : undefined;
	$: freq = componentInst ? componentInst.freq : undefined;

	$: perOccurance = (value: number): string => {
		let result;
		if (!$results) result = 0;
		else result = Math.round(value * $results.occurences * 100) / 100;
		return `${result} ${result === 1 ? 'hour' : 'hours'}`;
	};

	$: resultsList = $results
		? [
				{
					value: $results.prepHoursPer,
					formatted: perOccurance($results.prepHoursPer),
					label: ' to prepare'
				},
				{
					value: $results.IndependentHoursPer,
					formatted: perOccurance($results.IndependentHoursPer),
					label: 'of independent study'
				},
				{
					value: $results.scheduledHoursPer,
					formatted: perOccurance($results.scheduledHoursPer),
					label: 'of additional scheduled class time'
				},
				{
					value: $results.postActivityHoursPer,
					formatted: perOccurance($results.postActivityHoursPer),
					label: 'of time post activity'
				}
		  ]
		: [];
	$: filteredList = resultsList.filter((item) => item.value > 0);
</script>

{#if componentInst}
	<div transition:fade={{ duration: 150 }}>
		<h2>Configuration</h2>
		{#key $openComponent}
			<div>
				{#each componentInst.form as formElem}
					<svelte:component this={formElem && formElem.component} props={formElem.props} />
				{/each}
			</div>
			{#if $results && filteredList.length > 0}
				<div class="results">
					<h2>Results</h2>
					<p>
						{#if $freq == Frequency.Weekly}
							Each week, this activity takes:
						{:else}
							This activity will take:
						{/if}
					</p>
					<ul
						class="list-disc 
					Class
					Properties
					list-inside"
					>
						{#each filteredList as item}
							<li><strong>{item.formatted}</strong> {item.label}</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/key}
	</div>
{/if}
