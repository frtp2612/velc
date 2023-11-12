<template>
  <ComponentExampleTemplate component-name="VTextArea">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VTextArea id="text-area-1" v-model="text" :max-chars="200" />
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VTextArea from "@/components/VTextArea/VTextArea.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const text = ref("Initial text");
const example1 = "";
</script>
