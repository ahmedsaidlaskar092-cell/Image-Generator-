import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Input from './Input';
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onBack?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    // Reset form slightly but keep email convenience
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50 dark:bg-dark-bg">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-900/20 dark:to-accent-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>

      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 backdrop-blur transition-colors z-20 text-slate-700 dark:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      <div className="w-full max-w-md z-10 mt-8 sm:mt-0">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-block p-3 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl shadow-lg shadow-primary-500/30 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isLogin ? 'Enter your credentials to access your studio' : 'Join Lumina to start creating amazing AI art'}
          </p>
        </div>

        <div className="glass-panel rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8 animate-fade-in backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={User}
                  required
                />
              </div>
            )}
            
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="pt-2 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="h-12 text-lg font-semibold bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 border-none shadow-lg shadow-primary-500/25"
                icon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-slate-500 dark:text-slate-500 animate-fade-in" style={{ animationDelay: '600ms' }}>
          Protected by Lumina Secure Auth
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
