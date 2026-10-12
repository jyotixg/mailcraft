import { replaceVariables } from '../../engine/variableEngine';
import type { TextBlockProps } from '../../types/blocks';
import type { PreviewDataValues } from '../../types/email';
import { normalizeSpacing, spacingToCss } from '../../utils/spacing';
import { RichText } from './RichText';

export interface BlockComponentProps<P> {
  props: P;
  previewValues?: PreviewDataValues;
}

export function TextBlock({ props, previewValues }: BlockComponentProps<TextBlockProps>) {
  const content = previewValues ? replaceVariables(props.content, previewValues) : props.content;
  return (
    <div
      style={{
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        color: props.color,
        textAlign: props.align,
        lineHeight: props.lineHeight,
        padding: spacingToCss(normalizeSpacing(props.padding)),
        margin: spacingToCss(normalizeSpacing(props.margin)),
        textTransform: props.textTransform === 'none' ? undefined : props.textTransform,
        whiteSpace: 'pre-wrap',
        fontFamily: 'Arial, Helvetica, sans-serif',
        backgroundColor: props.bgColor,
      }}
    >
      {content ? <RichText text={content} /> : <span style={{ opacity: 0.4 }}>Empty text block</span>}
    </div>
  );
}
