import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button } from '@mui/material';
import { useState } from 'react';
import { formatBytes, MAX_IMAGE_FILE_SIZE, readImageFile } from '../../utils/image';

interface ImagePickerButtonProps {
  label?: string;
  onPicked: (dataUrl: string) => void;
  onError: (message: string) => void;
}

/** Shared "choose a local file, downscale it, hand back a data URL" control. */
export function ImagePickerButton({ label = 'Upload Image', onPicked, onError }: ImagePickerButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      onError(`Image is too large (max ${formatBytes(MAX_IMAGE_FILE_SIZE)}).`);
      return;
    }
    setIsProcessing(true);
    try {
      onPicked(await readImageFile(file));
    } catch {
      onError('Could not process that image. Try a different file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button size="small" variant="outlined" component="label" startIcon={<UploadFileIcon fontSize="small" />} disabled={isProcessing}>
      {isProcessing ? 'Processing…' : label}
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </Button>
  );
}
