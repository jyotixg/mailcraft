import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { extractAllVariableUsages } from '../../engine/variableEngine';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { generateId } from '../../utils/id';
import { VariableEditor, type VariableFormData } from './VariableEditor';

export function VariablePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useEmailBuilder();
  const { variables } = state.schema;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const usage = useMemo(() => extractAllVariableUsages(state.schema), [state.schema]);
  const existingNames = variables.map((v) => v.name);

  const handleAdd = (data: VariableFormData) => {
    dispatch({ type: 'ADD_VARIABLE', variable: { id: generateId('var'), ...data } });
    setEditingId(null);
  };

  const handleUpdate = (id: string, data: VariableFormData) => {
    dispatch({ type: 'UPDATE_VARIABLE', id, patch: data });
    setEditingId(null);
  };

  const handleCopy = async (name: string, id: string) => {
    try {
      await navigator.clipboard.writeText(`{{${name}}}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    } catch {
      // Clipboard API unavailable — ignore in this POC.
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: 380 } } }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" sx={{ mb: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Variables</Typography>
          <IconButton onClick={onClose} aria-label="Close variables panel" size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Define reusable tokens like <code>{'{{userName}}'}</code> that can be dropped into any text field.
        </Typography>

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Stack spacing={1.25}>
            {variables.map((variable) =>
              editingId === variable.id ? (
                <VariableEditor
                  key={variable.id}
                  initial={variable}
                  existingNames={existingNames}
                  onSubmit={(data) => handleUpdate(variable.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <Box key={variable.id} sx={{ p: 1.25, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          {`{{${variable.name}}}`}
                        </Typography>
                        <Chip label={variable.type} size="small" variant="outlined" />
                        {usage.used.has(variable.name) ? (
                          <Tooltip title="Used in this template">
                            <CheckCircleIcon fontSize="small" color="success" aria-label="Used" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Not referenced anywhere in this template">
                            <WarningAmberIcon fontSize="small" color="warning" aria-label="Unused" />
                          </Tooltip>
                        )}
                      </Stack>
                      {variable.description && (
                        <Typography variant="caption" color="text.secondary">
                          {variable.description}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row">
                      <Tooltip title={copiedId === variable.id ? 'Copied!' : 'Copy token'}>
                        <IconButton size="small" onClick={() => handleCopy(variable.name, variable.id)} aria-label="Copy variable token">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setEditingId(variable.id)} aria-label="Edit variable">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => dispatch({ type: 'DELETE_VARIABLE', id: variable.id })}
                          aria-label="Delete variable"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Box>
              ),
            )}

            {editingId === 'new' && (
              <VariableEditor existingNames={existingNames} onSubmit={handleAdd} onCancel={() => setEditingId(null)} />
            )}
          </Stack>
        </Box>

        {editingId !== 'new' && (
          <Button startIcon={<AddIcon />} onClick={() => setEditingId('new')} sx={{ mt: 2 }} variant="outlined">
            Add Variable
          </Button>
        )}
      </Box>
    </Drawer>
  );
}
