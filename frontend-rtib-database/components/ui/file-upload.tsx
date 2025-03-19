"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  id: string;
  label?: string;
  accept?: string;
  maxSize?: number; // Size in MB
  currentImageUrl?: string;
  onFileSelect: (file: File | null) => void;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
  isUploading?: boolean;
}

export function FileUpload({
  id,
  label,
  accept = "image/*",
  maxSize = 5, // Default 5MB
  currentImageUrl,
  onFileSelect,
  onClear,
  className,
  disabled = false,
  isUploading = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  // Reset preview when currentImageUrl changes
  useEffect(() => {
    if (!preview) {
      setImageError(false);
    }
  }, [preview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);
    setImageError(false);

    if (!file) {
      setPreview(null);
      onFileSelect(null);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB`);
      e.target.value = "";
      return;
    }

    // Create a preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent div's click handler
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreview(null);
    setError(null);
    setImageError(false);
    onFileSelect(null);
    if (onClear) onClear();
  };

  const handleImageError = () => {
    setImageError(true);
    // If the image fails to load, we should allow user to upload a new one
    if (onClear) onClear();
  };

  const displayImage = preview || (currentImageUrl && !imageError ? currentImageUrl : null);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="flex flex-col items-center gap-4">
        {displayImage && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
            <Image
              src={displayImage}
              alt="Preview"
              fill
              className="object-cover"
              priority
              onError={handleImageError}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={handleClear}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!displayImage && (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50 transition",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 mb-2" />
            <p className="text-sm text-center">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-center mt-1">
              Max size: {maxSize}MB
            </p>
          </div>
        )}

        <Input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {!displayImage && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Select File"
            )}
          </Button>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
} 