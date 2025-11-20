import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Generator from './components/Generator';
import Editor from './components/Editor';
import Analyzer from './components/Analyzer';
import SplashScreen from './components/SplashScreen';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import Subscription from './components/Subscription';
import AdminDashboard from './components/AdminDashboard';
import DailyRewardModal from './components/DailyRewardModal';
import { AppMode, PageView } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [currentPage, setCurrentPage] = useState<PageView>(PageView.TOOLS);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const { user, isLoading, showDailyReward, closeDailyReward } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Automatically transition from landing page if user is already logged in
  useEffect(() => {
    if (user) {
      setShowLanding(false);
    }
  }, [user]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (isLoading) {
    return <SplashScreen />;
  }

  // Logic: If not user, show Landing -> Auth. If user, show App.
  if (!user) {
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }
    return <AuthPage onBack={() => setShowLanding(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-500 flex flex-col font-sans overflow-x-hidden selection:bg-primary-500/30 relative">
      {/* Animated Background for Main App (Subtle & Fixed) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50 dark:opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-[100px]"></div>
      </div>

      <Header 
        currentMode={mode} 
        onModeChange={setMode} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Main Content - added padding-bottom for mobile bottom nav */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-24 sm:px-6 lg:px-8 relative z-10 max-w-7xl animate-fade-in">
        {currentPage === PageView.TOOLS && (
          <>
            {mode === AppMode.GENERATE && <Generator />}
            {mode === AppMode.EDIT && <Editor />}
            {mode === AppMode.ANALYZE && <Analyzer />}
          </>
        )}
        
        {currentPage === PageView.PROFILE && <Profile />}
        {currentPage === PageView.SUBSCRIPTION && <Subscription />}
        {currentPage === PageView.ADMIN && <AdminDashboard />}
      </main>

      <DailyRewardModal isOpen={showDailyReward} onClose={closeDailyReward} />

      {/* Footer (Only visible on desktop for tools, or general pages) */}
      <footer className="hidden md:block py-6 text-center text-slate-500 dark:text-slate-500 text-xs sm:text-sm border-t border-slate-200 dark:border-white/5 mt-auto bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm relative z-10">
        <p>© {new Date().getFullYear()} Lumina AI Studio. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;