<template>
  <ComponentExampleTemplate component-name="VFileUploader">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VFileUploader></VFileUploader>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VFileUploader from "@/components/VFileUploader/VFileUploader.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

const example1 = "";
</script>
