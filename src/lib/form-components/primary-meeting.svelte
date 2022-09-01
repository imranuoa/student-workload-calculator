<script lang="ts">
	import type { ComponentData } from '$lib/components';
	import type { courseMeta } from '$lib/course';

	interface primaryMeetingData extends ComponentData {
		meetingsPerWeek: number;
		meetingLength: number;
	}

	export let data: primaryMeetingData;
	export let courseInfo: courseMeta;

	$: data.calculated = {
		occurences: data.meetingsPerWeek * courseInfo.weeks,
		prepHoursPer: 0,
		independantHoursPer: 0,
		scheduledHoursPer: data.meetingLength,
		postActivityHoursPer: 0
	};
</script>

<div>
	<label class="block">
		<span class="text-gray-700">Name</span>
		<input type="text" class="form-input mt-1 block w-full" bind:value={data.name} />
	</label>
	<label class="block">
		<span class="text-gray-700"> Meetings per week </span>
		<input
			type="range"
			bind:value={data.meetingsPerWeek}
			class="mt-1 block w-full"
			min="0"
			max="13"
		/>
	</label>
	<label class="block">
		<span class="text-gray-700"> Meeting Duration (Hours) </span>
		<input
			type="range"
			bind:value={data.meetingLength}
			class="mt-1 block w-full"
			min="0"
			max="24"
		/>
	</label>
</div>
