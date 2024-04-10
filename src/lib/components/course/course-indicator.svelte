<script lang="ts">
	import type { Totals, courseMeta } from '@/lib/course';
	import { Frequency } from '@/lib/course-activities/genericActivity';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';

	export let totals: Readable<Totals>;
	export let activeCourseMeta: Readable<courseMeta>;
	export let options: {
		bottomOfScreen?: boolean;
		background?: boolean;
	} = {};
	export const isDanger = writable(false);

	$: isDanger.set(
		$totals &&
			$activeCourseMeta &&
			$totals.perCourse.total >
				$activeCourseMeta.target *
					($activeCourseMeta.targetFreq === Frequency.Weekly ? $activeCourseMeta.weeks : 1)
	);

	$: selectedOptions = {
		bottomOfScreen: false,
		background: false,
		...options
	};
</script>

{#if $totals && $activeCourseMeta}
	<div
		class="indicator"
		class:danger={$isDanger}
		class:bottomOfScreen={selectedOptions.bottomOfScreen}
		class:hasBackground={selectedOptions.background}
	>
		<div
			class="scheduled"
			style:width={`${
				($totals.perCourseS.total /
					Math.max(
						$activeCourseMeta.target *
							($activeCourseMeta.targetFreq === Frequency.Weekly ? $activeCourseMeta.weeks : 1),
						$totals.perCourse.total
					)) *
				100
			}%`}
		/>
		<div
			class="independant"
			style:width={`${
				($totals.perCourseI.total /
					Math.max(
						$activeCourseMeta.target *
							($activeCourseMeta.targetFreq === Frequency.Weekly ? $activeCourseMeta.weeks : 1),
						$totals.perCourse.total
					)) *
				100
			}%`}
		/>
	</div>
{/if}

<style lang="postcss">
	.indicator {
		@apply overflow-hidden h-2 w-full flex;
		&.bottomOfScreen {
			@apply fixed bottom-0 left-0 z-40 mt-0;
			width: calc(100% + theme(width.2));
		}
		&.hasBackground {
			@apply bg-gray-200 rounded-full;
		}
		.scheduled,
		.independant {
			@apply h-full transition-all rounded-r-full;
		}
		.independant {
			@apply bg-[#bddbab] -ml-2 z-10;
		}

		.scheduled {
			@apply bg-uni-color-green z-20;
		}

		&.danger {
			.independant {
				@apply bg-[#f7b5b5];
			}
			.scheduled {
				@apply bg-red-500;
			}
		}
	}
</style>
