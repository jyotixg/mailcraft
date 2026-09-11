import { useContext } from 'react';
import { EmailBuilderContext } from '../context/EmailBuilderContext';

export function useHistory() {
  const ctx = useContext(EmailBuilderContext);
  if (!ctx) throw new Error('useHistory must be used within an EmailBuilderProvider');
  const { state, dispatch } = ctx;

  return {
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
  };
}
