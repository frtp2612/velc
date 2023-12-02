<template>
	<div
		ref="widget"
		class="bg-white rounded-lg border-dashed border border-color-border hover:border-color-primary gap-1 p-2 flex flex-col items-center"
		draggable="true"
		@dragstart="onDragStart"
		@dragend="onDragEnd"
	>
		<VWidget :component-path="componentPath" :name="name" class="select-none" />
	</div>
</template>

<script setup lang="ts">
import VWidget from "@/components/VWidget/VWidget.vue";
import { ref } from "vue";

const props = defineProps<{
	componentPath: string;
	name: string;
	size: {
		x: number;
		y: number;
	};
}>();

const widget = ref<HTMLElement>();

function onDragStart(event: DragEvent) {
	const img = new Image();
	event.dataTransfer?.setDragImage(img, 0, 0);
	event.dataTransfer?.setData("text/plain", JSON.stringify(props));
	sessionStorage.setItem("draggable", JSON.stringify(props));
}

function onDragEnd(event: DragEvent) {
	event.dataTransfer?.setData("text/plain", "");
	sessionStorage.removeItem("draggable");
}
</script>

<style scoped></style>
