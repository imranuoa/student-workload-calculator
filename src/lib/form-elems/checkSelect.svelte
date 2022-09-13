<script lang="ts">
	import { onMount } from 'svelte';
	import './formStyles.postcss';

	export let options = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
	export let value: string[] = [];
	export let label: string;

	let selectGroup: HTMLElement;
	let isMouseDown = false;
	let mouseSelectValue = false;

	const beginSelecting = (e: PointerEvent) => {
		console.log('beginSelecting', e);
		isMouseDown = true;
		mouseSelectValue =
			(e.target as HTMLElement).closest('.daySelectLabel')?.querySelector('input')?.checked ||
			false;
		selectGroup.setPointerCapture(e.pointerId);
	};

	const stopSelecting = (e: PointerEvent) => {
		console.log('stopSelecting');
		isMouseDown = false;
		selectGroup.releasePointerCapture(e.pointerId);
	};

	const triggerSelect = (e: PointerEvent) => {
		if (isMouseDown) {
			const PointTarget = document.elementFromPoint(e.clientX, e.clientY);
			if (!PointTarget || !selectGroup.contains(PointTarget)) return;
			const input = PointTarget.closest('.daySelectLabel')?.querySelector('input');
			if (!input) return;
			input.checked = !mouseSelectValue;
			// console.log('triggerSelect', input);
		}
	};
</script>

<label class="block" for="rangeInput" style="--numOptions: {options.length}">
	<span class="text-gray-700"> {label} </span>
	<div
		class="daySelectGroup"
		bind:this={selectGroup}
		on:pointerdown={beginSelecting}
		on:pointerup={stopSelecting}
		on:pointermove={triggerSelect}
		draggable="false"
	>
		{#each options as option}
			<div class="daySelectLabel">
				<input type="checkbox" bind:group={value} value={option} id={option} />
				<label for={option} class="daySelectText">
					{option}
				</label>
			</div>
		{/each}
	</div>
</label>

<style lang="postcss">
	.daySelectGroup {
		@apply grid rounded shadow select-none overflow-clip overflow-x-auto;
		grid-template-columns: repeat(var(--numOptions), minmax(2.3ch, 1fr));
		.daySelectLabel {
			@apply grow flex;
			input {
				@apply absolute opacity-0 pointer-events-none;
			}
			.daySelectText {
				@apply grow py-2 text-center bg-slate-50 text-sm border-r border-slate-200 cursor-pointer transition;
			}
			&:last-child .daySelectText {
				@apply border-r-0;
			}
			:checked + .daySelectText {
				@apply bg-slate-700 text-white border-opacity-0;
			}
			:focus + .daySelectText {
				@apply outline outline-2 outline-slate-700;
				outline-offset: -2px;
			}
			:focus:checked + .daySelectText {
				@apply outline outline-2 outline-slate-200;
				outline-offset: -2px;
			}
		}
	}
</style>
