import React from 'react';
import { AlertOctagon, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { StoryEvent, StoryChoice } from '../types/game';

interface EventModalProps {
  event: StoryEvent;
  onSelectChoice: (choice: StoryChoice) => void;
  isAiGenerated?: boolean;
}

export const EventModal: React.FC<EventModalProps> = React.memo(({
  event,
  onSelectChoice,
  isAiGenerated = false,
}) => {
  return (
    <div className="fixed inset-[#0] z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-barlow">
      <div className="max-w-2xl w-full bg-[#191b21] border-2 border-[#E5A93C] p-5 sm:p-7 chamfer-panel shadow-2xl space-y-5 relative overflow-hidden ink-border-amber">
        
        {/* Background graphic vignette glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Header & Timestamp */}
        <div className="flex items-start justify-between gap-3 border-b border-[#282a30] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E5A93C]/20 border border-[#E5A93C] rounded text-[#E5A93C] shrink-0">
              {isAiGenerated ? <Sparkles className="w-6 h-6 animate-spin-slow" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-space-mono text-[#9DA3AE]">
                <span>{event.timestamp}</span>
                {isAiGenerated && (
                  <span className="bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2] px-1.5 py-0.2 text-[10px]">
                    SINAL SINTONIZADO GEMINI IA
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#F4C458]">
                {event.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Story Event Narrative Description Box */}
        <div className="bg-[#111319] p-4 sm:p-5 border border-[#282a30] text-[#e2e2ea] text-base sm:text-lg leading-relaxed font-normal shadow-inner relative">
          <p>{event.description}</p>
        </div>

        {/* Tactical Choices List */}
        <div className="space-y-3">
          <h3 className="text-xs font-space-mono uppercase tracking-widest text-[#9DA3AE]">
            DECISÃO TÁTICA REQUERIDA (ESCOLHA UMA AÇÃO):
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {event.choices.map((choice, idx) => (
              <button
                key={choice.id || idx}
                onClick={() => onSelectChoice(choice)}
                className="w-full text-left bg-[#111319] hover:bg-[#282a30] border border-[#282a30] hover:border-[#E5A93C] p-3.5 sm:p-4 rounded transition-all group cursor-pointer flex items-center justify-between gap-3 hover:translate-x-1"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-space-mono text-[#E5A93C] font-bold">
                      [{idx + 1}]
                    </span>
                    <span className="font-semibold text-base text-[#e2e2ea] group-hover:text-[#F4C458] transition-colors">
                      {choice.text}
                    </span>
                  </div>

                  {/* Vitals preview indicators */}
                  {choice.vitalsChange && (
                    <div className="flex items-center gap-2 text-xs font-space-mono text-[#9DA3AE] pt-0.5">
                      {choice.vitalsChange.water ? (
                        <span className={choice.vitalsChange.water > 0 ? 'text-[#48BB78]' : 'text-[#D64045]'}>
                          Água {choice.vitalsChange.water > 0 ? `+${choice.vitalsChange.water}` : choice.vitalsChange.water}%
                        </span>
                      ) : null}
                      {choice.vitalsChange.food ? (
                        <span className={choice.vitalsChange.food > 0 ? 'text-[#48BB78]' : 'text-[#D64045]'}>
                          Comida {choice.vitalsChange.food > 0 ? `+${choice.vitalsChange.food}` : choice.vitalsChange.food}%
                        </span>
                      ) : null}
                      {choice.vitalsChange.health ? (
                        <span className={choice.vitalsChange.health > 0 ? 'text-[#48BB78]' : 'text-[#D64045]'}>
                          Saúde {choice.vitalsChange.health > 0 ? `+${choice.vitalsChange.health}` : choice.vitalsChange.health}%
                        </span>
                      ) : null}
                      {choice.vitalsChange.stress ? (
                        <span className={choice.vitalsChange.stress < 0 ? 'text-[#48BB78]' : 'text-[#D64045]'}>
                          Estresse {choice.vitalsChange.stress > 0 ? `+${choice.vitalsChange.stress}` : choice.vitalsChange.stress}%
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                <ArrowRight className="w-5 h-5 text-[#9DA3AE] group-hover:text-[#E5A93C] group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
});

EventModal.displayName = 'EventModal';
