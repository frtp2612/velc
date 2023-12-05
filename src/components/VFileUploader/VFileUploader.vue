<template>
	<div class="w-full h-full grid min-h-0">
		<VDropZone
			class="flex flex-col gap-4 min-h-0"
			v-model="files"
			ref="dropZone"
			@files-selected="(filesList: any[]) => $emit('onFilesSelected', filesList)"
		>
			<template #default="{ dropZoneActive }">
				<div
					class="text-lg font-semibold flex h-full w-full items-center justify-center bg-color-bg-50 border rounded-lg p-6 cursor-pointer"
					:class="[
						dropZoneActive
							? 'border-color-primary text-color-primary'
							: 'hover:border-color-primary hover:text-color-primary border-color-border-50 text-color-text-500',
					]"
				>
					<VLabel v-if="dropZoneActive">Drop files to start the upload.</VLabel>
					<VLabel v-else>Drag or click to upload files.</VLabel>
				</div>
			</template>
			<template #before="{ filesList, events }">
				<div
					class="flex flex-col gap-2 overflow-y-auto p-4 bg-color-bg-50 rounded-lg no-after-cutoff"
					v-if="filesList!.length > 0"
				>
					<VFilePreview
						v-for="file in files"
						:key="file.id"
						:file-name="file.file.name"
						:file-size="file.file.size"
						:upload-progress="file.progress"
						:upload-status="file.status"
						@remove-file-click="events.removeFile(file)"
					/>
				</div>
			</template>
			<template #after="{ events }">
				<VButton :on-click="events.uploadFiles">Upload</VButton>
			</template>
		</VDropZone>
	</div>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/VLabel.vue";
import { useVModel } from "@vueuse/core";
import { ref } from "vue";
import VButton from "../VButton/index";
import VDropZone from "./VDropZone.vue";
import VFilePreview from "./VFilePreview.vue";
import type { UploadableFileType } from "./VFileUploaderState";

const dropZone = ref<InstanceType<typeof VDropZone> | null>(null);

const props = defineProps<{
	modelValue?: UploadableFileType[];
	files?: UploadableFileType[];
}>();

const emit = defineEmits(["update:modelValue", "onFilesSelected"]);

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

defineExpose({ files: files! });
</script>
