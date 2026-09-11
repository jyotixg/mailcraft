import { Button, Stack, Typography } from '@mui/material';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('MailCraft crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Stack
          spacing={2}
          sx={{ height: '100vh', p: 4, textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography variant="h6">Something went wrong.</Typography>
          <Typography variant="body2" color="text.secondary">
            MailCraft hit an unexpected error. Your last saved template is safe in local storage.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Stack>
      );
    }
    return this.props.children;
  }
}
