<script lang="ts">
	//@ts-ignore
	import SvelteTable from 'svelte-table';
	import { additionalCalculated, type componentInstance } from '$lib/components';
	import type { courseMeta } from '$lib/course';
	export let courseInfo: courseMeta;

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
			value: (row: componentInstance) => additionalCalculated(row.data, courseInfo).perWeekI
		},
		{
			key: 'perWeekS',
			title: 'hrs/wk (S)',
			value: (row: componentInstance) => additionalCalculated(row.data, courseInfo).perWeekS
		},
		{
			key: 'perSemI',
			title: 'hrs/semester (I)',
			value: (row: componentInstance) => additionalCalculated(row.data, courseInfo).perSemI
		},
		{
			key: 'perSemS',
			title: 'hrs/semester (S)',
			value: (row: componentInstance) => additionalCalculated(row.data, courseInfo).perSemS
		}
	];
</script>

<SvelteTable rows={components} {columns} />
