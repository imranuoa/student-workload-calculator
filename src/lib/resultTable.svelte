<script lang="ts">
	//@ts-ignore
	import SvelteTable from 'svelte-table';
	import { Frequency, type ComponentData, type componentInstance } from '$lib/components';
	import type { courseMeta } from '$lib/course';
	export let courseInfo: courseMeta;

	const additionalCalculated = (data: ComponentData) => {
		if (!data.calculated) return { perWeekI: 0, perWeekS: 0, perSemI: 0, perSemS: 0 };
		let perWeek =
			data.freq === Frequency.Weekly
				? data.calculated.occurences
				: data.calculated.occurences / courseInfo.weeks;
		let perSem =
			data.freq === Frequency.Semester
				? data.calculated.occurences
				: data.calculated.occurences * courseInfo.weeks;
		let IPerOcc =
			data.calculated.independantHoursPer +
			data.calculated.prepHoursPer +
			data.calculated.postActivityHoursPer;
		let SPerOcc = data.calculated.scheduledHoursPer;
		return {
			perWeekI: perWeek * IPerOcc,
			perWeekS: perWeek * SPerOcc,
			perSemI: perSem * IPerOcc,
			perSemS: perSem * SPerOcc
		};
	};

	export let components: componentInstance[];
	const columns = [
		{
			key: 'name',
			title: 'Name',
			value: (row: componentInstance) => row.data.name
		},
		{
			key: 'perWeekI',
			title: 'hrs/wk (I)',
			value: (row: componentInstance) => additionalCalculated(row.data).perWeekI
		},
		{
			key: 'perWeekS',
			title: 'hrs/wk (S)',
			value: (row: componentInstance) => additionalCalculated(row.data).perWeekS
		},
		{
			key: 'perSemI',
			title: 'hrs/semester (I)',
			value: (row: componentInstance) => additionalCalculated(row.data).perSemI
		},
		{
			key: 'perSemS',
			title: 'hrs/semester (S)',
			value: (row: componentInstance) => additionalCalculated(row.data).perSemS
		}
	];
</script>

<SvelteTable rows={components} {columns} />
