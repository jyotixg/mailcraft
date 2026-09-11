import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createForgotPasswordTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'forgot-password',
      name: 'Forgot Password',
      description: 'Sent when a user requests a password reset link.',
      category: 'Authentication',
      subject: 'Reset your {{companyName}} password',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('resetUrl', 'string', 'Password reset link'),
      variable('expiryMinutes', 'number', 'Reset link expiry time, in minutes'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', {
        content: 'Hello {{userName}},\n\nWe received a request to reset your password. Click the button below to securely create a new password.',
      }),
      block('button', { text: 'Reset Password', url: '{{resetUrl}}' }),
      block('text', { content: 'This link expires in {{expiryMinutes}} minutes.', fontSize: 13, color: '#868e96' }),
      block('footer', {}),
    ],
  };
}
