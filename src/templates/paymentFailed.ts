import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createPaymentFailedTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'payment-failed',
      name: 'Payment Failed',
      description: 'Notifies the user that a payment attempt could not be completed.',
      category: 'Payment',
      subject: 'Payment failed — {{transactionId}}',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('amount', 'string', 'Transaction amount'),
      variable('transactionId', 'string', 'Transaction reference ID'),
      variable('transactionDate', 'string', 'Date of the transaction'),
      variable('status', 'string', 'Transaction status'),
      variable('retryUrl', 'string', 'Link to retry the payment'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', { content: 'Hello {{userName}},\n\nUnfortunately, your payment could not be completed.' }),
      block('transaction'),
      block('button', { text: 'Try Again', url: '{{retryUrl}}', bgColor: '#e03131' }),
      block('footer', {}),
    ],
  };
}
