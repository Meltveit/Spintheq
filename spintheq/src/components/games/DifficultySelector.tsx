// src/components/games/DifficultySelector.tsx
'use client';

import { DifficultyLevel, DIFFICULTY_CONFIG } from '@/lib/models/truth-or-dare';

interface DifficultySelectorProps {
  selectedDifficulty: DifficultyLevel;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

export default function DifficultySelector({ selectedDifficulty, onSelectDifficulty }: DifficultySelectorProps) {
  const difficulties: DifficultyLevel[] = ['Light', 'Intermediate', 'Experienced', 'PartyKing'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => onSelectDifficulty(difficulty)}
            className={`
              p-3 rounded-lg transition-all duration-200 border-2
              ${selectedDifficulty === difficulty 
                ? getDifficultyActiveStyle(difficulty) 
                : getDifficultyInactiveStyle(difficulty)
              }
            `}
          >
            <div className="font-medium">{difficulty}</div>
          </button>
        ))}
      </div>
      
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
        <h4 className="font-medium mb-2 text-pink-200">Difficulty Details</h4>
        <ul className="space-y-2 text-sm text-white">
          <li className="flex justify-between">
            <span>Starting Penalty:</span>
            <span className="font-medium">{DIFFICULTY_CONFIG[selectedDifficulty].startingSips} sip(s)</span>
          </li>
          <li className="flex justify-between">
            <span>Penalty Increase:</span>
            <span className="font-medium">+{DIFFICULTY_CONFIG[selectedDifficulty].incrementSips} sip(s) per use</span>
          </li>
          <li className="flex justify-between">
            <span>Distribution Multiplier:</span>
            <span className="font-medium">{DIFFICULTY_CONFIG[selectedDifficulty].distributionMultiplier}x</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Helper functions for styling
function getDifficultyActiveStyle(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'Light':
      return 'bg-blue-600 border-blue-400 text-white shadow-md';
    case 'Intermediate':
      return 'bg-purple-600 border-purple-400 text-white shadow-md';
    case 'Experienced':
      return 'bg-pink-600 border-pink-400 text-white shadow-md';
    case 'PartyKing':
      return 'bg-red-600 border-red-400 text-white shadow-md';
    default:
      return 'bg-blue-600 border-blue-400 text-white shadow-md';
  }
}

function getDifficultyInactiveStyle(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'Light':
      return 'bg-blue-900/40 border-blue-700/40 text-blue-100 hover:bg-blue-800/60';
    case 'Intermediate':
      return 'bg-purple-900/40 border-purple-700/40 text-purple-100 hover:bg-purple-800/60';
    case 'Experienced':
      return 'bg-pink-900/40 border-pink-700/40 text-pink-100 hover:bg-pink-800/60';
    case 'PartyKing':
      return 'bg-red-900/40 border-red-700/40 text-red-100 hover:bg-red-800/60';
    default:
      return 'bg-blue-900/40 border-blue-700/40 text-blue-100 hover:bg-blue-800/60';
  }
}