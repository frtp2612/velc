<template>
	<div>
		<slot
			name="before"
			:filesList="files"
			:events="{ addFiles, removeFile, uploadFile, uploadFiles }"
		/>
		<div
			@dragenter.prevent="setActive"
			@dragover.prevent="setActive"
			@dragleave.prevent="setInactive"
			@drop.prevent="onDrop"
			@click="simulateInputClick"
		>
			<input
				type="file"
				class="hidden"
				@change="onFilesSelected"
				ref="fileInput"
			/>
			<slot
				:dropZoneActive="active"
				:filesList="files"
				:events="{ addFiles, removeFile }"
			>
			</slot>
		</div>
		<slot
			name="after"
			:filesList="files"
			:events="{ addFiles, removeFile, uploadFile, uploadFiles }"
		/>
	</div>
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { ref } from "vue";
import { UploadableFileType, VFileUploaderState } from "./VFileUploaderState";

const emit = defineEmits(["update:modelValue", "files-selected"]);

const props = withDefaults(
	defineProps<{
		uploadUrl?: string;
		modelValue?: UploadableFileType[];
	}>(),
	{
		uploadUrl: "",
	}
);

const files = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
				defaultValue: [],
		  }
);

// Create `active` state and manage it with functions
const active = ref(false);
const inActiveTimeout = ref();
const fileInput = ref<HTMLInputElement>();

const { addFiles, removeFile, uploadFile, uploadFiles } = VFileUploaderState(
	props.uploadUrl,
	files
);

function setActive() {
	active.value = true;
	clearTimeout(inActiveTimeout.value);
}
function setInactive() {
	inActiveTimeout.value = setTimeout(() => {
		active.value = false;
	}, 50);
}

function simulateInputClick() {
	fileInput.value?.click();
}

function onDrop(e: DragEvent) {
	setInactive();
	emit("files-selected", [...e.dataTransfer!.files]);
	addFiles(e.dataTransfer!.files);
}

function onFilesSelected(e: Event) {
	setInactive();
	emit("files-selected", [...(e.target as HTMLInputElement).files!]);
	addFiles((e.target as HTMLInputElement).files!);
}

defineExpose({ files });
</script>
