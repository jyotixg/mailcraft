import { describe, expect, it } from 'vitest';
import { createOtpTemplate } from '../templates/otp';
import { block } from '../templates/helpers';
import { validateTemplate } from './validationEngine';

describe('validateTemplate', () => {
  it('reports no errors for the default, complete OTP template', () => {
    const result = validateTemplate(createOtpTemplate());
    expect(result.errors).toEqual([]);
    expect(result.canBeReady).toBe(true);
    expect(result.score).toBe(100);
  });

  it('flags a missing subject as an error', () => {
    const schema = createOtpTemplate();
    schema.template.subject = '';
    const result = validateTemplate(schema);
    expect(result.errors.some((i) => i.id === 'subject-missing')).toBe(true);
    expect(result.canBeReady).toBe(false);
  });

  it('flags a reference to an undefined variable as an error', () => {
    const schema = createOtpTemplate();
    schema.template.subject = 'Your OTP for {{missingVar}}';
    const result = validateTemplate(schema);
    expect(result.errors.some((i) => i.message === 'Unknown variable: missingVar')).toBe(true);
  });

  it('flags a button with no URL as an error', () => {
    const schema = createOtpTemplate();
    schema.blocks.push(block('button', { text: 'Click me', url: '' }));
    const result = validateTemplate(schema);
    expect(result.errors.some((i) => i.message === 'Button URL is required')).toBe(true);
  });

  it('flags an image with no alt text as an error', () => {
    const schema = createOtpTemplate();
    schema.blocks.push(block('image', { alt: '' }));
    const result = validateTemplate(schema);
    expect(result.errors.some((i) => i.message === 'Image is missing alt text')).toBe(true);
  });

  it('warns, but does not error, when a variable is declared but unused', () => {
    const schema = createOtpTemplate();
    schema.variables.push({ id: 'extra', name: 'neverUsed', type: 'string', description: '' });
    const result = validateTemplate(schema);
    expect(result.warnings.some((i) => i.message === 'Unused variable: neverUsed')).toBe(true);
    expect(result.canBeReady).toBe(true);
  });

  it('applies category-aware rules, e.g. OTP templates should contain an OTP block', () => {
    const schema = createOtpTemplate();
    schema.blocks = schema.blocks.filter((b) => b.type !== 'otp');
    const result = validateTemplate(schema);
    expect(result.warnings.some((i) => i.message.includes('OTP templates should include an OTP block'))).toBe(true);
  });
});
