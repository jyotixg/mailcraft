export type PropertyFieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'url';

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
