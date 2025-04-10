import { useState, useEffect } from 'react';

interface QuestionDisplayProps {
  selectedPlayer: string | null;
  categories: string[];
  onNextQuestion: () => void;
}

export default function QuestionDisplay({ selectedPlayer, categories, onNextQuestion }: QuestionDisplayProps) {
  const [question, setQuestion] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Generate a random question when selectedPlayer changes
  useEffect(() => {
    if (selectedPlayer && categories.length > 0) {
      // Reset state for new question
      setIsRevealed(false);
      setQuestion(null);
      setCategory(null);
      
      // Simulate fetching a random question (this would come from your database in a real app)
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setCategory(randomCategory);
      
      // Random question based on category (placeholder - would come from actual data)
      const questions: Record<string, string[]> = {
        'Casual': [
          'What's your favorite movie of all time?',
          'If you could have dinner with any historical figure, who would it be?',
          'What's your go-to karaoke song?',
          'What's the most embarrassing thing that happened to you in school?',
          'If you had to eat one food for the rest of your life, what would it be?'
        ],
        'Spicy': [
          'Have you ever kissed someone in this room? If yes, who?',
          'What's your biggest turn off?',
          'What's your biggest turn on?',
          'Have you ever been caught doing something you shouldn't?',
          'What's the wildest thing on your bucket list?'
        ],
        'Couples': [
          'What was your first impression of your partner?',
          'What's one thing your partner does that you find adorable?',
          'What's your favorite memory together?',
          'If you could change one thing about your relationship, what would it be?',
          'What's something you've always wanted to tell your partner but haven't?'
        ],
        'Boys Night': [
          'Most embarrassing rejection story?',
          'What's your go-to pickup line?',
          'Best prank you've ever pulled?',
          'Most ridiculous thing you've done to impress someone?',
          'What's your secret talent that no one knows about?'
        ],
        'Girls Night': [
          'Who was your first celebrity crush?',
          'What's the worst fashion mistake you've ever made?',
          'What's the most expensive thing you've bought on impulse?',
          'What's one beauty secret you swear by?',
          'What's the pettiest reason you've ended a relationship?'
        ],
        'Friendship': [
          'What do you value most in a friendship?',
          'What's one thing you appreciate about someone in this room?',
          'What's the best gift you've ever received from a friend?',
          'If you could take one person from this room on a trip, who would it be and where would you go?',
          'What's your favorite memory with someone in this room?'
        ]
      };

      // Fallback to casual if the category doesn't exist in our mock data
      const categoryQuestions = questions[randomCategory] || questions['Casual'];
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
          <div className="bg-blue-800 rounded-lg p-4 mb-6 min-h-24 flex items-center justify-center">
            <p className="text-xl text-center">{question}</p>
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