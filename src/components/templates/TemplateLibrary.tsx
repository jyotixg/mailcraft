import SearchIcon from '@mui/icons-material/Search';
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMemo, useState } from 'react';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { builtInTemplates, getAllBuiltInTemplates } from '../../templates';
import type { EmailTemplateSchema } from '../../types/email';
import { generateId } from '../../utils/id';
import { deleteTemplateFromLibrary, loadSavedTemplates, saveTemplateToLibrary } from '../../utils/storage';
import { ConfirmDialog } from '../dialogs/ConfirmDialog';
import { TemplateCard } from './TemplateCard';

function duplicateSchema(schema: EmailTemplateSchema): EmailTemplateSchema {
  return {
    ...schema,
    template: {
      ...schema.template,
      id: generateId('template'),
      name: `${schema.template.name} Copy`,
      status: 'draft',
      isBuiltIn: false,
      lastModified: new Date().toISOString(),
    },
    variables: schema.variables.map((v) => ({ ...v, id: generateId('var') })),
    blocks: schema.blocks.map((b) => ({ ...b, id: generateId('block') })),
  };
}

export function TemplateLibrary({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useEmailBuilder();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [refreshTick, setRefreshTick] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<EmailTemplateSchema | null>(null);

  const templates = useMemo(() => {
    const saved = loadSavedTemplates();
    const builtIns = getAllBuiltInTemplates().map((t) => saved[t.template.id] ?? t);
    const extras = Object.values(saved).filter(
      (s) => !builtInTemplates.some((b) => b.id === s.template.id),
    );
    return [...builtIns, ...extras];
    // refreshTick forces recomputation after duplicate/delete mutate localStorage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTick]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(templates.map((t) => t.template.category)))], [templates]);

  const filtered = templates.filter((t) => {
    const matchesCategory = category === 'All' || t.template.category === category;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      t.template.name.toLowerCase().includes(query) ||
      t.template.category.toLowerCase().includes(query) ||
      t.template.subject.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleOpen = (schema: EmailTemplateSchema) => {
    dispatch({ type: 'LOAD_TEMPLATE', schema });
    onClose();
  };

  const handleDuplicate = (schema: EmailTemplateSchema) => {
    const copy = duplicateSchema(schema);
    saveTemplateToLibrary(copy);
    setRefreshTick((n) => n + 1);
  };

  const handleDeleteConfirmed = () => {
    if (pendingDelete) {
      deleteTemplateFromLibrary(pendingDelete.template.id);
      setPendingDelete(null);
      setRefreshTick((n) => n + 1);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth slotProps={{ paper: { sx: { height: '85vh' } } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Templates
          <IconButton onClick={onClose} aria-label="Close template library">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search by name, category or subject"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ maxWidth: { sm: 360 } }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
            />
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {categories.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  size="small"
                  color={category === c ? 'primary' : 'default'}
                  onClick={() => setCategory(c)}
                  variant={category === c ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </Stack>

          {filtered.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No templates match your search.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filtered.map((schema) => (
                <Grid key={schema.template.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <TemplateCard
                    schema={schema}
                    onOpen={() => handleOpen(schema)}
                    onDuplicate={() => handleDuplicate(schema)}
                    onDelete={schema.template.isBuiltIn ? undefined : () => setPendingDelete(schema)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete template?"
        message={`"${pendingDelete?.template.name}" will be permanently removed from your local templates.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
