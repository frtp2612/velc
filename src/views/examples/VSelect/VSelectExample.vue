<template>
	<ComponentExampleTemplate component-name="VSelect">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="''">
				<VSelect
					:values="list1"
					:id="id1"
					:formatter="formatter"
					v-model="selectedValue1"
					:key="selectedValue1"
					preventAppend
				/>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script setup lang="ts">
import VSelect from "@/components/VSelect/index";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const list1: string[] = Array.from(Array(100)).map((_, i) => "Item " + i);

const selectedValue1 = ref(list1[0]);

const id1 = Math.floor(Math.random() * Date.now()).toString(36);

const formatter = (value: string) => value;
</script>

<style scoped></style>
