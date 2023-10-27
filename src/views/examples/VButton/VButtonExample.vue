<template>
	<ComponentExampleTemplate component-name="VButton">
		<ComponentExampleBlockTemplate title="Simple button">
			<VButton :on-click="changeButtonText">{{ buttonText }}</VButton>
		</ComponentExampleBlockTemplate>
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
</script>
