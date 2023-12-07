<template>
	<ComponentExampleTemplate component-name="VSwitcher">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="''">
				<VColorPicker v-model="model"> </VColorPicker>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VColorPicker from "@/components/VColorPicker/VColorPicker.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

const model = "rgb(230,20,250)";
</script>
