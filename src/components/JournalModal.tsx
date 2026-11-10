import React, { useState } from 'react';
import { X, BookOpen, Radio, Sparkles, Clock, History } from 'lucide-react';
import { JournalEntry } from '../types/game';

interface JournalModalProps {
  entries: JournalEntry[];
  onRequestAIRadioScan: () => void;
  isLoadingAI: boolean;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = React.memo(({
  entries,
  onRequestAIRadioScan,
  isLoadingAI,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'journal' | 'radio'>('all');

  const filteredEntries = entries.filter((entry) => {
    if (filter === 'all') return true;
    return entry.category === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-barlow">
      <div className="max-w-3xl w-full bg-[#191b21] border border-[#282a30] p-5 sm:p-6 chamfer-panel shadow-2xl space-y-4 relative ink-border">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282a30] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#4A90E2]" />
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#4A90E2]">
              DIÁRIO DE CAMPO & TRANSMISSÕES
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-[#111319] hover:bg-[#282a30] text-[#9DA3AE] hover:text-[#e2e2ea] border border-[#282a30] rounded cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#282a30] pb-3">
          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 bg-[#111319] p-1 border border-[#282a30] rounded">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 font-space-mono text-xs rounded transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-[#4A90E2] text-[#111319] font-bold' : 'text-[#9DA3AE] hover:text-[#e2e2ea]'
              }`}
            >
              TODOS ({entries.length})
            </button>
            <button
              onClick={() => setFilter('journal')}
              className={`px-3 py-1 font-space-mono text-xs rounded transition-colors cursor-pointer ${
                filter === 'journal' ? 'bg-[#4A90E2] text-[#111319] font-bold' : 'text-[#9DA3AE] hover:text-[#e2e2ea]'
              }`}
            >
              DIÁRIO
            </button>
            <button
              onClick={() => setFilter('radio')}
              className={`px-3 py-1 font-space-mono text-xs rounded transition-colors cursor-pointer ${
                filter === 'radio' ? 'bg-[#4A90E2] text-[#111319] font-bold' : 'text-[#9DA3AE] hover:text-[#e2e2ea]'
              }`}
            >
              RÁDIO
            </button>
          </div>

          {/* AI Radio Transmission Button */}
          <button
            disabled={isLoadingAI}
            onClick={onRequestAIRadioScan}
            className={`px-4 py-2 chamfer-btn font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLoadingAI
                ? 'bg-[#282a30] text-[#9DA3AE] cursor-wait'
                : 'bg-[#4A90E2] hover:bg-[#5aa0f2] text-[#111319] shadow-lg'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>{isLoadingAI ? 'SINTONIZANDO GEMINI IA...' : 'BUSCAR FREQUÊNCIA IA DE EMERGÊNCIA'}</span>
          </button>
        </div>

        {/* Entries List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center bg-[#111319] border border-[#282a30] text-[#9DA3AE] font-space-mono text-sm">
              Nenhuma anotação nesta categoria ainda.
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#111319] border border-[#282a30] p-4 rounded space-y-2 relative"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#282a30]/60 pb-2">
                  <div className="flex items-center gap-2">
                    {entry.category === 'radio' ? (
                      <Radio className="w-4 h-4 text-[#4A90E2]" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-[#E5A93C]" />
                    )}
                    <h4 className="font-bold text-base text-[#e2e2ea]">{entry.title}</h4>
                  </div>

                  <span className="text-xs font-space-mono text-[#4A90E2] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {entry.timestamp}
                  </span>
                </div>

                <p className="text-sm text-[#9DA3AE] font-space-mono leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
});

JournalModal.displayName = 'JournalModal';
