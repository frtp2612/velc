<template>
  <ComponentExampleTemplate component-name="VModalWindow">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VButton :on-click="() => modal!.open()">Open Modal</VButton>
        <VModalWindow title="Modal" ref="modal" width="50%" height="40%">
          <VButton>I am a button inside a modal!</VButton>
        </VModalWindow>
        <VButton :on-click="() => secondModal!.open()">Open second Modal</VButton>
        <VOverrideModalWindowExample
          title="Custom content modal!"
          :content-component="VModalContent"
          :on-yes="() => {}"
          :on-no="() => {}"
          ref="secondModal"
        />
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VButton from "@/components/VButton/index";
import VModalWindow from "@/components/VModalWindow/VModalWindow.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";
import VModalContent from "./VModalContent.vue";
import VOverrideModalWindowExample from "./VOverrideModalWindowExample.vue";

const modal = ref<InstanceType<typeof VModalWindow>>();

const secondModal = ref<InstanceType<typeof VOverrideModalWindowExample>>();

const example1 = "";
</script>
