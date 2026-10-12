import { richTextToHtml } from './richText';
import type { EmailBlock } from '../types/blocks';
import type { EmailTemplateSchema } from '../types/email';
import { normalizeSpacing, spacingToCss } from '../utils/spacing';

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
      // margin doesn't apply to a <td> in email clients, so it goes on an inner <div> instead.
      const transform = p.textTransform && p.textTransform !== 'none' ? `text-transform:${p.textTransform};` : '';
      return `<tr><td style="padding:${spacingToCss(normalizeSpacing(p.padding))};background-color:${p.bgColor};"><div style="margin:${spacingToCss(normalizeSpacing(p.margin))};font-size:${p.fontSize}px;font-weight:${p.fontWeight};${transform}color:${p.color};text-align:${p.align};line-height:${p.lineHeight};font-family:${FONT};">${richTextToHtml(p.content, nl2br)}</div></td></tr>`;
    }
    case 'heading': {
      const p = block.props;
      const iconHtml = p.icon ? `<span style="margin-right:8px;">${escapeHtml(p.icon)}</span>` : '';
      const transform = p.textTransform && p.textTransform !== 'none' ? `text-transform:${p.textTransform};` : '';
      return `<tr><td style="padding:${spacingToCss(normalizeSpacing(p.padding))};background-color:${p.bgColor};"><div style="margin:${spacingToCss(normalizeSpacing(p.margin))};font-size:${p.fontSize}px;font-weight:${p.fontWeight};${transform}color:${p.color};text-align:${p.align};font-family:${FONT};">${iconHtml}${richTextToHtml(p.text, escapeHtml)}</div></td></tr>`;
    }
    case 'image': {
      const p = block.props;
      const img = `<img src="${escapeAttr(p.src)}" alt="${escapeAttr(p.alt)}" width="${p.width}" style="display:block;max-width:100%;border:0;" />`;
      const content = p.linkUrl ? `<a href="${escapeAttr(p.linkUrl)}">${img}</a>` : img;
      return `<tr><td align="${p.align}" style="padding:${spacingToCss(normalizeSpacing(p.padding))};background-color:${p.bgColor};">${content}</td></tr>`;
    }
    case 'button': {
      const p = block.props;
      const width = p.width === 'full' ? ' width="100%"' : '';
      return `<tr><td align="${p.align}" style="padding:${spacingToCss(normalizeSpacing(p.padding))};"><table role="presentation" cellpadding="0" cellspacing="0"${width}><tr><td align="center" style="border-radius:${p.borderRadius}px;background-color:${p.bgColor};box-shadow:0 4px 12px -3px ${p.bgColor}80;"><a href="${escapeAttr(p.url)}" style="display:inline-block;padding:12px 28px;font-family:${FONT};font-size:15px;font-weight:bold;color:${p.textColor};text-decoration:none;border-radius:${p.borderRadius}px;">${escapeHtml(p.text)}</a></td></tr></table></td></tr>`;
    }
    case 'link': {
      const p = block.props;
      return `<tr><td style="padding:8px 16px;text-align:${p.align};font-family:${FONT};background-color:${p.bgColor};"><a href="${escapeAttr(p.url)}" style="color:${p.color};text-decoration:underline;font-size:14px;">${escapeHtml(p.text)}</a></td></tr>`;
    }
    case 'divider': {
      const p = block.props;
      const hasBadge = Boolean(p.badgeIcon || p.badgeText);
      if (!hasBadge) {
        return `<tr><td style="padding:${p.margin}px 16px;"><div style="border-top:${p.thickness}px ${p.style} ${p.color};font-size:0;line-height:0;">&nbsp;</div></td></tr>`;
      }
      const isPill = Boolean(p.badgeText);
      const iconHtml = p.badgeIcon ? `${escapeHtml(p.badgeIcon)}` : '';
      const badgeContent = [iconHtml, escapeHtml(p.badgeText)].filter(Boolean).join('&nbsp;&nbsp;');
      const lineCell = `<td style="border-top:${p.thickness}px ${p.style} ${p.color};font-size:0;line-height:0;">&nbsp;</td>`;
      const gapCell = `<td width="10" style="font-size:0;line-height:0;">&nbsp;</td>`;
      const badgeCell = isPill
        ? `<td style="white-space:nowrap;"><span style="display:inline-block;padding:0 14px;height:28px;line-height:28px;border-radius:14px;background-color:${p.badgeColor};color:#ffffff;font-size:13px;font-weight:bold;font-family:${FONT};">${badgeContent}</span></td>`
        : `<td width="28" style="width:28px;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;background-color:${p.badgeColor};color:#ffffff;font-size:14px;">${badgeContent}</span></td>`;
      const cells =
        p.badgePosition === 'left'
          ? `${badgeCell}${gapCell}${lineCell}`
          : p.badgePosition === 'right'
            ? `${lineCell}${gapCell}${badgeCell}`
            : `${lineCell}${gapCell}${badgeCell}${gapCell}${lineCell}`;
      return `<tr><td style="padding:${p.margin}px 16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table></td></tr>`;
    }
    case 'spacer': {
      const p = block.props;
      return `<tr><td style="height:${p.height}px;line-height:${p.height}px;font-size:0;">&nbsp;</td></tr>`;
    }
    case 'container': {
      const p = block.props;
      return `<tr><td style="padding:16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${p.bgColor};border:${p.border};border-radius:${p.borderRadius}px;"><tr><td style="padding:${spacingToCss(normalizeSpacing(p.padding))};text-align:${p.align};font-family:${FONT};color:#868e96;font-size:13px;">&nbsp;</td></tr></table></td></tr>`;
    }
    case 'header': {
      const p = block.props;
      const content = p.logoUrl
        ? `<img src="${escapeAttr(p.logoUrl)}" width="${p.logoWidth}" alt="${escapeAttr(p.companyName)}" style="display:inline-block;border:0;" />`
        : `<div style="font-size:18px;font-weight:bold;color:${p.textColor};font-family:${FONT};">${escapeHtml(p.companyName)}</div>`;
      return `<tr><td align="${p.align}" style="background-color:${p.bgColor};padding:${spacingToCss(normalizeSpacing(p.padding))};">${content}</td></tr>`;
    }
    case 'footer': {
      const p = block.props;
      return `<tr><td style="padding:24px 16px;text-align:${p.align};font-family:${FONT};font-size:12px;color:${p.textColor};border-top:1px solid #e9ecef;background-color:${p.bgColor};">
        <div style="margin-bottom:4px;">${escapeHtml(p.companyName)}</div>
        <div style="margin-bottom:8px;">Need help? <a href="mailto:${escapeAttr(p.supportEmail)}" style="color:${p.textColor};">${escapeHtml(p.supportEmail)}</a></div>
        <div style="margin-bottom:8px;"><a href="${escapeAttr(p.privacyUrl)}" style="color:${p.textColor};margin-right:12px;">Privacy Policy</a><a href="${escapeAttr(p.termsUrl)}" style="color:${p.textColor};">Terms of Service</a></div>
        <div>${escapeHtml(p.copyrightText)}</div>
      </td></tr>`;
    }
    case 'otp': {
      const p = block.props;
      return `<tr><td align="${p.align}" style="padding:28px;background-color:${p.bgColor};font-family:${FONT};">
        <div style="font-size:13px;font-weight:600;color:${p.textColor};opacity:0.7;margin-bottom:14px;">${escapeHtml(p.label)}</div>
        <div style="display:inline-block;padding:14px 24px;border:1px solid #e2e4ee;border-radius:10px;background-color:#ffffff;font-size:24px;font-weight:bold;letter-spacing:6px;color:${p.textColor};box-shadow:0 2px 6px -2px rgba(16,24,40,0.16);">${escapeHtml(p.otpVariable)}</div>
        <div style="font-size:12px;color:${p.textColor};opacity:0.6;margin-top:14px;">This code expires in ${escapeHtml(p.expiryVariable)} minutes.</div>
      </td></tr>`;
    }
    case 'transaction': {
      const p = block.props;
      const row = (label: string, value: string, first: boolean) =>
        `<tr><td style="padding:10px 0;color:${p.textColor};opacity:0.6;font-size:14px;border-top:${first ? 'none' : '1px solid rgba(127,127,127,0.14)'};">${label}</td><td style="padding:10px 0;text-align:right;font-weight:bold;color:${p.textColor};font-size:14px;border-top:${first ? 'none' : '1px solid rgba(127,127,127,0.14)'};">${escapeHtml(value)}</td></tr>`;
      return `<tr><td style="padding:16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${p.bgColor};border:${p.border};border-radius:12px;box-shadow:0 4px 16px -6px rgba(16,24,40,0.12);"><tr><td style="padding:${spacingToCss(normalizeSpacing(p.padding))};font-family:${FONT};">
        <div style="font-size:15px;font-weight:bold;margin-bottom:14px;color:${p.textColor};">${escapeHtml(p.title)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('Amount', p.amountVariable, true)}
          ${row('Transaction ID', p.transactionIdVariable, false)}
          ${row('Date', p.dateVariable, false)}
          ${row('Status', p.statusVariable, false)}
        </table>
      </td></tr></table></td></tr>`;
    }
    case 'securityAlert': {
      const p = block.props;
      return `<tr><td style="padding:16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${p.bgColor};border-radius:12px;"><tr><td style="padding:18px;text-align:${p.align};color:${p.textColor};font-family:${FONT};">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td valign="top" style="padding-right:12px;">
            <span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;background-color:rgba(0,0,0,0.08);font-size:14px;">⚠</span>
          </td>
          <td valign="top">
            <div style="font-weight:bold;font-size:14px;margin-bottom:4px;">${richTextToHtml(p.title, escapeHtml)}</div>
            <div style="font-size:13px;line-height:1.5;opacity:0.9;">${richTextToHtml(p.message, nl2br)}</div>
          </td>
        </tr></table>
      </td></tr></table></td></tr>`;
    }
    case 'socialIcons': {
      const p = block.props;
      const platforms: { url: string; monogram: string; color: string; name: string }[] = [
        { url: p.facebookUrl, monogram: 'f', color: '#1877F2', name: 'Facebook' },
        { url: p.twitterUrl, monogram: 'X', color: '#000000', name: 'X (Twitter)' },
        { url: p.linkedinUrl, monogram: 'in', color: '#0A66C2', name: 'LinkedIn' },
        { url: p.instagramUrl, monogram: 'IG', color: '#E1306C', name: 'Instagram' },
        { url: p.youtubeUrl, monogram: 'YT', color: '#FF0000', name: 'YouTube' },
      ].filter((platform) => platform.url.trim());
      if (platforms.length === 0) return '';
      const fontSize = Math.round(p.iconSize * 0.4);
      const cells = platforms
        .map(
          (platform) =>
            `<td style="padding:0 5px;"><a href="${escapeAttr(platform.url)}" style="text-decoration:none;"><span style="display:inline-block;width:${p.iconSize}px;height:${p.iconSize}px;line-height:${p.iconSize}px;border-radius:50%;background-color:${platform.color};color:#ffffff;font-size:${fontSize}px;font-weight:bold;text-align:center;font-family:${FONT};">${platform.monogram}</span></a></td>`,
        )
        .join('');
      return `<tr><td align="${p.align}" style="padding:${spacingToCss(normalizeSpacing(p.padding))};background-color:${p.bgColor};"><table role="presentation" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table></td></tr>`;
    }
    case 'imageGroup': {
      const p = block.props;
      if (p.images.length === 0) return '';
      const halfGap = Math.round(p.gap / 2);
      const cells = p.images
        .map((image) => {
          const img = `<img src="${escapeAttr(image.src)}" alt="${escapeAttr(image.alt)}" height="${p.imageHeight}" style="display:block;height:${p.imageHeight}px;width:auto;border:0;" />`;
          const content = image.linkUrl ? `<a href="${escapeAttr(image.linkUrl)}">${img}</a>` : img;
          return `<td style="padding:0 ${halfGap}px;">${content}</td>`;
        })
        .join('');
      return `<tr><td align="${p.align}" style="padding:${spacingToCss(normalizeSpacing(p.padding))};background-color:${p.bgColor};"><table role="presentation" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table></td></tr>`;
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
