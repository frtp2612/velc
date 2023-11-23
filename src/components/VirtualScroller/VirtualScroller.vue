<template>
	<div
		:class="[
			containerClass ? containerClass : 'overflow-auto min-h-0 h-full relative',
		]"
		ref="container"
	>
		<slot name="prepend"></slot>
		<div
			class="will-change-transform"
			:class="[wrapperClass ? wrapperClass : 'w-full']"
			:style="{ height: `${totalHeight}px` }"
			ref="itemsWrapper"
		>
			<div
				v-for="(item, index) in visibleItems"
				class="will-change-transform"
				:style="[
					{ transform: `translateY(${offsetY}px)` },
					itemHeight ? { height: `${itemHeight}px` } : {},
				]"
				:key="item"
			>
				<slot
					:item="item"
					:index="startIndex + index"
					:height="itemHeight"
					:wrapper="itemsWrapper"
				>
					<span>{{ item }}</span>
				</slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import useVirtualList from "./useVirtualList";

type Props = {
	itemHeight: number;
	items: any[];
	containerClass?: string;
	wrapperClass?: string;
	renderAhead?: number;
};

const props = withDefaults(defineProps<Props>(), {
	renderAhead: 6,
	id: "",
});

const container = ref<HTMLElement | null>(null);
const itemsWrapper = ref<HTMLElement | null>(null);

const { visibleItems, totalHeight, offsetY, startIndex, scrollToIndex } =
	useVirtualList(
		computed(() => props.items),
		props.itemHeight,
		container,
		props.renderAhead
	);

defineExpose({ container, itemsWrapper, scrollToIndex });
</script>
