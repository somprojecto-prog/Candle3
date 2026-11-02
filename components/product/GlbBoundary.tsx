"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface GlbBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

let warned = false;

export default class GlbBoundary extends Component<GlbBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (warned) return;
    warned = true;
    console.error("[GlbBoundary] GLB falhou; usando o placeholder.", error, info.componentStack);
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}