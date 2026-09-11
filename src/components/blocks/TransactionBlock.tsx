import { replaceVariables, resolveDirectVariable } from '../../engine/variableEngine';
import type { TransactionBlockProps } from '../../types/blocks';
import type { BlockComponentProps } from './TextBlock';

export function TransactionBlock({ props, previewValues }: BlockComponentProps<TransactionBlockProps>) {
  const title = previewValues ? replaceVariables(props.title, previewValues) : props.title;
  const rows: [string, string][] = [
    ['Amount', previewValues ? resolveDirectVariable(props.amountVariable, previewValues) : `{{${props.amountVariable}}}`],
    [
      'Transaction ID',
      previewValues ? resolveDirectVariable(props.transactionIdVariable, previewValues) : `{{${props.transactionIdVariable}}}`,
    ],
    ['Date', previewValues ? resolveDirectVariable(props.dateVariable, previewValues) : `{{${props.dateVariable}}}`],
    ['Status', previewValues ? resolveDirectVariable(props.statusVariable, previewValues) : `{{${props.statusVariable}}}`],
  ];

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          backgroundColor: props.bgColor,
          border: props.border,
          borderRadius: 8,
          padding: props.padding,
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 12, color: '#1a1a1a' }}>{title}</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <td style={{ padding: '6px 0', color: '#868e96' }}>{label}</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', color: '#1a1a1a' }}>
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
