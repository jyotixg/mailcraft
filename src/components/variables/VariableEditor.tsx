import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import type { TemplateVariable, VariableType } from '../../types/variables';

export interface VariableFormData {
  name: string;
  type: VariableType;
  description: string;
}

interface VariableEditorProps {
  initial?: TemplateVariable;
  existingNames: string[];
  onSubmit: (data: VariableFormData) => void;
  onCancel: () => void;
}

const NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export function VariableEditor({ initial, existingNames, onSubmit, onCancel }: VariableEditorProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState<VariableType>(initial?.type ?? 'string');
  const [description, setDescription] = useState(initial?.description ?? '');

  const trimmedName = name.trim();
  const isDuplicate = existingNames.some((n) => n === trimmedName && n !== initial?.name);
  const isInvalidFormat = trimmedName.length > 0 && !NAME_PATTERN.test(trimmedName);
  const error = trimmedName.length === 0 ? '' : isDuplicate ? 'A variable with this name already exists' : isInvalidFormat ? 'Use letters, numbers and underscores, starting with a letter' : '';
  const canSubmit = trimmedName.length > 0 && !error;

  return (
    <Stack
      spacing={1.5}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit({ name: trimmedName, type, description: description.trim() });
      }}
      sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'action.hover' }}
    >
      <TextField
        label="Variable Name"
        size="small"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={Boolean(error)}
        helperText={error || 'Referenced as {{' + (trimmedName || 'name') + '}}'}
      />
      <TextField label="Type" size="small" select value={type} onChange={(e) => setType(e.target.value as VariableType)}>
        <MenuItem value="string">String</MenuItem>
        <MenuItem value="number">Number</MenuItem>
      </TextField>
      <TextField
        label="Description"
        size="small"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What is this variable for?"
      />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="small" type="submit" variant="contained" disabled={!canSubmit}>
          {initial ? 'Save' : 'Add Variable'}
        </Button>
      </Stack>
    </Stack>
  );
}
