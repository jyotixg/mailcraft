import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import EditIcon from '@mui/icons-material/Edit';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import GridViewIcon from '@mui/icons-material/GridView';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DownloadIcon from '@mui/icons-material/Download';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { useHistory } from '../../hooks/useHistory';

interface BuilderHeaderProps {
  onOpenTemplates: () => void;
  onOpenVariables: () => void;
  onOpenValidation: () => void;
  onOpenImport: () => void;
  onExportJson: () => void;
  onExportHtml: () => void;
  onSave: () => void;
}

export function BuilderHeader({
  onOpenTemplates,
  onOpenVariables,
  onOpenValidation,
  onOpenImport,
  onExportJson,
  onExportHtml,
  onSave,
}: BuilderHeaderProps) {
  const { state, dispatch } = useEmailBuilder();
  const { canUndo, canRedo, undo, redo } = useHistory();
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null);

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ gap: 1, flexWrap: 'wrap', py: 1 }}>
        <Box sx={{ mr: 2 }}>
          <Typography variant="h6" component="div" sx={{ lineHeight: 1.1 }}>
            MailCraft
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            Transactional Email Template Builder
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Undo (Ctrl/Cmd+Z)">
            <span>
              <IconButton size="small" onClick={undo} disabled={!canUndo} aria-label="Undo">
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo (Ctrl/Cmd+Shift+Z)">
            <span>
              <IconButton size="small" onClick={redo} disabled={!canRedo} aria-label="Redo">
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Templates">
            <IconButton size="small" onClick={onOpenTemplates} aria-label="Open template library">
              <GridViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Variables">
            <IconButton size="small" onClick={onOpenVariables} aria-label="Open variables panel">
              <DataObjectIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Validate">
            <IconButton size="small" onClick={onOpenValidation} aria-label="Validate template">
              <FactCheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Import JSON">
            <IconButton size="small" onClick={onOpenImport} aria-label="Import template JSON">
              <UploadFileIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton size="small" onClick={(e) => setExportAnchor(e.currentTarget)} aria-label="Export template">
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)}>
            <MenuItem
              onClick={() => {
                onExportJson();
                setExportAnchor(null);
              }}
            >
              <ListItemIcon>
                <DataObjectIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export JSON</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                onExportHtml();
                setExportAnchor(null);
              }}
            >
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export HTML</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>

        <Box sx={{ flex: 1 }} />

        <ToggleButtonGroup
          size="small"
          exclusive
          value={state.editorMode}
          onChange={(_, mode) => mode && dispatch({ type: 'SET_EDITOR_MODE', mode })}
          aria-label="Editor mode"
        >
          <ToggleButton value="builder" aria-label="Builder mode">
            <EditIcon fontSize="small" sx={{ mr: 0.75 }} />
            Builder
          </ToggleButton>
          <ToggleButton value="preview" aria-label="Preview mode">
            <VisibilityIcon fontSize="small" sx={{ mr: 0.75 }} />
            Preview
          </ToggleButton>
        </ToggleButtonGroup>

        {state.editorMode === 'preview' && (
          <ToggleButtonGroup
            size="small"
            exclusive
            value={state.previewDevice}
            onChange={(_, device) => device && dispatch({ type: 'SET_PREVIEW_DEVICE', device })}
            aria-label="Preview device"
          >
            <ToggleButton value="desktop" aria-label="Desktop preview">
              <DesktopWindowsIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="mobile" aria-label="Mobile preview">
              <PhoneIphoneIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        <Stack direction="row" spacing={0.75} sx={{ ml: 1, alignItems: 'center' }}>
          <FiberManualRecordIcon
            sx={{ fontSize: 8, color: state.isDirty ? 'warning.main' : 'success.main' }}
            aria-hidden
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {state.isDirty ? 'Unsaved changes' : 'Saved'}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          size="small"
          startIcon={state.isDirty ? <SaveIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
          onClick={onSave}
        >
          Save
        </Button>
      </Toolbar>
    </AppBar>
  );
}
