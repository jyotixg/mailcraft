import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createEmailVerificationTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'email-verification',
      name: 'Email Verification',
      description: 'Confirms a new user’s email address right after sign-up.',
      category: 'Authentication',
      subject: 'Please verify your email for {{companyName}}',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('verificationUrl', 'string', 'Email verification link'),
      variable('expiryMinutes', 'number', 'Link expiry time, in minutes'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('heading', { text: 'Confirm your email address', align: 'center' }),
      block('text', {
        content:
          'Hi {{userName}},\n\nThanks for signing up for {{companyName}}! Please confirm this is your email address by clicking the button below.',
        align: 'center',
      }),
      block('button', { text: 'Verify Email Address', url: '{{verificationUrl}}', align: 'center' }),
      block('text', {
        content:
          'This link expires in {{expiryMinutes}} minutes. If you did not create this account, you can safely ignore this email.',
        fontSize: 13,
        color: '#868e96',
        align: 'center',
      }),
      block('footer', {}),
    ],
  };
}
