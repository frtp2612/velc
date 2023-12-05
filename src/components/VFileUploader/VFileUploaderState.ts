import { type Ref } from "vue";
import useFileUploader from "../../composables/UseFileUploader";
import { UploadStatus } from "../../enums/index";

export function VFileUploaderState(
	uploadUrl: string,
	files: Ref<UploadableFileType[] | undefined>
) {
	const fileUploader = useFileUploader(uploadUrl);

	function addFiles(newFiles: FileList) {
		let newUploadableFiles: UploadableFileType[] = [...newFiles]
			.map((file) => new UploadableFile(file))
			.filter((file) => !fileExists(file.id));
		files.value = files.value!.concat(newUploadableFiles);
	}

	function fileExists(otherId: string) {
		return files.value!.some(({ id }) => id === otherId);
	}

	function removeFile(file: UploadableFileType) {
		const index = files.value!.indexOf(file);

		if (index > -1) files.value!.splice(index, 1);
	}

	function uploadFiles() {
		fileUploader.uploadFiles(files.value!);
	}

	function uploadFile(file: UploadableFileType) {
		fileUploader.uploadFile(file);
	}

	return { files, addFiles, removeFile, uploadFile, uploadFiles };
}

export type UploadableFileType = {
	id: string;
	file: File;
	url: string;
	status: UploadStatus;
	progress: number;
};

export class UploadableFile {
	id: string;
	file: File;
	url: string;
	status: UploadStatus;
	progress: number;

	constructor(file: File) {
		this.file = file;
		this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
		this.url = URL.createObjectURL(file);
		this.status = UploadStatus.NONE;
		this.progress = 0;
	}
}
