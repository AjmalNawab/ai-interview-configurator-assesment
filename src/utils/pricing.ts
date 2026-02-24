import type { Difficulty, Duration } from "../types/interview";

export const basePrices: Record<Duration, number> = {
  15: 10,
  30: 20,
  45: 35,
  60: 50,
};

export const difficultyMultiplier: Record<Difficulty, number> = {
  Junior: 1,
  Mid: 1.2,
  Senior: 1.5,
  Lead: 1.8,
};

export interface AddOnPrices {
  aiFollowUp: number;
  performanceReport: number;
  videoRecording: number;
  expertReview: number;
}

export const addOnPrices: AddOnPrices = {
  aiFollowUp: 5,
  performanceReport: 10,
  videoRecording: 8,
  expertReview: 25,
};

export const calculateTotal = (
  duration: Duration,
  difficulty: Difficulty,
  addOns: Partial<Record<keyof AddOnPrices, boolean>>,
) => {
  let total = basePrices[duration] * difficultyMultiplier[difficulty];
  Object.entries(addOns).forEach(([key, value]) => {
    if (value && addOnPrices[key as keyof AddOnPrices]) {
      total += addOnPrices[key as keyof AddOnPrices];
    }
  });
  return total;
};
