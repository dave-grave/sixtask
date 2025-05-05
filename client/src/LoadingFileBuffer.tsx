import React from "react";

export default function LoadingFileBuffer({
  uploadProgress,
}: {
  uploadProgress: number;
}) {
  return (
    <div className="space-y-2">
      <div className="h-2.5 w-full rounded-full bg-gray-200">
        <div
          className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">{uploadProgress}% completed</p>
    </div>
  );
}
