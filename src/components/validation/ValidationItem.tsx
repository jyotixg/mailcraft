import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Stack, Typography } from '@mui/material';
import type { ValidationSeverity } from '../../engine/validationEngine';

export type CheckState = 'pass' | ValidationSeverity;

export function ValidationItem({ state, message }: { state: CheckState; message: string }) {
  const Icon = state === 'pass' ? CheckCircleIcon : state === 'error' ? ErrorOutlineIcon : WarningAmberIcon;
  const color = state === 'pass' ? 'success' : state === 'error' ? 'error' : 'warning';

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
      <Icon fontSize="small" color={color} sx={{ mt: '1px', flexShrink: 0 }} />
      <Typography variant="body2">{message}</Typography>
    </Stack>
  );
}
