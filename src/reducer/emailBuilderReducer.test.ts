import { describe, expect, it } from 'vitest';
import { createOtpTemplate } from '../templates/otp';
import { createInitialEditorState, emailBuilderReducer, type EditorState } from './emailBuilderReducer';

function freshState(): EditorState {
  return createInitialEditorState(createOtpTemplate());
}

describe('emailBuilderReducer', () => {
  it('adds a block and selects it', () => {
    const state = freshState();
    const count = state.schema.blocks.length;
    const next = emailBuilderReducer(state, { type: 'ADD_BLOCK', blockType: 'divider' });
    expect(next.schema.blocks).toHaveLength(count + 1);
    expect(next.schema.blocks.at(-1)?.type).toBe('divider');
    expect(next.selectedBlockId).toBe(next.schema.blocks.at(-1)?.id);
  });

  it('inserts a block at a specific index', () => {
    const state = freshState();
    const next = emailBuilderReducer(state, { type: 'ADD_BLOCK', blockType: 'spacer', index: 1 });
    expect(next.schema.blocks[1].type).toBe('spacer');
  });

  it('deletes a block and clears selection if it was selected', () => {
    const state = freshState();
    const targetId = state.schema.blocks[0].id;
    const selected = { ...state, selectedBlockId: targetId };
    const next = emailBuilderReducer(selected, { type: 'DELETE_BLOCK', id: targetId });
    expect(next.schema.blocks.find((b) => b.id === targetId)).toBeUndefined();
    expect(next.selectedBlockId).toBeNull();
  });

  it('duplicates a block with a new id, placed right after the original', () => {
    const state = freshState();
    const original = state.schema.blocks[0];
    const next = emailBuilderReducer(state, { type: 'DUPLICATE_BLOCK', id: original.id });
    expect(next.schema.blocks).toHaveLength(state.schema.blocks.length + 1);
    const copy = next.schema.blocks[1];
    expect(copy.type).toBe(original.type);
    expect(copy.id).not.toBe(original.id);
    expect(next.selectedBlockId).toBe(copy.id);
  });

  it('reorders blocks according to the given id order', () => {
    const state = freshState();
    const ids = state.schema.blocks.map((b) => b.id);
    const reversed = [...ids].reverse();
    const next = emailBuilderReducer(state, { type: 'REORDER_BLOCKS', orderedIds: reversed });
    expect(next.schema.blocks.map((b) => b.id)).toEqual(reversed);
  });

  it('updates block props immutably', () => {
    const state = freshState();
    const target = state.schema.blocks.find((b) => b.type === 'header')!;
    const next = emailBuilderReducer(state, {
      type: 'UPDATE_BLOCK_PROPS',
      id: target.id,
      patch: { companyName: 'Updated Co' },
    });
    const updated = next.schema.blocks.find((b) => b.id === target.id);
    expect(updated?.props).toMatchObject({ companyName: 'Updated Co' });
    expect(state.schema.blocks.find((b) => b.id === target.id)?.props).not.toMatchObject({
      companyName: 'Updated Co',
    });
  });

  it('supports undo and redo across a schema-changing action', () => {
    const state = freshState();
    const countBefore = state.schema.blocks.length;
    const afterAdd = emailBuilderReducer(state, { type: 'ADD_BLOCK', blockType: 'divider' });
    expect(afterAdd.schema.blocks).toHaveLength(countBefore + 1);

    const afterUndo = emailBuilderReducer(afterAdd, { type: 'UNDO' });
    expect(afterUndo.schema.blocks).toHaveLength(countBefore);

    const afterRedo = emailBuilderReducer(afterUndo, { type: 'REDO' });
    expect(afterRedo.schema.blocks).toHaveLength(countBefore + 1);
  });

  it('does not push history for selection changes', () => {
    const state = freshState();
    const next = emailBuilderReducer(state, { type: 'SELECT_BLOCK', id: state.schema.blocks[0].id });
    expect(next.history).toHaveLength(0);
    expect(next.isDirty).toBe(false);
  });

  it('caps history at 20 entries', () => {
    let state = freshState();
    for (let i = 0; i < 25; i += 1) {
      state = emailBuilderReducer(state, { type: 'ADD_BLOCK', blockType: 'spacer' });
    }
    expect(state.history.length).toBeLessThanOrEqual(20);
  });
});
