import TuneIcon from '@mui/icons-material/Tune';
import { Alert, Box, Divider, Stack, Typography } from '@mui/material';
import { blockRegistry } from '../../registry/blockRegistry';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { PropertyField } from './PropertyField';

export function PropertiesPanel() {
  const { state, dispatch, selectedBlock } = useEmailBuilder();

  if (!selectedBlock) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          color: 'text.secondary',
          p: 3,
          textAlign: 'center',
        }}
      >
        <TuneIcon />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          No block selected
        </Typography>
        <Typography variant="caption">Select a block on the canvas to edit its properties.</Typography>
      </Box>
    );
  }

  const entry = blockRegistry[selectedBlock.type];
  const errors = entry.validate ? entry.validate(selectedBlock.props as never) : [];
  const propsRecord = selectedBlock.props as unknown as Record<string, unknown>;

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
        {entry.label.toUpperCase()}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {entry.description}
      </Typography>

      {errors.length > 0 && (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {errors.map((message) => (
            <Alert key={message} severity="error" variant="outlined" sx={{ py: 0 }}>
              {message}
            </Alert>
          ))}
        </Stack>
      )}

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {entry.fields.map((field) => (
          <PropertyField
            key={field.key}
            config={field}
            value={propsRecord[field.key]}
            variables={state.schema.variables}
            onChange={(value) =>
              dispatch({
                type: 'UPDATE_BLOCK_PROPS',
                id: selectedBlock.id,
                patch: { [field.key]: value },
              })
            }
          />
        ))}
      </Stack>
    </Box>
  );
}
