<template>
	<ComponentExampleTemplate component-name="VCheckBox">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<VCheckBox id="checkbox" v-model="selection" resettable> </VCheckBox>
				{{ selection }}
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script setup lang="ts">
import VCheckBox from "@/components/VCheckBox/VCheckBox.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const selection = ref(undefined);

const example1 = "";
</script>
