import { useMemo } from 'react';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { slugifyFileName } from '../../engine/htmlGenerator';
import { CodeExportDialog } from './CodeExportDialog';

export function ExportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useEmailBuilder();
  const json = useMemo(() => JSON.stringify(state.schema, null, 2), [state.schema]);

  return (
    <CodeExportDialog
      open={open}
      onClose={onClose}
      title="Export Template JSON"
      description="The complete, versioned schema behind this template — hand this to another environment or check it into source control."
      code={json}
      filename={`${slugifyFileName(state.schema.template.name)}.json`}
      mimeType="application/json"
    />
  );
}
