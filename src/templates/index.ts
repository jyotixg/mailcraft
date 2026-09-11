import type { EmailTemplateSchema } from '../types/email';
import { createForgotPasswordTemplate } from './forgotPassword';
import { createLoginSuccessTemplate } from './loginSuccess';
import { createOtpTemplate } from './otp';
import { createPasswordChangedTemplate } from './passwordChanged';
import { createPaymentFailedTemplate } from './paymentFailed';
import { createPaymentSuccessTemplate } from './paymentSuccess';
import { createSubscriptionTemplate } from './subscription';
import { createWelcomeTemplate } from './welcome';

export interface BuiltInTemplateEntry {
  id: string;
  factory: () => EmailTemplateSchema;
}

export const builtInTemplates: BuiltInTemplateEntry[] = [
  { id: 'otp-verification', factory: createOtpTemplate },
  { id: 'login-success', factory: createLoginSuccessTemplate },
  { id: 'forgot-password', factory: createForgotPasswordTemplate },
  { id: 'password-changed', factory: createPasswordChangedTemplate },
  { id: 'subscription-confirmation', factory: createSubscriptionTemplate },
  { id: 'payment-success', factory: createPaymentSuccessTemplate },
  { id: 'payment-failed', factory: createPaymentFailedTemplate },
  { id: 'welcome-email', factory: createWelcomeTemplate },
];

export function getAllBuiltInTemplates(): EmailTemplateSchema[] {
  return builtInTemplates.map((entry) => entry.factory());
}

export function getBuiltInTemplateById(id: string): EmailTemplateSchema | null {
  const entry = builtInTemplates.find((t) => t.id === id);
  return entry ? entry.factory() : null;
}

/** Realistic sample values keyed by variable name, used to seed the Preview Data panel. */
export const SAMPLE_VARIABLE_VALUES: Record<string, string> = {
  userName: 'Jyoti',
  otp: '483921',
  expiryMinutes: '10',
  companyName: 'Example Finance',
  supportEmail: 'support@examplefinance.com',
  device: 'iPhone 15 · Safari',
  location: 'Mumbai, India',
  loginTime: '11 Sep 2026, 10:42 AM',
  resetUrl: 'https://app.examplefinance.com/reset-password?token=demo',
  verificationUrl: 'https://app.examplefinance.com/verify?token=demo',
  changeTime: '11 Sep 2026, 09:15 AM',
  planName: 'Pro Monthly',
  amount: '₹2,499',
  nextBillingDate: '11 Oct 2026',
  subscriptionUrl: 'https://app.examplefinance.com/account/subscription',
  transactionId: 'TXN123456',
  transactionDate: '11 Sep 2026',
  status: 'Successful',
  transactionUrl: 'https://app.examplefinance.com/transactions/TXN123456',
  retryUrl: 'https://app.examplefinance.com/payments/retry',
  getStartedUrl: 'https://app.examplefinance.com/dashboard',
};

export function buildSamplePreviewData(variableNames: string[]): Record<string, string> {
  return Object.fromEntries(variableNames.map((name) => [name, SAMPLE_VARIABLE_VALUES[name] ?? '']));
}
