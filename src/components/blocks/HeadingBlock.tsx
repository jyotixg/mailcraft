import { replaceVariables } from '../../engine/variableEngine';
import type { HeadingBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function HeadingBlock({ props, previewValues }: BlockComponentProps<HeadingBlockProps>) {
  const text = previewValues ? replaceVariables(props.text, previewValues) : props.text;
  return (
    <div
      style={{
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        color: props.color,
        textAlign: props.align,
        padding: props.padding,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {text || <span style={{ opacity: 0.4 }}>Heading</span>}
    </div>
  );
}
