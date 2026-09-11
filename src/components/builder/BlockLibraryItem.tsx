import { useDraggable } from '@dnd-kit/core';
import { Box, Paper, Typography } from '@mui/material';
import type { BlockRegistryEntry } from '../../registry/blockRegistry';
import type { EmailBlockType } from '../../types/blocks';

export interface LibraryDragData {
  source: 'library';
  blockType: EmailBlockType;
}

export function BlockLibraryItem({ entry }: { entry: BlockRegistryEntry<EmailBlockType> }) {
  const dragData: LibraryDragData = { source: 'library', blockType: entry.type };
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${entry.type}`,
    data: dragData,
  });

  const Icon = entry.icon;

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      variant="outlined"
      role="button"
      aria-label={`Drag ${entry.label} block into the canvas`}
      tabIndex={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        p: 1,
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        userSelect: 'none',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 1 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          flexShrink: 0,
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {entry.label}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap component="div">
          {entry.description}
        </Typography>
      </Box>
    </Paper>
  );
}
