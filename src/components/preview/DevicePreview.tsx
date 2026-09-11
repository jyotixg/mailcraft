import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import type { PreviewDevice } from '../../types/email';

const WIDTHS: Record<PreviewDevice, number> = {
  desktop: 640,
  mobile: 375,
};

export function DevicePreview({ device, children }: { device: PreviewDevice; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
      <Box
        sx={{
          width: WIDTHS[device],
          maxWidth: '100%',
          transition: 'width 0.2s ease',
          bgcolor: 'background.paper',
          borderRadius: device === 'mobile' ? 4 : 2,
          border: 1,
          borderColor: 'divider',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
