import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { estimateDataUrlSize, formatBytes, isDataUrlImage } from '../../utils/image';
import { ImagePickerButton } from './ImagePickerButton';

interface ImagePropertyFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ImagePropertyField({ label, value, onChange }: ImagePropertyFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const isUploaded = isDataUrlImage(value);

  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '10px',
            border: '1px solid #e2e4ee',
            backgroundColor: '#f6f7fb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {value ? (
            <Box component="img" src={value} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <UploadFileIcon fontSize="small" sx={{ color: 'text.disabled' }} />
          )}
        </Box>

        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1}>
            <ImagePickerButton
              onPicked={(dataUrl) => {
                setError(null);
                onChange(dataUrl);
              }}
              onError={setError}
            />
            {value && (
              <Button
                size="small"
                color="inherit"
                startIcon={<CloseIcon fontSize="small" />}
                onClick={() => onChange('')}
              >
                Remove
              </Button>
            )}
          </Stack>
          {isUploaded && (
            <Typography variant="caption" color="text.secondary" noWrap>
              Uploaded image · {formatBytes(estimateDataUrlSize(value))}
            </Typography>
          )}
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ py: 0 }}>
          {error}
        </Alert>
      )}

      <TextField
        size="small"
        fullWidth
        label="or paste an image URL"
        value={isUploaded ? '' : value}
        placeholder="https://…"
        disabled={isUploaded}
        onChange={(e) => onChange(e.target.value)}
        helperText={isUploaded ? 'Remove the uploaded image to use a URL instead' : undefined}
      />
    </Stack>
  );
}
