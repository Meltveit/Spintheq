// src/lib/models/truth-or-dare.ts

// Difficulty levels for the game
export type DifficultyLevel = 'Light' | 'Intermediate' | 'Experienced' | 'PartyKing';

// Configuration for each difficulty level
export interface DifficultyConfig {
  startingSips: number;     // Starting penalty for pass
  incrementSips: number;    // How much penalty increases each time
  distributionMultiplier: number; // Multiplier for distribution
}

// Configuration mapping for all difficulty levels
export const DIFFICULTY_CONFIG: Record<DifficultyLevel, DifficultyConfig> = {
  Light: {
    startingSips: 1,
    incrementSips: 1,
    distributionMultiplier: 1
  },
  Intermediate: {
    startingSips: 2,
    incrementSips: 1,
    distributionMultiplier: 2
  },
  Experienced: {
    startingSips: 3,
    incrementSips: 2,
    distributionMultiplier: 3
  },
  PartyKing: {
    startingSips: 5,
    incrementSips: 3,
    distributionMultiplier: 5
  }
};

// Player in the game
export interface Player {
  id: string;
  name: string;
  isDealer: boolean;
  passesRemaining: number;
  points: number;
  penaltiesUsed: number; // How many times they've used penalties after passes
  challengesCompleted: number; // Track how many challenges they've completed
  challengesFailed: number; // Track how many challenges they've failed
}

// Challenge type
export type ChallengeType = 'Truth' | 'Dare';

// Game state
export interface GameState {
  players: Player[];
  difficultyLevel: DifficultyLevel;
  currentPlayerId: string | null; // Player asking the question
  targetPlayerId: string | null; // Player answering the question
  selectedChallengeType: ChallengeType | null;
  gameStarted: boolean;
  roundInProgress: boolean;
  dealerId: string | null;
  round: number; // Track the current round number
  lastAction: string | null; // Track the last action (for displaying history)
}

// Game action history item
export interface GameActionHistory {
  round: number;
  challengerId: string;
  targetId: string;
  challengeType: ChallengeType | null;
  result: 'completed' | 'passed' | 'penalty' | 'distribution';
  points?: number;
  sips?: number;
}

// Constants for the game
export const POINTS_FOR_TRUTH = 1;
export const POINTS_FOR_DARE = 2;
export const POINTS_TO_DISTRIBUTE = 5;
export const STARTING_PASSES = 2;