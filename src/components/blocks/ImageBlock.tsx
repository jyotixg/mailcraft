import { replaceVariables } from '../../engine/variableEngine';
import type { ImageBlockProps } from '../../types/blocks';
import { normalizeSpacing, spacingToCss } from '../../utils/spacing';
import type { BlockComponentProps } from './TextBlock';

const justifyForAlign: Record<ImageBlockProps['align'], string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export function ImageBlock({ props, previewValues }: BlockComponentProps<ImageBlockProps>) {
  const alt = previewValues ? replaceVariables(props.alt, previewValues) : props.alt;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justifyForAlign[props.align],
        padding: spacingToCss(normalizeSpacing(props.padding)),
        backgroundColor: props.bgColor,
      }}
    >
      {props.src ? (
        <img src={props.src} alt={alt} style={{ width: props.width, maxWidth: '100%', display: 'block' }} />
      ) : (
        <div
          style={{
            width: props.width,
            height: 120,
            background: '#f1f3f5',
            border: '1px dashed #ced4da',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#868e96',
            fontSize: 13,
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          No image URL set
        </div>
      )}
    </div>
  );
}
