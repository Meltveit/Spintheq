// src/components/games/QuestionDisplay.tsx
'use client';

import { useState, useEffect } from 'react';
import { Question, CategoryKey } from '../../lib/content/spin-the-bottle';
import { categories as bottleCategories } from '../../lib/content/spin-the-bottle';

interface QuestionDisplayProps {
  selectedPlayer: string | null;
  categories: CategoryKey[];
  onNextQuestion: () => void;
}

export default function QuestionDisplay({ selectedPlayer, categories, onNextQuestion }: QuestionDisplayProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [category, setCategory] = useState<CategoryKey | null>(null);

  // Generate a random question when selectedPlayer changes
  useEffect(() => {
    if (selectedPlayer && categories.length > 0) {
      // Get a random category from the enabled categories
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setCategory(randomCategory);
      
      // Get questions for the selected category from our imported data
      const categoryQuestions = bottleCategories[randomCategory];
      
      // Select a random question from the category
      const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
      
      setQuestion(randomQuestion);
    } else {
      // Clear the question when no player is selected
      setQuestion(null);
      setCategory(null);
    }
  }, [selectedPlayer, categories]);

  // Get category colors
  const getCategoryColor = (cat: CategoryKey | null) => {
    switch(cat) {
      case 'Casual': return 'bg-blue-600 border-blue-400';
      case 'Spicy': return 'bg-pink-600 border-pink-400';
      case 'Couples': return 'bg-purple-600 border-purple-400';
      default: return 'bg-blue-600 border-blue-400';
    }
  };

  const getQuestionBgColor = (cat: CategoryKey | null) => {
    switch(cat) {
      case 'Casual': return 'bg-blue-900/80 border-blue-500/30';
      case 'Spicy': return 'bg-pink-900/80 border-pink-500/30';
      case 'Couples': return 'bg-purple-900/80 border-purple-500/30';
      default: return 'bg-blue-900/80 border-blue-500/30';
    }
  };

  const getCardBgColor = (cat: CategoryKey | null) => {
    switch(cat) {
      case 'Casual': return 'bg-blue-800/70 border-blue-400/30';
      case 'Spicy': return 'bg-pink-800/70 border-pink-400/30';
      case 'Couples': return 'bg-purple-800/70 border-purple-400/30';
      default: return 'bg-blue-800/70 border-blue-400/30';
    }
  };

  if (!selectedPlayer) {
    return (
      <div className="w-full max-w-md bg-blue-700/50 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-400/30 shadow-lg mx-auto">
        <p className="text-lg text-blue-50">Spin the bottle to select a player</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md ${getCardBgColor(category)} backdrop-blur-sm rounded-xl p-6 border shadow-lg mx-auto text-center`}>
      <h3 className="text-xl font-bold mb-4 text-center text-white">
        {selectedPlayer}&apos;s Turn
      </h3>
      
      {category && (
        <div className="mb-4 text-center">
          <span className={`inline-block px-3 py-1 ${getCategoryColor(category)} rounded-full text-sm font-medium text-white`}>
            {category}
          </span>
        </div>
      )}
      
      <div className={`${getQuestionBgColor(category)} rounded-lg p-4 mb-6 min-h-24 flex flex-col items-center justify-center border shadow-inner`}>
        <p className="text-xl text-center mb-2 text-white">{question?.text}</p>
        
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {question?.playerInteraction && (
            <div className="mt-1 bg-blue-700 px-3 py-1 rounded text-sm text-white">
              Involves another player
            </div>
          )}
          
          {question?.skipAction && (
            <div className="mt-1 bg-yellow-600 px-3 py-1 rounded text-sm text-white">
              Skip penalty: {question.skipAction}
            </div>
          )}
          
          {question?.drinkAction && (
            <div className="mt-1 bg-pink-600 px-3 py-1 rounded text-sm text-white">
              {question.drinkAction}
            </div>
          )}

          {question?.distributeAction && (
            <div className="mt-1 bg-green-600 px-3 py-1 rounded text-sm text-white">
              Player can distribute sips
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={onNextQuestion}
          className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-lg font-bold transition-colors text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          Next Question
        </button>
      </div>
    </div>
  );
}