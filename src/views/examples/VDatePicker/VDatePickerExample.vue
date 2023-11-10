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

const date = ref(new Date("2006-08-31t00:00:00.000+00:00"));
console.log(date);

const example1 = `<template>
  <VDatePicker />
<\/template>

<script lang="ts" setup>
import VDatePicker from "@/components/VDatePicker/VDatePicker.vue";

<\/script>`;
</script>
