import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import { Alert, Box, Button, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import type { ImageGroupItem } from '../../types/blocks';
import { generateId } from '../../utils/id';
import { ImagePickerButton } from './ImagePickerButton';

interface ImageListPropertyFieldProps {
  label: string;
  value: ImageGroupItem[];
  onChange: (value: ImageGroupItem[]) => void;
}

export function ImageListPropertyField({ label, value, onChange }: ImageListPropertyFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const items = Array.isArray(value) ? value : [];

  const updateItem = (id: string, patch: Partial<ImageGroupItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };
  const removeItem = (id: string) => onChange(items.filter((item) => item.id !== id));
  const addItem = () => onChange([...items, { id: generateId('img'), src: '', alt: '', linkUrl: '' }]);

  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>

      <Stack spacing={1.25}>
        {items.map((item, index) => (
          <Box key={item.id} sx={{ p: 1.25, border: 1, borderColor: 'divider', borderRadius: '10px' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '8px',
                  border: '1px solid #e2e4ee',
                  backgroundColor: '#f6f7fb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {item.src ? (
                  <Box component="img" src={item.src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <ImageIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                )}
              </Box>
              <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Image {index + 1}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <ImagePickerButton
                      label={item.src ? 'Replace' : 'Upload'}
                      onPicked={(dataUrl) => {
                        setError(null);
                        updateItem(item.id, { src: dataUrl });
                      }}
                      onError={setError}
                    />
                    <Tooltip title="Remove image">
                      <IconButton size="small" color="error" onClick={() => removeItem(item.id)} aria-label={`Remove image ${index + 1}`}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Alt text"
                  value={item.alt}
                  onChange={(e) => updateItem(item.id, { alt: e.target.value })}
                />
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Link URL (optional)"
                  value={item.linkUrl}
                  onChange={(e) => updateItem(item.id, { linkUrl: e.target.value })}
                />
              </Stack>
            </Stack>
          </Box>
        ))}
        {items.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            No images yet — add one below.
          </Typography>
        )}
      </Stack>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ py: 0 }}>
          {error}
        </Alert>
      )}

      <Button size="small" variant="outlined" startIcon={<AddIcon fontSize="small" />} onClick={addItem}>
        Add Image
      </Button>
    </Stack>
  );
}
