export type RoomId = 'quarto' | 'sala' | 'cozinha' | 'banheiro' | 'oficina' | 'porao';

export interface Vitals {
  water: number;  // 0 - 100
  food: number;   // 0 - 100
  health: number; // 0 - 100
  stress: number; // 0 - 100
}

export interface PlayerPosition {
  x: number;
  y: number;
  facing: 'up' | 'down' | 'left' | 'right';
}

export interface RoomBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Room {
  id: RoomId;
  name: string;
  shortName: string;
  color: string;
  bounds: RoomBounds;
  description: string;
}

export type ItemCategory = 'food' | 'water' | 'medical' | 'tool' | 'key' | 'crafting';

export interface Item {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  quantity: number;
  iconName: string;
  usable: boolean;
  vitalsRestore?: {
    water?: number;
    food?: number;
    health?: number;
    stress?: number;
  };
}

export interface Recipe {
  id: string;
  name: string;
  resultItemId: string;
  resultQty: number;
  description: string;
  ingredients: { itemId: string; qty: number }[];
}

export interface InteractiveObject {
  id: string;
  name: string;
  roomId: RoomId;
  x: number;
  y: number;
  width: number;
  height: number;
  iconName: string;
  actionText: string;
  color: string;
  type: 'search' | 'rest' | 'craft' | 'radio' | 'water' | 'food' | 'door' | 'journal' | 'generator' | 'safe';
  timesInteracted: number;
}

export interface StoryChoice {
  id: string;
  text: string;
  outcomeText: string;
  vitalsChange?: {
    water?: number;
    food?: number;
    health?: number;
    stress?: number;
  };
  itemReward?: { itemId: string; qty: number; name: string };
  itemCost?: { itemId: string; qty: number };
  timeAdvanceSeconds?: number;
  objectiveUpdate?: string;
}

export interface StoryEvent {
  id: string;
  title: string;
  timestamp: string; // e.g. "HORA 60:00:00"
  triggerSecondsLeft: number; // e.g. 216000 (60h left)
  description: string;
  choices: StoryChoice[];
  triggered: boolean;
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  category: 'journal' | 'radio' | 'system' | 'event';
}

export type GameStateStatus = 'title' | 'playing' | 'paused' | 'event' | 'inventory' | 'journal' | 'victory' | 'gameover';
