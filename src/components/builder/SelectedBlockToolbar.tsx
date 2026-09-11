import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, Paper, Stack, Tooltip } from '@mui/material';

interface SelectedBlockToolbarProps {
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function SelectedBlockToolbar({
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SelectedBlockToolbarProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: -18,
        right: 8,
        display: 'flex',
        zIndex: 2,
        border: 1,
        borderColor: 'divider',
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Stack direction="row" spacing={0.25} sx={{ p: 0.25 }}>
        <Tooltip title="Move up">
          <span>
            <IconButton size="small" onClick={onMoveUp} disabled={!canMoveUp} aria-label="Move block up">
              <KeyboardArrowUpIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Move down">
          <span>
            <IconButton size="small" onClick={onMoveDown} disabled={!canMoveDown} aria-label="Move block down">
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Duplicate">
          <IconButton size="small" onClick={onDuplicate} aria-label="Duplicate block">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={onDelete} aria-label="Delete block" color="error">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
