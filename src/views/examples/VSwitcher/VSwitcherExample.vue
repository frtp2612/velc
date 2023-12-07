<template>
	<ComponentExampleTemplate component-name="VSwitcher">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="''">
				<VSwitcher :values="values"> </VSwitcher>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VSwitcher from "@/components/VSwitcher/VSwitcher.vue";
import { VCallableItem } from "@/enums/index";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { TranslationType } from "../../../enums/index";

const values: VCallableItem[] = Array.from(Array(3)).map((_, i) => {
	return {
		label: {
			type: TranslationType.RAW,
			value: "item" + i,
		},
		callback: () => {
			console.log("item %d was clicked", [i]);
		},
	};
});
</script>
