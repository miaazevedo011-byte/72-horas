import React from 'react';
import { Target, Keyboard, AlertCircle } from 'lucide-react';

interface ObjectiveFooterProps {
  objective: string;
  nearbyObjectName: string | null;
  onInteractNearby: () => void;
}

export const ObjectiveFooter: React.FC<ObjectiveFooterProps> = React.memo(({
  objective,
  nearbyObjectName,
  onInteractNearby,
}) => {
  return (
    <footer className="w-full bg-[#191b21]/95 backdrop-blur-md border-t border-[#282a30] p-2 sm:p-3 relative z-30 select-none font-barlow">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Active Objective Banner */}
        <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
          <div className="p-1 bg-[#E5A93C]/20 border border-[#E5A93C] rounded shrink-0">
            <Target className="w-4 h-4 text-[#E5A93C]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-space-mono text-[#9DA3AE] uppercase tracking-widest leading-none">
              OBJETIVO ATUAL
            </span>
            <span className="text-sm font-semibold text-[#e2e2ea] tracking-wide leading-tight line-clamp-1">
              {objective}
            </span>
          </div>
        </div>

        {/* Center: Interactive Prompt Banner when close to an object */}
        {nearbyObjectName ? (
          <button
            onClick={onInteractNearby}
            className="w-full sm:w-auto bg-[#E5A93C] hover:bg-[#F4C458] text-[#111319] font-bold px-4 py-1.5 chamfer-btn transition-transform transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider animate-bounce shadow-lg"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>[E] INTERAGIR COM {nearbyObjectName}</span>
          </button>
        ) : (
          <div className="hidden lg:flex items-center gap-3 text-xs font-space-mono text-[#9DA3AE]">
            <span className="flex items-center gap-1">
              <span className="bg-[#111319] border border-[#282a30] px-1.5 py-0.5 text-[#E5A93C]">WASD / Setas</span> Movimentação
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="bg-[#111319] border border-[#282a30] px-1.5 py-0.5 text-[#E5A93C]">E / Clique</span> Interagir
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="bg-[#111319] border border-[#282a30] px-1.5 py-0.5 text-[#4A90E2]">I</span> Itens
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="bg-[#111319] border border-[#282a30] px-1.5 py-0.5 text-[#4A90E2]">J</span> Diário
            </span>
          </div>
        )}

        {/* Right: Telemetry Stencil Tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-space-mono text-[#9DA3AE]">
          <Keyboard className="w-3.5 h-3.5" />
          <span>SISTEMA 72H // CERCO ATIVO</span>
        </div>

      </div>
    </footer>
  );
});

ObjectiveFooter.displayName = 'ObjectiveFooter';
