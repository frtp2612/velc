<template>
	<ComponentExampleTemplate component-name="VButton">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" :example="example1">
				<div class="flex gap-4">
					<VButton :on-click="changeButtonText">{{ buttonText }}</VButton>
					<VButton
						:on-click="changeButtonText"
						:type="VButtonTypes.SECONDARY"
						>{{ buttonText }}</VButton
					>
					<VButton :on-click="changeButtonText" :type="VButtonTypes.PRIMARY">{{
						buttonText
					}}</VButton>
					<VButton :on-click="changeButtonText" :type="VButtonTypes.ERROR">{{
						buttonText
					}}</VButton>
					<VButton :on-click="changeButtonText" :type="VButtonTypes.SUCCESS">{{
						buttonText
					}}</VButton>
				</div>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import { VButtonTypes } from "@/enums";
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
