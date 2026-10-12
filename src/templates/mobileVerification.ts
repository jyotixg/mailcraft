import type { EmailTemplateSchema } from '../types/email';
import { block, variable } from './helpers';

export function createMobileVerificationTemplate(): EmailTemplateSchema {
  return {
    schemaVersion: 1,
    template: {
      id: 'mobile-verification',
      name: 'Mobile Number Verification',
      description: 'Email copy of an OTP sent to verify a mobile number linked to the account.',
      category: 'Authentication',
      subject: 'Verify your mobile number for {{companyName}}',
      status: 'ready',
      lastModified: new Date().toISOString(),
      isBuiltIn: true,
    },
    variables: [
      variable('userName', 'string', "User's display name"),
      variable('companyName', 'string', 'Company name'),
      variable('phoneNumber', 'string', 'Mobile number being verified'),
      variable('otp', 'string', 'One-time verification code'),
      variable('expiryMinutes', 'number', 'OTP expiry time, in minutes'),
      variable('supportEmail', 'string', 'Support contact email'),
    ],
    blocks: [
      block('header', { companyName: '{{companyName}}' }),
      block('text', {
        content: 'Hi {{userName}},\n\nUse the code below to verify the mobile number {{phoneNumber}} linked to your account.',
      }),
      block('otp', { label: 'Your verification code' }),
      block('text', {
        content: "Didn't request this? You can safely ignore this email — your mobile number won't be changed.",
        fontSize: 13,
        color: '#868e96',
      }),
      block('footer', {}),
    ],
  };
}
