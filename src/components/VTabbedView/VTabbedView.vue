<template>
	<div ref="tabContainer" class="grow flex flex-col min-h-0">
		<div class="grow-0 border-b border-theme-primary">
			<ul class="flex">
				<!-- this shows all of the titles -->
				<li
					class="border-b border-transparent group/tab px-4 py-2 cursor-pointer flex flex-col gap-2 rounded-t-lg"
					:class="[
						activeTab == tab
							? 'bg-theme-primary text-theme-inverse'
							: 'bg-transparent hover:bg-theme-neutral-100',
					]"
					v-for="(tab, index) in tabs"
					:key="index"
					@click="selectTab(index)"
				>
					<VLabel class="px-4 text-lg font-semibold">{{
						titleFormatter ? titleFormatter(tab) : tab
					}}</VLabel>
				</li>
			</ul>
		</div>
		<!-- this is where the tabs go, in this slot -->
		<div
			class="grid grow min-h-0 border rounded-b-lg border-theme-neutral-300 overflow-clip"
		>
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/VLabel.vue";

import {
	computed,
	onMounted,
	provide,
	ref,
	useSlots,
	type ComputedRef,
} from "vue";

defineProps<{
	titleFormatter?: (value: any) => string;
}>();

const emits = defineEmits(["onTabChanged"]);

const activeTab = ref("");

const slots = useSlots();

const selectTab = (index: number) => {
	activeTab.value = tabs.value[index];
	emits("onTabChanged", index, tabs.value[index]);
};

const tabs: ComputedRef<Array<string>> = computed<Array<string>>(() => {
	if (slots.default) {
		return slots.default().map((tab) => tab.props?.title);
	}
	return [];
});

onMounted(() => {
	selectTab(0);
});

provide("activeTab", activeTab);
</script>
