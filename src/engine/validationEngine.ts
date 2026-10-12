import { blockRegistry } from '../registry/blockRegistry';
import type { EmailTemplateSchema } from '../types/email';
import { isDataUrlImage } from '../utils/image';
import { validateVariables } from './variableEngine';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  message: string;
  blockId?: string;
}

export interface ValidationResult {
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  score: number;
  canBeReady: boolean;
}

interface CategoryRule {
  /** Whether this rule applies to the given template. */
  appliesTo: (schema: EmailTemplateSchema) => boolean;
  /** Whether the template satisfies the rule. */
  isSatisfied: (schema: EmailTemplateSchema) => boolean;
  message: string;
}

/** POC-level, configurable category-aware checks — add more by extending this list. */
const CATEGORY_RULES: CategoryRule[] = [
  {
    appliesTo: (s) => /otp/i.test(s.template.id) || /otp/i.test(s.template.name),
    isSatisfied: (s) => s.blocks.some((b) => b.type === 'otp'),
    message: 'OTP templates should include an OTP block',
  },
  {
    appliesTo: (s) => /reset|forgot/i.test(s.template.id) || /reset|forgot/i.test(s.template.name),
    isSatisfied: (s) => s.blocks.some((b) => b.type === 'button'),
    message: 'Password reset templates should include a reset button',
  },
  {
    appliesTo: (s) => s.template.category.toLowerCase() === 'payment',
    isSatisfied: (s) => s.blocks.some((b) => b.type === 'transaction'),
    message: 'Payment templates should include a transaction summary',
  },
  {
    appliesTo: (s) => s.template.category.toLowerCase() === 'security',
    isSatisfied: (s) => s.blocks.some((b) => b.type === 'securityAlert'),
    message: 'Security-related templates should include a security notice',
  },
];

export function validateTemplate(schema: EmailTemplateSchema): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!schema.template.subject.trim()) {
    issues.push({ id: 'subject-missing', severity: 'error', message: 'Subject is missing' });
  } else if (schema.template.subject.length > 78) {
    issues.push({ id: 'subject-long', severity: 'warning', message: 'Subject is very long (over 78 characters)' });
  }

  const { unknown, unused } = validateVariables(schema);
  unknown.forEach((name) =>
    issues.push({ id: `unknown-var-${name}`, severity: 'error', message: `Unknown variable: ${name}` }),
  );
  unused.forEach((name) =>
    issues.push({ id: `unused-var-${name}`, severity: 'warning', message: `Unused variable: ${name}` }),
  );

  let hasFooter = false;
  for (const block of schema.blocks) {
    if (block.type === 'footer') hasFooter = true;

    if (block.type === 'image' && isDataUrlImage(block.props.src)) {
      issues.push({
        id: `${block.id}-embedded-image`,
        severity: 'warning',
        message: 'Image uses an uploaded (embedded) file — some email clients like Gmail may not render it. Host it on a URL for production sending.',
        blockId: block.id,
      });
    }
    if (block.type === 'header' && isDataUrlImage(block.props.logoUrl)) {
      issues.push({
        id: `${block.id}-embedded-logo`,
        severity: 'warning',
        message: 'Logo uses an uploaded (embedded) file — some email clients like Gmail may not render it. Host it on a URL for production sending.',
        blockId: block.id,
      });
    }

    const entry = blockRegistry[block.type];
    const validate = entry.validate as ((props: typeof block.props) => string[]) | undefined;
    if (validate) {
      validate(block.props).forEach((message) =>
        issues.push({ id: `${block.id}-${message}`, severity: 'error', message, blockId: block.id }),
      );
    }
  }

  if (schema.blocks.length === 0) {
    issues.push({ id: 'no-blocks', severity: 'warning', message: 'Template has no content blocks yet' });
  }
  if (!hasFooter) {
    issues.push({ id: 'no-footer', severity: 'warning', message: 'Template has no footer block' });
  }

  for (const rule of CATEGORY_RULES) {
    if (rule.appliesTo(schema) && !rule.isSatisfied(schema)) {
      issues.push({ id: `category-${rule.message}`, severity: 'warning', message: rule.message });
    }
  }

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const score = Math.max(0, Math.min(100, 100 - errors.length * 20 - warnings.length * 5));

  return { issues, errors, warnings, score, canBeReady: errors.length === 0 };
}
