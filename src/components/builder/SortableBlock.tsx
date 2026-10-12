import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box } from '@mui/material';
import { renderBlock } from '../../engine/renderer';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import type { EmailBlock } from '../../types/blocks';
import { SelectedBlockToolbar } from './SelectedBlockToolbar';

export interface CanvasDragData {
  source: 'canvas';
  blockId: string;
}

export function SortableBlock({ block, index, total }: { block: EmailBlock; index: number; total: number }) {
  const { state, dispatch } = useEmailBuilder();
  const isSelected = state.selectedBlockId === block.id;

  const dragData: CanvasDragData = { source: 'canvas', blockId: block.id };
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: dragData,
  });

  return (
    <Box
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      role="group"
      aria-label={`${block.type} block, position ${index + 1} of ${total}`}
      sx={{
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        outline: isSelected ? '2px solid' : '2px solid transparent',
        outlineColor: isSelected ? 'primary.main' : 'transparent',
        outlineOffset: -2,
        '&:hover': { outlineColor: isSelected ? 'primary.main' : 'action.hover' },
        '&:hover .drag-handle': { opacity: 1 },
      }}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: 'SELECT_BLOCK', id: block.id });
      }}
    >
      {isSelected && (
        <SelectedBlockToolbar
          canMoveUp={index > 0}
          canMoveDown={index < total - 1}
          onMoveUp={() => dispatch({ type: 'MOVE_BLOCK', id: block.id, direction: 'up' })}
          onMoveDown={() => dispatch({ type: 'MOVE_BLOCK', id: block.id, direction: 'down' })}
          onDuplicate={() => dispatch({ type: 'DUPLICATE_BLOCK', id: block.id })}
          onDelete={() => dispatch({ type: 'DELETE_BLOCK', id: block.id })}
        />
      )}
      <Box
        className="drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder block"
        sx={{
          position: 'absolute',
          top: 4,
          left: 4,
          zIndex: 2,
          display: 'flex',
          opacity: isSelected ? 1 : 0,
          transition: 'opacity 0.12s',
          cursor: 'grab',
          color: 'text.secondary',
          bgcolor: 'background.paper',
          borderRadius: 0.5,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>
      <Box
        sx={{
          overflow: 'hidden',
          borderTopLeftRadius: index === 0 ? 14 : 0,
          borderTopRightRadius: index === 0 ? 14 : 0,
          borderBottomLeftRadius: index === total - 1 ? 14 : 0,
          borderBottomRightRadius: index === total - 1 ? 14 : 0,
        }}
      >
        {renderBlock(block)}
      </Box>
    </Box>
  );
}
