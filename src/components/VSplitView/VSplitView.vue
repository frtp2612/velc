<template>
	<div
		class="grid min-h-0 h-full relative"
		ref="container"
		:style="[
			vertical
				? { gridTemplateRows: splitViewStyle }
				: { gridTemplateColumns: splitViewStyle },
		]"
	>
		<slot />
	</div>
</template>

<script lang="ts" setup>
import { ref, useSlots } from "vue";
import { VSplitViewState } from "./VSplitViewState";

const props = withDefaults(
	defineProps<{
		vertical?: boolean;
	}>(),
	{
		vertical: false,
	}
);

const slots = useSlots();

const container = ref<HTMLElement | null>(null);

const state = VSplitViewState(container, slots, props.vertical);

const { splitViewStyle } = state;
</script>
