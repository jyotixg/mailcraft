import { Box, Divider, Stack, Typography } from '@mui/material';
import { renderBlocks } from '../../engine/renderer';
import { replaceVariables } from '../../engine/variableEngine';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { usePreview } from '../../hooks/usePreview';
import { DevicePreview } from './DevicePreview';

export function EmailPreview() {
  const { state } = useEmailBuilder();
  const { values } = usePreview();
  const { template, blocks } = state.schema;

  const subject = replaceVariables(template.subject, values);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default' }}>
      <DevicePreview device={state.previewDevice}>
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              From: <strong>notifications@{template.category.toLowerCase().replace(/\s+/g, '')}.example.com</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {subject || <em>(no subject)</em>}
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <Box>{renderBlocks(blocks, values)}</Box>
      </DevicePreview>
    </Box>
  );
}
