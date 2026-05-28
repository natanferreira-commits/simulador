"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GROUP_MATCHES } from "@/data/groupMatches";
import type { SimulationState, GroupMatch } from "@/types";

interface Store extends SimulationState {
  setUserName: (name: string) => void;
  setScore: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void;
  randomizeAll: () => void;
  resetAll: () => void;
  hasHydrated: boolean;
  setHasHydrated: (b: boolean) => void;
}

const initialMatches: SimulationState["groupMatches"] = Object.fromEntries(
  GROUP_MATCHES.map((m) => [m.id, { homeGoals: null, awayGoals: null }]),
);

export const useSimulation = create<Store>()(
  persist(
    (set) => ({
      userName: "",
      groupMatches: initialMatches,
      version: "1",
      hasHydrated: false,
      setHasHydrated: (b) => set({ hasHydrated: b }),
      setUserName: (name) => set({ userName: name.trim() }),
      setScore: (matchId, homeGoals, awayGoals) =>
        set((state) => ({
          groupMatches: {
            ...state.groupMatches,
            [matchId]: { homeGoals, awayGoals },
          },
        })),
      randomizeAll: () =>
        set((state) => ({
          groupMatches: Object.fromEntries(
            Object.keys(state.groupMatches).map((id) => [
              id,
              {
                homeGoals: Math.floor(Math.random() * 5),
                awayGoals: Math.floor(Math.random() * 5),
              },
            ]),
          ),
        })),
      resetAll: () =>
        set({
          groupMatches: initialMatches,
        }),
    }),
    {
      name: "wc2026-sim",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/** Hydrate GROUP_MATCHES with the user's scores */
export function getMatchesWithScores(
  storeMatches: SimulationState["groupMatches"],
): GroupMatch[] {
  return GROUP_MATCHES.map((m) => ({
    ...m,
    homeGoals: storeMatches[m.id]?.homeGoals ?? null,
    awayGoals: storeMatches[m.id]?.awayGoals ?? null,
  }));
}
