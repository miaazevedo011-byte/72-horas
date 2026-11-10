import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Bed, 
  BookOpen, 
  Archive, 
  Eye, 
  Radio, 
  Armchair, 
  Refrigerator, 
  Utensils, 
  Droplet, 
  HeartPulse, 
  Wrench, 
  Zap, 
  Shield, 
  Package, 
  Lock,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { PlayerPosition, Room, InteractiveObject, RoomId } from '../types/game';

interface GameViewportProps {
  rooms: Room[];
  objects: InteractiveObject[];
  playerPos: PlayerPosition;
  onUpdatePlayerPos: (posUpdater: (prev: PlayerPosition) => PlayerPosition) => void;
  onUpdateCurrentRoom: (roomId: RoomId) => void;
  onUpdateNearbyObject: (obj: InteractiveObject | null) => void;
  onInteractObject: (obj: InteractiveObject) => void;
  isPaused: boolean;
}

export const GameViewport: React.FC<GameViewportProps> = React.memo(({
  rooms,
  objects,
  playerPos,
  onUpdatePlayerPos,
  onUpdateCurrentRoom,
  onUpdateNearbyObject,
  onInteractObject,
  isPaused,
}) => {
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const animFrameRef = useRef<number | null>(null);

  // Helper to render object icon
  const renderObjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bed': return <Bed className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'Archive': return <Archive className="w-6 h-6" />;
      case 'Eye': return <Eye className="w-6 h-6" />;
      case 'Radio': return <Radio className="w-6 h-6" />;
      case 'Armchair': return <Armchair className="w-6 h-6" />;
      case 'Refrigerator': return <Refrigerator className="w-6 h-6" />;
      case 'Utensils': return <Utensils className="w-6 h-6" />;
      case 'Droplet': return <Droplet className="w-6 h-6" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6" />;
      case 'Wrench': return <Wrench className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Shield': return <Shield className="w-6 h-6" />;
      case 'Package': return <Package className="w-6 h-6" />;
      case 'Lock': return <Lock className="w-6 h-6" />;
      default: return <Compass className="w-6 h-6" />;
    }
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'e'].includes(k)) {
        keysPressedRef.current[k] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (keysPressedRef.current[k]) {
        keysPressedRef.current[k] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 60FPS Game Loop for Player Movement & Collision Bounds
  useEffect(() => {
    if (isPaused) return;

    let lastTime = performance.now();
    const SPEED = 220; // pixels per second

    const updateGame = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const keys = keysPressedRef.current;
      let dx = 0;
      let dy = 0;

      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      if (dx !== 0 || dy !== 0) {
        // Normalize diagonal speed
        const length = Math.sqrt(dx * dx + dy * dy);
        const vx = (dx / length) * SPEED * delta;
        const vy = (dy / length) * SPEED * delta;

        let facing: 'up' | 'down' | 'left' | 'right' = 'down';
        if (dy < 0) facing = 'up';
        else if (dy > 0) facing = 'down';
        else if (dx < 0) facing = 'left';
        else if (dx > 0) facing = 'right';

        // Update player pos safely using functional setter with boundary clamping
        onUpdatePlayerPos((prev) => {
          const newX = Math.max(30, Math.min(770, prev.x + vx));
          const newY = Math.max(30, Math.min(570, prev.y + vy));

          if (Math.abs(prev.x - newX) < 0.1 && Math.abs(prev.y - newY) < 0.1 && prev.facing === facing) {
            return prev;
          }

          return { x: newX, y: newY, facing };
        });
      }

      animFrameRef.current = requestAnimationFrame(updateGame);
    };

    animFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPaused, onUpdatePlayerPos]);

  // Room Detection & Proximity Check Effect
  useEffect(() => {
    // 1. Determine Room
    let foundRoomId: RoomId = 'quarto';
    for (const r of rooms) {
      const b = r.bounds;
      if (
        playerPos.x >= b.x - 15 &&
        playerPos.x <= b.x + b.width + 15 &&
        playerPos.y >= b.y - 15 &&
        playerPos.y <= b.y + b.height + 15
      ) {
        foundRoomId = r.id;
        break;
      }
    }
    onUpdateCurrentRoom(foundRoomId);

    // 2. Determine Nearest Interactive Object
    let closestObj: InteractiveObject | null = null;
    let minDistance = 75; // Proximity threshold

    for (const obj of objects) {
      // center of object
      const objCenterX = obj.x + obj.width / 2;
      const objCenterY = obj.y + obj.height / 2;

      const dist = Math.hypot(playerPos.x - objCenterX, playerPos.y - objCenterY);
      if (dist < minDistance) {
        minDistance = dist;
        closestObj = obj;
      }
    }

    onUpdateNearbyObject(closestObj);
  }, [playerPos.x, playerPos.y, rooms, objects, onUpdateCurrentRoom, onUpdateNearbyObject]);

  // Touch Movement Controls Handlers
  const handleTouchMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 20;
    onUpdatePlayerPos((prev) => {
      let nx = prev.x;
      let ny = prev.y;
      if (direction === 'up') ny = Math.max(30, prev.y - step);
      if (direction === 'down') ny = Math.min(570, prev.y + step);
      if (direction === 'left') nx = Math.max(30, prev.x - step);
      if (direction === 'right') nx = Math.min(770, prev.x + step);

      return { x: nx, y: ny, facing: direction };
    });
  }, [onUpdatePlayerPos]);

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      
      {/* 2D MAP CANVAS CONTAINER (Fixed aspect 800x600 layout) */}
      <div className="relative w-full aspect-[4/3] bg-[#121316] border-2 border-[#282a30] rounded shadow-2xl overflow-hidden tactical-grid ink-border">
        
        {/* Ambient Dark Vignette Overlay */}
        <div className="absolute inset-0 radial-vignette pointer-events-none z-10" />

        {/* ROOM DIVIDERS & BLUEPRINT FLOORPLAN */}
        <div className="absolute inset-0">
          {rooms.map((room) => {
            const b = room.bounds;

            return (
              <div
                key={room.id}
                style={{
                  left: `${(b.x / 800) * 100}%`,
                  top: `${(b.y / 600) * 100}%`,
                  width: `${(b.width / 800) * 100}%`,
                  height: `${(b.height / 600) * 100}%`,
                }}
                className="absolute border-2 border-[#282a30] bg-[#191b21]/70 flex flex-col justify-between p-3 transition-colors hover:bg-[#191b21]/90"
              >
                {/* Room Title Tag in Stencil Nanquim style */}
                <div className="flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] sm:text-xs font-space-mono font-bold tracking-widest text-[#9DA3AE] bg-[#111319]/90 px-2 py-0.5 border border-[#282a30] uppercase">
                    {room.name}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: room.color }}
                  />
                </div>
              </div>
            );
          })}

          {/* DOORS / CORRIDOR OPENINGS */}
          <div className="absolute top-[280px] left-[110px] w-12 h-5 bg-[#121316] border-x border-[#282a30]" />
          <div className="absolute top-[280px] left-[370px] w-12 h-5 bg-[#121316] border-x border-[#282a30]" />
          <div className="absolute top-[280px] left-[630px] w-12 h-5 bg-[#121316] border-x border-[#282a30]" />

          <div className="absolute left-[260px] top-[110px] w-5 h-12 bg-[#121316] border-y border-[#282a30]" />
          <div className="absolute left-[520px] top-[110px] w-5 h-12 bg-[#121316] border-y border-[#282a30]" />
          <div className="absolute left-[260px] top-[410px] w-5 h-12 bg-[#121316] border-y border-[#282a30]" />
          <div className="absolute left-[520px] top-[410px] w-5 h-12 bg-[#121316] border-y border-[#282a30]" />
        </div>

        {/* INTERACTIVE OBJECTS IN SCENE */}
        <div className="absolute inset-0 z-10">
          {objects.map((obj) => {
            return (
              <div
                key={obj.id}
                onClick={() => onInteractObject(obj)}
                style={{
                  left: `${(obj.x / 800) * 100}%`,
                  top: `${(obj.y / 600) * 100}%`,
                  width: `${(obj.width / 800) * 100}%`,
                  height: `${(obj.height / 600) * 100}%`,
                }}
                className="absolute bg-[#191b21] hover:bg-[#282a30] border border-[#282a30] hover:border-[#E5A93C] rounded flex flex-col items-center justify-center p-1 cursor-pointer group transition-all transform hover:scale-105 shadow-md"
              >
                <div 
                  className="p-1 rounded transition-transform group-hover:scale-110"
                  style={{ color: obj.color }}
                >
                  {renderObjectIcon(obj.iconName)}
                </div>

                <span className="text-[9px] sm:text-[10px] font-space-mono text-[#9DA3AE] group-hover:text-[#F4C458] text-center leading-tight truncate w-full font-bold">
                  {obj.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* PLAYER ENTITY WITH GOLDEN AURA GLOW */}
        <div
          style={{
            left: `${(playerPos.x / 800) * 100}%`,
            top: `${(playerPos.y / 600) * 100}%`,
          }}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 pointer-events-none"
        >
          {/* Outer Golden Aura Ring */}
          <div className="w-10 h-10 rounded-full bg-[#E5A93C]/25 animate-ping absolute -inset-1 pointer-events-none" />

          {/* Survivor Icon / Silhouette */}
          <div className="w-8 h-8 rounded-full bg-[#E5A93C] border-2 border-[#111319] shadow-2xl flex items-center justify-center text-[#111319] player-glow relative font-bold text-xs font-space-mono">
            🥾
            {/* Direction Pointer */}
            <div
              className={`absolute w-2 h-2 bg-[#F4C458] border border-[#111319] rotate-45 ${
                playerPos.facing === 'up' ? '-top-1 left-3' :
                playerPos.facing === 'down' ? '-bottom-1 left-3' :
                playerPos.facing === 'left' ? '-left-1 top-3' : '-right-1 top-3'
              }`}
            />
          </div>
        </div>

      </div>

      {/* MOBILE / TOUCH DIRECTIONAL D-PAD CONTROLLER */}
      <div className="mt-3 w-full flex items-center justify-between sm:hidden px-2 z-30">
        <div className="grid grid-cols-3 gap-1 w-36 h-36">
          <div />
          <button
            onClick={() => handleTouchMove('up')}
            className="bg-[#191b21] active:bg-[#E5A93C] text-[#e2e2ea] active:text-[#111319] border border-[#282a30] rounded flex items-center justify-center p-3 font-bold"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div />

          <button
            onClick={() => handleTouchMove('left')}
            className="bg-[#191b21] active:bg-[#E5A93C] text-[#e2e2ea] active:text-[#111319] border border-[#282a30] rounded flex items-center justify-center p-3 font-bold"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="bg-[#111319] border border-[#282a30] rounded flex items-center justify-center text-[10px] font-space-mono text-[#9DA3AE]">
            PAD
          </div>
          <button
            onClick={() => handleTouchMove('right')}
            className="bg-[#191b21] active:bg-[#E5A93C] text-[#e2e2ea] active:text-[#111319] border border-[#282a30] rounded flex items-center justify-center p-3 font-bold"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          <div />
          <button
            onClick={() => handleTouchMove('down')}
            className="bg-[#191b21] active:bg-[#E5A93C] text-[#e2e2ea] active:text-[#111319] border border-[#282a30] rounded flex items-center justify-center p-3 font-bold"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <div />
        </div>

        <div className="text-right space-y-1">
          <p className="text-[10px] font-space-mono text-[#9DA3AE]">TOQUE NOS OBJETOS PARA INTERAGIR</p>
        </div>
      </div>

    </div>
  );
});

GameViewport.displayName = 'GameViewport';
