import React, { useState, useCallback, useEffect } from 'react';
import { generateTitles, TitleResponse } from './services/geminiService';
import Header from './components/Header';
import Loader from './components/Loader';
import TitleCard from './components/TitleCard';
import ThemeToggle from './components/ThemeToggle';
import Tabs from './components/Tabs';
import History from './components/History';

// Define a type for our chosen titles
export interface ChosenTitle extends TitleResponse {
  id: string;
}

// Helper to get initial theme
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const tones = [
  'Acronym',
  'All Caps',
  'Catchy',
  'Comical',
  'Desperate',
  'Double Entendre',
  'Informative',
  'Intriguing',
  'Professional',
  'Sales pitch',
].sort();

const platforms = [
  'Blog Post',
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Podcast',
  'Reddit',
  'TikTok',
  'Twitter (X)',
  'YouTube',
].sort();


const App: React.FC = () => {
  // Existing state
  const [idea, setIdea] = useState<string>('');
  const [titles, setTitles] = useState<TitleResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for features
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const [chosenTitles, setChosenTitles] = useState<ChosenTitle[]>([]);
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');

  // New state for generation options
  const [tone, setTone] = useState<string>('Informative');
  const [platform, setPlatform] = useState<string>('YouTube');
  const [titleCount, setTitleCount] = useState<number>(6);
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(false);

  // Effect for theme persistence
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
      const options = {
        tone,
        platform,
        count: titleCount,
        includeEmojis,
      };
      const generatedTitles = await generateTitles(idea, options);
      const sortedTitles = generatedTitles.sort((a, b) => b.ctrScore - a.ctrScore);
      setTitles(sortedTitles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [idea, tone, platform, titleCount, includeEmojis]);

  const handleShare = useCallback(async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this title!',
          text: text,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(text);
      alert('Share not supported, title copied to clipboard!');
    }
  }, []);

  const handleShareAll = useCallback(async () => {
    if (titles.length === 0) return;
    const allTitlesText = titles.map((t, i) => `${i + 1}. ${t.title}`).join('\n');
    const shareText = `Here are some title ideas for "${idea}":\n\n${allTitlesText}`;
    handleShare(shareText);
  }, [titles, idea, handleShare]);

  const handleShareAllHistory = useCallback(async () => {
    if (chosenTitles.length === 0) return;
    const allTitlesText = chosenTitles.slice().reverse().map((t, i) => `${i + 1}. ${t.title}`).join('\n');
    const shareText = `Here are my saved titles:\n\n${allTitlesText}`;
    handleShare(shareText);
  }, [chosenTitles, handleShare]);
  
  // Handlers for chosen titles
  const handleChooseTitle = (titleData: TitleResponse) => {
    if (!chosenTitles.some(t => t.title === titleData.title)) {
      const newTitle: ChosenTitle = { ...titleData, id: Date.now().toString() };
      setChosenTitles(prev => [newTitle, ...prev]);
    }
  };

  const handleUpdateChosenTitle = (id: string, newText: string) => {
    setChosenTitles(prev =>
      prev.map(t => (t.id === id ? { ...t, title: newText } : t))
    );
  };

  const handleDeleteChosenTitle = (id: string) => {
    setChosenTitles(prev => prev.filter(t => t.id !== id));
  };

  // Filtered titles for history tab
  const filteredChosenTitles = chosenTitles.filter(title =>
    title.title.toLowerCase().includes(historySearchTerm.toLowerCase())
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
                  Enter your idea
                </label>
                <textarea
                  id="video-idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g., A tutorial on how to bake sourdough bread for absolute beginners..."
                  className="w-full h-32 p-4 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
                  disabled={isLoading}
                />
                 <fieldset className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                  <legend className="text-base font-medium text-slate-600 dark:text-slate-300 -mt-9 px-2 bg-white dark:bg-slate-800">Options</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="tone" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Tone</label>
                      <select id="tone" value={tone} onChange={e => setTone(e.target.value)} disabled={isLoading} className="w-full p-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-1 focus:ring-indigo-500">
                        {tones.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="platform" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Platform</label>
                      <select id="platform" value={platform} onChange={e => setPlatform(e.target.value)} disabled={isLoading} className="w-full p-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-1 focus:ring-indigo-500">
                        {platforms.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="count" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">How many?</label>
                      <input type="number" id="count" value={titleCount} onChange={e => setTitleCount(Number(e.target.value))} min="1" max="10" disabled={isLoading} className="w-full p-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-end justify-start pb-1">
                      <div className="flex items-center gap-2">
                         <input type="checkbox" id="emojis" checked={includeEmojis} onChange={e => setIncludeEmojis(e.target.checked)} disabled={isLoading} className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                         <label htmlFor="emojis" className="text-sm font-medium text-slate-600 dark:text-slate-300">Include Emojis</label>
                      </div>
                    </div>
                  </div>
                </fieldset>
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
                   <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Generated Titles</h2>
                    <button
                      onClick={handleShareAll}
                      className="flex items-center gap-2 text-sm font-semibold rounded-md py-2 px-4 transition-colors duration-200 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200"
                      aria-label="Share all generated titles"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {titles.map((titleData, index) => (
                      <TitleCard 
                        key={index}
                        index={index}
                        titleData={titleData} 
                        onChoose={handleChooseTitle}
                        isChosen={chosenTitles.some(t => t.title === titleData.title)}
                        onShare={() => handleShare(titleData.title)}
                      />
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
              onShare={handleShare}
              onShareAll={handleShareAllHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;