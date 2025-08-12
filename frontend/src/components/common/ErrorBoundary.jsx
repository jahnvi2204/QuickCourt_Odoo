import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('UI Error:', error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="card text-sm text-red-600">Something went wrong.</div>;
    }
    return this.props.children;
  }
}


