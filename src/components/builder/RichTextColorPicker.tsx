import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { IconButton, Tooltip } from '@mui/material';

export interface RichTextColorPickerProps {
  disabled: boolean;
  onApply: (color: string) => void;
}

/** "Color selected text" — clicking it opens the native color picker directly, same as every other color field in the app. */
export function RichTextColorPicker({ disabled, onApply }: RichTextColorPickerProps) {
  return (
    <Tooltip title={disabled ? 'Select some text first to color it' : 'Color selected text'}>
      <span>
        <IconButton
          component="label"
          size="small"
          edge="end"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Color selected text"
        >
          <FormatColorTextIcon fontSize="small" />
          <input
            type="color"
            disabled={disabled}
            onChange={(e) => onApply(e.target.value)}
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
          />
        </IconButton>
      </span>
    </Tooltip>
  );
}
