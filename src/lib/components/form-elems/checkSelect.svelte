<script lang="ts">
	import { onMount } from 'svelte';
	import './formStyles.postcss';
	import type { CheckSelectInput } from '$lib/form';

	export let props: CheckSelectInput['props'];
	let { id, options, value, label } = props;

	let selectGroup: HTMLElement;
	let isMouseDown = false;
	let mouseSelectValue = false;

	let blankCanvas: HTMLCanvasElement;

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

	onMount(() => {
		blankCanvas = document.createElement('canvas');
		blankCanvas.setAttribute(
			'style',
			'opacity:0;position:absolute;top:0;left:0;pointer-events: none;'
		);
		blankCanvas.width = 1;
		blankCanvas.height = 1;
		document.body.appendChild(blankCanvas);
	});
</script>

<fieldset class="block" for="rangeInput" style="--numOptions: {$options.length}">
	<legend class="text-gray-700" id={`${id}-label`}>
		{label} <i class="text-sm align-baseline" aria-hidden="true">(click or drag to delete)</i>
	</legend>
	<div class="daySelectGroup" bind:this={selectGroup} role="group" aria-labelledby={`${id}-label`}>
		{#each $options as option, i}
			<div
				class="daySelectLabel"
				on:dragover={dragOver}
				on:dragstart={beginSelecting}
				on:dragend={stopSelecting}
				on:drop={stopSelecting}
				draggable="true"
			>
				<input
					type="checkbox"
					name={id}
					bind:group={$value}
					value={option}
					id={`${id}-option${i}`}
				/>
				<label for={`${id}-option${i}`} class="daySelectText">
					{option}
				</label>
			</div>
		{/each}
	</div>
</fieldset>

<style lang="postcss">
	fieldset {
		@apply min-w-0;
	}
	.daySelectGroup {
		@apply flex rounded shadow select-none overflow-clip overflow-x-auto;
		@apply bg-gray-200;
		/* grid-template-columns: repeat(var(--numOptions), minmax(2.3ch, 1fr)); */
		.daySelectLabel {
			min-width: 2.5ch;
			@apply grow flex;
			input {
				@apply absolute opacity-0 pointer-events-none;
			}
			.daySelectText {
				@apply grow py-2 text-center bg-white text-sm cursor-pointer transition opacity-50;
				@apply border-l border-r border-black border-opacity-10 scale-90;
				@apply relative overflow-clip;
				&:after {
					@apply absolute top-0 bottom-0 left-0 right-0 m-auto pointer-events-none transition-all duration-300 delay-100;
					@apply bg-red-500;
					content: ' ';
					width: 1px;
					height: 141.42%;
					transform: rotate(41deg);
				}
			}
			&:last-child .daySelectText {
				@apply border-r-0;
			}
			:checked + .daySelectText {
				@apply bg-white opacity-100 scale-100 text-green-700;
				&:hover {
					@apply bg-slate-100;
				}
				&:after {
					@apply h-0 transition-none;
				}
			}
			:focus-visible + .daySelectText {
				@apply outline outline-2 outline-slate-300;
				outline-offset: -2px;
			}
			:focus-visible:checked + .daySelectText {
				@apply outline outline-2 outline-slate-300;
				outline-offset: -2px;
			}
		}
	}
</style>
