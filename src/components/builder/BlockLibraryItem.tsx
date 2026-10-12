import { useDraggable } from '@dnd-kit/core';
import { Box, Paper, Typography } from '@mui/material';
import type { BlockRegistryEntry } from '../../registry/blockRegistry';
import type { BlockGroup, EmailBlockType } from '../../types/blocks';

export interface LibraryDragData {
  source: 'library';
  blockType: EmailBlockType;
}

export const GROUP_ACCENT: Record<BlockGroup, string> = {
  content: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  layout: 'linear-gradient(135deg, #64748b, #475569)',
  fintech: 'linear-gradient(135deg, #14b8a6, #0d9488)',
  common: 'linear-gradient(135deg, #f59e0b, #d97706)',
};

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
        borderRadius: '10px',
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        userSelect: 'none',
        transition: 'box-shadow 0.14s ease, transform 0.14s ease, border-color 0.14s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 14px -4px rgba(16, 24, 40, 0.14)',
          transform: 'translateY(-1px)',
        },
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
          borderRadius: '9px',
          backgroundImage: GROUP_ACCENT[entry.group],
          color: '#fff',
          flexShrink: 0,
          boxShadow: '0 2px 6px -1px rgba(16, 24, 40, 0.2)',
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
