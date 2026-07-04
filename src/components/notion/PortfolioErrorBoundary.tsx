import { Component, type ReactNode } from 'react'
import { enrichPortfolioError, type PortfolioError } from './portfolio-error'

type PortfolioErrorBoundaryProps = {
  children: ReactNode
  resetKey: number
  onError: (error: PortfolioError) => void
}

type PortfolioErrorBoundaryState = {
  failed: boolean
}

export class PortfolioErrorBoundary extends Component<
  PortfolioErrorBoundaryProps,
  PortfolioErrorBoundaryState
> {
  state: PortfolioErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): Partial<PortfolioErrorBoundaryState> {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError(enrichPortfolioError(error, info))
    if (import.meta.env.DEV) {
      console.error('[PortfolioErrorBoundary]', error, info.componentStack)
    }
  }

  componentDidUpdate(prevProps: PortfolioErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false })
    }
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
