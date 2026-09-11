import { useEffect } from 'react';
import { useHistory } from './useHistory';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
}

interface KeyboardShortcutOptions {
  onSave: () => void;
  onDeleteSelected: () => void;
}

/** Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z redo, Cmd/Ctrl+S save, Delete/Backspace removes the selected block. */
export function useKeyboardShortcuts({ onSave, onDeleteSelected }: KeyboardShortcutOptions): void {
  const { undo, redo } = useHistory();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      const editable = isEditableTarget(event.target);

      if (meta && event.key.toLowerCase() === 's') {
        event.preventDefault();
        onSave();
        return;
      }

      if (editable) return;

      if (meta && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        onDeleteSelected();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onDeleteSelected, undo, redo]);
}
