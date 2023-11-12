<template>
  <VModalWindow :content-component="contentComponent" ref="modal">
    <template #footer>
      <div class="flex gap-4 justify-end">
        <VButton :on-click="onYes" :type="VButtonTypes.PRIMARY">Yes</VButton>
        <VButton :on-click="onNo" :type="VButtonTypes.SECONDARY">No</VButton>
        <VButton :on-click="onCancel" v-if="onCancel">Cancel</VButton>
      </div>
    </template>
  </VModalWindow>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VModalWindow from "@/components/VModalWindow";
import { VButtonTypes } from "@/enums";
import { ref } from "vue";

defineProps<{
  contentComponent: Object;
  onYes: () => void;
  onNo: () => void;
  onCancel?: () => void;
}>();

defineExpose<{
  open: () => void;
}>({ open });

const modal = ref<InstanceType<typeof VModalWindow>>();

function open() {
  modal.value?.open();
}
</script>
