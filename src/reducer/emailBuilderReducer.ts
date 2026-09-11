import { blockRegistry } from '../registry/blockRegistry';
import type { EmailBlock, EmailBlockType } from '../types/blocks';
import type { EmailTemplateSchema, PreviewDevice, TemplateMeta, TemplateStatus } from '../types/email';
import type { TemplateVariable } from '../types/variables';
import { generateId } from '../utils/id';

export type EditorMode = 'builder' | 'preview';

export interface EditorState {
  schema: EmailTemplateSchema;
  selectedBlockId: string | null;
  editorMode: EditorMode;
  previewDevice: PreviewDevice;
  history: EmailTemplateSchema[];
  future: EmailTemplateSchema[];
  isDirty: boolean;
  lastSavedAt: string | null;
}

const HISTORY_LIMIT = 20;

export type EditorAction =
  | { type: 'ADD_BLOCK'; blockType: EmailBlockType; index?: number }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'DUPLICATE_BLOCK'; id: string }
  | { type: 'REORDER_BLOCKS'; orderedIds: string[] }
  | { type: 'MOVE_BLOCK'; id: string; direction: 'up' | 'down' }
  | { type: 'UPDATE_BLOCK_PROPS'; id: string; patch: Record<string, unknown> }
  | { type: 'SET_SUBJECT'; subject: string }
  | { type: 'UPDATE_TEMPLATE_META'; patch: Partial<Omit<TemplateMeta, 'id' | 'isBuiltIn'>> }
  | { type: 'ADD_VARIABLE'; variable: TemplateVariable }
  | { type: 'UPDATE_VARIABLE'; id: string; patch: Partial<Omit<TemplateVariable, 'id'>> }
  | { type: 'DELETE_VARIABLE'; id: string }
  | { type: 'SELECT_BLOCK'; id: string | null }
  | { type: 'SET_EDITOR_MODE'; mode: EditorMode }
  | { type: 'SET_PREVIEW_DEVICE'; device: PreviewDevice }
  | { type: 'SET_STATUS'; status: TemplateStatus }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'MARK_SAVED' }
  | { type: 'LOAD_TEMPLATE'; schema: EmailTemplateSchema };

function touch(meta: TemplateMeta): TemplateMeta {
  return { ...meta, lastModified: new Date().toISOString() };
}

function withHistory(state: EditorState, nextSchema: EmailTemplateSchema): EditorState {
  const history = [...state.history, state.schema].slice(-HISTORY_LIMIT);
  return {
    ...state,
    schema: { ...nextSchema, template: touch(nextSchema.template) },
    history,
    future: [],
    isDirty: true,
  };
}

function updateBlocks(blocks: EmailBlock[], id: string, patch: Record<string, unknown>): EmailBlock[] {
  return blocks.map((block) =>
    block.id === id ? ({ ...block, props: { ...block.props, ...patch } } as EmailBlock) : block,
  );
}

export function createBlock(type: EmailBlockType): EmailBlock {
  const entry = blockRegistry[type];
  return { id: generateId('block'), type, props: { ...entry.defaultProps } } as EmailBlock;
}

export function emailBuilderReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const newBlock = createBlock(action.blockType);
      const blocks = [...state.schema.blocks];
      const insertAt = action.index ?? blocks.length;
      blocks.splice(insertAt, 0, newBlock);
      const next = withHistory(state, { ...state.schema, blocks });
      return { ...next, selectedBlockId: newBlock.id };
    }
    case 'DELETE_BLOCK': {
      const blocks = state.schema.blocks.filter((b) => b.id !== action.id);
      const next = withHistory(state, { ...state.schema, blocks });
      return { ...next, selectedBlockId: state.selectedBlockId === action.id ? null : state.selectedBlockId };
    }
    case 'DUPLICATE_BLOCK': {
      const index = state.schema.blocks.findIndex((b) => b.id === action.id);
      if (index === -1) return state;
      const original = state.schema.blocks[index];
      const copy = { ...original, id: generateId('block'), props: { ...original.props } } as EmailBlock;
      const blocks = [...state.schema.blocks];
      blocks.splice(index + 1, 0, copy);
      const next = withHistory(state, { ...state.schema, blocks });
      return { ...next, selectedBlockId: copy.id };
    }
    case 'REORDER_BLOCKS': {
      const byId = new Map(state.schema.blocks.map((b) => [b.id, b]));
      const blocks = action.orderedIds.map((id) => byId.get(id)).filter((b): b is EmailBlock => Boolean(b));
      if (blocks.length !== state.schema.blocks.length) return state;
      return withHistory(state, { ...state.schema, blocks });
    }
    case 'MOVE_BLOCK': {
      const blocks = [...state.schema.blocks];
      const index = blocks.findIndex((b) => b.id === action.id);
      const targetIndex = action.direction === 'up' ? index - 1 : index + 1;
      if (index === -1 || targetIndex < 0 || targetIndex >= blocks.length) return state;
      [blocks[index], blocks[targetIndex]] = [blocks[targetIndex], blocks[index]];
      return withHistory(state, { ...state.schema, blocks });
    }
    case 'UPDATE_BLOCK_PROPS': {
      const blocks = updateBlocks(state.schema.blocks, action.id, action.patch);
      return withHistory(state, { ...state.schema, blocks });
    }
    case 'SET_SUBJECT': {
      return withHistory(state, { ...state.schema, template: { ...state.schema.template, subject: action.subject } });
    }
    case 'UPDATE_TEMPLATE_META': {
      return withHistory(state, { ...state.schema, template: { ...state.schema.template, ...action.patch } });
    }
    case 'ADD_VARIABLE': {
      return withHistory(state, { ...state.schema, variables: [...state.schema.variables, action.variable] });
    }
    case 'UPDATE_VARIABLE': {
      const variables = state.schema.variables.map((v) => (v.id === action.id ? { ...v, ...action.patch } : v));
      return withHistory(state, { ...state.schema, variables });
    }
    case 'DELETE_VARIABLE': {
      const variables = state.schema.variables.filter((v) => v.id !== action.id);
      return withHistory(state, { ...state.schema, variables });
    }
    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.id };
    case 'SET_EDITOR_MODE':
      return { ...state, editorMode: action.mode };
    case 'SET_PREVIEW_DEVICE':
      return { ...state, previewDevice: action.device };
    case 'SET_STATUS':
      return { ...state, schema: { ...state.schema, template: touch({ ...state.schema.template, status: action.status }) } };
    case 'UNDO': {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      return {
        ...state,
        schema: previous,
        history: state.history.slice(0, -1),
        future: [state.schema, ...state.future],
        isDirty: true,
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        ...state,
        schema: next,
        history: [...state.history, state.schema],
        future: rest,
        isDirty: true,
      };
    }
    case 'MARK_SAVED':
      return { ...state, isDirty: false, lastSavedAt: new Date().toISOString() };
    case 'LOAD_TEMPLATE':
      return {
        ...state,
        schema: action.schema,
        selectedBlockId: null,
        history: [],
        future: [],
        isDirty: false,
      };
    default:
      return state;
  }
}

export function createInitialEditorState(schema: EmailTemplateSchema): EditorState {
  return {
    schema,
    selectedBlockId: null,
    editorMode: 'builder',
    previewDevice: 'desktop',
    history: [],
    future: [],
    isDirty: false,
    lastSavedAt: null,
  };
}
