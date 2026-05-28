"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GROUP_MATCHES } from "@/data/groupMatches";
import type { SimulationState, GroupMatch, KnockoutScore } from "@/types";

interface Store extends SimulationState {
  setUserName: (name: string) => void;
  setScore: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void;
  setKnockoutScore: (
    matchId: number,
    homeGoals: number | null,
    awayGoals: number | null,
    penaltyWinner?: "home" | "away",
  ) => void;
  randomizeAll: () => void;
  resetAll: () => void;
  resetKnockout: () => void;
  hasHydrated: boolean;
  setHasHydrated: (b: boolean) => void;
}

const initialGroupMatches: SimulationState["groupMatches"] = Object.fromEntries(
  GROUP_MATCHES.map((m) => [m.id, { homeGoals: null, awayGoals: null }]),
);

const initialKnockoutMatches: SimulationState["knockoutMatches"] = {};

export const useSimulation = create<Store>()(
  persist(
    (set) => ({
      userName: "",
      groupMatches: initialGroupMatches,
      knockoutMatches: initialKnockoutMatches,
      version: "2",
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
      setKnockoutScore: (matchId, homeGoals, awayGoals, penaltyWinner) =>
        set((state) => {
          const existing = state.knockoutMatches[matchId];
          const next: KnockoutScore = {
            homeGoals,
            awayGoals,
            // Preserve previous penaltyWinner unless explicitly provided OR
            // unless scores are no longer drawn (then clear it).
            penaltyWinner:
              penaltyWinner !== undefined
                ? penaltyWinner
                : homeGoals !== null && awayGoals !== null && homeGoals === awayGoals
                  ? existing?.penaltyWinner
                  : undefined,
          };
          return {
            knockoutMatches: {
              ...state.knockoutMatches,
              [matchId]: next,
            },
          };
        }),
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
          groupMatches: initialGroupMatches,
          knockoutMatches: initialKnockoutMatches,
        }),
      resetKnockout: () =>
        set({
          knockoutMatches: initialKnockoutMatches,
        }),
    }),
    {
      name: "wc2026-sim",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: unknown, fromVersion: number) => {
        const data = (persisted ?? {}) as Partial<SimulationState>;
        if (fromVersion < 2) {
          // v1 → v2: add knockoutMatches
          return {
            ...data,
            knockoutMatches: {},
          } as SimulationState;
        }
        return data as SimulationState;
      },
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
