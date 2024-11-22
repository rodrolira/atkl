import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Actualiza el estado para mostrar la UI de error en caso de fallos
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Puedes registrar el error en un servicio de monitoreo
    console.error("Error capturado por Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes personalizar esta interfaz de usuario
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Oops, algo salió mal 😔</h1>
          <p>Por favor, recarga la página o contacta al soporte técnico.</p>
        </div>
      );
    }

    // Renderiza los hijos si no hay errores
    return this.props.children;
  }
}

export default ErrorBoundary;
