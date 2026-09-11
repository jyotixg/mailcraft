import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import type { ValidationIssue } from '../../engine/validationEngine';
import { EmailCompatibilityPanel } from './EmailCompatibilityPanel';
import { ValidationItem, type CheckState } from './ValidationItem';

interface NamedCheck {
  label: string;
  isFailing: (issues: ValidationIssue[]) => ValidationIssue | undefined;
}

const NAMED_CHECKS: NamedCheck[] = [
  { label: 'Subject is present', isFailing: (issues) => issues.find((i) => i.id === 'subject-missing') },
  { label: 'All variables are defined', isFailing: (issues) => issues.find((i) => i.id.startsWith('unknown-var-')) },
  { label: 'Button URLs are valid', isFailing: (issues) => issues.find((i) => i.message === 'Button URL is required') },
  { label: 'Footer exists', isFailing: (issues) => issues.find((i) => i.id === 'no-footer') },
  { label: 'Images have alt text', isFailing: (issues) => issues.find((i) => i.message === 'Image is missing alt text') },
];

function scoreColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 85) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

export function ValidationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch, validation } = useEmailBuilder();
  const namedMessages = new Set(
    NAMED_CHECKS.flatMap((check) => {
      const failing = check.isFailing(validation.issues);
      return failing ? [failing.id] : [];
    }),
  );
  const otherIssues = validation.issues.filter((issue) => !namedMessages.has(issue.id));

  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: 400 } } }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
        <Stack direction="row" sx={{ mb: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Template Health</Typography>
          <IconButton onClick={onClose} aria-label="Close validation panel" size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'baseline' }}>
          <Typography variant="h4" color={`${scoreColor(validation.score)}.main`} sx={{ fontWeight: 700 }}>
            {validation.score}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            / 100
          </Typography>
          <Chip
            size="small"
            label={state.schema.template.status === 'ready' ? 'Ready' : 'Draft'}
            color={state.schema.template.status === 'ready' ? 'success' : 'default'}
            sx={{ ml: 'auto' }}
          />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={validation.score}
          color={scoreColor(validation.score)}
          sx={{ borderRadius: 4, height: 6, mb: 2 }}
        />

        <Stack spacing={1} sx={{ mb: 2 }}>
          {NAMED_CHECKS.map((check) => {
            const failing = check.isFailing(validation.issues);
            const stateValue: CheckState = failing ? failing.severity : 'pass';
            return <ValidationItem key={check.label} state={stateValue} message={check.label} />;
          })}
        </Stack>

        {otherIssues.length > 0 && (
          <>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Findings
            </Typography>
            <Stack spacing={1} sx={{ mb: 2 }}>
              {otherIssues.map((issue) => (
                <ValidationItem key={issue.id} state={issue.severity} message={issue.message} />
              ))}
            </Stack>
          </>
        )}

        <Divider sx={{ mb: 1.5 }} />
        <EmailCompatibilityPanel />

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Tooltip title={validation.canBeReady ? '' : 'Resolve all errors before marking Ready'}>
            <span>
              <Button
                fullWidth
                variant="contained"
                disabled={!validation.canBeReady || state.schema.template.status === 'ready'}
                onClick={() => dispatch({ type: 'SET_STATUS', status: 'ready' })}
              >
                Mark as Ready
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
}
