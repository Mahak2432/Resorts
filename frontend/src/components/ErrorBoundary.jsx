import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('React error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-screen pt-32 px-6 bg-cream flex items-center justify-center text-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-gold-500 text-xs">Something went wrong</p>
            <h1 className="text-5xl text-forest-700 mt-3">We lost the trail for a moment</h1>
            <button onClick={() => window.location.reload()} className="btn-primary mt-8">Reload page</button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
