import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { EmptyCanvas } from './EmptyCanvas';
import { SortableBlock } from './SortableBlock';

export const CANVAS_DROPPABLE_ID = 'canvas-root';

export function EmailCanvas() {
  const { state, dispatch } = useEmailBuilder();
  const { blocks, template } = state.schema;
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_DROPPABLE_ID, data: { source: 'canvas-root' } });

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#eef0f7',
        backgroundImage: 'radial-gradient(circle, #dcdfec 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        p: { xs: 2, md: 4 },
      }}
      onClick={() => dispatch({ type: 'SELECT_BLOCK', id: null })}
    >
      <Box sx={{ maxWidth: 640, mx: 'auto' }}>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
            SUBJECT LINE
          </Typography>
          <TextField
            value={template.subject}
            onChange={(e) => dispatch({ type: 'SET_SUBJECT', subject: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            placeholder="Your OTP for {{companyName}}"
            size="small"
            fullWidth
            error={!template.subject.trim()}
            helperText={!template.subject.trim() ? 'Subject is required' : ' '}
            aria-label="Email subject"
          />
        </Stack>

        <Paper
          ref={setNodeRef}
          onClick={(e) => e.stopPropagation()}
          sx={{
            minHeight: 400,
            borderRadius: '14px',
            boxShadow: isOver ? '0 12px 28px -8px rgba(79, 70, 229, 0.35)' : '0 8px 24px -10px rgba(16, 24, 40, 0.16)',
            outline: isOver ? '2px solid' : '1px solid transparent',
            outlineColor: isOver ? 'primary.main' : 'transparent',
            outlineOffset: 2,
            transition: 'box-shadow 0.16s ease, outline-color 0.16s ease',
          }}
        >
          {blocks.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <EmptyCanvas isOver={isOver} />
            </Box>
          ) : (
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((block, index) => (
                <SortableBlock key={block.id} block={block} index={index} total={blocks.length} />
              ))}
            </SortableContext>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
