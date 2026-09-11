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
        padding: 24,
        backgroundColor: props.bgColor,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div style={{ fontSize: 13, color: props.textColor, opacity: 0.75, marginBottom: 12 }}>{label}</div>
      <div
        style={{
          display: 'inline-flex',
          gap: 8,
          padding: '14px 20px',
          border: '1px solid #dee2e6',
          borderRadius: 8,
          backgroundColor: '#ffffff',
        }}
      >
        {digits
          ? digits.map((digit, index) => (
              <span
                key={`${digit}-${index}`}
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  color: props.textColor,
                  minWidth: 18,
                  display: 'inline-block',
                  textAlign: 'center',
                }}
              >
                {digit}
              </span>
            ))
          : (
              <span style={{ fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace', color: props.textColor }}>
                {otpToken}
              </span>
            )}
      </div>
      <div style={{ fontSize: 12, color: props.textColor, opacity: 0.6, marginTop: 12 }}>
        This code expires in {expiryValue} minutes.
      </div>
    </div>
  );
}
