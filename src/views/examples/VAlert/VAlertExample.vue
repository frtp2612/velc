<template>
	<ComponentExampleTemplate component-name="VAlert">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<div class="grid w-full grid-cols-2 gap-4">
					<VAlert text="normal" :type="MessageType.NORMAL"></VAlert>
					<VAlert text="info" :type="MessageType.INFO"></VAlert>
					<VAlert text="alert" :type="MessageType.ALERT"></VAlert>
					<VAlert text="error" :type="MessageType.ERROR"></VAlert>
					<VAlert text="success" :type="MessageType.SUCCESS"></VAlert>
				</div>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script setup lang="ts">
import VAlert from "@/components/VAlert/index";
import { MessageType } from "@/enums";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

const example1 = ``.trim();
</script>
