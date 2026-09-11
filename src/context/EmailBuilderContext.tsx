import { createContext, useReducer, type Dispatch, type ReactNode } from 'react';
import {
  createInitialEditorState,
  emailBuilderReducer,
  type EditorAction,
  type EditorState,
} from '../reducer/emailBuilderReducer';
import { createOtpTemplate } from '../templates/otp';
import { loadCurrentTemplate } from '../utils/storage';

export interface EmailBuilderContextValue {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
}

export const EmailBuilderContext = createContext<EmailBuilderContextValue | null>(null);

function loadInitialState(): EditorState {
  const persisted = loadCurrentTemplate();
  return createInitialEditorState(persisted ?? createOtpTemplate());
}

export function EmailBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(emailBuilderReducer, undefined, loadInitialState);

  return <EmailBuilderContext.Provider value={{ state, dispatch }}>{children}</EmailBuilderContext.Provider>;
}
