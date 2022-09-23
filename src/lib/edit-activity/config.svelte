<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { Frequency, type Activity } from '$lib/course-activities/genericActivity';

	export let activities: Readable<Activity[]> | undefined;
	export let openActivity: Readable<number> | undefined;

	$: activityInst =
		$activities && $openActivity !== undefined ? $activities[$openActivity] : undefined;
	$: results = activityInst ? activityInst.results : undefined;
	$: freq = activityInst ? activityInst.freq : undefined;

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

{#if activityInst}
	<div transition:fade={{ duration: 150 }}>
		<h2>Configuration</h2>
		{#key $openActivity}
			<div>
				{#each activityInst.form as formElem}
					<svelte:component this={formElem && formElem.activity} props={formElem.props} />
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
