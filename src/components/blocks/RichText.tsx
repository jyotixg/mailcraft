import { parseRichTextSegments } from '../../engine/richText';

/** Renders `[style color=#hex bold]...[/style]` segments — no dangerouslySetInnerHTML involved. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseRichTextSegments(text).map((segment, index) => (
        <span key={index} style={{ color: segment.color, fontWeight: segment.bold ? 'bold' : undefined }}>
          {segment.text}
        </span>
      ))}
    </>
  );
}
