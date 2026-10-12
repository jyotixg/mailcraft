import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createTwoFactorEnabledTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'two-factor-enabled',
      name: 'Two-Factor Authentication Enabled',
      description: 'Confirms that 2FA was turned on for an account — a security best-practice notification.',
      category: 'Security',
      subject: 'Two-factor authentication enabled on your {{companyName}} account',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('enabledTime', 'string', 'When 2FA was enabled'),
      variable('device', 'string', 'Device used to enable 2FA'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('heading', { text: 'Two-factor authentication enabled', icon: '🔒', align: 'center', fontSize: 18 }),
      block('text', {
        content:
          'Hi {{userName}},\n\nTwo-factor authentication was turned on for your account on {{enabledTime}} from {{device}}. Your account is now more secure.',
      }),
      block('securityAlert', {
        title: 'Security Alert',
        message: "If you didn't make this change, please contact support immediately and secure your account.",
      }),
      block('footer', {}),
    ],
  };
}
