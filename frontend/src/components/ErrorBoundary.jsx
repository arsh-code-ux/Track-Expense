import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // You can send this to a logging endpoint if desired
    console.error('ErrorBoundary caught an error:', error)
    console.error(info)
    this.setState({ info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:40,fontFamily:'Inter, Arial, sans-serif'}}>
          <h1 style={{color:'#b91c1c'}}>Something went wrong</h1>
          <p style={{color:'#374151'}}>The application encountered an unexpected error — we captured it and logged details to the console.</p>
          <details style={{whiteSpace:'pre-wrap',marginTop:12,background:'#f3f4f6',padding:12,borderRadius:6}}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.info && this.state.info.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
