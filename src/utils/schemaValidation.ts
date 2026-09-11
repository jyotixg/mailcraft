import { blockRegistry } from '../registry/blockRegistry';
import type { EmailBlock, EmailBlockType } from '../types/blocks';
import type { EmailTemplateSchema } from '../types/email';
import type { TemplateVariable } from '../types/variables';
import { generateId } from './id';

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  schema?: EmailTemplateSchema;
}

const KNOWN_BLOCK_TYPES = new Set(Object.keys(blockRegistry));

/**
 * Parses and structurally validates a pasted/imported JSON schema. Never
 * evaluates the input as code — this only ever does JSON.parse + shape
 * checks, then rebuilds a schema with fresh ids and registry-backed
 * defaults for any missing block properties.
 */
export function parseAndValidateSchema(raw: string): SchemaValidationResult {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { valid: false, errors: ['Invalid JSON: could not parse the input.'] };
  }

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Schema must be a JSON object.'] };
  }

  const obj = data as Record<string, unknown>;
  const errors: string[] = [];

  if (obj.schemaVersion !== 1) errors.push('schemaVersion must be 1.');

  const template = obj.template as Record<string, unknown> | undefined;
  if (!template || typeof template !== 'object') {
    errors.push('template metadata is missing.');
  } else {
    if (typeof template.name !== 'string' || !template.name.trim()) errors.push('template.name is required.');
    if (typeof template.subject !== 'string') errors.push('template.subject must be a string.');
  }

  const variables = obj.variables;
  if (!Array.isArray(variables)) {
    errors.push('variables must be an array.');
  } else {
    variables.forEach((v, index) => {
      const isValid = typeof v === 'object' && v !== null && typeof (v as Record<string, unknown>).name === 'string';
      if (!isValid) errors.push(`variables[${index}] is missing a "name" string.`);
    });
  }

  const blocks = obj.blocks;
  if (!Array.isArray(blocks)) {
    errors.push('blocks must be an array.');
  } else {
    blocks.forEach((b, index) => {
      if (typeof b !== 'object' || b === null) {
        errors.push(`blocks[${index}] must be an object.`);
        return;
      }
      const type = (b as Record<string, unknown>).type;
      if (typeof type !== 'string' || !KNOWN_BLOCK_TYPES.has(type)) {
        errors.push(`blocks[${index}] has unknown block type "${String(type)}".`);
      }
    });
  }

  if (errors.length > 0 || !template) return { valid: false, errors };

  const normalizedBlocks: EmailBlock[] = (blocks as Record<string, unknown>[]).map((b) => {
    const type = b.type as EmailBlockType;
    const entry = blockRegistry[type];
    const rawProps = (b.props && typeof b.props === 'object' ? b.props : {}) as Record<string, unknown>;
    const props = { ...entry.defaultProps, ...rawProps };
    return { id: generateId('block'), type, props } as EmailBlock;
  });

  const normalizedVariables: TemplateVariable[] = (variables as Record<string, unknown>[]).map((v) => ({
    id: generateId('var'),
    name: String(v.name),
    type: v.type === 'number' ? 'number' : 'string',
    description: typeof v.description === 'string' ? v.description : '',
  }));

  const schema: EmailTemplateSchema = {
    schemaVersion: 1,
    template: {
      id: typeof template.id === 'string' && template.id ? template.id : generateId('template'),
      name: String(template.name),
      description: typeof template.description === 'string' ? template.description : '',
      category: typeof template.category === 'string' ? template.category : 'Custom',
      subject: String(template.subject ?? ''),
      status: template.status === 'ready' ? 'ready' : 'draft',
      lastModified: new Date().toISOString(),
      isBuiltIn: false,
    },
    variables: normalizedVariables,
    blocks: normalizedBlocks,
  };

  return { valid: true, errors: [], schema };
}
