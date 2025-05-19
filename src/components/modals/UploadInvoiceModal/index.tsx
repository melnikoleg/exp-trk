import React, { useRef, useState } from "react";
import { BaseModal } from "../BaseModal";
import styles from "./index.module.css";

interface UploadInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  error?: string;
  loading?: boolean;
}

export const UploadInvoiceModal: React.FC<UploadInvoiceModalProps> = ({
  open,
  onClose,
  onUpload,
  error,
  loading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      return "Only images files are allowed.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB.";
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      setSelectedFile(null);
      return;
    }
    setLocalError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div
        className={
          styles.uploadContainer + (dragActive ? " " + styles.dragActive : "")
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        data-testid="upload-drop-area"
      >
        <h3>Upload Invoice</h3>
        <p>Upload your invoice to automatically fill in the expense form</p>
        <input
          type="file"
          accept="image/jpeg"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleChange}
          data-testid="upload-input"
        />
        <p>
          Drag & drop a image invoice here, or{" "}
          <span
            className={styles.browse}
            onClick={() => inputRef.current?.click()}
          >
            browse
          </span>
        </p>
        {selectedFile && (
          <div className={styles.fileInfo}>{selectedFile.name}</div>
        )}
        {(localError || error) && (
          <div className={styles.error}>{localError || error}</div>
        )}
        <button
          className={styles.uploadButton}
          onClick={handleUpload}
          disabled={!selectedFile || !!localError || loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button
          className={styles.cancelButton}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </BaseModal>
  );
};
