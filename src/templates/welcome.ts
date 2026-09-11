import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createWelcomeTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'welcome-email',
      name: 'Welcome Email',
      description: 'Greets a new user right after account creation.',
      category: 'Onboarding',
      subject: 'Welcome to {{companyName}}, {{userName}}!',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('getStartedUrl', 'string', 'Onboarding / dashboard link'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('heading', { text: 'Welcome aboard, {{userName}}!', align: 'center' }),
      block('text', {
        content:
          "We're excited to have you with {{companyName}}. Your account is ready — here's a quick way to get started.",
        align: 'center',
      }),
      block('button', { text: 'Get Started', url: '{{getStartedUrl}}', align: 'center' }),
      block('footer', {}),
    ],
  };
}
