import type { EmailBlock } from '../types/blocks';
import type { EmailTemplateSchema } from '../types/email';

/**
 * Converts the structured schema into email-client-friendly HTML: a
 * table-based layout with inline styles. Variable tokens ({{name}}) are
 * left intact in the output — the generated HTML is a *template*, meant to
 * be handed to a backend/email service that performs the final
 * substitution at send time, the same way the schema's builder/preview
 * only resolves tokens locally for demonstration purposes.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text);
}

function nl2br(text: string): string {
  return text.split('\n').map(escapeHtml).join('<br/>');
}

const FONT = 'Arial, Helvetica, sans-serif';

function blockToHtml(block: EmailBlock): string {
  switch (block.type) {
    case 'text': {
      const p = block.props;
      return `<tr><td style="padding:${p.padding}px;font-size:${p.fontSize}px;font-weight:${p.fontWeight};color:${p.color};text-align:${p.align};line-height:${p.lineHeight};font-family:${FONT};">${nl2br(p.content)}</td></tr>`;
    }
    case 'heading': {
      const p = block.props;
      return `<tr><td style="padding:${p.padding}px;font-size:${p.fontSize}px;font-weight:${p.fontWeight};color:${p.color};text-align:${p.align};font-family:${FONT};">${escapeHtml(p.text)}</td></tr>`;
    }
    case 'image': {
      const p = block.props;
      const img = `<img src="${escapeAttr(p.src)}" alt="${escapeAttr(p.alt)}" width="${p.width}" style="display:block;max-width:100%;border:0;" />`;
      const content = p.linkUrl ? `<a href="${escapeAttr(p.linkUrl)}">${img}</a>` : img;
      return `<tr><td align="${p.align}" style="padding:${p.padding}px;">${content}</td></tr>`;
    }
    case 'button': {
      const p = block.props;
      const width = p.width === 'full' ? ' width="100%"' : '';
      return `<tr><td align="${p.align}" style="padding:${p.padding}px;"><table role="presentation" cellpadding="0" cellspacing="0"${width}><tr><td align="center" style="border-radius:${p.borderRadius}px;background-color:${p.bgColor};"><a href="${escapeAttr(p.url)}" style="display:inline-block;padding:12px 28px;font-family:${FONT};font-size:15px;font-weight:bold;color:${p.textColor};text-decoration:none;border-radius:${p.borderRadius}px;">${escapeHtml(p.text)}</a></td></tr></table></td></tr>`;
    }
    case 'link': {
      const p = block.props;
      return `<tr><td style="padding:8px 16px;text-align:${p.align};font-family:${FONT};"><a href="${escapeAttr(p.url)}" style="color:${p.color};text-decoration:underline;font-size:14px;">${escapeHtml(p.text)}</a></td></tr>`;
    }
    case 'divider': {
      const p = block.props;
      return `<tr><td style="padding:${p.margin}px 16px;"><div style="border-top:${p.thickness}px ${p.style} ${p.color};font-size:0;line-height:0;">&nbsp;</div></td></tr>`;
    }
    case 'spacer': {
      const p = block.props;
      return `<tr><td style="height:${p.height}px;line-height:${p.height}px;font-size:0;">&nbsp;</td></tr>`;
    }
    case 'container': {
      const p = block.props;
      return `<tr><td style="padding:16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${p.bgColor};border:${p.border};border-radius:${p.borderRadius}px;"><tr><td style="padding:${p.padding}px;text-align:${p.align};font-family:${FONT};color:#868e96;font-size:13px;">&nbsp;</td></tr></table></td></tr>`;
    }
    case 'header': {
      const p = block.props;
      const content = p.logoUrl
        ? `<img src="${escapeAttr(p.logoUrl)}" width="${p.logoWidth}" alt="${escapeAttr(p.companyName)}" style="display:inline-block;border:0;" />`
        : `<div style="font-size:18px;font-weight:bold;color:#1a1a1a;font-family:${FONT};">${escapeHtml(p.companyName)}</div>`;
      return `<tr><td align="${p.align}" style="background-color:${p.bgColor};padding:${p.padding}px;">${content}</td></tr>`;
    }
    case 'footer': {
      const p = block.props;
      return `<tr><td style="padding:24px 16px;text-align:${p.align};font-family:${FONT};font-size:12px;color:#868e96;border-top:1px solid #e9ecef;">
        <div style="margin-bottom:4px;">${escapeHtml(p.companyName)}</div>
        <div style="margin-bottom:8px;">Need help? <a href="mailto:${escapeAttr(p.supportEmail)}" style="color:#868e96;">${escapeHtml(p.supportEmail)}</a></div>
        <div style="margin-bottom:8px;"><a href="${escapeAttr(p.privacyUrl)}" style="color:#868e96;margin-right:12px;">Privacy Policy</a><a href="${escapeAttr(p.termsUrl)}" style="color:#868e96;">Terms of Service</a></div>
        <div>${escapeHtml(p.copyrightText)}</div>
      </td></tr>`;
    }
    case 'otp': {
      const p = block.props;
      return `<tr><td align="${p.align}" style="padding:24px;background-color:${p.bgColor};font-family:${FONT};">
        <div style="font-size:13px;color:${p.textColor};opacity:0.75;margin-bottom:12px;">${escapeHtml(p.label)}</div>
        <div style="display:inline-block;padding:14px 20px;border:1px solid #dee2e6;border-radius:8px;background-color:#ffffff;font-size:24px;font-weight:bold;letter-spacing:6px;color:${p.textColor};">{{${p.otpVariable}}}</div>
        <div style="font-size:12px;color:${p.textColor};opacity:0.6;margin-top:12px;">This code expires in {{${p.expiryVariable}}} minutes.</div>
      </td></tr>`;
    }
    case 'transaction': {
      const p = block.props;
      const row = (label: string, variable: string) =>
        `<tr><td style="padding:6px 0;color:#868e96;font-size:14px;">${label}</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:#1a1a1a;font-size:14px;">{{${variable}}}</td></tr>`;
      return `<tr><td style="padding:16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${p.bgColor};border:${p.border};border-radius:8px;"><tr><td style="padding:${p.padding}px;font-family:${FONT};">
        <div style="font-size:15px;font-weight:bold;margin-bottom:12px;color:#1a1a1a;">${escapeHtml(p.title)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('Amount', p.amountVariable)}
          ${row('Transaction ID', p.transactionIdVariable)}
          ${row('Date', p.dateVariable)}
          ${row('Status', p.statusVariable)}
        </table>
      </td></tr></table></td></tr>`;
    }
    case 'securityAlert': {
      const p = block.props;
      return `<tr><td style="padding:16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${p.bgColor};border-radius:6px;"><tr><td style="padding:16px;text-align:${p.align};color:${p.textColor};font-family:${FONT};">
        <div style="font-weight:bold;font-size:14px;margin-bottom:6px;">⚠ ${escapeHtml(p.title)}</div>
        <div style="font-size:13px;line-height:1.5;">${nl2br(p.message)}</div>
      </td></tr></table></td></tr>`;
    }
    default:
      return '';
  }
}

export function generateEmailHtml(schema: EmailTemplateSchema): string {
  const bodyRows = schema.blocks.map(blockToHtml).join('\n');
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(schema.template.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f3f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f3f5;">
    <tr>
      <td align="center" style="padding:24px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;font-family:${FONT};max-width:100%;">
${bodyRows}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function slugifyFileName(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'template'
  );
}
