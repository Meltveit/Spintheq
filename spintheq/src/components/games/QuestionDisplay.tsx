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
  const [isRevealed, setIsRevealed] = useState(false);

  // Generate a random question when selectedPlayer changes
  useEffect(() => {
    if (selectedPlayer && categories.length > 0) {
      // Reset state for new question
      setIsRevealed(false);
      setQuestion(null);
      setCategory(null);
      
      // Get a random category from the enabled categories
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setCategory(randomCategory);
      
      // Get questions for the selected category from our imported data
      const categoryQuestions = bottleCategories[randomCategory];
      
      // Select a random question from the category
      const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
      
      setQuestion(randomQuestion);
    }
  }, [selectedPlayer, categories]);

  // Reveal the question
  const handleRevealQuestion = () => {
    setIsRevealed(true);
  };

  if (!selectedPlayer) {
    return (
      <div className="w-full max-w-md bg-blue-700/50 backdrop-blur-sm rounded-xl p-6 text-center">
        <p className="text-lg">Spin the bottle to select a player</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-blue-700/50 backdrop-blur-sm rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-center">
        {selectedPlayer}'s Turn
      </h3>
      
      {category && (
        <div className="mb-4 text-center">
          <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
      )}
      
      {!isRevealed ? (
        <div className="text-center">
          <button
            onClick={handleRevealQuestion}
            className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Reveal Question
          </button>
        </div>
      ) : (
        <>
          <div className="bg-blue-800 rounded-lg p-4 mb-6 min-h-24 flex flex-col items-center justify-center">
            <p className="text-xl text-center mb-2">{question?.text}</p>
            
            {question?.playerInteraction && (
              <div className="mt-2 bg-blue-700 px-3 py-1 rounded text-sm">
                Involves another player
              </div>
            )}
            
            {question?.skipAction && (
              <div className="mt-2 bg-yellow-600 px-3 py-1 rounded text-sm">
                Skip penalty: {question.skipAction}
              </div>
            )}
            
            {question?.drinkAction && (
              <div className="mt-2 bg-purple-600 px-3 py-1 rounded text-sm">
                {question.drinkAction}
              </div>
            )}

            {question?.distributeAction && (
              <div className="mt-2 bg-green-600 px-3 py-1 rounded text-sm">
                Player can distribute 1-5 sips
              </div>
            )}
          </div>
          
          <div className="text-center">
            <button
              onClick={onNextQuestion}
              className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Next Question
            </button>
          </div>
        </>
      )}
    </div>
  );
}