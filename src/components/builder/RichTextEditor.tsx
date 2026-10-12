import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { parseRichTextSegments, wrapWithStyle, type RichTextStyle } from '../../engine/richText';
import type { TemplateVariable } from '../../types/variables';
import { VariablePicker } from '../variables/VariablePicker';
import { RichTextBoldButton } from './RichTextBoldButton';
import { RichTextColorPicker } from './RichTextColorPicker';

function rgbStringToHex(color: string): string {
  if (color.startsWith('#')) return color;
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000';
  const toHex = (n: string) => Number(n).toString(16).padStart(2, '0');
  return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
}

/** Rebuilds the contentEditable DOM from the stored [style ...]...[/style] string. */
function renderValueIntoEditor(container: HTMLElement, text: string, multiline: boolean): void {
  container.innerHTML = '';
  const lines = multiline ? text.split('\n') : [text];
  lines.forEach((line, lineIndex) => {
    parseRichTextSegments(line).forEach((segment) => {
      if (!segment.text) return;
      if (segment.color || segment.bold) {
        const span = document.createElement('span');
        if (segment.color) span.style.color = segment.color;
        if (segment.bold) span.style.fontWeight = 'bold';
        span.textContent = segment.text;
        container.appendChild(span);
      } else {
        container.appendChild(document.createTextNode(segment.text));
      }
    });
    if (multiline && lineIndex < lines.length - 1) {
      container.appendChild(document.createElement('br'));
    }
  });
}

const BOLD_WEIGHTS = new Set(['bold', 'bolder', '700', '800', '900']);

function isBoldElement(el: HTMLElement): boolean {
  return el.tagName === 'B' || el.tagName === 'STRONG' || BOLD_WEIGHTS.has(el.style.fontWeight);
}

/** Walks the edited DOM back into the [style ...]...[/style] string representation. */
function serializeEditorToValue(container: HTMLElement): string {
  let result = '';
  const walk = (node: ChildNode, context: RichTextStyle) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (!text) return;
      result += wrapWithStyle(text, context);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    if (el.tagName === 'BR') {
      result += '\n';
      return;
    }
    const nextContext: RichTextStyle = { ...context };
    if (el.style.color) nextContext.color = rgbStringToHex(el.style.color);
    if (isBoldElement(el)) nextContext.bold = true;
    if ((el.tagName === 'DIV' || el.tagName === 'P') && result.length > 0 && !result.endsWith('\n')) {
      result += '\n';
    }
    Array.from(el.childNodes).forEach((child) => walk(child, nextContext));
  };
  Array.from(container.childNodes).forEach((child) => walk(child, {}));
  return result;
}

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline: boolean;
  variables: TemplateVariable[];
  helperText?: string;
}

/**
 * A live rich-text field: colors/bold render as actual styled text (not raw
 * `[style ...]` markup) while still serializing to that same string for
 * storage, so the rest of the app (validation, HTML export) is untouched.
 */
export function RichTextEditor({ label, value, onChange, multiline, variables, helperText }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    const el = editorRef.current;
    if (el && value !== lastValueRef.current) {
      renderValueIntoEditor(el, value, multiline);
      lastValueRef.current = value;
    }
    // Only re-sync from outside changes (undo/redo, switching blocks) — not our own keystrokes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commitChange = () => {
    const el = editorRef.current;
    if (!el) return;
    const next = serializeEditorToValue(el);
    lastValueRef.current = next;
    onChange(next);
  };

  // The Selection API's `selectionchange` event is the only reliable way to catch every
  // way a selection can be made (drag, double-click word-select, shift+arrow, ...) — a
  // handful of them don't consistently land inside a plain onMouseUp/onKeyUp handler.
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setHasSelection(
        Boolean(selection && !selection.isCollapsed && editorRef.current?.contains(selection.anchorNode)),
      );
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // execCommand mutations fire a native `input` event themselves, which our onInput
  // handler already turns into a commitChange() — calling it again here would double
  // up the change (and double up undo history) for the exact same edit.
  const insertTokenAtCursor = (name: string) => {
    editorRef.current?.focus();
    document.execCommand('insertText', false, `{{${name}}}`);
  };

  // styleWithCSS keeps every command (foreColor, bold, ...) emitting inline-styled
  // <span>s instead of a mix of <font>/<b> tags, which our serializer above relies on.
  const runStyledCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(command, false, value);
  };

  const applyColorToSelection = (color: string) => runStyledCommand('foreColor', color);
  const applyBoldToSelection = () => runStyledCommand('bold');

  // Keeps the editor's selection alive when a toolbar button is pressed (mousedown would
  // otherwise blur the editor before the button's click handler runs).
  const preserveSelection = (e: ReactMouseEvent) => e.preventDefault();

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Stack direction="row" onMouseDown={preserveSelection}>
          <RichTextBoldButton disabled={!hasSelection} onApply={applyBoldToSelection} />
          <RichTextColorPicker disabled={!hasSelection} onApply={applyColorToSelection} />
          <VariablePicker variables={variables} onInsert={insertTokenAtCursor} />
        </Stack>
      </Stack>
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline={multiline}
        aria-label={label}
        onInput={commitChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={(e) => {
          e.preventDefault();
          document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
        }}
        onKeyDown={(e) => {
          if (!multiline && e.key === 'Enter') {
            e.preventDefault();
            return;
          }
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            applyBoldToSelection();
          }
        }}
        sx={{
          minHeight: multiline ? 72 : 36,
          border: '1px solid',
          borderColor: isFocused ? 'primary.main' : '#dcdee8',
          borderRadius: '9px',
          px: 1.5,
          py: 1,
          fontSize: 14,
          fontFamily: 'inherit',
          lineHeight: 1.5,
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          boxShadow: isFocused ? '0 0 0 3.5px rgba(79,70,229,0.12)' : 'none',
          transition: 'box-shadow 0.12s ease, border-color 0.12s ease',
          '&:empty:before': {
            content: multiline ? '"Enter content…"' : '"Enter text…"',
            color: 'text.disabled',
          },
        }}
      />
      {helperText && (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      )}
    </Stack>
  );
}
