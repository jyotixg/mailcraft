import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createLoginSuccessTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'login-success',
      name: 'Login Success',
      description: 'Notifies the user of a new successful login on their account.',
      category: 'Security',
      subject: 'New login detected for {{companyName}}',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('device', 'string', 'Device used to sign in'),
      variable('location', 'string', 'Approximate login location'),
      variable('loginTime', 'string', 'Timestamp of the login'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', { content: 'Hello {{userName}},\n\nA successful login was detected on your account.' }),
      block('heading', { text: 'Login Details', fontSize: 16 }),
      block('text', {
        content: 'Device: {{device}}\nLocation: {{location}}\nTime: {{loginTime}}',
        padding: 8,
      }),
      block('securityAlert', {
        title: 'Security Alert',
        message: "If this wasn't you, please secure your account immediately.",
      }),
      block('footer', {}),
    ],
  };
}
