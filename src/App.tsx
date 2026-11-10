import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TacticalHUD } from './components/TacticalHUD';
import { GameViewport } from './components/GameViewport';
import { ObjectiveFooter } from './components/ObjectiveFooter';
import { EventModal } from './components/EventModal';
import { InventoryModal } from './components/InventoryModal';
import { JournalModal } from './components/JournalModal';
import { GameOverModal } from './components/GameOverModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { 
  Vitals, 
  PlayerPosition, 
  RoomId, 
  InteractiveObject, 
  Item, 
  Recipe, 
  StoryEvent, 
  StoryChoice, 
  JournalEntry, 
  GameStateStatus 
} from './types/game';

import { 
  INITIAL_VITALS, 
  TOTAL_SURVIVAL_SECONDS, 
  ROOMS, 
  INITIAL_OBJECTS, 
  INITIAL_ITEMS, 
  CRAFTING_RECIPES, 
  SCRIPTED_EVENTS, 
  INITIAL_JOURNAL_LOGS 
} from './data/initialState';

import { generateAINarrativeEvent } from './utils/aiNarrative';
import { Play, ShieldAlert, Sparkles, Volume2, VolumeX } from 'lucide-react';

export function AppContent() {
  // Game States
  const [gameStatus, setGameStatus] = useState<GameStateStatus>('title');
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_SURVIVAL_SECONDS);
  const [vitals, setVitals] = useState<Vitals>(INITIAL_VITALS);
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>('quarto');
  const [playerPos, setPlayerPos] = useState<PlayerPosition>({ x: 140, y: 150, facing: 'down' });
  
  const [objects, setObjects] = useState<InteractiveObject[]>(INITIAL_OBJECTS);
  const [nearbyObject, setNearbyObject] = useState<InteractiveObject | null>(null);
  
  const [inventory, setInventory] = useState<Item[]>(INITIAL_ITEMS);
  const [recipes] = useState<Recipe[]>(CRAFTING_RECIPES);
  const [journal, setJournal] = useState<JournalEntry[]>(INITIAL_JOURNAL_LOGS);
  const [events, setEvents] = useState<StoryEvent[]>(SCRIPTED_EVENTS);
  const [activeEvent, setActiveEvent] = useState<StoryEvent | null>(null);
  const [isAiGeneratedEvent, setIsAiGeneratedEvent] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  const [objective, setObjective] = useState<string>('Reforçar as trancas e vasculhar o refúgio por água e alimento.');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [completedEventsCount, setCompletedEventsCount] = useState<number>(0);

  // Derived current room memo
  const currentRoom = useMemo(() => {
    return ROOMS.find((r) => r.id === currentRoomId) || ROOMS[0];
  }, [currentRoomId]);

  // Handle Start New Game
  const handleStartGame = useCallback(() => {
    setGameStatus('playing');
    setSecondsLeft(TOTAL_SURVIVAL_SECONDS);
    setVitals(INITIAL_VITALS);
    setCurrentRoomId('quarto');
    setPlayerPos({ x: 140, y: 150, facing: 'down' });
    setObjects(INITIAL_OBJECTS);
    setInventory(INITIAL_ITEMS);
    setJournal(INITIAL_JOURNAL_LOGS);
    setEvents(SCRIPTED_EVENTS.map((e) => ({ ...e, triggered: false })));
    setActiveEvent(null);
    setObjective('Reforçar as trancas e vasculhar o refúgio por água e alimento.');
    setCompletedEventsCount(0);
  }, []);

  // 1-Second Survival Clock Tick & Vitals Decay Loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const intervalTime = Math.max(100, Math.floor(1000 / gameSpeed));

    const timer = setInterval(() => {
      // 1. Advance Clock
      setSecondsLeft((prevSec) => {
        const nextSec = prevSec - 1;
        if (nextSec <= 0) {
          setGameStatus('victory');
          return 0;
        }
        return nextSec;
      });

      // 2. Vitals Natural Decay (1s = ~0.035% hunger/thirst)
      setVitals((prevVitals) => {
        const newWater = Math.max(0, prevVitals.water - 0.035 * gameSpeed);
        const newFood = Math.max(0, prevVitals.food - 0.025 * gameSpeed);

        let healthDelta = 0;
        let stressDelta = 0;

        // Health damage if starving or dehydrated
        if (newWater <= 0) healthDelta -= 0.15 * gameSpeed;
        if (newFood <= 0) healthDelta -= 0.1 * gameSpeed;

        // Stress increases if stats are low
        if (newWater < 25 || newFood < 25) stressDelta += 0.08 * gameSpeed;

        const newHealth = Math.max(0, Math.min(100, prevVitals.health + healthDelta));
        const newStress = Math.max(0, Math.min(100, prevVitals.stress + stressDelta));

        // Check Defeat Conditions
        if (newHealth <= 0 || newStress >= 100) {
          setGameStatus('gameover');
        }

        return {
          water: newWater,
          food: newFood,
          health: newHealth,
          stress: newStress,
        };
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [gameStatus, gameSpeed]);

  // Scripted Story Event Trigger Effect
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const eventToTrigger = events.find(
      (ev) => !ev.triggered && secondsLeft <= ev.triggerSecondsLeft
    );

    if (eventToTrigger) {
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.id === eventToTrigger.id ? { ...e, triggered: true } : e))
      );
      setActiveEvent(eventToTrigger);
      setIsAiGeneratedEvent(false);
      setGameStatus('event');
    }
  }, [secondsLeft, events, gameStatus]);

  // Keyboard Shortcuts (E for interact, I for items, J for journal, ESC for pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing' && gameStatus !== 'paused') return;

      const key = e.key.toLowerCase();
      if (key === 'e' && nearbyObject) {
        handleInteractWithObject(nearbyObject);
      } else if (key === 'i') {
        setGameStatus((prev) => (prev === 'inventory' ? 'playing' : 'inventory'));
      } else if (key === 'j') {
        setGameStatus((prev) => (prev === 'journal' ? 'playing' : 'journal'));
      } else if (key === 'escape') {
        setGameStatus((prev) => (prev === 'paused' ? 'playing' : 'paused'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, nearbyObject]);

  // Object Interaction Handler
  const handleInteractWithObject = useCallback((obj: InteractiveObject) => {
    // 1. Bed (Cama) -> Rest / Sleep
    if (obj.type === 'rest') {
      const restChoice: StoryChoice = {
        id: 'c_rest_4h',
        text: 'Dormir por 4 horas no abrigo',
        outcomeText: 'Você descansou na cama. Seu corpo recuperou energia e o estresse diminuiu, mas a fome e sede aumentaram.',
        vitalsChange: { water: -15, food: -15, health: 15, stress: -20 },
        timeAdvanceSeconds: 4 * 3600,
      };

      const restEvent: StoryEvent = {
        id: `ev_rest_${Date.now()}`,
        title: 'DESCANSO NO QUARTO',
        timestamp: 'HORA ATUAL',
        triggerSecondsLeft: secondsLeft,
        description: 'A cama rangente do quarto oferece uma trégua temporária. Deseja fechar os olhos e descansar para recuperar a saúde e diminuir a tensão mental?',
        choices: [
          restChoice,
          {
            id: 'c_cancel',
            text: 'Voltar a vigiar a casa',
            outcomeText: 'Você decidiu permanecer desperto e alerta.',
          },
        ],
        triggered: true,
      };

      setActiveEvent(restEvent);
      setIsAiGeneratedEvent(false);
      setGameStatus('event');
      return;
    }

    // 2. Water Filter / Sink (Filtro de Água)
    if (obj.type === 'water') {
      setVitals((prev) => ({
        ...prev,
        water: Math.min(100, prev.water + 30),
        stress: Math.max(0, prev.stress - 5),
      }));

      // Add log
      const newEntry: JournalEntry = {
        id: `log_${Date.now()}`,
        timestamp: `${Math.floor(secondsLeft / 3600)}h restantes`,
        title: 'ÁGUA PURIFICADA',
        content: 'Você bebeu água limpa do filtro reservatório. Hidratação restaurada.',
        category: 'journal',
      };
      setJournal((prev) => [newEntry, ...prev]);
      return;
    }

    // 3. Refrigerator / Food Pantry
    if (obj.type === 'food') {
      setVitals((prev) => ({
        ...prev,
        food: Math.min(100, prev.food + 25),
        stress: Math.max(0, prev.stress - 5),
      }));

      const newEntry: JournalEntry = {
        id: `log_${Date.now()}`,
        timestamp: `${Math.floor(secondsLeft / 3600)}h restantes`,
        title: 'REFEIÇÃO RACIONADA',
        content: 'Você consumiu suprimentos conservados na geladeira. Fome saciada.',
        category: 'journal',
      };
      setJournal((prev) => [newEntry, ...prev]);
      return;
    }

    // 4. Workbench (Bancada)
    if (obj.type === 'craft') {
      setGameStatus('inventory');
      return;
    }

    // 5. Journal (Diário)
    if (obj.type === 'journal') {
      setGameStatus('journal');
      return;
    }

    // 6. Radio / Search / Generator / Door / Safe -> Trigger Event
    const genericEvent: StoryEvent = {
      id: `ev_obj_${obj.id}_${Date.now()}`,
      title: `INSPEÇÃO: ${obj.name.toUpperCase()}`,
      timestamp: 'HORA ATUAL',
      triggerSecondsLeft: secondsLeft,
      description: `Você aproxima-se de ${obj.name} na sala ${currentRoom.shortName}. O ambiente está silencioso e tenso. O que você deseja fazer?`,
      choices: [
        {
          id: 'c_search_1',
          text: `Vasculhar cuidadosamente em busca de itens`,
          outcomeText: `Você vasculhou ${obj.name} e encontrou materiais utilizáveis!`,
          vitalsChange: { stress: -5 },
          itemReward: { itemId: 'sucata_metal', qty: 1, name: 'Sucata de Metal' },
        },
        {
          id: 'c_search_2',
          text: `Apenas inspecionar as estruturas`,
          outcomeText: `A estrutura parece firme e segura por enquanto.`,
        },
      ],
      triggered: true,
    };

    setActiveEvent(genericEvent);
    setIsAiGeneratedEvent(false);
    setGameStatus('event');
  }, [secondsLeft, currentRoom.shortName]);

  // Select Event Choice Outcome
  const handleSelectEventChoice = useCallback((choice: StoryChoice) => {
    // 1. Update Vitals
    if (choice.vitalsChange) {
      setVitals((prev) => ({
        water: Math.max(0, Math.min(100, prev.water + (choice.vitalsChange?.water || 0))),
        food: Math.max(0, Math.min(100, prev.food + (choice.vitalsChange?.food || 0))),
        health: Math.max(0, Math.min(100, prev.health + (choice.vitalsChange?.health || 0))),
        stress: Math.max(0, Math.min(100, prev.stress + (choice.vitalsChange?.stress || 0))),
      }));
    }

    // 2. Advance time if choice specifies
    if (choice.timeAdvanceSeconds) {
      setSecondsLeft((prev) => Math.max(0, prev - choice.timeAdvanceSeconds!));
    }

    // 3. Item Rewards
    if (choice.itemReward) {
      setInventory((prev) => {
        const existing = prev.find((i) => i.id === choice.itemReward!.itemId);
        if (existing) {
          return prev.map((i) =>
            i.id === choice.itemReward!.itemId ? { ...i, quantity: i.quantity + choice.itemReward!.qty } : i
          );
        }
        return [
          ...prev,
          {
            id: choice.itemReward!.itemId,
            name: choice.itemReward!.name,
            description: 'Item obtido em evento narrativo.',
            category: 'crafting',
            quantity: choice.itemReward!.qty,
            iconName: 'Package',
            usable: false,
          },
        ];
      });
    }

    // 4. Update Objective
    if (choice.objectiveUpdate) {
      setObjective(choice.objectiveUpdate);
    }

    // 5. Add Journal Entry
    const eventTitle = activeEvent ? activeEvent.title : 'EVENTO CONCLUÍDO';
    const logEntry: JournalEntry = {
      id: `log_ev_${Date.now()}`,
      timestamp: `${Math.floor(secondsLeft / 3600)}h restantes`,
      title: eventTitle,
      content: `${choice.text}\n\n-> ${choice.outcomeText}`,
      category: 'event',
    };

    setJournal((prev) => [logEntry, ...prev]);
    setCompletedEventsCount((prev) => prev + 1);
    setActiveEvent(null);
    setGameStatus('playing');
  }, [activeEvent, secondsLeft]);

  // Item Consumption Handler
  const handleUseItem = useCallback((item: Item) => {
    if (!item.usable || item.quantity <= 0) return;

    if (item.vitalsRestore) {
      setVitals((prev) => ({
        water: Math.min(100, prev.water + (item.vitalsRestore?.water || 0)),
        food: Math.min(100, prev.food + (item.vitalsRestore?.food || 0)),
        health: Math.min(100, prev.health + (item.vitalsRestore?.health || 0)),
        stress: Math.max(0, prev.stress + (item.vitalsRestore?.stress || 0)),
      }));
    }

    setInventory((prev) =>
      prev
        .map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  // Workbench Crafting Recipe Handler
  const handleCraftRecipe = useCallback((recipe: Recipe) => {
    setInventory((prev) => {
      let updated = [...prev];
      // Deduct ingredients
      recipe.ingredients.forEach((ing) => {
        updated = updated
          .map((i) => (i.id === ing.itemId ? { ...i, quantity: i.quantity - ing.qty } : i))
          .filter((i) => i.quantity > 0);
      });

      // Add result item
      const existingResult = updated.find((i) => i.id === recipe.resultItemId);
      if (existingResult) {
        return updated.map((i) =>
          i.id === recipe.resultItemId ? { ...i, quantity: i.quantity + recipe.resultQty } : i
        );
      } else {
        return [
          ...updated,
          {
            id: recipe.resultItemId,
            name: recipe.name,
            description: recipe.description,
            category: 'tool',
            quantity: recipe.resultQty,
            iconName: 'Wrench',
            usable: false,
          },
        ];
      }
    });

    const craftLog: JournalEntry = {
      id: `craft_${Date.now()}`,
      timestamp: `${Math.floor(secondsLeft / 3600)}h restantes`,
      title: `FABRICAÇÃO: ${recipe.name.toUpperCase()}`,
      content: `Você construiu ${recipe.name} na bancada da oficina para reforçar o abrigo.`,
      category: 'journal',
    };
    setJournal((prev) => [craftLog, ...prev]);
  }, [secondsLeft]);

  // Gemini AI Radio Scan Trigger
  const handleRequestAIRadioScan = useCallback(async () => {
    setIsLoadingAI(true);
    const aiEvent = await generateAINarrativeEvent(
      currentRoom.name,
      secondsLeft,
      vitals,
      nearbyObject ? nearbyObject.name : 'Rádio Transceptor'
    );
    setIsLoadingAI(false);

    if (aiEvent && aiEvent.title && aiEvent.choices) {
      setActiveEvent(aiEvent as StoryEvent);
      setIsAiGeneratedEvent(true);
      setGameStatus('event');
    } else {
      // Fallback pre-scripted radio scan event
      const fallbackEvent: StoryEvent = {
        id: `ev_radio_fall_${Date.now()}`,
        title: 'TRANSMISSÃO DE RÁDIO EM ONDAS CURTAS',
        timestamp: 'FREQUÊNCIA 104.9 MHz',
        triggerSecondsLeft: secondsLeft,
        description: 'Você gira o dial do rádio mil-spec no escuro. Entre os ruidos de estática, uma transmissão truncada soa: "Atenção sobreviventes... manter o consumo de água sob controle... equipe a caminho."',
        choices: [
          {
            id: 'c_rf_1',
            text: 'Responder à transmissão via rádio',
            outcomeText: 'Você enviou um código morse confirming posição. Seu estresse diminuiu.',
            vitalsChange: { stress: -10 },
          },
          {
            id: 'c_rf_2',
            text: 'Desligar para economizar bateria',
            outcomeText: 'Você desliga o rádio para evitar interceptação.',
          },
        ],
        triggered: true,
      };
      setActiveEvent(fallbackEvent);
      setIsAiGeneratedEvent(false);
      setGameStatus('event');
    }
  }, [currentRoom.name, secondsLeft, vitals, nearbyObject]);

  // Dynamic Position updater callback
  const handleUpdatePlayerPos = useCallback((updater: (prev: PlayerPosition) => PlayerPosition) => {
    setPlayerPos(updater);
  }, []);

  const handleUpdateCurrentRoom = useCallback((roomId: RoomId) => {
    setCurrentRoomId((prev) => (prev === roomId ? prev : roomId));
  }, []);

  const handleUpdateNearbyObject = useCallback((obj: InteractiveObject | null) => {
    setNearbyObject((prev) => {
      if (prev?.id === obj?.id) return prev;
      return obj;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#111319] text-[#e2e2ea] flex flex-col justify-between font-barlow relative overflow-x-hidden scanlines">
      
      {/* 1. TITLE SCREEN / MAIN MENU */}
      {gameStatus === 'title' && (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
          <div className="max-w-2xl w-full bg-[#191b21]/95 border-2 border-[#E5A93C] p-6 sm:p-10 chamfer-panel shadow-2xl text-center space-y-6 ink-border-amber">
            <div className="space-y-2">
              <span className="text-xs font-space-mono text-[#E5A93C] tracking-widest uppercase bg-[#111319] px-3 py-1 border border-[#282a30]">
                SIMULADOR DE SOBREVIVÊNCIA NARRATIVA 2D
              </span>
              <h1 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-wider text-[#F4C458] font-barlow drop-shadow-lg">
                72 HORAS
              </h1>
              <p className="text-sm font-space-mono text-[#9DA3AE] max-w-lg mx-auto">
                Estilo Graphic Novel / Nanquim · Cerco a Abrigo Isolado
              </p>
            </div>

            <div className="bg-[#111319] p-4 sm:p-5 border border-[#282a30] text-left text-sm sm:text-base space-y-3 leading-relaxed text-[#e2e2ea]">
              <p>
                <strong className="text-[#E5A93C]">O CONTEXTO:</strong> O perímetro urbano foi isolado. Você está trancado dentro de um refúgio militar fortificado. As equipes de evacuação aérea chegarão em exatamente <strong>72 horas</strong>.
              </p>
              <p>
                <strong className="text-[#4A90E2]">SUA MISSÃO:</strong> Explore os 6 cômodos da casa, administre seus níveis de <span className="text-[#4A90E2]">Água</span>, <span className="text-[#E5A93C]">Comida</span>, <span className="text-[#48BB78]">Saúde</span> e <span className="text-[#D64045]">Estresse</span>, fabrique barricadas e tome decisões táticas decisivas.
              </p>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full bg-[#E5A93C] hover:bg-[#F4C458] text-[#111319] font-extrabold py-4 px-8 chamfer-btn transition-transform transform active:scale-95 cursor-pointer flex items-center justify-center gap-3 uppercase tracking-wider text-lg shadow-xl"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>INICIAR CERCO DE 72 HORAS</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PLAYING / ACTIVE GAME VIEW */}
      {gameStatus !== 'title' && (
        <>
          {/* Top Tactical HUD */}
          <TacticalHUD
            vitals={vitals}
            secondsLeft={secondsLeft}
            currentRoom={currentRoom}
            isPaused={gameStatus === 'paused'}
            gameSpeed={gameSpeed}
            soundEnabled={soundEnabled}
            onTogglePause={() => setGameStatus((prev) => (prev === 'paused' ? 'playing' : 'paused'))}
            onCycleSpeed={() => setGameSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onOpenInventory={() => setGameStatus('inventory')}
            onOpenJournal={() => setGameStatus('journal')}
          />

          {/* Center 2D Map Viewport */}
          <main className="flex-1 flex items-center justify-center py-2 sm:py-4">
            <GameViewport
              rooms={ROOMS}
              objects={objects}
              playerPos={playerPos}
              onUpdatePlayerPos={handleUpdatePlayerPos}
              onUpdateCurrentRoom={handleUpdateCurrentRoom}
              onUpdateNearbyObject={handleUpdateNearbyObject}
              onInteractObject={handleInteractWithObject}
              isPaused={gameStatus !== 'playing'}
            />
          </main>

          {/* Bottom Objective & Interaction Footer */}
          <ObjectiveFooter
            objective={objective}
            nearbyObjectName={nearbyObject ? nearbyObject.name : null}
            onInteractNearby={() => nearbyObject && handleInteractWithObject(nearbyObject)}
          />
        </>
      )}

      {/* MODAL OVERLAYS */}

      {/* Event Modal */}
      {gameStatus === 'event' && activeEvent && (
        <EventModal
          event={activeEvent}
          onSelectChoice={handleSelectEventChoice}
          isAiGenerated={isAiGeneratedEvent}
        />
      )}

      {/* Inventory Modal */}
      {gameStatus === 'inventory' && (
        <InventoryModal
          items={inventory}
          recipes={recipes}
          onUseItem={handleUseItem}
          onCraftRecipe={handleCraftRecipe}
          onClose={() => setGameStatus('playing')}
        />
      )}

      {/* Journal Modal */}
      {gameStatus === 'journal' && (
        <JournalModal
          entries={journal}
          onRequestAIRadioScan={handleRequestAIRadioScan}
          isLoadingAI={isLoadingAI}
          onClose={() => setGameStatus('playing')}
        />
      )}

      {/* Victory / Defeat Modal */}
      {(gameStatus === 'victory' || gameStatus === 'gameover') && (
        <GameOverModal
          isVictory={gameStatus === 'victory'}
          secondsLeft={secondsLeft}
          vitals={vitals}
          daysSurvived={Math.floor((72 * 3600 - secondsLeft) / 86400)}
          totalEventsCompleted={completedEventsCount}
          onRestart={handleStartGame}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
