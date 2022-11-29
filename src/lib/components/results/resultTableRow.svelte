<script lang="ts">
	import { Frequency, type Activity } from '$lib/course-activities/genericActivity';
	import { getActivityClass } from '$lib/activities';
	import type { courseMeta } from '$lib/course';

	export let activity: Activity;

	$: freq = activity.freq;

	export let totals: {
		perWeekI: { median: number; total: number };
		perWeekS: { median: number; total: number };
		perCourseI: { median: number; total: number };
		perCourseS: { median: number; total: number };
		perCourse: { median: number; total: number };
		perWeek: { median: number; total: number };
	};
	export let gradeTotals: { median: number; total: number };
	export let courseWeeks: number;
	export let active: boolean | null = null;
	export let courseMeta: courseMeta | undefined;

	$: derivedCalculated = activity.derivedCalculated;
	$: instanceName = activity.instanceName;

	$: perWeekI = $derivedCalculated.perWeekI;
	$: perWeekS = $derivedCalculated.perWeekS;
	$: perCourseI = $derivedCalculated.perCourseI;
	$: perCourseS = $derivedCalculated.perCourseS;
	$: gradeWorth = activity.gradeWorth;

	$: targetPerCourse =
		courseMeta &&
		courseMeta.target * (courseMeta.targetFreq === Frequency.Weekly ? courseMeta.weeks : 1);
	$: targetPerWeek =
		courseMeta &&
		courseMeta.target / (courseMeta.targetFreq === Frequency.Weekly ? 1 : courseMeta.weeks);
	$: warningPerCourse = targetPerCourse && 0.6 * targetPerCourse;
	$: warningPerWeek = targetPerWeek && 0.6 * targetPerWeek;
</script>

<tr class:active class:clickable={active !== null}>
	<td class="name">
		<!-- {#if $freq == Frequency.Weekly}
			<span class="pill weekly" title="Occurs Weekly">
				<span aria-hidden="true"> W </span>
			</span>
		{:else}
			<span class="pill coursely" title="Occurs once">
				<span aria-hidden="true"> C </span>
			</span>
		{/if} -->
		<span class="icon" aria-hidden="true">
			<svelte:component this={getActivityClass(activity).icon} />
		</span>
		<span class="name">
			{$instanceName}
		</span>
	</td>
	<td
		class:warning={warningPerWeek && perWeekI > warningPerWeek}
		class:danger={targetPerWeek && perWeekI > targetPerWeek}
		style="--comparison: {totals.perWeek.total > 0
			? (perWeekI / totals.perWeek.total) * 100
			: perWeekI > 0
			? 100
			: 0}%"
	>
		{perWeekI}
		<div class="comparison" />
	</td>
	<td
		class:warning={warningPerWeek && perWeekS > warningPerWeek}
		class:danger={targetPerWeek && perWeekS > targetPerWeek}
		style="--comparison: {totals.perWeek.total > 0
			? (perWeekS / totals.perWeek.total) * 100
			: perWeekS > 0
			? 100
			: 0}%"
	>
		{perWeekS}
		<div class="comparison" />
	</td>
	<td
		class:warning={warningPerCourse && perCourseI > warningPerCourse}
		class:danger={targetPerCourse && perCourseI > targetPerCourse}
		style="--comparison: {totals.perCourse.total > 0
			? (perCourseI / totals.perCourse.total) * 100
			: perCourseI > 0
			? 100
			: 0}%"
	>
		{perCourseI}
		<div class="comparison" />
	</td>
	<td
		class:warning={warningPerCourse && perCourseS > warningPerCourse}
		class:danger={targetPerCourse && perCourseS > targetPerCourse}
		style="--comparison: {totals.perCourse.total > 0
			? (perCourseS / totals.perCourse.total) * 100
			: perCourseS > 0
			? 100
			: 0}%"
	>
		{perCourseS}
		<div class="comparison" />
	</td>
	<td
		style="--comparison: {gradeTotals.total > 0
			? ($gradeWorth / gradeTotals.total) * 100
			: $gradeWorth > 0
			? 100
			: 0}%"
	>
		{$gradeWorth}%
		<div class="comparison" />
	</td>
</tr>

<style lang="postcss">
	.pill {
		@apply rounded-full text-xs p-1 mr-1 bg-white inline-block w-6 h-6 align-middle text-center font-bold leading-4 float-left;
		&.weekly {
			@apply bg-blue-300;
		}
		&.coursely {
			@apply bg-green-400;
		}
	}

	tr {
		@apply h-10 text-center relative;
		@apply border-b border-slate-300;
		.name {
			.icon {
				@apply inline-block align-middle;
			}
		}
		&.clickable .name {
			@apply cursor-pointer;
		}
		&:last-child {
			@apply border-b-0;
		}
		&:hover {
			@apply bg-gray-200;
		}

		&::after {
			content: ' ';
			@apply block absolute w-1 h-0 rounded-full top-0 bottom-0 left-0 m-auto;
			@apply transition-all duration-300 opacity-0 bg-slate-700;
		}
		&.active::after {
			@apply opacity-100 h-full;
		}
	}
	td {
		@apply border-l border-slate-300 relative transition px-3;
		&.warning {
			@apply bg-yellow-200;
		}
		&.danger {
			@apply bg-red-200;
		}
		.comparison {
			@apply block absolute bottom-0 left-0 h-1;
			@apply bg-slate-700;
			width: min(var(--comparison), 100%);
		}
	}
	td:first-child {
		@apply border-l-0;
	}
</style>
