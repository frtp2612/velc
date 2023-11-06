<template>
	<VModalWindow :content-component="contentComponent" ref="modal">
		<template #footer>
			<VButton :on-click="onYes">Yes</VButton>
			<VButton :on-click="onNo">No</VButton>
			<VButton :on-click="onCancel" v-if="onCancel">Cancel</VButton>
		</template>
	</VModalWindow>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VModalWindow from "@/components/VModalWindow";
import { ref } from "vue";

defineProps<{
	contentComponent: Object;
	onYes: () => void;
	onNo: () => void;
	onCancel?: () => void;
}>();

defineExpose<{
	open: () => void;
}>({ open });

const modal = ref<InstanceType<typeof VModalWindow>>();

function open() {
	modal.value?.open();
}
</script>
