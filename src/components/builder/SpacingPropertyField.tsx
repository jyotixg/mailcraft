import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { normalizeSpacing, uniformSpacing, type Spacing } from '../../utils/spacing';
import { NumberInput } from './NumberInput';

interface SpacingPropertyFieldProps {
  label: string;
  value: unknown;
  onChange: (value: Spacing) => void;
}

const SIDES: { key: keyof Spacing; label: string }[] = [
  { key: 'top', label: 'T' },
  { key: 'right', label: 'R' },
  { key: 'bottom', label: 'B' },
  { key: 'left', label: 'L' },
];

/**
 * A compact 4-sided spacing editor (used for both padding and margin).
 * Sides are independent by default — each field only changes itself.
 * Turning "link" on is an opt-in convenience for setting all four sides at
 * once, not the default behavior.
 */
export function SpacingPropertyField({ label, value, onChange }: SpacingPropertyFieldProps) {
  const spacing = normalizeSpacing(value);
  const [linked, setLinked] = useState(false);

  const updateSide = (side: keyof Spacing, next: number) => {
    onChange(linked ? uniformSpacing(next) : { ...spacing, [side]: next });
  };

  return (
    <Stack spacing={0.75}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Tooltip title={linked ? 'Unlink sides' : 'Link all sides to the same value'}>
          <IconButton
            size="small"
            onClick={() => setLinked((prev) => !prev)}
            color={linked ? 'primary' : 'default'}
            aria-label={linked ? 'Unlink sides' : 'Link sides'}
          >
            {linked ? <LinkIcon fontSize="small" /> : <LinkOffIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={1}>
        {SIDES.map((side) => (
          <NumberInput
            key={side.key}
            label={side.label}
            value={spacing[side.key]}
            onChange={(next) => updateSide(side.key, next)}
            min={0}
            max={128}
            ariaLabel={`${label} ${side.key}`}
          />
        ))}
      </Stack>
    </Stack>
  );
}
