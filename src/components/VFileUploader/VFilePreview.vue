<template>
	<div
		class="flex gap-4 bg-color-bg border border-color-border-50 items-center justify-between rounded-lg p-4"
	>
		<div class="flex flex-col gap-2 w-full">
			<div class="flex gap-4 items-center">
				<VLabel class="font-semibold">{{ fileName }}</VLabel>
				<VLabel
					class="px-2 py-1 bg-color-secondary-50 border border-color-secondary-100 rounded-md text-color-secondary-500 font-semibold text-sm"
					>{{ formatBytes(fileSize) }}</VLabel
				>
				<VLabel
					v-if="message"
					class="font-semibold text-sm"
					:class="messageColor"
					>{{ message }}</VLabel
				>
				<VLabel class="ml-auto">{{ uploadProgress }}%</VLabel>
			</div>
			<VProgressBar :model-value="uploadProgress" hide-progress />
		</div>
		<div class="flex gap-4 items-center">
			<!-- <div
        class="flex rounded-full aspect-square"
        :class="iconColor"
        v-if="icon"
      >
        <font-awesome-icon :icon="icon" class="h-4 w-4 p-2" />
      </div> -->
			<VButton
				:on-click="() => $emit('removeFileClick')"
				icon-left="fa-trash-can"
				v-if="!icon || uploadStatus === UploadStatus.ERROR"
				v-tooltip="{ text: 'Remove' }"
			></VButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/VLabel.vue";
import { UploadStatus } from "@/enums/index";
import { computed } from "vue";
import { formatBytes } from "../../utilities/index";
import VProgressBar from "../VProgressBar/index";

const props = defineProps<{
	fileName: string;
	fileSize: number;
	uploadProgress: number;
	uploadStatus: UploadStatus;
}>();

const emit = defineEmits(["removeFileClick"]);

const icon = computed(() => {
	switch (props.uploadStatus) {
		case UploadStatus.ERROR:
			return "fa-xmark";
		case UploadStatus.SUCCESS:
			return "fa-check";
		default:
			return undefined;
	}
});

// const iconColor = computed(() => {
// 	switch (props.uploadStatus) {
// 		case UploadStatus.ERROR:
// 			return "bg-color-error/30 text-color-error";
// 		case UploadStatus.SUCCESS:
// 			return "bg-color-success/30 text-color-success";
// 		default:
// 			return undefined;
// 	}
// });

const messageColor = computed(() => {
	switch (props.uploadStatus) {
		case UploadStatus.ERROR:
			return "text-color-error";
		case UploadStatus.SUCCESS:
			return "text-color-success";
		default:
			return undefined;
	}
});

const message = computed(() => {
	switch (props.uploadStatus) {
		case UploadStatus.ERROR:
			return "Upload failed";
		case UploadStatus.SUCCESS:
			return "Upload successful";
		default:
			return undefined;
	}
});
</script>

<style scoped></style>
