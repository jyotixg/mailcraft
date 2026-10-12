export type PropertyFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'url'
  | 'image'
  | 'imageList'
  | 'spacing';

export interface PropertyFieldOption {
  label: string;
  value: string;
}

export interface PropertyFieldConfig {
  /** Property key on the block's `props` object. */
  key: string;
  label: string;
  type: PropertyFieldType;
  options?: PropertyFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  /** Renders an "Insert Variable" affordance next to the field. */
  supportsVariables?: boolean;
  /** Renders a "Color selected text" affordance that wraps the selection in [color=#hex]...[/color]. */
  supportsRichColor?: boolean;
  helperText?: string;
}

export const ALIGN_OPTIONS: PropertyFieldOption[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

export const FONT_WEIGHT_OPTIONS: PropertyFieldOption[] = [
  { label: 'Normal', value: 'normal' },
  { label: 'Bold', value: 'bold' },
  { label: '100 · Thin', value: '100' },
  { label: '200 · Extra Light', value: '200' },
  { label: '300 · Light', value: '300' },
  { label: '400 · Regular', value: '400' },
  { label: '500 · Medium', value: '500' },
  { label: '600 · Semi Bold', value: '600' },
  { label: '700 · Bold', value: '700' },
  { label: '800 · Extra Bold', value: '800' },
  { label: '900 · Black', value: '900' },
];

export const TEXT_TRANSFORM_OPTIONS: PropertyFieldOption[] = [
  { label: 'None', value: 'none' },
  { label: 'UPPERCASE', value: 'uppercase' },
  { label: 'lowercase', value: 'lowercase' },
  { label: 'Capitalize', value: 'capitalize' },
];

export const DIVIDER_STYLE_OPTIONS: PropertyFieldOption[] = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
];

export const BLOCK_WIDTH_OPTIONS: PropertyFieldOption[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Full Width', value: 'full' },
];

/** A curated emoji set — renders identically in the builder, preview, and exported HTML. */
export const EMOJI_ICON_OPTIONS: PropertyFieldOption[] = [
  { label: 'None', value: '' },
  { label: '👤 Person', value: '👤' },
  { label: '✅ Check', value: '✅' },
  { label: '☑️ Checkbox', value: '☑️' },
  { label: '🛡️ Shield', value: '🛡️' },
  { label: '🔒 Lock', value: '🔒' },
  { label: '🔓 Unlock', value: '🔓' },
  { label: '🔑 Key', value: '🔑' },
  { label: '🔔 Bell', value: '🔔' },
  { label: '⭐ Star', value: '⭐' },
  { label: 'ℹ️ Info', value: 'ℹ️' },
  { label: '⚠️ Warning', value: '⚠️' },
  { label: '❌ Cross', value: '❌' },
  { label: '🎉 Celebration', value: '🎉' },
  { label: '💳 Card', value: '💳' },
  { label: '💰 Money', value: '💰' },
  { label: '📈 Chart Up', value: '📈' },
  { label: '📉 Chart Down', value: '📉' },
  { label: '📄 Document', value: '📄' },
  { label: '📧 Mail', value: '📧' },
  { label: '📱 Phone', value: '📱' },
  { label: '🏦 Bank', value: '🏦' },
  { label: '⏱️ Clock', value: '⏱️' },
  { label: '🚀 Rocket', value: '🚀' },
  { label: '👍 Thumbs Up', value: '👍' },
  { label: '🎁 Gift', value: '🎁' },
];
