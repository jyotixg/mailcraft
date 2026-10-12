import { alpha, createTheme } from '@mui/material/styles';

const PRIMARY = '#4f46e5';
const PRIMARY_DARK = '#4338ca';
const PRIMARY_LIGHT = '#818cf8';

// Soft, layered shadows instead of MUI's default harsh umbra/penumbra stack.
const softShadow = (y: number, blur: number, spread: number, alphaValue: number) =>
  `0 ${y}px ${blur}px ${spread}px rgba(16, 24, 40, ${alphaValue})`;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY,
      dark: PRIMARY_DARK,
      light: PRIMARY_LIGHT,
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#495057',
    },
    background: {
      default: '#f6f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#12141a',
      secondary: '#65697a',
    },
    divider: '#e7e8ef',
    success: { main: '#12b76a' },
    warning: { main: '#f79009' },
    error: { main: '#f04438' },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 13,
    h6: { fontWeight: 800, fontSize: '1.05rem', letterSpacing: -0.2 },
    h4: { fontWeight: 800, letterSpacing: -0.5 },
    subtitle1: { fontWeight: 700 },
    subtitle2: { fontWeight: 700, letterSpacing: -0.1 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.1 },
    caption: { letterSpacing: 0.1 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(18, 20, 26, 0.16)',
          borderRadius: 8,
        },
        '*::-webkit-scrollbar-thumb:hover': { background: 'rgba(18, 20, 26, 0.28)' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 14,
          transition: 'transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease',
        },
        contained: {
          boxShadow: softShadow(1, 2, 0, 0.06),
          '&:hover': {
            boxShadow: softShadow(4, 10, -2, 0.12),
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#dcdee8',
          '&:hover': { borderColor: PRIMARY, backgroundColor: alpha(PRIMARY, 0.04) },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.12s ease, transform 0.12s ease',
          '&:hover': { backgroundColor: alpha(PRIMARY, 0.08) },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: '#e7e8ef' },
        elevation1: { boxShadow: softShadow(1, 3, 0, 0.05) },
        elevation2: { boxShadow: softShadow(2, 6, -1, 0.06) },
        elevation3: { boxShadow: softShadow(4, 12, -2, 0.08) },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #e7e8ef',
          boxShadow: softShadow(1, 2, 0, 0.04),
          transition: 'box-shadow 0.16s ease, transform 0.16s ease, border-color 0.16s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #fbfbfe 100%)',
          color: '#12141a',
          borderBottom: '1px solid #e7e8ef',
          boxShadow: softShadow(1, 2, 0, 0.03),
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1a1c25',
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 600,
          padding: '6px 10px',
        },
        arrow: { color: '#1a1c25' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 7 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          boxShadow: softShadow(20, 48, -12, 0.18),
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: softShadow(0, 24, -8, 0.12),
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          transition: 'box-shadow 0.12s ease, border-color 0.12s ease',
          '&.Mui-focused': {
            boxShadow: `0 0 0 3.5px ${alpha(PRIMARY, 0.12)}`,
          },
        },
        notchedOutline: { borderColor: '#dcdee8' },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { borderRadius: 9, gap: 2, padding: 2, backgroundColor: '#f0f1f7' },
        grouped: {
          border: 0,
          borderRadius: '7px !important',
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            boxShadow: softShadow(1, 3, 0, 0.08),
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: '#eef0f6' },
      },
    },
  },
});
