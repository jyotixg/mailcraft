import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { blockRegistryList } from '../../registry/blockRegistry';
import type { BlockGroup } from '../../types/blocks';
import { BlockLibraryItem, GROUP_ACCENT } from './BlockLibraryItem';

const GROUP_LABELS: Record<BlockGroup, string> = {
  content: 'Content',
  layout: 'Layout',
  fintech: 'Fintech',
  common: 'Common',
};

const GROUP_ORDER: BlockGroup[] = ['content', 'layout', 'fintech', 'common'];

export function BlockLibrary() {
  const [search, setSearch] = useState('');

  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? blockRegistryList.filter(
          (entry) => entry.label.toLowerCase().includes(query) || entry.description.toLowerCase().includes(query),
        )
      : blockRegistryList;

    return GROUP_ORDER.map((group) => ({
      group,
      entries: filtered.filter((entry) => entry.group === group),
    })).filter((g) => g.entries.length > 0);
  }, [search]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search blocks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search block library"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Box sx={{ overflowY: 'auto', p: 1.5, flex: 1 }}>
        {groups.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            No blocks match "{search}".
          </Typography>
        )}
        <Stack spacing={2.5}>
          {groups.map(({ group, entries }) => (
            <Box key={group}>
              <Stack direction="row" spacing={0.75} sx={{ mb: 1, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundImage: GROUP_ACCENT[group],
                    flexShrink: 0,
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.6, color: 'text.secondary' }}>
                  {GROUP_LABELS[group].toUpperCase()}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {entries.map((entry) => (
                  <BlockLibraryItem key={entry.type} entry={entry} />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
