import { create } from "zustand";

export type WorldData = {
  title: string;
  description: string;
  setting: string;
  startingLocation: string;
  initialSituation: string;
  characters?: Array<{
    name: string;
    description: string;
    role: string;
  }>;
  items?: Array<{
    name: string;
    description: string;
  }>;
  goals?: string[];
  tone: string;
  genre: string;
};

type WorldState = {
  worldData: WorldData | null;
  seedPrompt: string | null;
  initialMessage: string | null;
  setWorldData: (worldData: WorldData) => void;
  setSeedPrompt: (seedPrompt: string) => void;
  setInitialMessage: (message: string) => void;
  clearWorld: () => void;
};

export const useWorldStore = create<WorldState>((set) => ({
  worldData: null,
  seedPrompt: null,
  initialMessage: null,
  setWorldData: (worldData) => set({ worldData }),
  setSeedPrompt: (seedPrompt) => set({ seedPrompt }),
  setInitialMessage: (message) => set({ initialMessage: message }),
  clearWorld: () =>
    set({ worldData: null, seedPrompt: null, initialMessage: null }),
}));
