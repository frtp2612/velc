<template>
	<div class="h-full min-h-0">
		<div class="sticky top-0 right-0">{{ id }}</div>
		<VirtualScroller :items="items" :item-height="itemHeight" />
	</div>
</template>

<script lang="ts" setup>
import VirtualScroller from "@/components/VirtualScroller/VirtualScroller.vue";

defineProps<{
	items: string[];
	itemHeight: number;
}>();

const id = Math.floor(Math.random() * Date.now()).toString(36);
</script>
