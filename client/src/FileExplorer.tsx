import React, { useState, ChangeEvent } from "react";
import LoadingFileBuffer from "./LoadingFileBuffer";
import axios from "axios";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileExplorer() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0); // reset upload progress every time new file is uploaded

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("https://httpbin.org/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // update upload progress and save into uploadProgress
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      setStatus("success");
      setUploadProgress(100);
    } catch {
      setStatus("error");
      setUploadProgress(0);
    }
  };

  return (
    <div className="py-8 flex flex-col items-center h-screen justify-between">
      <div className="flex-grow flex items-center justify-center">
        <input
          className="block w-full text-sm text-gray-500 
          file:mr-4 file:py-2 file:px-4 file:rounded file:border-solid 
          file:text-sm file:font-semibold file:bg-gray-200 
          file:text-blue-700 hover:file:bg-gray-500 file:transition file:duration-300 "
          type="file"
          onChange={handleFileChange}
        ></input>
      </div>

      {file && (
        <div className="mb-4 text-sm flex-grow flex flex-col items-center justify-center">
          <p>File name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type}</p>
        </div>
      )}

      {file && (
        <div className="flex-grow flex-col flex items-center justify-center">
          <button
            type="button"
            className={`px-4 py-2 rounded transition ${
              status === "uploading"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 transition px-4 py-2 rounded"
            }`}
            onClick={handleFileUpload}
            disabled={status === "uploading"}
          >
            {status === "uploading" ? (
              <LoadingFileBuffer uploadProgress={uploadProgress} />
            ) : (
              "upload a file..."
            )}
          </button>

          {status === "success" && (
            <div>
              <p className="text-sm text-green-600">
                file uploaded successfully!
              </p>
            </div>
          )}

          {status === "error" && (
            <div>
              <p className="text-sm text-red-600">file upload failed</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
