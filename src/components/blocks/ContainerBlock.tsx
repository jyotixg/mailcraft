import type { ContainerBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function ContainerBlock({ props }: BlockComponentProps<ContainerBlockProps>) {
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          backgroundColor: props.bgColor,
          border: props.border,
          borderRadius: props.borderRadius,
          padding: props.padding,
          textAlign: props.align,
          minHeight: 48,
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: '#868e96',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: props.align === 'center' ? 'center' : props.align === 'right' ? 'flex-end' : 'flex-start',
        }}
      >
        Container
      </div>
    </div>
  );
}
