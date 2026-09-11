import type { DividerBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function DividerBlock({ props }: BlockComponentProps<DividerBlockProps>) {
  return (
    <div style={{ padding: `${props.margin}px 16px` }}>
      <div style={{ borderTop: `${props.thickness}px ${props.style} ${props.color}` }} />
    </div>
  );
}
