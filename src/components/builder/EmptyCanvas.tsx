import InboxIcon from '@mui/icons-material/Inbox';
import { Box, Typography } from '@mui/material';

export function EmptyCanvas({ isOver }: { isOver: boolean }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 8,
        color: 'text.secondary',
        border: '2px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: 2,
        bgcolor: isOver ? 'action.hover' : 'transparent',
        transition: 'all 0.12s',
      }}
    >
      <InboxIcon fontSize="large" />
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        This email is empty
      </Typography>
      <Typography variant="caption">Drag a block from the library on the left to get started.</Typography>
    </Box>
  );
}
