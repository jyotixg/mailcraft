import { replaceVariables } from '../../engine/variableEngine';
import type { HeadingBlockProps } from '../../types/blocks';
import { normalizeSpacing, spacingToCss } from '../../utils/spacing';
import type { BlockComponentProps } from './TextBlock';
import { RichText } from './RichText';

export function HeadingBlock({ props, previewValues }: BlockComponentProps<HeadingBlockProps>) {
  const text = previewValues ? replaceVariables(props.text, previewValues) : props.text;
  return (
    <div
      style={{
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        color: props.color,
        textAlign: props.align,
        padding: spacingToCss(normalizeSpacing(props.padding)),
        margin: spacingToCss(normalizeSpacing(props.margin)),
        textTransform: props.textTransform === 'none' ? undefined : props.textTransform,
        fontFamily: 'Arial, Helvetica, sans-serif',
        backgroundColor: props.bgColor,
      }}
    >
      {props.icon && <span style={{ marginRight: 8 }}>{props.icon}</span>}
      {text ? <RichText text={text} /> : <span style={{ opacity: 0.4 }}>Heading</span>}
    </div>
  );
}
