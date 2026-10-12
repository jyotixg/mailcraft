import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createAccountDeactivatedTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'account-deactivated',
      name: 'Account Deactivated',
      description: 'Confirms that a user’s account has been deactivated, with a window to undo it.',
      category: 'Security',
      subject: 'Your {{companyName}} account has been deactivated',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('deactivationDate', 'string', 'When the account was deactivated'),
      variable('reactivationUrl', 'string', 'Link to reactivate the account'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', {
        content: 'Hi {{userName}},\n\nYour {{companyName}} account was deactivated on {{deactivationDate}}, as requested.',
      }),
      block('text', { content: 'Changed your mind? You can reactivate your account anytime within the next 30 days.' }),
      block('button', { text: 'Reactivate Account', url: '{{reactivationUrl}}' }),
      block('securityAlert', {
        title: "Wasn't you?",
        message: 'If you did not request this, please contact support immediately — your account may be at risk.',
      }),
      block('footer', {}),
    ],
  };
}
