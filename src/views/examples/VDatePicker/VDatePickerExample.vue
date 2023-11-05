<template>
  <ComponentExampleTemplate title="VDatePicker" component-name="VDatePicker">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VDatePicker />
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VDatePicker from "@/components/VDatePicker/VDatePicker.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";

const example1 = `<template>
  <VDatePicker />
<\/template>

<script lang="ts" setup>
import VDatePicker from "@/components/VDatePicker/VDatePicker.vue";

<\/script>`;
</script>
