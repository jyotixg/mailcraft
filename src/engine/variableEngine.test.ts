import { describe, expect, it } from 'vitest';
import { createOtpTemplate } from '../templates/otp';
import { extractVariableTokens, replaceVariables, validateVariables } from './variableEngine';

describe('extractVariableTokens', () => {
  it('finds every unique {{token}} in a string', () => {
    expect(extractVariableTokens('Hello {{userName}}, your OTP is {{otp}}.')).toEqual(['userName', 'otp']);
  });

  it('de-duplicates repeated tokens', () => {
    expect(extractVariableTokens('{{otp}} {{otp}}')).toEqual(['otp']);
  });

  it('returns an empty array for text with no tokens', () => {
    expect(extractVariableTokens('Hello there')).toEqual([]);
  });

  it('handles null/undefined input safely', () => {
    expect(extractVariableTokens(undefined)).toEqual([]);
    expect(extractVariableTokens(null)).toEqual([]);
  });
});

describe('replaceVariables', () => {
  it('substitutes tokens with supplied preview values', () => {
    const result = replaceVariables('Hello {{userName}}, your OTP is {{otp}}.', { userName: 'Jyoti', otp: '483921' });
    expect(result).toBe('Hello Jyoti, your OTP is 483921.');
  });

  it('renders a bracketed placeholder for missing values', () => {
    const result = replaceVariables('Hello {{userName}}', {});
    expect(result).toBe('Hello [ userName ]');
  });

  it('returns an empty string for null/undefined input', () => {
    expect(replaceVariables(undefined, {})).toBe('');
  });
});

describe('validateVariables', () => {
  it('reports no issues for the default OTP template', () => {
    const schema = createOtpTemplate();
    const result = validateVariables(schema);
    expect(result.unknown).toEqual([]);
    expect(result.unused).toEqual([]);
  });

  it('flags a variable referenced in content but not declared', () => {
    const schema = createOtpTemplate();
    schema.template.subject = 'Your OTP for {{unknownVar}}';
    const result = validateVariables(schema);
    expect(result.unknown).toContain('unknownVar');
  });

  it('flags a declared variable that is never referenced', () => {
    const schema = createOtpTemplate();
    schema.variables.push({ id: 'extra', name: 'neverUsed', type: 'string', description: '' });
    const result = validateVariables(schema);
    expect(result.unused).toContain('neverUsed');
  });
});
