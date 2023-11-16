<template>
	<ComponentExampleTemplate title="VDatePicker" component-name="VDatePicker">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<VDatePicker v-model="date" />
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VDatePicker from "@/components/VDatePicker/VDatePicker.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const date = ref(new Date("2023-11-17T09:46:09.283+00:00"));
console.log(date.value.toISOString());
console.log(date.value.toUTCString());

const example1 = `<template>
  <VDatePicker />
<\/template>

<script lang="ts" setup>
import VDatePicker from "@/components/VDatePicker/VDatePicker.vue";

<\/script>`;
</script>
