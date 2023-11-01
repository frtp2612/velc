<template>
	<ComponentExampleTemplate component-name="VButton">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<VButton :on-click="changeButtonText">{{ buttonText }}</VButton>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const buttonText = ref("Button");

function changeButtonText() {
	buttonText.value = "Button clicked!";
}

const example1 = `
<template>
	<VButton :on-click="changeButtonText">{{ buttonText }}<\/VButton>
<\/template>

<script lang="ts" setup>
import VButton from "@/components/VButton/index";
import { ref } from "vue";

const buttonText = ref("Button");

function changeButtonText() {
	buttonText.value = "Button clicked!";
}
<\/script>
`.trim();
</script>
