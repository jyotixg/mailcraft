import { Box, Stack, TextField, Typography } from '@mui/material';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { usePreview } from '../../hooks/usePreview';

export function PreviewDataPanel() {
  const { state } = useEmailBuilder();
  const { values, setValue } = usePreview();
  const { variables } = state.schema;

  if (variables.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No variables defined yet. Add some from the Variables panel to populate sample data here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        Preview Data
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Values used to resolve {'{{tokens}}'} in the preview below.
      </Typography>
      <Stack spacing={1.5}>
        {variables.map((variable) => (
          <TextField
            key={variable.id}
            label={variable.name}
            size="small"
            fullWidth
            type={variable.type === 'number' ? 'number' : 'text'}
            value={values[variable.name] ?? ''}
            onChange={(e) => setValue(variable.name, e.target.value)}
            helperText={variable.description || undefined}
          />
        ))}
      </Stack>
    </Box>
  );
}
