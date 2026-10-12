import { describe, expect, it } from 'vitest';
import { parseRichTextSegments, wrapWithStyle } from './richText';

describe('parseRichTextSegments', () => {
  it('returns a single plain segment when there is no markup', () => {
    expect(parseRichTextSegments('hi i am joyg')).toEqual([{ text: 'hi i am joyg' }]);
  });

  it('splits out a colored segment', () => {
    expect(parseRichTextSegments('hi i am [style color=#ff0000]joyg[/style]')).toEqual([
      { text: 'hi i am ' },
      { text: 'joyg', color: '#ff0000', bold: undefined },
    ]);
  });

  it('splits out a bold segment', () => {
    expect(parseRichTextSegments('Hi [style bold]Rohini Srivastava[/style],')).toEqual([
      { text: 'Hi ' },
      { text: 'Rohini Srivastava', color: undefined, bold: true },
      { text: ',' },
    ]);
  });

  it('supports a segment that is both bold and colored', () => {
    expect(parseRichTextSegments('[style color=#1971c2 bold]Received[/style]')).toEqual([
      { text: 'Received', color: '#1971c2', bold: true },
    ]);
  });

  it('handles multiple styled segments', () => {
    expect(
      parseRichTextSegments('[style bold]one[/style] and [style color=#222222]two[/style]'),
    ).toEqual([
      { text: 'one', color: undefined, bold: true },
      { text: ' and ' },
      { text: 'two', color: '#222222', bold: undefined },
    ]);
  });

  it('treats malformed/unclosed tags as literal text', () => {
    expect(parseRichTextSegments('[style color=#ff0000]unclosed')).toEqual([
      { text: '[style color=#ff0000]unclosed' },
    ]);
  });
});

describe('wrapWithStyle', () => {
  it('wraps text with a color attribute', () => {
    expect(wrapWithStyle('joyg', { color: '#ff0000' })).toBe('[style color=#ff0000]joyg[/style]');
  });

  it('wraps text with a bold attribute', () => {
    expect(wrapWithStyle('Team Money TV', { bold: true })).toBe('[style bold]Team Money TV[/style]');
  });

  it('wraps text with both attributes', () => {
    expect(wrapWithStyle('Received', { color: '#1971c2', bold: true })).toBe(
      '[style color=#1971c2 bold]Received[/style]',
    );
  });

  it('returns the plain text when no style is given', () => {
    expect(wrapWithStyle('plain', {})).toBe('plain');
  });
});
