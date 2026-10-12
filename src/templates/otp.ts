import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createOtpTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'otp-verification',
      name: 'OTP Verification',
      description: 'One-time password sent for login or transaction verification.',
      category: 'Authentication',
      subject: 'Your OTP for {{companyName}}',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('otp', 'string', 'One-time password'),
      variable('expiryMinutes', 'number', 'OTP expiry time, in minutes'),
      variable('companyName', 'string', 'Company name'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', { content: 'Hello {{userName}},\n\nYour verification code is:' }),
      block('otp', { label: 'Your verification code' }),
      block('securityAlert', {
        title: 'Security Alert',
        message: 'If you did not request this code, please contact support immediately.',
      }),
      block('footer', {}),
    ],
  };
}
