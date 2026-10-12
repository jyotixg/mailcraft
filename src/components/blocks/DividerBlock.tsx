import type { DividerBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function DividerBlock({ props }: BlockComponentProps<DividerBlockProps>) {
  const line = <div style={{ borderTop: `${props.thickness}px ${props.style} ${props.color}`, flex: 1 }} />;
  const hasBadge = Boolean(props.badgeIcon || props.badgeText);

  if (!hasBadge) {
    return (
      <div style={{ padding: `${props.margin}px 16px` }}>
        {line}
      </div>
    );
  }

  const isPill = Boolean(props.badgeText);
  const badge = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        minWidth: isPill ? undefined : 28,
        height: 28,
        padding: isPill ? '0 14px' : 0,
        borderRadius: isPill ? 14 : '50%',
        backgroundColor: props.badgeColor,
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 700,
        fontFamily: 'Arial, Helvetica, sans-serif',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {props.badgeIcon && <span style={{ fontSize: 14 }}>{props.badgeIcon}</span>}
      {props.badgeText}
    </span>
  );

  return (
    <div style={{ padding: `${props.margin}px 16px`, display: 'flex', alignItems: 'center', gap: 10 }}>
      {props.badgePosition !== 'left' && line}
      {badge}
      {props.badgePosition !== 'right' && line}
    </div>
  );
}
