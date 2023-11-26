<template>
  <div ref="tabContainer" class="grow flex flex-col min-h-0 h-full">
    <div
      class="grow-0 relative after:-z-[0] after:content-[''] after:bottom-0 after:absolute after:w-full after:h-[2px] after:bg-color-bg-50"
    >
      <ul class="flex z-[1]">
        <!-- this shows all of the titles -->
        <li
          class="group/tab px-4 py-2 cursor-pointer flex flex-col gap-2 rounded-t-lg relative after:z-[1] after:content-[''] after:-bottom-0 after:left-0 after:absolute after:w-full after:h-[2px]"
          :class="[
            activeTab == tab
              ? 'after:bg-color-primary'
              : 'hover:after:bg-color-border-100 text-color-text-500 hover:text-color-text',
          ]"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="selectTab(index)"
        >
          <VLabel class="px-4 text-lg text-inherit">{{
            titleFormatter ? titleFormatter(tab) : tab
          }}</VLabel>
        </li>
      </ul>
    </div>
    <!-- this is where the tabs go, in this slot -->
    <div class="grid grow min-h-0 overflow-clip">
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
