import DataObjectIcon from '@mui/icons-material/DataObject';
import { IconButton, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { useState } from 'react';
import type { TemplateVariable } from '../../types/variables';

export interface VariablePickerProps {
  variables: TemplateVariable[];
  onInsert: (name: string) => void;
}

/** "Insert Variable" affordance: an icon button that opens a menu of {{tokens}}. */
export function VariablePicker({ variables, onInsert }: VariablePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title="Insert variable">
        <span>
          <IconButton
            size="small"
            edge="end"
            aria-label="Insert variable"
            disabled={variables.length === 0}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <DataObjectIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {variables.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary="No variables defined yet" />
          </MenuItem>
        )}
        {variables.map((v) => (
          <MenuItem
            key={v.id}
            onClick={() => {
              onInsert(v.name);
              setAnchorEl(null);
            }}
          >
            <ListItemText primary={`{{${v.name}}}`} secondary={v.description || undefined} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
