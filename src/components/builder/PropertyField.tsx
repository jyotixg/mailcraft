import {
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, type ChangeEvent } from 'react';
import type { PropertyFieldConfig } from '../../registry/propertyRegistry';
import type { TemplateVariable } from '../../types/variables';
import { VariablePicker } from '../variables/VariablePicker';

interface PropertyFieldProps {
  config: PropertyFieldConfig;
  value: unknown;
  onChange: (value: string | number | boolean) => void;
  variables: TemplateVariable[];
}

export function PropertyField({ config, value, onChange, variables }: PropertyFieldProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const insertAtCursor = (name: string) => {
    const token = `{{${name}}}`;
    const el = inputRef.current;
    const current = String(value ?? '');
    if (el && typeof el.selectionStart === 'number') {
      const start = el.selectionStart;
      const end = el.selectionEnd ?? start;
      const next = current.slice(0, start) + token + current.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        const cursor = start + token.length;
        el.setSelectionRange(cursor, cursor);
      });
    } else {
      onChange(current + token);
    }
  };

  if (config.type === 'boolean') {
    return (
      <FormControlLabel
        control={<Switch checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} size="small" />}
        label={config.label}
      />
    );
  }

  if (config.type === 'select') {
    return (
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {config.label}
        </Typography>
        <Select
          size="small"
          fullWidth
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          inputProps={{ 'aria-label': config.label }}
        >
          {(config.options ?? []).map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    );
  }

  if (config.type === 'number') {
    return (
      <TextField
        label={config.label}
        type="number"
        size="small"
        fullWidth
        value={value as number}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        slotProps={{ htmlInput: { min: config.min, max: config.max, step: config.step ?? 1 } }}
        helperText={config.helperText}
      />
    );
  }

  if (config.type === 'color') {
    return (
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {config.label}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(String(value)) ? String(value) : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            aria-label={config.label}
            style={{ width: 36, height: 36, padding: 0, border: '1px solid #dee2e6', borderRadius: 6, cursor: 'pointer' }}
          />
          <TextField
            size="small"
            fullWidth
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${config.label} hex value`}
          />
        </Stack>
      </Stack>
    );
  }

  const isMultiline = config.type === 'textarea';
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value);

  return (
    <TextField
      label={config.label}
      size="small"
      fullWidth
      multiline={isMultiline}
      minRows={isMultiline ? 3 : undefined}
      value={String(value ?? '')}
      onChange={handleTextChange}
      helperText={config.helperText}
      inputRef={inputRef}
      slotProps={{
        input: config.supportsVariables
          ? {
              endAdornment: (
                <InputAdornment position="end" sx={{ alignSelf: isMultiline ? 'flex-end' : 'center', mb: isMultiline ? 0.5 : 0 }}>
                  <VariablePicker variables={variables} onInsert={insertAtCursor} />
                </InputAdornment>
              ),
            }
          : undefined,
      }}
    />
  );
}
