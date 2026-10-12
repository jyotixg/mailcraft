import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createPaymentSuccessTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'payment-success',
      name: 'Payment Success',
      description: 'Confirms a successful payment transaction.',
      category: 'Payment',
      subject: 'Payment successful — {{transactionId}}',
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
      variable('transactionUrl', 'string', 'Link to view the transaction'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', { content: 'Hello {{userName}},\n\nYour payment was successful.' }),
      block('transaction'),
      block('button', { text: 'View Transaction', url: '{{transactionUrl}}' }),
      block('footer', {}),
    ],
  };
}
