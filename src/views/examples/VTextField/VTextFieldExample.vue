<template>
	<ComponentExampleTemplate component-name="VTextField">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<VTextField id="text-field-1" v-model="text" />
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>
<script lang="ts" setup>
import VTextField from "@/components/VTextField/VTextField.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const text = ref("I have an initial text!");

const example1 = "";
</script>
