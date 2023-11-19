import axios from "axios";
import { UploadableFile } from "../components/VFileUploader/VFileUploaderState";
import { UploadStatus } from "@/enums";

export async function uploadFile(file: UploadableFile, url: string) {
  // set up the request data
  let formData = new FormData();
  formData.append("file", file.file);

  // track status and upload file
  file.status = UploadStatus.LOADING;

  try {
    let response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress(progressEvent: any) {
        onUploadProgress(progressEvent, file);
      },
    });
    // change status to indicate the success of the upload request
    file.status =
      response.status === 201 ? UploadStatus.SUCCESS : UploadStatus.ERROR;

    return response;
  } catch (error: any) {
    file.status = UploadStatus.ERROR;
  }

  return new Promise(() => false);
}

const onUploadProgress = (
  progressEvent: ProgressEvent,
  file: UploadableFile
) => {
  const { loaded, total } = progressEvent;
  let percent = Math.floor((loaded * 100) / total);

  file.progress = percent;

  if (percent < 100) {
    console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
  }
};

export function uploadFiles(files: UploadableFile[], url: string) {
  return Promise.all(files.map((file) => uploadFile(file, url)));
}

export default function useFileUploader(url: string) {
  return {
    uploadFile: function (file: UploadableFile) {
      return uploadFile(file, url);
    },
    uploadFiles: function (files: UploadableFile[]) {
      return uploadFiles(files, url);
    },
  };
}
