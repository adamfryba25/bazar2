"use client";

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Image } from "@mantine/core";

export const UploadButton = generateUploadButton<OurFileRouter>();

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]?.url) {
          onUploadComplete(res[0].url);
        }
      }}
      onUploadError={(error) => {
        alert(`Chyba při nahrávání: ${error.message}`);
      }}
    />
  );
}
