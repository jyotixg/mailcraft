import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createPasswordChangedTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'password-changed',
      name: 'Password Changed',
      description: 'Confirms a successful password change and flags suspicious activity.',
      category: 'Security',
      subject: 'Your {{companyName}} password was changed',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('changeTime', 'string', 'When the password was changed'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', {
        content: 'Hello {{userName}},\n\nYour password was changed successfully on {{changeTime}}.',
      }),
      block('securityAlert', {
        title: 'Security Alert',
        message: "If you didn't make this change, please contact support immediately to secure your account.",
      }),
      block('footer', {}),
    ],
  };
}
