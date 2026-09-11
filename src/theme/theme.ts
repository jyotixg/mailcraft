import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2f6feb',
      dark: '#1d4ed8',
      light: '#5b8def',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#495057',
    },
    background: {
      default: '#f5f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1d21',
      secondary: '#5c636b',
    },
    divider: '#e5e7eb',
    success: { main: '#2f9e44' },
    warning: { main: '#e8850c' },
    error: { main: '#e03131' },
  },
  shape: {
    borderRadius: 8,
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
    h6: { fontWeight: 700, fontSize: '1rem' },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a1d21',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});
