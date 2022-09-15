<script lang="ts">
	//@ts-ignore
	import SvelteTable from 'svelte-table';
	import type { Component } from '$lib/components';
	import { get } from 'svelte/store';

	export let components: Component[];
	const columns = [
		{
			key: 'name',
			title: 'Name',
			value: (row: Component) => row.name
		},
		{
			key: 'perWeekI',
			title: 'hrs/wk (I)',
			value: (row: Component) => get(row.derivedCalculated).perWeekI
		},
		{
			key: 'perWeekS',
			title: 'hrs/wk (S)',
			value: (row: Component) => get(row.derivedCalculated).perWeekS
		},
		{
			key: 'perSemI',
			title: 'hrs/semester (I)',
			value: (row: Component) => get(row.derivedCalculated).perSemI
		},
		{
			key: 'perSemS',
			title: 'hrs/semester (S)',
			value: (row: Component) => get(row.derivedCalculated).perSemS
		}
	];
</script>

<SvelteTable rows={components} {columns} />
