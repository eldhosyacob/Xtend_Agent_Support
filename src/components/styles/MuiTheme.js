import { createTheme } from '@mui/material/styles';

// Create a theme instance with custom typography settings
const muiTheme = createTheme({
  typography: {
    fontFamily: 'Satoshi,ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Satoshi,ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
        },
      },
    },
  },
});

export default muiTheme; 