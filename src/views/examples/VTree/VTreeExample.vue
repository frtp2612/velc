<template>
	<ComponentExampleTemplate component-name="VTree">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<VTree :root="values" :formatter="formatter" v-model="selection" />
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>
<script lang="ts" setup>
import VTree from "@/components/VTree/VTree.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const values = {
	id: "item-0",
	children: Array.from(Array(3)).map((_, i) => {
		return {
			id: "item-" + i,
			children:
				i % 3 === 0
					? Array.from(Array(10)).map((_, index) => {
							return {
								id: "item-" + (i * index + index),
							};
					  })
					: undefined,
		};
	}),
};
const formatter = (value: any) => {
	return value.id;
};
const selection = ref(values.children[0]);
const example1 = "";
</script>
