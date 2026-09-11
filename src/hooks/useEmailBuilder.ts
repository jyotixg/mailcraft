import { useContext, useMemo } from 'react';
import { EmailBuilderContext } from '../context/EmailBuilderContext';
import { validateTemplate } from '../engine/validationEngine';

export function useEmailBuilder() {
  const ctx = useContext(EmailBuilderContext);
  if (!ctx) throw new Error('useEmailBuilder must be used within an EmailBuilderProvider');
  const { state, dispatch } = ctx;

  const selectedBlock = useMemo(
    () => state.schema.blocks.find((b) => b.id === state.selectedBlockId) ?? null,
    [state.schema.blocks, state.selectedBlockId],
  );

  const validation = useMemo(() => validateTemplate(state.schema), [state.schema]);

  return { state, dispatch, selectedBlock, validation };
}
