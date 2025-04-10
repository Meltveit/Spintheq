// C:\litt_av_hvert_nett\Spintheq\spintheq\src\lib\content\spin-the-bottle\types.ts

export type Question = {
    text: string;
    skipAction?: string;  // What to do if player doesn't want to answer
    playerInteraction?: boolean; // If this question involves selecting another player
    drinkAction?: string; // Optional drinking instruction
    distributeAction?: boolean; // Whether player can distribute 1-5 sips after answering
  };