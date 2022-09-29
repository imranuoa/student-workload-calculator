<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { Frequency, type Activity } from '$lib/course-activities/genericActivity';
	import Duration from 'humanize-duration';
	import RangeInput from '$lib/form-elems/rangeInput.svelte';

	export let activities: Readable<Activity[]> | undefined;
	export let openActivity: Readable<number> | undefined;

	$: activityInst =
		$activities && $openActivity !== undefined ? $activities[$openActivity] : undefined;
	$: results = activityInst ? activityInst.results : undefined;
	$: freq = activityInst ? activityInst.freq : undefined;

	$: perOccurance = (value: number): string => {
		if (!$results) return '0 hours';
		return Duration(value * $results.occurences * 60 * 60 * 1000, {
			units: ['h', 'm'],
			round: true,
			conjunction: ' and ',
			serialComma: false
		});
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
			<div class="mt-2">
				<RangeInput
					props={{
						id: 'grade Worth',
						value: activityInst.gradeWorth,
						label: 'Grade Worth (%)',
						min: 0,
						max: 100,
						step: 1
					}}
				/>
			</div>
			{#if $results && filteredList.length > 0}
				<div class="results mt-4">
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
