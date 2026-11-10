import React from 'react';
import { 
  Droplet, 
  Utensils, 
  Heart, 
  Activity, 
  Compass, 
  Clock, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX,
  FastForward,
  BookOpen,
  Backpack
} from 'lucide-react';
import { Vitals, Room } from '../types/game';

interface TacticalHUDProps {
  vitals: Vitals;
  secondsLeft: number;
  currentRoom: Room;
  isPaused: boolean;
  gameSpeed: number;
  soundEnabled: boolean;
  onTogglePause: () => void;
  onCycleSpeed: () => void;
  onToggleSound: () => void;
  onOpenInventory: () => void;
  onOpenJournal: () => void;
}

export const TacticalHUD: React.FC<TacticalHUDProps> = React.memo(({
  vitals,
  secondsLeft,
  currentRoom,
  isPaused,
  gameSpeed,
  soundEnabled,
  onTogglePause,
  onCycleSpeed,
  onToggleSound,
  onOpenInventory,
  onOpenJournal,
}) => {
  // Format seconds into HH:MM:SS
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = Math.floor(secondsLeft % 60);

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isCriticalTime = hours < 12;

  // Helper for color coding stats
  const getStatColor = (val: number, isStress: boolean = false) => {
    if (isStress) {
      if (val > 75) return 'text-[#D64045] bg-[#D64045]/20 border-[#D64045]';
      if (val > 45) return 'text-[#E5A93C] bg-[#E5A93C]/20 border-[#E5A93C]';
      return 'text-[#48BB78] bg-[#48BB78]/20 border-[#48BB78]';
    }
    if (val < 25) return 'text-[#D64045] bg-[#D64045]/20 border-[#D64045]';
    if (val < 55) return 'text-[#E5A93C] bg-[#E5A93C]/20 border-[#E5A93C]';
    return 'text-[#48BB78] bg-[#48BB78]/20 border-[#48BB78]';
  };

  return (
    <header className="w-full bg-[#191b21]/90 backdrop-blur-md border-b border-[#282a30] p-2 md:p-3 relative z-30 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        
        {/* Left Side: Brand & Survival Clock */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-extrabold tracking-wider text-[#E5A93C] font-barlow uppercase">
              72 HORAS
            </span>
            <span className="text-[10px] font-space-mono text-[#9DA3AE] bg-[#111319] px-1.5 py-0.5 border border-[#282a30] hidden sm:inline-block">
              SOBREVIVÊNCIA
            </span>
          </div>

          {/* Countdown Timer Display */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded border font-space-mono ${
            isCriticalTime 
              ? 'bg-[#D64045]/15 border-[#D64045] text-[#D64045] animate-pulse' 
              : 'bg-[#111319] border-[#E5A93C]/40 text-[#E5A93C]'
          }`}>
            <Clock className="w-4 h-4 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest leading-none text-[#9DA3AE]">TEMPO RESTANTE</span>
              <span className="text-lg md:text-xl font-bold tracking-tight leading-tight">{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Center: Vitals Chips (Water, Food, Health, Stress) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full md:w-auto">
          {/* Water Chip */}
          <div className="bg-[#111319] border border-[#282a30] p-1.5 sm:p-2 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 text-[11px] font-space-mono text-[#9DA3AE]">
              <span className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-[#4A90E2]" />
                <span className="hidden sm:inline">ÁGUA</span>
              </span>
              <span className="font-bold text-[#e2e2ea]">{Math.round(vitals.water)}%</span>
            </div>
            <div className="w-full bg-[#282a30] h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-[#4A90E2] h-full transition-all duration-300" 
                style={{ width: `${Math.max(0, Math.min(100, vitals.water))}%` }}
              />
            </div>
          </div>

          {/* Food Chip */}
          <div className="bg-[#111319] border border-[#282a30] p-1.5 sm:p-2 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 text-[11px] font-space-mono text-[#9DA3AE]">
              <span className="flex items-center gap-1">
                <Utensils className="w-3 h-3 text-[#E5A93C]" />
                <span className="hidden sm:inline">COMIDA</span>
              </span>
              <span className="font-bold text-[#e2e2ea]">{Math.round(vitals.food)}%</span>
            </div>
            <div className="w-full bg-[#282a30] h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-[#E5A93C] h-full transition-all duration-300" 
                style={{ width: `${Math.max(0, Math.min(100, vitals.food))}%` }}
              />
            </div>
          </div>

          {/* Health Chip */}
          <div className="bg-[#111319] border border-[#282a30] p-1.5 sm:p-2 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 text-[11px] font-space-mono text-[#9DA3AE]">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-[#48BB78]" />
                <span className="hidden sm:inline">SAÚDE</span>
              </span>
              <span className="font-bold text-[#e2e2ea]">{Math.round(vitals.health)}%</span>
            </div>
            <div className="w-full bg-[#282a30] h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-[#48BB78] h-full transition-all duration-300" 
                style={{ width: `${Math.max(0, Math.min(100, vitals.health))}%` }}
              />
            </div>
          </div>

          {/* Stress Chip */}
          <div className="bg-[#111319] border border-[#282a30] p-1.5 sm:p-2 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 text-[11px] font-space-mono text-[#9DA3AE]">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#D64045]" />
                <span className="hidden sm:inline">ESTRESSE</span>
              </span>
              <span className="font-bold text-[#e2e2ea]">{Math.round(vitals.stress)}%</span>
            </div>
            <div className="w-full bg-[#282a30] h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-[#D64045] h-full transition-all duration-300" 
                style={{ width: `${Math.max(0, Math.min(100, vitals.stress))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Current Room & Quick Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
          {/* Room Indicator */}
          <div className="flex items-center gap-1.5 bg-[#111319] border border-[#282a30] px-2.5 py-1.5 rounded text-xs font-space-mono text-[#F4C458]">
            <Compass className="w-4 h-4 shrink-0 text-[#E5A93C]" />
            <span className="font-semibold uppercase tracking-wider truncate max-w-[120px] sm:max-w-none">
              {currentRoom.shortName}
            </span>
          </div>

          {/* Action Modals Toggles (Inventory & Journal) */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenInventory}
              title="Inventário e Bancada de Trabalho"
              className="p-1.5 sm:p-2 bg-[#111319] hover:bg-[#282a30] border border-[#282a30] hover:border-[#E5A93C] text-[#E5A93C] rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-space-mono"
            >
              <Backpack className="w-4 h-4" />
              <span className="hidden lg:inline">ITENS</span>
            </button>

            <button
              onClick={onOpenJournal}
              title="Diário e Transmissões de Rádio"
              className="p-1.5 sm:p-2 bg-[#111319] hover:bg-[#282a30] border border-[#282a30] hover:border-[#4A90E2] text-[#4A90E2] rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-space-mono"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden lg:inline">DIÁRIO</span>
            </button>
          </div>

          {/* Game Speed & Audio Toggles */}
          <div className="flex items-center gap-1 border-l border-[#282a30] pl-2">
            <button
              onClick={onCycleSpeed}
              className="p-1.5 bg-[#111319] hover:bg-[#282a30] text-[#9DA3AE] hover:text-[#E5A93C] rounded transition-colors cursor-pointer text-xs font-space-mono flex items-center gap-1"
              title={`Velocidade atual: ${gameSpeed}x`}
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">{gameSpeed}x</span>
            </button>

            <button
              onClick={onTogglePause}
              className="p-1.5 bg-[#111319] hover:bg-[#282a30] text-[#9DA3AE] hover:text-[#E5A93C] rounded transition-colors cursor-pointer"
              title={isPaused ? 'Continuar' : 'Pausar'}
            >
              {isPaused ? <Play className="w-4 h-4 text-[#48BB78]" /> : <Pause className="w-4 h-4 text-[#E5A93C]" />}
            </button>

            <button
              onClick={onToggleSound}
              className="p-1.5 bg-[#111319] hover:bg-[#282a30] text-[#9DA3AE] hover:text-[#e2e2ea] rounded transition-colors cursor-pointer"
              title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#4A90E2]" /> : <VolumeX className="w-4 h-4 text-[#9DA3AE]" />}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
});

TacticalHUD.displayName = 'TacticalHUD';
