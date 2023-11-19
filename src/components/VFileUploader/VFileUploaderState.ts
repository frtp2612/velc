import { ref } from "vue";
import useFileUploader from "../../composables/UseFileUploader";
import { UploadStatus } from "../../enums/index";

export function VFileUploaderState(uploadUrl: string) {
  const files = ref<UploadableFile[]>([]);

  const fileUploader = useFileUploader(uploadUrl);

  function addFiles(newFiles: FileList) {
    let newUploadableFiles: UploadableFile[] = [...newFiles]
      .map((file) => new UploadableFile(file))
      .filter((file) => !fileExists(file.id));
    files.value = files.value.concat(newUploadableFiles);
  }

  function fileExists(otherId: string) {
    return files.value.some(({ id }) => id === otherId);
  }

  function removeFile(file: UploadableFile) {
    const index = files.value.indexOf(file);

    if (index > -1) files.value.splice(index, 1);
  }

  function uploadFiles() {
    fileUploader.uploadFiles(files.value);
  }

  function uploadFile(file: UploadableFile) {
    fileUploader.uploadFile(file);
  }

  return { files, addFiles, removeFile, uploadFile, uploadFiles };
}

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
