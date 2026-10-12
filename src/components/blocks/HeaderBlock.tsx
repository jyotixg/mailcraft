import { replaceVariables } from '../../engine/variableEngine';
import type { HeaderBlockProps } from '../../types/blocks';
import { normalizeSpacing, spacingToCss } from '../../utils/spacing';
import type { BlockComponentProps } from './TextBlock';

export function HeaderBlock({ props, previewValues }: BlockComponentProps<HeaderBlockProps>) {
  const companyName = previewValues ? replaceVariables(props.companyName, previewValues) : props.companyName;
  return (
    <div
      style={{
        backgroundColor: props.bgColor,
        padding: spacingToCss(normalizeSpacing(props.padding)),
        textAlign: props.align,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {props.logoUrl ? (
        <img src={props.logoUrl} alt={companyName || 'Company logo'} style={{ width: props.logoWidth }} />
      ) : (
        <div style={{ fontSize: 18, fontWeight: 'bold', color: props.textColor, letterSpacing: 0.5 }}>
          {companyName || 'COMPANY LOGO'}
        </div>
      )}
    </div>
  );
}
