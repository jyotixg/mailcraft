import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createSubscriptionTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'subscription-confirmation',
      name: 'Subscription Confirmation',
      description: 'Confirms an active subscription plan and next billing date.',
      category: 'Subscription',
      subject: 'Your {{planName}} subscription is active',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('planName', 'string', 'Subscription plan name'),
      variable('amount', 'string', 'Billed amount'),
      variable('nextBillingDate', 'string', 'Next billing date'),
      variable('subscriptionUrl', 'string', 'Link to manage subscription'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', { content: 'Hello {{userName}},\n\nYour subscription has been successfully activated.' }),
      block('heading', { text: 'Subscription Summary', fontSize: 16 }),
      block('text', {
        content: 'Plan: {{planName}}\nAmount: {{amount}}\nNext Billing Date: {{nextBillingDate}}',
        padding: 8,
      }),
      block('button', { text: 'View Subscription', url: '{{subscriptionUrl}}' }),
      block('footer', {}),
    ],
  };
}
