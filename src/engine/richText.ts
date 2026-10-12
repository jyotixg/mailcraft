/**
 * A deliberately tiny markup for styling part of a text field's content:
 * `[style color=#ff0000 bold]this part[/style]`. Both attributes are
 * optional and independent. Parsed with a plain regex into segments — never
 * rendered via dangerouslySetInnerHTML, so there's no HTML injection
 * surface even though the source is user-authored.
 */

export interface RichTextSegment {
  text: string;
  color?: string;
  bold?: boolean;
}

export interface RichTextStyle {
  color?: string;
  bold?: boolean;
}

const STYLE_TAG_PATTERN = /\[style([^\]]*)\]([\s\S]*?)\[\/style\]/g;

function parseAttributes(attrString: string): RichTextStyle {
  const colorMatch = attrString.match(/color=(#[0-9a-fA-F]{6})/);
  const bold = /(^|\s)bold(\s|$)/.test(attrString);
  return { color: colorMatch?.[1], bold: bold || undefined };
}

export function parseRichTextSegments(text: string): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  let lastIndex = 0;
  STYLE_TAG_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = STYLE_TAG_PATTERN.exec(text))) {
    if (match.index > lastIndex) segments.push({ text: text.slice(lastIndex, match.index) });
    segments.push({ text: match[2], ...parseAttributes(match[1]) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex) });
  if (segments.length === 0) segments.push({ text: '' });

  return segments;
}

export function wrapWithStyle(text: string, style: RichTextStyle): string {
  const attrs = [style.color ? `color=${style.color}` : '', style.bold ? 'bold' : ''].filter(Boolean).join(' ');
  return attrs ? `[style ${attrs}]${text}[/style]` : text;
}

/** Renders rich-text segments to an HTML string, using the given escaper for each segment's text. */
export function richTextToHtml(text: string, escapeSegment: (segmentText: string) => string): string {
  return parseRichTextSegments(text)
    .map((segment) => {
      if (!segment.color && !segment.bold) return escapeSegment(segment.text);
      const styles = [
        segment.color ? `color:${segment.color};` : '',
        segment.bold ? 'font-weight:bold;' : '',
      ].join('');
      return `<span style="${styles}">${escapeSegment(segment.text)}</span>`;
    })
    .join('');
}
