import { replaceVariables, resolveDirectVariable } from '../../engine/variableEngine';
import type { OtpBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function OTPBlock({ props, previewValues }: BlockComponentProps<OtpBlockProps>) {
  const label = previewValues ? replaceVariables(props.label, previewValues) : props.label;
  const expiryToken = props.expiryVariable ? `{{${props.expiryVariable}}}` : '{{expiryMinutes}}';
  const expiryValue = previewValues ? resolveDirectVariable(props.expiryVariable, previewValues) : expiryToken;

  const otpToken = props.otpVariable ? `{{${props.otpVariable}}}` : '{{otp}}';
  const resolvedOtp = previewValues ? resolveDirectVariable(props.otpVariable, previewValues) : null;
  const isResolved = resolvedOtp !== null && !resolvedOtp.startsWith('[ ');
  const digits = isResolved ? resolvedOtp!.padEnd(props.digits, '•').slice(0, props.digits).split('') : null;

  return (
    <div
      style={{
        textAlign: props.align,
        padding: 28,
        backgroundColor: props.bgColor,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: props.textColor, opacity: 0.7, marginBottom: 14 }}>
        {label}
      </div>
      {digits ? (
        <div style={{ display: 'inline-flex', gap: 8 }}>
          {digits.map((digit, index) => (
            <span
              key={`${digit}-${index}`}
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: props.textColor,
                width: 40,
                height: 48,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e4ee',
                boxShadow: '0 2px 6px -2px rgba(16, 24, 40, 0.16)',
              }}
            >
              {digit}
            </span>
          ))}
        </div>
      ) : (
        <span
          style={{
            display: 'inline-block',
            fontSize: 18,
            fontWeight: 700,
            fontFamily: 'monospace',
            color: props.textColor,
            padding: '14px 24px',
            borderRadius: 10,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e4ee',
            boxShadow: '0 2px 6px -2px rgba(16, 24, 40, 0.16)',
          }}
        >
          {otpToken}
        </span>
      )}
      <div style={{ fontSize: 12, color: props.textColor, opacity: 0.6, marginTop: 14 }}>
        This code expires in {expiryValue} minutes.
      </div>
    </div>
  );
}
