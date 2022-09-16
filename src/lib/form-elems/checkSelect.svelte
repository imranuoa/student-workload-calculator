<script lang="ts">
	import { onMount } from 'svelte';
	import './formStyles.postcss';
	import type { CheckSelectInput } from '../form';

	export let props: CheckSelectInput['props'];
	let { options, value, label } = props;

	let selectGroup: HTMLElement;
	let isMouseDown = false;
	let mouseSelectValue = false;
	const blankCanvas = document.createElement('canvas');
	blankCanvas.setAttribute(
		'style',
		'opacity:0;position:absolute;top:0;left:0;pointer-events: none;'
	);
	blankCanvas.width = 1;
	blankCanvas.height = 1;
	document.body.appendChild(blankCanvas);

	const beginSelecting = (e: DragEvent) => {
		// console.log('beginSelecting', e.target);
		isMouseDown = true;
		mouseSelectValue = (e.target as HTMLElement)?.querySelector('input')?.checked || false;
		if (!e.dataTransfer) return;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setDragImage(blankCanvas, 0, 0);
	};

	const stopSelecting = (e: DragEvent) => {
		// if (isMouseDown) console.log('stopSelecting');
		isMouseDown = false;
	};

	const dragOver = (e: DragEvent) => {
		e.preventDefault();
		const input = (e.currentTarget as HTMLElement)?.querySelector('input');
		if (!input) return;
		// Only set variable if we need to, to avoid unnessasary updates
		if (input.checked !== !mouseSelectValue) {
			input.checked = !mouseSelectValue;
			input.dispatchEvent(new Event('change'));
		}
	};
</script>

<label class="block" for="rangeInput" style="--numOptions: {$options.length}">
	<span class="text-gray-700">
		{label} <i class="text-sm align-baseline">(click or drag to select)</i>
	</span>
	<div class="daySelectGroup" bind:this={selectGroup}>
		{#each $options as option}
			<div
				class="daySelectLabel"
				on:dragover={dragOver}
				on:dragstart={beginSelecting}
				on:dragend={stopSelecting}
				on:drop={stopSelecting}
				draggable="true"
			>
				<input type="checkbox" bind:group={$value} value={option} id={option} />
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
				@apply outline outline-2 outline-slate-500;
				outline-offset: -2px;
			}
			:focus:checked + .daySelectText {
				@apply outline outline-2 outline-slate-500;
				outline-offset: -2px;
			}
		}
	}
</style>
