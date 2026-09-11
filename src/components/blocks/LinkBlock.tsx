import { replaceVariables } from '../../engine/variableEngine';
import type { LinkBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function LinkBlock({ props, previewValues }: BlockComponentProps<LinkBlockProps>) {
  const text = previewValues ? replaceVariables(props.text, previewValues) : props.text;
  return (
    <div style={{ textAlign: props.align, padding: '8px 16px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <span style={{ color: props.color, textDecoration: 'underline', fontSize: 14 }}>{text || 'Link text'}</span>
    </div>
  );
}
