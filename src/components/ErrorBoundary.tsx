import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro não tratado:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111319] text-[#e2e2ea] flex items-center justify-center p-6 font-barlow">
          <div className="max-w-md w-full bg-[#191b21] border border-[#D64045] p-6 chamfer-panel shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#D64045]">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-wider">Falha de Sistema Detectada</h2>
                <p className="text-xs font-space-mono text-[#9DA3AE]">RECUPERAÇÃO DE EMERGÊNCIA ATIVADA</p>
              </div>
            </div>
            
            <p className="text-sm text-[#9DA3AE] bg-[#111319] p-3 border border-[#282a30] font-space-mono">
              {this.state.error?.message || 'Ocorreu um erro inesperado no simulador de sobrevivência.'}
            </p>

            <button
              onClick={this.handleReset}
              className="w-full bg-[#E5A93C] text-[#111319] font-bold py-3 px-4 chamfer-btn hover:bg-[#F4C458] transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reiniciar Simulador 72h
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
