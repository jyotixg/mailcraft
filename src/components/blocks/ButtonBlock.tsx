import { replaceVariables } from '../../engine/variableEngine';
import type { ButtonBlockProps } from '../../types/blocks';
import { normalizeSpacing, spacingToCss } from '../../utils/spacing';
import type { BlockComponentProps } from './TextBlock';

const justifyForAlign: Record<ButtonBlockProps['align'], string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export function ButtonBlock({ props, previewValues }: BlockComponentProps<ButtonBlockProps>) {
  const text = previewValues ? replaceVariables(props.text, previewValues) : props.text;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justifyForAlign[props.align],
        padding: spacingToCss(normalizeSpacing(props.padding)),
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: props.width === 'full' ? '100%' : 'auto',
          textAlign: 'center',
          backgroundColor: props.bgColor,
          color: props.textColor,
          borderRadius: props.borderRadius,
          padding: '12px 28px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 15,
          fontWeight: 'bold',
          boxSizing: 'border-box',
          boxShadow: `0 4px 12px -3px ${props.bgColor}80`,
        }}
      >
        {text || 'Button'}
      </span>
    </div>
  );
}
