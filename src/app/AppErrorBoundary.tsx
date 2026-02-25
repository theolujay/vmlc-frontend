"use client"
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    throw new Error(`"Uncaught error: " ${error} ${errorInfo}`);
  }

  public render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <main>
          <h1>An error occured</h1>
          <button onClick={() => window.location.reload()} type="button">
            Refresh App
          </button>
        </main>
      );
    }

    return children;
  }
}

export default AppErrorBoundary;
