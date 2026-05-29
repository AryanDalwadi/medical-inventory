import { createTheme } from '@mui/material/styles';

export const appColors = {
  primary: '#1565c0',
  primaryLight: '#e3f2fd',
  secondary: '#2e7d32',
  secondaryLight: '#e8f5e9',
  background: '#f4f7fb',
  border: '#e3f2fd',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: appColors.primary,
      light: '#42a5f5',
      dark: '#0d47a1',
    },
    secondary: {
      main: appColors.secondary,
      light: '#4caf50',
      dark: '#1b5e20',
    },
    background: {
      default: appColors.background,
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700, color: appColors.primary },
    h6: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${appColors.border}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 8px rgba(21, 101, 192, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
