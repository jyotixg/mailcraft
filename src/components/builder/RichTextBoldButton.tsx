import FormatBoldIcon from '@mui/icons-material/FormatBold';
import { IconButton, Tooltip } from '@mui/material';

export interface RichTextBoldButtonProps {
  disabled: boolean;
  onApply: () => void;
}

/** "Bold selected text" (Ctrl/Cmd+B also works while the editor is focused). */
export function RichTextBoldButton({ disabled, onApply }: RichTextBoldButtonProps) {
  return (
    <Tooltip title={disabled ? 'Select some text first to bold it' : 'Bold selected text'}>
      <span>
        <IconButton
          size="small"
          edge="end"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onApply}
          aria-label="Bold selected text"
        >
          <FormatBoldIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
}
