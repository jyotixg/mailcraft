import { replaceVariables } from '../../engine/variableEngine';
import type { SecurityAlertBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

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
          borderRadius: 6,
          padding: 16,
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 6 }}>⚠ {title}</div>
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>{message}</div>
      </div>
    </div>
  );
}
