import { replaceVariables } from '../../engine/variableEngine';
import type { HeaderBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function HeaderBlock({ props, previewValues }: BlockComponentProps<HeaderBlockProps>) {
  const companyName = previewValues ? replaceVariables(props.companyName, previewValues) : props.companyName;
  return (
    <div
      style={{
        backgroundColor: props.bgColor,
        padding: props.padding,
        textAlign: props.align,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {props.logoUrl ? (
        <img src={props.logoUrl} alt={companyName || 'Company logo'} style={{ width: props.logoWidth }} />
      ) : (
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', letterSpacing: 0.5 }}>
          {companyName || 'COMPANY LOGO'}
        </div>
      )}
    </div>
  );
}
