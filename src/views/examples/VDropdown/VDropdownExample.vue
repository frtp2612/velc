<template>
	<ComponentExampleTemplate title="VDropdown" component-name="VDropdown">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<VDropdown
					label="Dropdown"
					:values="values"
					v-model="dropDownSelection"
					append-to="body"
					:align="PopAlignment.RIGHT"
				>
				</VDropdown>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VDropdown from "@/components/VDropdown/VDropdown.vue";
import { PopAlignment } from "@/composables/UseAutoPopDirection";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const values = Array.from(Array(100)).map((_, i) => "item-" + i);
const dropDownSelection = ref(values[0]);

const example1 = `
<template>
	<VDropdown :values="values" v-model="dropDownSelection" \/>
<\/template>

<script lang="ts" setup>
import { ref } from "vue";

const values = Array.from(Array(10000)).map((_, i) => "item-" + i);
const selection = ref(values[0]);
<\/script>
`.trim();
</script>
