<div class="componentList">
	<label class="block">
		<span class="text-gray-700">Weeks in Semester</span>
		<input
			type="number"
			class="form-input mt-1 block w-full"
			bind:value={$activeCourseMeta.weeks}
		/>
	</label>
	<h2>
		<span> Components: </span>
		<button
			class="btn"
			on:click={() => {
				addComponentOpen = !addComponentOpen;
			}}
		>
			<span class="icon">+</span>
		</button>
	</h2>
	{#if addComponentOpen}
		<ComponentList {components} on:add={({ detail }) => addComponent(detail)} />
	{/if}
	{#if $activeCourseComponents.length === 0 && !addComponentOpen}
		<p in:fade class="text-gray-500 text-center italic m-5">
			You don't have any components to this course yet! Why not <button
				class="italic font-bold underline"
				on:click={() => {
					addComponentOpen = !addComponentOpen;
				}}>add one</button
			>?
		</p>
	{:else}
		<div class="component-instance-list">
			{#each $activeCourseComponents as component, i}
				<div
					class="component-row"
					class:active={i === $openComponent}
					role="button"
					on:click={() => {
						if (i === $openComponent) $openComponent = -1;
						else $openComponent = i;
					}}
				>
					<span class="icon">
						{getComponentClass(component).icon}
					</span>
					<span class="name">{get(component.instanceName)}</span>
					<span class="hours">
						{get(component.derivedCalculated).perWeekI + get(component.derivedCalculated).perWeekS} Hrs
						per Week
					</span>
					<button
						class="btn btn-block"
						aria-label="delete"
						on:click={() => {
							deleteComponent(i);
						}}
					>
						<span class="icon">-</span>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
