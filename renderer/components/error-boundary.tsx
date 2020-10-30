import React from 'react';

interface ErrorBoundaryState {
    error?: string;
}

export default class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    state = { error: undefined };

    static getDerivedStateFromError(error: string) {
        // Update state so the next render will show the fallback UI.
        return { error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        console.error(error, errorInfo);
    }

    render() {
        const { error } = this.state;

        if (error) {
            return error;
        }

        return this.props.children;
    }
}
