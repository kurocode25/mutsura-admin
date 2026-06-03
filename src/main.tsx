import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, GlobalStyles } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import App from './App.tsx';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';

const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '.EasyMDEContainer .CodeMirror-fullscreen': {
        zIndex: theme.zIndex.modal + 1
      },
      '.editor-toolbar.fullscreen': {
        zIndex: theme.zIndex.modal + 2
      },
      '.editor-preview-side': {
        zIndex: theme.zIndex.modal + 2
      }
    })}
  />
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <SnackbarProvider maxSnack={3}>
        <Router basename="/admin">
          <AuthProvider>
            <App />
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>
);
