<script lang="ts">
	import type { ComponentData } from '$lib/components';
	import type { courseMeta } from '$lib/course';
	import CheckSelect from '$lib/form-elems/checkSelect.svelte';
	import RangeInput from '$lib/form-elems/rangeInput.svelte';

	interface primaryMeetingData extends ComponentData {
		meetingsPerWeek: number;
		meetingLength: number;
		weeksRunning: string[] | undefined;
	}

	export let data: primaryMeetingData;
	export let initialFormEl: HTMLElement;
	export let weeks: number;

	$: weeksList = [...Array(weeks).keys()].map((e) => (e + 1).toString());

	$: if (data.weeksRunning === undefined) data.weeksRunning = weeksList;

	$: data.calculated = {
		occurences: data.meetingsPerWeek,
		prepHoursPer: 0,
		independantHoursPer: 0,
		scheduledHoursPer: data.meetingLength,
		postActivityHoursPer: 0,
		weeksRunning: weeksList.map((w) => data.weeksRunning?.includes(w) || false)
	};
</script>

<div class="grid gap-2">
	<label class="block">
		<span class="text-gray-700">Name</span>
		<input
			type="text"
			class="form-input mt-1 block w-full"
			bind:value={data.name}
			bind:this={initialFormEl}
		/>
	</label>
	<RangeInput bind:value={data.meetingsPerWeek} max={14} label="Meetings per week" />
	<RangeInput bind:value={data.meetingLength} max={12} label="Meeting Duration (Hours)" />
	<CheckSelect bind:value={data.weeksRunning} options={weeksList} label="Weeks class runs:" />
</div>
