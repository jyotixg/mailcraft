export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function uniformSpacing(value: number): Spacing {
  return { top: value, right: value, bottom: value, left: value };
}

/**
 * Reads a padding value that may still be in the old single-number format
 * (from a template saved before per-side padding existed) or the current
 * `Spacing` object — either way, returns a valid `Spacing`.
 */
export function normalizeSpacing(value: unknown, fallback = 0): Spacing {
  if (typeof value === 'number') return uniformSpacing(value);
  if (value && typeof value === 'object') {
    const v = value as Partial<Spacing>;
    return {
      top: v.top ?? fallback,
      right: v.right ?? fallback,
      bottom: v.bottom ?? fallback,
      left: v.left ?? fallback,
    };
  }
  return uniformSpacing(fallback);
}

export function spacingToCss(spacing: Spacing): string {
  return `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`;
}
