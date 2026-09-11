import type { EmailBlock } from '../types/blocks';
import type { EmailTemplateSchema, PreviewDataValues } from '../types/email';

const TOKEN_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/** Finds every {{variableName}} token referenced inside a piece of free text. */
export function extractVariableTokens(text: string | undefined | null): string[] {
  if (!text) return [];
  const found = new Set<string>();
  for (const match of text.matchAll(TOKEN_REGEX)) {
    found.add(match[1]);
  }
  return Array.from(found);
}

/**
 * Replaces {{variableName}} tokens with preview values.
 * A token with no supplied value renders as `[ variableName ]` so authors can
 * see at a glance which fields still need sample data.
 */
export function replaceVariables(text: string | undefined | null, values: PreviewDataValues): string {
  if (!text) return '';
  return text.replace(TOKEN_REGEX, (_match, name: string) => {
    const value = values[name];
    return value !== undefined && value !== '' ? value : `[ ${name} ]`;
  });
}

/** Resolves a directly-referenced variable name (used by OTP/Transaction blocks). */
export function resolveDirectVariable(name: string | undefined | null, values: PreviewDataValues): string {
  if (!name) return '';
  const value = values[name];
  return value !== undefined && value !== '' ? value : `[ ${name} ]`;
}

/** Free-text props (may contain {{token}} placeholders) per block type. */
function getBlockTextFields(block: EmailBlock): string[] {
  switch (block.type) {
    case 'text':
      return [block.props.content];
    case 'heading':
      return [block.props.text];
    case 'image':
      return [block.props.alt, block.props.linkUrl];
    case 'button':
      return [block.props.text, block.props.url];
    case 'link':
      return [block.props.text, block.props.url];
    case 'header':
      return [block.props.companyName];
    case 'footer':
      return [block.props.companyName, block.props.supportEmail, block.props.copyrightText];
    case 'securityAlert':
      return [block.props.title, block.props.message];
    case 'otp':
      return [block.props.label];
    case 'transaction':
      return [block.props.title];
    case 'divider':
    case 'spacer':
    case 'container':
      return [];
    default:
      return [];
  }
}

/** Direct variable-name references (no {{}} braces) per block type. */
function getBlockDirectVariableNames(block: EmailBlock): string[] {
  switch (block.type) {
    case 'otp':
      return [block.props.otpVariable, block.props.expiryVariable].filter(Boolean);
    case 'transaction':
      return [
        block.props.amountVariable,
        block.props.transactionIdVariable,
        block.props.dateVariable,
        block.props.statusVariable,
      ].filter(Boolean);
    default:
      return [];
  }
}

export interface VariableUsage {
  /** Every variable name referenced anywhere in the template (subject, tokens, direct refs). */
  used: Set<string>;
}

export function extractAllVariableUsages(schema: EmailTemplateSchema): VariableUsage {
  const used = new Set<string>();
  extractVariableTokens(schema.template.subject).forEach((name) => used.add(name));
  for (const block of schema.blocks) {
    getBlockTextFields(block).forEach((text) => extractVariableTokens(text).forEach((name) => used.add(name)));
    getBlockDirectVariableNames(block).forEach((name) => used.add(name));
  }
  return { used };
}

export interface VariableValidationResult {
  unknown: string[];
  unused: string[];
}

/** Cross-references every variable usage in the schema against defined variables. */
export function validateVariables(schema: EmailTemplateSchema): VariableValidationResult {
  const defined = new Set(schema.variables.map((v) => v.name));
  const { used } = extractAllVariableUsages(schema);

  const unknown = Array.from(used).filter((name) => !defined.has(name));
  const unused = Array.from(defined).filter((name) => !used.has(name));

  return { unknown, unused };
}
