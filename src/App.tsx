import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BuilderLayout } from './components/builder/BuilderLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { EmailBuilderProvider } from './context/EmailBuilderContext';
import { PreviewProvider } from './context/PreviewContext';
import { theme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <EmailBuilderProvider>
          <PreviewProvider>
            <BuilderLayout />
          </PreviewProvider>
        </EmailBuilderProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
