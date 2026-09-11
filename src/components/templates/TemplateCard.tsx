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

export function TemplateCard({ schema, onOpen, onDuplicate, onDelete }: TemplateCardProps) {
  const { template } = schema;

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
          <Chip label={template.category} size="small" />
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
