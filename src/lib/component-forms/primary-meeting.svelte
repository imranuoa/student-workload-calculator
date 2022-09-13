<script lang="ts">
	import type { ComponentData, componentInstance } from '$lib/components';
	import type { courseMeta } from '$lib/course';
	import CheckSelect from '$lib/form-elems/checkSelect.svelte';
	import RangeInput from '$lib/form-elems/rangeInput.svelte';
	import { courses, activeCourse } from '../../store';

	interface primaryMeetingData extends ComponentData {
		meetingsPerWeek: number;
		meetingLength: number;
		weeksRunning: string[] | undefined;
	}
	interface primaryMeetingInstance extends componentInstance {
		data: primaryMeetingData;
	}
	$: openComponent = $courses[$activeCourse].components[
		$courses[$activeCourse].openComponent
	] as primaryMeetingInstance;
	export let initialFormEl: HTMLElement;

	$: weeksList = [...Array($courses[$activeCourse].meta.weeks).keys()].map((e) =>
		(e + 1).toString()
	);

	$: if (openComponent.data.weeksRunning === undefined) openComponent.data.weeksRunning = weeksList;
	// $: if (
	// 	openComponent.data.weeksRunning &&
	// 	openComponent.data.weeksRunning.length < weeksList.length
	// )
	// 	openComponent.data.weeksRunning = [
	// 		...openComponent.data.weeksRunning,
	// 		...weeksList.slice(openComponent.data.weeksRunning.length)
	// 	];

	$: calculateData(
		openComponent.data.meetingsPerWeek,
		openComponent.data.meetingLength,
		openComponent.data.weeksRunning
	);
	const calculateData = (
		meetingsPerWeek: primaryMeetingData['meetingsPerWeek'],
		meetingLength: primaryMeetingData['meetingLength'],
		weeksRunning: primaryMeetingData['weeksRunning']
	) => {
		openComponent.data.calculated = {
			occurences: meetingsPerWeek,
			prepHoursPer: 0,
			independantHoursPer: 0,
			scheduledHoursPer: meetingLength,
			postActivityHoursPer: 0,
			weeksRunning: weeksList.map((w) => weeksRunning?.includes(w) || false)
		};
		courses.set($courses);
	};
</script>

<div class="grid gap-2">
	<label class="block">
		<span class="text-gray-700">Name</span>
		<input
			type="text"
			class="form-input mt-1 block w-full"
			bind:value={openComponent.data.name}
			bind:this={initialFormEl}
		/>
	</label>
	<RangeInput bind:value={openComponent.data.meetingsPerWeek} max={14} label="Meetings per week" />
	<RangeInput
		bind:value={openComponent.data.meetingLength}
		max={12}
		label="Meeting Duration (Hours)"
	/>
	<CheckSelect
		bind:value={openComponent.data.weeksRunning}
		options={weeksList}
		label="Weeks class runs:"
	/>
</div>
