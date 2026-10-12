import { replaceVariables } from '../../engine/variableEngine';
import type { FooterBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function FooterBlock({ props, previewValues }: BlockComponentProps<FooterBlockProps>) {
  const resolve = (text: string) => (previewValues ? replaceVariables(text, previewValues) : text);
  return (
    <div
      style={{
        padding: '24px 16px',
        textAlign: props.align,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 12,
        color: props.textColor,
        borderTop: '1px solid #e9ecef',
        backgroundColor: props.bgColor,
      }}
    >
      <div style={{ marginBottom: 4 }}>{resolve(props.companyName)}</div>
      <div style={{ marginBottom: 8 }}>
        Need help? <a href={`mailto:${props.supportEmail}`} style={{ color: props.textColor }}>{resolve(props.supportEmail)}</a>
      </div>
      <div style={{ marginBottom: 8 }}>
        <a href={props.privacyUrl} style={{ color: props.textColor, marginRight: 12 }}>
          Privacy Policy
        </a>
        <a href={props.termsUrl} style={{ color: props.textColor }}>
          Terms of Service
        </a>
      </div>
      <div>{resolve(props.copyrightText)}</div>
    </div>
  );
}
