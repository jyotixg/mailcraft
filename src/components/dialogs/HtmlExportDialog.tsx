import { useMemo } from 'react';
import { generateEmailHtml, slugifyFileName } from '../../engine/htmlGenerator';
import { useEmailBuilder } from '../../hooks/useEmailBuilder';
import { CodeExportDialog } from './CodeExportDialog';

export function HtmlExportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useEmailBuilder();
  const html = useMemo(() => generateEmailHtml(state.schema), [state.schema]);

  return (
    <CodeExportDialog
      open={open}
      onClose={onClose}
      title="Export Email HTML"
      description="Table-based, inline-styled HTML generated from the schema. Variable tokens are left intact for your email service to fill in at send time."
      code={html}
      filename={`${slugifyFileName(state.schema.template.name)}.html`}
      mimeType="text/html"
    />
  );
}
