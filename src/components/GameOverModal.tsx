import React from 'react';
import { Trophy, Skull, RefreshCw, Award, Clock } from 'lucide-react';
import { Vitals } from '../types/game';

interface GameOverModalProps {
  isVictory: boolean;
  secondsLeft: number;
  vitals: Vitals;
  daysSurvived: number;
  totalEventsCompleted: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = React.memo(({
  isVictory,
  secondsLeft,
  vitals,
  daysSurvived,
  totalEventsCompleted,
  onRestart,
}) => {
  const hoursSurvived = Math.floor((72 * 3600 - secondsLeft) / 3600);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn font-barlow">
      <div className={`max-w-xl w-full bg-[#191b21] border-2 p-6 sm:p-8 chamfer-panel shadow-2xl space-y-6 relative text-center ${
        isVictory ? 'border-[#48BB78] ink-border-amber' : 'border-[#D64045] ink-border-crimson'
      }`}>
        
        {/* Banner Icon */}
        <div className="inline-flex p-4 rounded-full bg-[#111319] border border-[#282a30] mx-auto shadow-inner">
          {isVictory ? (
            <Trophy className="w-12 h-12 text-[#48BB78] animate-bounce" />
          ) : (
            <Skull className="w-12 h-12 text-[#D64045] animate-pulse" />
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-space-mono text-[#9DA3AE] uppercase tracking-widest">
            {isVictory ? 'EVACUAÇÃO BEM SUCEDIDA' : 'FIM DA SOBREVIVÊNCIA'}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold uppercase tracking-wider ${
            isVictory ? 'text-[#48BB78]' : 'text-[#D64045]'
          }`}>
            {isVictory ? 'VOCÊ SOBREVIVEU ÀS 72 HORAS!' : 'O CERCO REASSUMIU O ABRIGO'}
          </h2>
        </div>

        {/* Story Summary Paragraph */}
        <p className="text-base text-[#e2e2ea] leading-relaxed max-w-md mx-auto">
          {isVictory
            ? 'O helicóptero de resgate militar pousou sobre o teto do refúgio e o resgatou com segurança. Você manteve a sanidade e administrou os recursos perfeitamente!'
            : vitals.health <= 0
            ? 'Seu corpo sucumbiu aos ferimentos e à desnutrição no silêncio do refúgio. A história do seu cerco termina aqui.'
            : 'O estresse insuportável e o pânico da escuridão romperam sua determinação. Você abandonou o refúgio na escuridão.'}
        </p>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-[#111319] p-4 border border-[#282a30] text-left font-space-mono text-xs">
          <div>
            <span className="text-[#9DA3AE]">HORAS SOBREVIVIDAS:</span>
            <p className="text-lg font-bold text-[#E5A93C]">{hoursSurvived}h / 72h</p>
          </div>
          <div>
            <span className="text-[#9DA3AE]">EVENTOS CONCLUÍDOS:</span>
            <p className="text-lg font-bold text-[#4A90E2]">{totalEventsCompleted}</p>
          </div>
          <div>
            <span className="text-[#9DA3AE]">SAÚDE FINAL:</span>
            <p className="text-lg font-bold text-[#48BB78]">{Math.max(0, Math.round(vitals.health))}%</p>
          </div>
          <div>
            <span className="text-[#9DA3AE]">ESTRESSE FINAL:</span>
            <p className="text-lg font-bold text-[#D64045]">{Math.min(100, Math.round(vitals.stress))}%</p>
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className={`w-full font-bold py-3.5 px-6 chamfer-btn transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider text-base shadow-xl ${
            isVictory
              ? 'bg-[#48BB78] hover:bg-[#58cc88] text-[#111319]'
              : 'bg-[#E5A93C] hover:bg-[#F4C458] text-[#111319]'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          <span>INICIAR NOVO SIMULADOR DE 72 HORAS</span>
        </button>

      </div>
    </div>
  );
});

GameOverModal.displayName = 'GameOverModal';
