import { Stack, Typography } from '@mui/material';
import { ValidationItem } from './ValidationItem';

const COMPATIBILITY_FACTS: { label: string; supported: boolean }[] = [
  { label: 'Responsive layout', supported: true },
  { label: 'Inline styles', supported: true },
  { label: 'Alt text on images', supported: true },
  { label: 'Table-based structure', supported: true },
  { label: 'External fonts', supported: false },
];

/** Informational only — does not attempt to emulate any specific email client. */
export function EmailCompatibilityPanel() {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Email Compatibility</Typography>
      <Typography variant="caption" color="text.secondary">
        The HTML export uses these techniques to render reliably across common email clients.
      </Typography>
      <Stack spacing={0.75} sx={{ mt: 0.5 }}>
        {COMPATIBILITY_FACTS.map((fact) => (
          <ValidationItem key={fact.label} state={fact.supported ? 'pass' : 'warning'} message={fact.label} />
        ))}
      </Stack>
    </Stack>
  );
}
