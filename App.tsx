import React, { useState, useCallback, useEffect } from 'react';
import { generateTitles } from './services/geminiService';
import Header from './components/Header';
import Loader from './components/Loader';
import TitleCard from './components/TitleCard';
import ThemeToggle from './components/ThemeToggle';
import Tabs from './components/Tabs';
import History from './components/History';

// Define a type for our chosen titles
interface ChosenTitle {
  id: string;
  text: string;
}

// Helper to get initial theme, preventing flash of wrong theme by reading from localStorage or system preference.
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};


const App: React.FC = () => {
  // Existing state
  const [idea, setIdea] = useState<string>('');
  const [titles, setTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for features
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const [chosenTitles, setChosenTitles] = useState<ChosenTitle[]>([]);
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');


  // Effect for theme persistence
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effects for chosen titles persistence
  useEffect(() => {
    try {
      const savedTitles = localStorage.getItem('chosenTitles');
      if (savedTitles) {
        setChosenTitles(JSON.parse(savedTitles));
      }
    } catch (e) {
      console.error("Failed to load chosen titles from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chosenTitles', JSON.stringify(chosenTitles));
    } catch (e) {
      console.error("Failed to save chosen titles to localStorage", e);
    }
  }, [chosenTitles]);


  const handleGenerateTitles = useCallback(async () => {
    if (!idea.trim()) {
      setError('Please enter a video idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTitles([]);

    try {
      const generatedTitles = await generateTitles(idea);
      setTitles(generatedTitles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [idea]);
  
  // Handlers for chosen titles
  const handleChooseTitle = (title: string) => {
    if (!chosenTitles.some(t => t.text === title)) {
      const newTitle: ChosenTitle = { id: Date.now().toString(), text: title };
      setChosenTitles(prev => [newTitle, ...prev]);
    }
  };

  const handleUpdateChosenTitle = (id: string, newText: string) => {
    setChosenTitles(prev =>
      prev.map(t => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleDeleteChosenTitle = (id: string) => {
    setChosenTitles(prev => prev.filter(t => t.id !== id));
  };

  // Filtered titles for history tab
  const filteredChosenTitles = chosenTitles.filter(title =>
    title.text.toLowerCase().includes(historySearchTerm.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <Header />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main>
          {activeTab === 'generator' && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                <label htmlFor="video-idea" className="block text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                  Enter your video idea
                </label>
                <textarea
                  id="video-idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g., A tutorial on how to bake sourdough bread for absolute beginners..."
                  className="w-full h-32 p-4 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleGenerateTitles}
                  disabled={isLoading || !idea.trim()}
                  className="mt-6 w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-indigo-500/50"
                >
                  {isLoading ? <Loader /> : 'Generate Titles'}
                </button>
              </div>

              {error && (
                <div className="mt-8 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center">
                  <p>{error}</p>
                </div>
              )}

              {titles.length > 0 && (
                <div className="mt-12">
                  <hh2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">Generated Titles</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {titles.map((title, index) => (
                      <TitleCard key={index} title={title} onChoose={handleChooseTitle} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <History 
              chosenTitles={filteredChosenTitles}
              allChosenTitlesCount={chosenTitles.length}
              onUpdateTitle={handleUpdateChosenTitle}
              onDeleteTitle={handleDeleteChosenTitle}
              searchTerm={historySearchTerm}
              onSearchChange={setHistorySearchTerm}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;