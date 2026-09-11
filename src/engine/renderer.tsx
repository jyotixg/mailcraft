import type { ReactElement } from 'react';
import { blockRegistry } from '../registry/blockRegistry';
import type { EmailBlock } from '../types/blocks';
import type { PreviewDataValues } from '../types/email';

/**
 * The single rendering path shared by the builder canvas and the runtime
 * preview: given a schema block, look up its registry entry and render its
 * component. Passing `previewValues` switches the block into "resolved"
 * mode (tokens replaced); omitting it renders raw `{{tokens}}` for editing.
 */
export function renderBlock(block: EmailBlock, previewValues?: PreviewDataValues): ReactElement {
  const entry = blockRegistry[block.type];
  const Component = entry.component;
  // Each registry entry's component type matches its own block.props type by construction.
  return <Component key={block.id} props={block.props as never} previewValues={previewValues} />;
}

export function renderBlocks(blocks: EmailBlock[], previewValues?: PreviewDataValues): ReactElement[] {
  return blocks.map((block) => renderBlock(block, previewValues));
}
