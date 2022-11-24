<script lang="ts">
	import { Course, getCourseData, type courseData, type courseDataValid } from '$lib/course';
	import { cardState } from '../card';
	import Generic from './generic.svelte';

	export let course: Course;
	export let state: cardState;

	$: meta = course?.meta;
	$: activities = course?.activities;
	$: totals = $activities && Course.getTotal($activities);
</script>

<Generic type="Total">
	<slot name="data" slot="data">
		{$meta.weeks} week{$meta.weeks === 1 ? '' : 's'}
	</slot>
</Generic>
