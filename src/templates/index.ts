import type { EmailTemplateSchema } from '../types/email';
import { createAccountDeactivatedTemplate } from './accountDeactivated';
import { createEmailVerificationTemplate } from './emailVerification';
import { createForgotPasswordTemplate } from './forgotPassword';
import { createLoginSuccessTemplate } from './loginSuccess';
import { createMobileVerificationTemplate } from './mobileVerification';
import { createOtpTemplate } from './otp';
import { createPasswordChangedTemplate } from './passwordChanged';
import { createPaymentFailedTemplate } from './paymentFailed';
import { createPaymentSuccessTemplate } from './paymentSuccess';
import { createSubscriptionTemplate } from './subscription';
import { createTwoFactorEnabledTemplate } from './twoFactorEnabled';
import { createWelcomeTemplate } from './welcome';

export interface BuiltInTemplateEntry {
  id: string;
  factory: () => EmailTemplateSchema;
}

export const builtInTemplates: BuiltInTemplateEntry[] = [
  { id: 'otp-verification', factory: createOtpTemplate },
  { id: 'email-verification', factory: createEmailVerificationTemplate },
  { id: 'mobile-verification', factory: createMobileVerificationTemplate },
  { id: 'login-success', factory: createLoginSuccessTemplate },
  { id: 'forgot-password', factory: createForgotPasswordTemplate },
  { id: 'password-changed', factory: createPasswordChangedTemplate },
  { id: 'two-factor-enabled', factory: createTwoFactorEnabledTemplate },
  { id: 'account-deactivated', factory: createAccountDeactivatedTemplate },
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
  phoneNumber: '+91 98765 43210',
  deactivationDate: '10 Oct 2026',
  reactivationUrl: 'https://app.examplefinance.com/reactivate?token=demo',
  enabledTime: '12 Oct 2026, 11:20 AM',
};

export function buildSamplePreviewData(variableNames: string[]): Record<string, string> {
  return Object.fromEntries(variableNames.map((name) => [name, SAMPLE_VARIABLE_VALUES[name] ?? '']));
}
