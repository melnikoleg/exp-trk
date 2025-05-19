import React from "react";
import { UploadInvoiceModal } from "../components/modals/UploadInvoiceModal";

export default {
  title: "Modals/UploadInvoiceModal",
  component: UploadInvoiceModal,
};

export const Default = () => (
  <UploadInvoiceModal open onClose={() => {}} onUpload={() => {}} />
);

export const WithError = () => (
  <UploadInvoiceModal
    open
    onClose={() => {}}
    onUpload={() => {}}
    error="Only JPG files are allowed."
  />
);

export const Loading = () => (
  <UploadInvoiceModal open onClose={() => {}} onUpload={() => {}} loading />
);
