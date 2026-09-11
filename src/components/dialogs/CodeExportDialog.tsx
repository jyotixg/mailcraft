import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { downloadFile } from '../../utils/download';

export interface CodeExportDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  code: string;
  filename: string;
  mimeType: string;
}

export function CodeExportDialog({ open, onClose, title, description, code, filename, mimeType }: CodeExportDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — ignore in this POC.
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton onClick={onClose} aria-label={`Close ${title.toLowerCase()} dialog`}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {description}
        </Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            bgcolor: 'grey.900',
            color: 'grey.100',
            borderRadius: 1,
            fontSize: 12,
            lineHeight: 1.6,
            maxHeight: '50vh',
            overflow: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          <code>{code}</code>
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ p: 1 }}>
          <Button startIcon={<ContentCopyIcon />} onClick={handleCopy} variant="outlined">
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button startIcon={<DownloadIcon />} onClick={() => downloadFile(filename, code, mimeType)} variant="contained">
            Download
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
