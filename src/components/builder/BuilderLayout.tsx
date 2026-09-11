import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import MenuIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Drawer, IconButton, Paper, Stack, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { usePreview } from '../../hooks/usePreview';
import { buildSamplePreviewData } from '../../templates';
import { saveTemplateToLibrary } from '../../utils/storage';
import { ExportDialog } from '../dialogs/ExportDialog';
import { HtmlExportDialog } from '../dialogs/HtmlExportDialog';
import { ImportDialog } from '../dialogs/ImportDialog';
import { EmailPreview } from '../preview/EmailPreview';
import { PreviewDataPanel } from '../preview/PreviewDataPanel';
import { TemplateLibrary } from '../templates/TemplateLibrary';
import { ValidationPanel } from '../validation/ValidationPanel';
import { VariablePanel } from '../variables/VariablePanel';
import type { LibraryDragData } from './BlockLibraryItem';
import { BlockLibrary } from './BlockLibrary';
import { CANVAS_DROPPABLE_ID, EmailCanvas } from './EmailCanvas';
import { BuilderHeader } from './BuilderHeader';
import { blockRegistry } from '../../registry/blockRegistry';
import type { CanvasDragData } from './SortableBlock';
import { PropertiesPanel } from './PropertiesPanel';

type DragData = LibraryDragData | CanvasDragData;

const LEFT_WIDTH = 268;
const RIGHT_WIDTH = 320;

export function BuilderLayout() {
  const { state, dispatch } = useEmailBuilder();
  const { ensureKeys } = usePreview();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [variablesOpen, setVariablesOpen] = useState(false);
  const [validationOpen, setValidationOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [exportJsonOpen, setExportJsonOpen] = useState(false);
  const [exportHtmlOpen, setExportHtmlOpen] = useState(false);
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);

  useEffect(() => {
    const names = state.schema.variables.map((v) => v.name);
    ensureKeys(names, buildSamplePreviewData(names));
  }, [state.schema.variables, ensureKeys]);

  useEffect(() => {
    if (state.selectedBlockId && isMobile) setRightOpen(true);
  }, [state.selectedBlockId, isMobile]);

  const handleSave = () => {
    saveTemplateToLibrary(state.schema);
    dispatch({ type: 'MARK_SAVED' });
  };

  useKeyboardShortcuts({
    onSave: handleSave,
    onDeleteSelected: () => {
      if (state.selectedBlockId) dispatch({ type: 'DELETE_BLOCK', id: state.selectedBlockId });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined;
    if (data) setActiveDrag(data);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);
    if (!over) return;
    const data = active.data.current as DragData | undefined;
    if (!data) return;

    if (data.source === 'library') {
      const blocks = state.schema.blocks;
      let index = blocks.length;
      if (over.id !== CANVAS_DROPPABLE_ID) {
        const overIndex = blocks.findIndex((b) => b.id === over.id);
        if (overIndex !== -1) index = overIndex + 1;
      }
      dispatch({ type: 'ADD_BLOCK', blockType: data.blockType, index });
      return;
    }

    if (data.source === 'canvas') {
      if (over.id === CANVAS_DROPPABLE_ID || active.id === over.id) return;
      const blocks = state.schema.blocks;
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const orderedIds = arrayMove(blocks, oldIndex, newIndex).map((b) => b.id);
      dispatch({ type: 'REORDER_BLOCKS', orderedIds });
    }
  };

  const isPreview = state.editorMode === 'preview';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <BuilderHeader
        onOpenTemplates={() => setTemplatesOpen(true)}
        onOpenVariables={() => setVariablesOpen(true)}
        onOpenValidation={() => setValidationOpen(true)}
        onOpenImport={() => setImportOpen(true)}
        onExportJson={() => setExportJsonOpen(true)}
        onExportHtml={() => setExportHtmlOpen(true)}
        onSave={handleSave}
      />

      {isPreview ? (
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <EmailPreview />
          </Box>
          <Box sx={{ width: 300, borderLeft: 1, borderColor: 'divider', overflowY: 'auto', display: { xs: 'none', sm: 'block' } }}>
            <PreviewDataPanel />
          </Box>
        </Box>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {!isMobile && (
              <Box sx={{ width: LEFT_WIDTH, flexShrink: 0, borderRight: 1, borderColor: 'divider' }}>
                <BlockLibrary />
              </Box>
            )}

            <Box sx={{ flex: 1, minWidth: 0, position: 'relative' }}>
              {isMobile && (
                <Stack direction="row" spacing={1} sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Tooltip title="Block library">
                    <IconButton size="small" onClick={() => setLeftOpen(true)} aria-label="Open block library">
                      <MenuIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Properties">
                    <IconButton size="small" onClick={() => setRightOpen(true)} aria-label="Open properties panel">
                      <TuneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
              <Box sx={{ height: isMobile ? 'calc(100% - 48px)' : '100%' }}>
                <EmailCanvas />
              </Box>
            </Box>

            {!isMobile && (
              <Paper square variant="outlined" sx={{ width: RIGHT_WIDTH, flexShrink: 0, borderTop: 0, borderBottom: 0, borderRight: 0 }}>
                <PropertiesPanel />
              </Paper>
            )}
          </Box>

          <Drawer anchor="left" open={isMobile && leftOpen} onClose={() => setLeftOpen(false)}>
            <Box sx={{ width: LEFT_WIDTH, height: '100%' }}>
              <BlockLibrary />
            </Box>
          </Drawer>
          <Drawer anchor="right" open={isMobile && rightOpen} onClose={() => setRightOpen(false)}>
            <Box sx={{ width: RIGHT_WIDTH, height: '100%' }}>
              <PropertiesPanel />
            </Box>
          </Drawer>

          <DragOverlay>
            {activeDrag?.source === 'library' ? (
              <Box sx={{ width: LEFT_WIDTH - 24 }}>
                <Paper
                  variant="outlined"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, boxShadow: 3, bgcolor: 'background.paper' }}
                >
                  {(() => {
                    const Icon = blockRegistry[activeDrag.blockType].icon;
                    return <Icon fontSize="small" color="primary" />;
                  })()}
                  {blockRegistry[activeDrag.blockType].label}
                </Paper>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <TemplateLibrary open={templatesOpen} onClose={() => setTemplatesOpen(false)} />
      <VariablePanel open={variablesOpen} onClose={() => setVariablesOpen(false)} />
      <ValidationPanel open={validationOpen} onClose={() => setValidationOpen(false)} />
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
      <ExportDialog open={exportJsonOpen} onClose={() => setExportJsonOpen(false)} />
      <HtmlExportDialog open={exportHtmlOpen} onClose={() => setExportHtmlOpen(false)} />
    </Box>
  );
}
