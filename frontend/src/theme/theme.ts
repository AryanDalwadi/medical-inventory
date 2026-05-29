import { createTheme } from '@mui/material/styles';

export const appColors = {
  primary: '#18181b',          // zinc-900 / premium dark charcoal
  primaryLight: '#f4f4f5',     // zinc-100 / soft light gray
  secondary: '#27272a',        // zinc-800 / secondary charcoal
  secondaryLight: '#fafafa',   // zinc-50 / off-white
  background: '#fafafa',       // zinc-50 / pure soft light mode background
  border: '#e4e4e7',           // zinc-200 / modern clean borders
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: appColors.primary,
      light: '#52525b',        // zinc-600
      dark: '#09090b',         // zinc-950
    },
    secondary: {
      main: appColors.secondary,
      light: '#71717a',        // zinc-500
      dark: '#18181b',         // zinc-900
    },
    background: {
      default: appColors.background,
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700, color: appColors.primary },
    h6: { fontWeight: 700, color: appColors.primary },
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
          boxShadow: 'none',
          borderBottom: `1px solid ${appColors.border}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${appColors.border}`,
          boxShadow: 'none',
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
