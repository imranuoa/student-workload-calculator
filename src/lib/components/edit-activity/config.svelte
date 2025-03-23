<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { Frequency, type Activity } from '$lib/course-activities/genericActivity';
	import RangeInput from '$lib/components/form-elems/rangeInput.svelte';
	import type { Course } from '$lib/course';
	import { durationToString } from '$lib/serialize';
	import { getActivityClass } from '$lib/activities';
	import Information from 'svelte-material-icons/Information.svelte';
	import { onMount } from 'svelte';
    import { data, loadCsvData, type CsvRow } from '$lib/data/csvActivityBackgrounds';

	
	export let course: Course;
	let showInfo = false;
	$: openActivity = course.openActivity;
	$: activities = course.activities;
	$: activity = $activities && $openActivity !== undefined ? $activities[$openActivity] : undefined;
	$: instanceName = activity?.instanceName;

	$: results = activity ? activity.results : undefined;
	$: freq = activity ? activity.freq : undefined;

	$: resultsList = $results
		? [
				{
					value: $results.prepHoursPer,
					formatted: durationToString($results.prepHoursPer, $results.occurences),
					label: ' to prepare'
				},
				{
					value: $results.IndependentHoursPer,
					formatted: durationToString($results.IndependentHoursPer, $results.occurences),
					label: 'of independent study'
				},
				{
					value: $results.scheduledHoursPer,
					formatted: durationToString($results.scheduledHoursPer, $results.occurences),
					label: 'of additional scheduled class time'
				},
				{
					value: $results.postActivityHoursPer,
					formatted: durationToString($results.postActivityHoursPer, $results.occurences),
					label: 'of time post activity'
				}
			
		  ]
		: [];
	$: filteredList = resultsList.filter((item) => item.value > 0);

	//Code related to Show Info for each activity

	console.log($data);

	onMount(async () => {
    	await loadCsvData();
  	});
</script>

{#if activity}
	<div>
		{#key $openActivity}
			<h2 class="text-xl activityTitle">
				<span class="icon" style={`color:${getActivityClass(activity).hexColour}`}>
					<svelte:component this={getActivityClass(activity).icon} />
				</span>
				{getActivityClass(activity).label}: {$instanceName}
				
				<button on:click={() => showInfo = !showInfo} class="text-uni-blue" ><Information  size="30"/></button>
				{#if showInfo}
					<div class="info-card">
						<p>Background of {$instanceName}</p>
						<!-- Add more details here based on the instance name -->
						{#if $data.length > 0}
							<div>
															
								{#each $data as item (item)}
									{#if item.activity.trim().toUpperCase().normalize("NFC") === $instanceName.trim().toUpperCase().normalize("NFC") }
										<div class="uni-card space-y-4  text-justify text-gray-500">{@html item.background.trim()}</div>
									{/if}
									
								{/each}
								
							</div>
						{:else if $data.length === 0}
								<p>Loading data...</p>
						{:else}
								<p>Error loading data</p>
						{/if}


					</div>
				{/if}
			</h2>
			<div>
				{#each activity.form as formElem}
					<svelte:component this={formElem && formElem.activity} props={formElem.props} />
				{/each}
			</div>
			<div class="mt-2">
				<RangeInput
					props={{
						id: 'grade Worth',
						value: activity.gradeWorth,
						label: 'Grade Worth (%)',
						min: 0,
						max: 100,
						step: 1
					}}
				/>
			</div>
			{#if $results && filteredList.length > 0}
				<div class="results mt-4">
					<h2 class="text-xl">Results</h2>
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

<style lang="postcss">
	.activityTitle {
		@apply flex items-center gap-2;
		.icon {
			@apply inline-block h-full;
		}
	}

	list-outside {
		@apply list-outside space-x-2 ;
	}



</style>
