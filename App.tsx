import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Generator from './components/Generator';
import Editor from './components/Editor';
import Analyzer from './components/Analyzer';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for "AI" vibe

  useEffect(() => {
    // Initialize theme
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 flex flex-col font-sans">
      <Header 
        currentMode={mode} 
        onModeChange={setMode} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {mode === AppMode.GENERATE && <Generator />}
        {mode === AppMode.EDIT && <Editor />}
        {mode === AppMode.ANALYZE && <Analyzer />}
      </main>

      <footer className="py-6 text-center text-slate-500 dark:text-slate-500 text-sm border-t border-slate-200 dark:border-dark-border mt-auto bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Lumina AI Studio. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
