import { replaceVariables } from '../../engine/variableEngine';
import type { TransactionBlockProps } from '../../types/blocks';
import { normalizeSpacing, spacingToCss } from '../../utils/spacing';
import type { BlockComponentProps } from './TextBlock';

export function TransactionBlock({ props, previewValues }: BlockComponentProps<TransactionBlockProps>) {
  const title = previewValues ? replaceVariables(props.title, previewValues) : props.title;
  // Each value field works like every other text field: type a literal value directly,
  // or type {{variableName}} yourself to tie it to a real variable.
  const resolve = (raw: string) => (previewValues ? replaceVariables(raw, previewValues) : raw);
  const rows: [string, string][] = [
    ['Amount', resolve(props.amountVariable)],
    ['Transaction ID', resolve(props.transactionIdVariable)],
    ['Date', resolve(props.dateVariable)],
    ['Status', resolve(props.statusVariable)],
  ];

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          backgroundColor: props.bgColor,
          border: props.border,
          borderRadius: 12,
          padding: spacingToCss(normalizeSpacing(props.padding)),
          fontFamily: 'Arial, Helvetica, sans-serif',
          boxShadow: '0 4px 16px -6px rgba(16, 24, 40, 0.12)',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, color: props.textColor, letterSpacing: -0.2 }}>
          {title}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <tbody>
            {rows.map(([label, value], index) => (
              <tr key={label}>
                <td
                  style={{
                    padding: '10px 0',
                    color: props.textColor,
                    opacity: 0.6,
                    borderTop: index === 0 ? 'none' : '1px solid rgba(127,127,127,0.14)',
                  }}
                >
                  {label}
                </td>
                <td
                  style={{
                    padding: '10px 0',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: props.textColor,
                    borderTop: index === 0 ? 'none' : '1px solid rgba(127,127,127,0.14)',
                  }}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
