import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {this.state.error.toString()}
          {this.state.errorInfo.toString()}
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
