<template>
	<div
		class="grid min-h-0 h-full overflow-auto"
		:class="[noPadding ? '' : 'p-4']"
		ref="tab"
		v-show="parentVisible"
	>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { inject, provide, ref, watchEffect, type Ref } from "vue";

const tab = ref<HTMLElement | null>();

const activeTab: Ref<String> = inject("activeTab", ref(""));

const props = defineProps({
	title: {
		type: String!,
		default: "",
		required: true,
	},
	noPadding: {
		type: Boolean,
		default: false,
	},
});

const parentVisible = ref(true);

watchEffect(() => {
	parentVisible.value = props.title === activeTab.value;
});

provide("parentVisible", parentVisible);
</script>
