<template>
	<div
		:class="[
			containerClass ? containerClass : 'overflow-auto min-h-0 h-full border',
		]"
		ref="container"
	>
		<div
			class="overflow-hidden will-change-transform"
			:style="{ height: `${totalContentHeight}px` }"
		>
			<div
				class="will-change-transform"
				:style="[{ transform: `translateY(${offsetY}px)` }]"
			>
				<div
					v-for="(item, index) in list"
					:style="[itemHeight ? { height: `${itemHeight}px` } : {}]"
					:key="currentIndex + index"
				>
					<slot :item="item" :index="currentIndex + index">
						<span>{{ item }}</span>
					</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import VirtualScroll from "./VirtualScroller";

type Props = {
	itemHeight: number;
	items: any[];
	containerClass?: string;
};

const props = withDefaults(defineProps<Props>(), {});

const container = ref<HTMLElement | null>(null);

const { list, totalContentHeight, offsetY, currentIndex } = VirtualScroll({
	container,
	items: computed(() => props.items),
	itemHeight: props.itemHeight,
	renderAhead: 10,
});
</script>
