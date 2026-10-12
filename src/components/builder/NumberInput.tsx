import { TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
}

/**
 * A number field that lets the user actually clear it while typing a new
 * value. A plain controlled `<input type="number" value={n}>` snaps back to
 * showing "0" the instant the field is emptied (since onChange('') has to
 * map to *some* number), which makes backspacing feel broken. This keeps a
 * local text buffer so an empty/in-progress value doesn't get overwritten
 * by the last committed number until the field is actually left empty on
 * blur.
 */
export function NumberInput({ label, value, onChange, min = 0, max, step = 1, helperText, ariaLabel, fullWidth = true }: NumberInputProps) {
  const [text, setText] = useState(String(value));
  const lastCommittedRef = useRef(value);

  useEffect(() => {
    if (value !== lastCommittedRef.current) {
      setText(String(value));
      lastCommittedRef.current = value;
    }
  }, [value]);

  const commit = (raw: string) => {
    if (raw === '' || raw === '-') return;
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      lastCommittedRef.current = parsed;
      onChange(parsed);
    }
  };

  return (
    <TextField
      label={label}
      type="number"
      size="small"
      fullWidth={fullWidth}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        commit(e.target.value);
      }}
      onBlur={() => {
        if (text === '' || text === '-' || Number.isNaN(Number(text))) {
          setText(String(min));
          lastCommittedRef.current = min;
          onChange(min);
        }
      }}
      helperText={helperText}
      slotProps={{ htmlInput: { min, max, step, 'aria-label': ariaLabel } }}
    />
  );
}
