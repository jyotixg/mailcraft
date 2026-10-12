import { replaceVariables } from '../../engine/variableEngine';
import type { SecurityAlertBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';
import { RichText } from './RichText';

export function SecurityAlertBlock({ props, previewValues }: BlockComponentProps<SecurityAlertBlockProps>) {
  const title = previewValues ? replaceVariables(props.title, previewValues) : props.title;
  const message = previewValues ? replaceVariables(props.message, previewValues) : props.message;
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          backgroundColor: props.bgColor,
          color: props.textColor,
          textAlign: props.align,
          borderRadius: 12,
          padding: 18,
          fontFamily: 'Arial, Helvetica, sans-serif',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <span
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.08)',
            fontSize: 14,
          }}
        >
          ⚠
        </span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
            <RichText text={title} />
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9 }}>
            <RichText text={message} />
          </div>
        </div>
      </div>
    </div>
  );
}
