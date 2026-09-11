import { blockRegistry } from '../registry/blockRegistry';
import type { BlockPropsMap, EmailBlock, EmailBlockType } from '../types/blocks';
import type { VariableType, TemplateVariable } from '../types/variables';
import { generateId } from '../utils/id';

export function block<K extends EmailBlockType>(type: K, overrides: Partial<BlockPropsMap[K]> = {}): EmailBlock {
  const entry = blockRegistry[type];
  return { id: generateId('block'), type, props: { ...entry.defaultProps, ...overrides } } as EmailBlock;
}

export function variable(name: string, type: VariableType, description: string): TemplateVariable {
  return { id: generateId('var'), name, type, description };
}
