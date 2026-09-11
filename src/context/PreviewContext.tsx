import { createContext, useCallback, useState, type ReactNode } from 'react';
import type { PreviewDataValues } from '../types/email';

export interface PreviewContextValue {
  values: PreviewDataValues;
  setValue: (name: string, value: string) => void;
  setValues: (values: PreviewDataValues) => void;
  ensureKeys: (names: string[], sampleValues: Record<string, string>) => void;
}

export const PreviewContext = createContext<PreviewContextValue | null>(null);

/**
 * Preview/runtime state lives in its own context, separate from the editor
 * state in EmailBuilderContext: sample variable values are per-viewing
 * session and never enter undo history.
 */
export function PreviewProvider({ children }: { children: ReactNode }) {
  const [values, setValuesState] = useState<PreviewDataValues>({});

  const setValue = useCallback((name: string, value: string) => {
    setValuesState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setValues = useCallback((next: PreviewDataValues) => {
    setValuesState(next);
  }, []);

  const ensureKeys = useCallback((names: string[], sampleValues: Record<string, string>) => {
    setValuesState((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const name of names) {
        if (!(name in next)) {
          next[name] = sampleValues[name] ?? '';
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  return (
    <PreviewContext.Provider value={{ values, setValue, setValues, ensureKeys }}>
      {children}
    </PreviewContext.Provider>
  );
}
