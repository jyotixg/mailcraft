import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LockIcon from '@mui/icons-material/Lock';
import { Box, Button, Card, CardActions, CardContent, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import type { EmailTemplateSchema } from '../../types/email';
import { formatLastModified } from '../../utils/formatDate';

interface TemplateCardProps {
  schema: EmailTemplateSchema;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete?: () => void;
}

const CATEGORY_ACCENT: Record<string, string> = {
  Authentication: '#4f46e5',
  Security: '#f04438',
  Subscription: '#8b5cf6',
  Payment: '#0d9488',
  Onboarding: '#f59e0b',
};

function categoryAccent(category: string): string {
  return CATEGORY_ACCENT[category] ?? '#64748b';
}

export function TemplateCard({ schema, onOpen, onDuplicate, onDelete }: TemplateCardProps) {
  const { template } = schema;
  const accent = categoryAccent(template.category);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
        '&:hover': {
          boxShadow: '0 10px 24px -8px rgba(16, 24, 40, 0.18)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ height: 4, backgroundColor: accent }} />
      <CardContent sx={{ flex: 1 }}>
        <Stack direction="row" sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {template.name}
          </Typography>
          {template.isBuiltIn && (
            <Tooltip title="Built-in template">
              <LockIcon fontSize="small" color="disabled" />
            </Tooltip>
          )}
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ mb: 1.5 }}>
          <Chip
            label={template.category}
            size="small"
            sx={{ backgroundColor: `${accent}1a`, color: accent }}
          />
          <Chip
            label={template.status === 'ready' ? 'Ready' : 'Draft'}
            size="small"
            color={template.status === 'ready' ? 'success' : 'default'}
            variant={template.status === 'ready' ? 'filled' : 'outlined'}
          />
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontStyle: 'italic',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          "{template.subject || 'No subject set'}"
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last modified: {formatLastModified(template.lastModified)}
        </Typography>
      </CardContent>
      <Box sx={{ px: 2 }}>
        <CardActions disableSpacing sx={{ px: 0, justifyContent: 'space-between' }}>
          <Button size="small" variant="contained" onClick={onOpen}>
            Open
          </Button>
          <Stack direction="row">
            <Tooltip title="Duplicate">
              <IconButton size="small" onClick={onDuplicate} aria-label={`Duplicate ${template.name}`}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {onDelete && (
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={onDelete} aria-label={`Delete ${template.name}`}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </CardActions>
      </Box>
    </Card>
  );
}
