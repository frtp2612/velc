<template>
	<ComponentExampleTemplate component-name="VPopover">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<VPopover> </VPopover>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VPopover from "@/components/VPopover/VPopover.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

const example1 = "";
</script>
