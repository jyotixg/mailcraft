import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { parseAndValidateSchema } from '../../utils/schemaValidation';

export function ImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useEmailBuilder();
  const [raw, setRaw] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleClose = () => {
    setRaw('');
    setErrors([]);
    onClose();
  };

  const handleImport = () => {
    const result = parseAndValidateSchema(raw);
    if (!result.valid || !result.schema) {
      setErrors(result.errors);
      return;
    }
    dispatch({ type: 'LOAD_TEMPLATE', schema: result.schema });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Import Template JSON
        <IconButton onClick={handleClose} aria-label="Close import dialog">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Paste a MailCraft template schema below. It's validated structurally before loading — nothing here is ever
          executed as code.
        </Typography>
        <TextField
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          multiline
          minRows={12}
          maxRows={18}
          fullWidth
          placeholder='{"schemaVersion": 1, "template": {...}, "variables": [...], "blocks": [...]}'
          sx={{ fontFamily: 'monospace' }}
          slotProps={{ htmlInput: { style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 } } }}
        />
        {errors.length > 0 && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            {errors.map((error) => (
              <Alert key={error} severity="error" variant="outlined">
                {error}
              </Alert>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleImport} variant="contained" disabled={!raw.trim()}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
