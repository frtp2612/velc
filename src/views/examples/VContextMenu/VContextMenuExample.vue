<template>
	<ComponentExampleTemplate component-name="VContextMenu">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<VButton :type="VButtonTypes.PRIMARY" ref="target"
					>Testing context menu</VButton
				>
				<VContextMenu :items="items" :attach-to="target?.$el"> </VContextMenu>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VButton from "@/components/VButton/index";
import VContextMenu from "@/components/VContextMenu/VContextMenu.vue";
import { TranslationType, VButtonTypes, VInteractiveItem } from "@/enums/index";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ComponentPublicInstance, ref } from "vue";

const target = ref<ComponentPublicInstance | null>(null);

const items: VInteractiveItem[] = Array.from(Array(5)).map((_, i) => {
	return {
		callback: () => console.log("Item " + i + " was clicked"),
		label: {
			type: TranslationType.RAW,
			value: "Item " + i,
		},
	};
});

const example1 = "";
</script>
