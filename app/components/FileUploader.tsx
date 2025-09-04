"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0] ?? null;
    onFileSelect?.(file);
  }, [onFileSelect]);

  const maxFileSize = 20 * 1024 * 1024; // 20MB

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    multiple: false,
    // IMPORTANT: include extensions for each MIME type
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: maxFileSize,
    onDropRejected: () => {
      // no-op; UI message below
    },
  });

  const file = acceptedFiles[0] ?? null;

  return (
    <div className="w-full gradient-border">
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-md transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file flex items-center space-x-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" alt="file" className="w-10 h-10" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
              </div>
              <button
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect?.(null);
                }}
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="w-20 h-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-lg text-gray-500">
                PDF/DOC/DOCX/PNG/ (max {formatSize(maxFileSize)})
              </p>
              {fileRejections.length > 0 && (
                <p className="text-sm text-red-600 mt-2">
                  Only PDF/DOC/DOCX up to {formatSize(maxFileSize)} are allowed.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
