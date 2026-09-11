import type { SpacerBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function SpacerBlock({ props }: BlockComponentProps<SpacerBlockProps>) {
  return <div style={{ height: props.height }} />;
}
