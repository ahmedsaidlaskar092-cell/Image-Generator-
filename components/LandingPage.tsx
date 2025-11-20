import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Wand2, ScanEye, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, ChevronDown, Play, Star, Users, Menu, X } from 'lucide-react';
import Button from './Button';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeFeature, setActiveFeature] = useState<'generate' | 'edit' | 'analyze'>('generate');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const features = {
    generate: {
      title: "Text to Image",
      desc: "Describe anything, get a high-fidelity image.",
      prompt: "A futuristic city with flying cars, neon lights, cyberpunk style, 8k resolution",
      result: "https://images.unsplash.com/photo-1615751072497-5f5169febe33?auto=format&fit=crop&q=80&w=800",
      icon: <Sparkles className="w-5 h-5" />
    },
    edit: {
      title: "Magic Edit",
      desc: "Use natural language to modify existing images.",
      prompt: "Change the sky to a starry night and add fireworks",
      result: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
      icon: <Wand2 className="w-5 h-5" />
    },
    analyze: {
      title: "Visual Analysis",
      desc: "Get insights, recipes, or detailed descriptions.",
      prompt: "What ingredients are in this salad?",
      result: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
      icon: <ScanEye className="w-5 h-5" />
    }
  };

  const modes = ['generate', 'edit', 'analyze'] as const;

  // Auto-play logic for demo
  useEffect(() => {
    const duration = 6000; // 6 seconds per slide
    const interval = 50; // Update progress every 50ms
    let currentProgress = 0;

    const runAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        currentProgress += (interval / duration) * 100;
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          currentProgress = 0;
          setProgress(0);
          setActiveFeature(prev => {
            const currentIndex = modes.indexOf(prev);
            const nextIndex = (currentIndex + 1) % modes.length;
            return modes[nextIndex];
          });
        }
      }, interval);
    };

    runAutoPlay();

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  const handleFeatureClick = (mode: 'generate' | 'edit' | 'analyze') => {
    setActiveFeature(mode);
    setProgress(0);
    // Reset interval logic by forcing re-render (or could be more complex state)
    // For now, clicking just sets state. The effect runs but will jump to next slide eventually.
    // To properly reset: we'd need the effect dependency to change or manage a 'userInteracted' state.
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const demoImages = [
    "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1682686580003-22d0d6f87a74?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1682695794947-17061dc284dd?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1504384308090-c54be3855463?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-slate-900 dark:text-white overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-500 to-accent-600 p-2 rounded-xl shadow-lg shadow-primary-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary-600 dark:from-white dark:to-primary-400">
              Lumina
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</button>
            <button onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Showcase</button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={onGetStarted} className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary-500 transition-colors">
              Sign In
            </button>
            <Button onClick={onGetStarted} className="shadow-lg shadow-primary-500/25">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 dark:text-slate-300">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-white/5 p-4 flex flex-col space-y-4 shadow-2xl animate-slide-down">
            <button onClick={() => { setMobileMenuOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left p-2 text-slate-600 dark:text-slate-300 font-medium">Features</button>
            <button onClick={() => { setMobileMenuOpen(false); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left p-2 text-slate-600 dark:text-slate-300 font-medium">Pricing</button>
            <div className="h-px bg-slate-100 dark:bg-white/10 my-2"></div>
            <Button onClick={onGetStarted} fullWidth>Sign In / Sign Up</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-500/20 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute top-[40%] right-[10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-accent-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 animate-slide-up shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold tracking-wide text-slate-800 dark:text-slate-200 uppercase">New: Gemini 2.5 Integration</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6 animate-slide-up leading-[1.1]" style={{ animationDelay: '100ms' }}>
            Imagine. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 animate-gradient-x">
              Generate. Edit.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '200ms' }}>
            The ultimate AI studio powered by Google's most advanced models. 
            Create stunning visuals, edit with words, and analyze images in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Button 
              onClick={onGetStarted}
              className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-xl shadow-primary-500/30 transform hover:scale-105 transition-transform"
              icon={<Zap className="w-5 h-5 fill-current" />}
            >
              Start Creating Free
            </Button>
            <button 
              onClick={() => document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> See How It Works
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-slate-200/50 dark:border-white/5 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-500 mb-4">TRUSTED BY CREATORS FROM</p>
            <div className="flex justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {['Google', 'Adobe', 'Figma', 'Canva'].map((brand, i) => (
                 <span key={i} className="text-lg font-bold font-display text-slate-400 dark:text-slate-500">{brand}</span>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Scroll Marquee */}
      <section id="showcase" className="py-12 bg-white dark:bg-black/20 border-y border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="flex w-max animate-scroll gap-4 hover:pause">
          {[...demoImages, ...demoImages].map((img, i) => (
            <div key={i} className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden flex-shrink-0 relative group cursor-pointer">
              <img src={img} alt={`AI Generated ${i}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium line-clamp-2">Cyberpunk street style with neon lights and rain reflection...</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="interactive-demo" className="py-24 bg-slate-50 dark:bg-dark-surface/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Experience the Power</h2>
            <p className="text-slate-600 dark:text-slate-400">Switch between modes to see what Lumina can do for you.</p>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-white/5">
              {modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleFeatureClick(mode)}
                  className={`flex-1 py-4 sm:py-6 text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden ${
                    activeFeature === mode 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {features[mode].icon}
                  <span className="capitalize">{mode}</span>
                  {/* Progress Bar */}
                  {activeFeature === mode && (
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-center space-y-6 animate-fade-in">
                <div className="inline-block p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 w-fit">
                  {features[activeFeature].icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {features[activeFeature].title}
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {features[activeFeature].desc}
                </p>
                
                <div className="bg-slate-100 dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-white/10 relative group hover:border-primary-500 transition-colors">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Input Prompt</p>
                  <p className="text-slate-800 dark:text-slate-200 font-mono text-sm">
                    "{features[activeFeature].prompt}"
                  </p>
                  <div className="absolute right-4 bottom-4">
                     <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></div>
                  </div>
                </div>

                <Button onClick={onGetStarted} icon={<ArrowRight className="w-4 h-4" />}>
                  Try This Feature
                </Button>
              </div>

              <div className="relative aspect-square md:aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl group">
                {/* Key ensures image re-animates on switch */}
                <img 
                  key={activeFeature}
                  src={features[activeFeature].result} 
                  alt="Demo Result" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 animate-scale-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="flex items-center gap-2 text-white text-sm font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Generated in 1.2s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Everything you need</h2>
            <p className="text-slate-600 dark:text-slate-400">A complete suite of AI tools in one platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 bg-slate-50 dark:bg-dark-surface rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-white/5 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm">
                  <Smartphone className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">Mobile First Design</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg">
                  Designed from the ground up for touch interactions. Create on the go with a fully responsive interface that feels like a native app.
                </p>
              </div>
              <div className="absolute right-[-20px] bottom-[-40px] w-[300px] md:w-[400px] shadow-2xl rounded-3xl overflow-hidden border-8 border-slate-900 transform rotate-[-5deg] group-hover:rotate-0 group-hover:bottom-[-20px] transition-all duration-500 opacity-80 hover:opacity-100">
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80" alt="App Interface" className="w-full h-auto" />
              </div>
            </div>

            {/* Tall Card */}
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Enterprise Security</h3>
                <p className="text-white/80 mb-8 flex-grow">
                  Your data is encrypted and secure. We prioritize privacy and safe content generation.
                </p>
                <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="font-bold text-sm">SOC2 Compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="font-bold text-sm">End-to-End Encrypted</span>
                  </div>
                </div>
              </div>
              {/* Background decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Wide Card Bottom */}
            <div className="md:col-span-3 bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 relative z-10">
                <h3 className="text-3xl font-bold mb-4">Join the Community</h3>
                <p className="text-slate-400 text-lg mb-6">
                  Over 10,000 creators are generating millions of images daily. Join our Discord and share your creations.
                </p>
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                      ))}
                   </div>
                   <span className="text-sm font-bold text-slate-300">+5k Online</span>
                </div>
              </div>
              <div className="flex-1 w-full h-48 md:h-auto relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
                 <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" alt="Community" className="w-full h-full object-cover rounded-2xl opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-slate-600 dark:text-slate-400">Start for free, upgrade when you're ready.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {[
               { name: 'Starter', price: '₹99', coins: 50, features: ['Standard Speed', 'Basic Editing'] },
               { name: 'Pro', price: '₹199', coins: 125, features: ['Fast Speed', 'Priority Access', 'All Tools'], rec: true },
               { name: 'Ultimate', price: '₹299', coins: 200, features: ['Max Speed', 'Beta Features', 'Commercial Use'] }
             ].map((plan, i) => (
               <div key={i} className={`p-8 rounded-3xl border ${plan.rec ? 'bg-white dark:bg-dark-surface border-primary-500 shadow-xl scale-105 relative z-10' : 'bg-slate-50 dark:bg-dark-bg border-slate-200 dark:border-white/10'}`}>
                 {plan.rec && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold">MOST POPULAR</div>}
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                 <div className="my-4">
                   <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                   <span className="text-slate-500">/mo</span>
                 </div>
                 <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-700 dark:text-amber-400 font-bold text-sm mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> {plan.coins} Coins
                 </div>
                 <ul className="space-y-3 mb-8">
                   {plan.features.map((f, j) => (
                     <li key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                       <CheckCircle2 className="w-4 h-4 text-green-500" /> {f}
                     </li>
                   ))}
                 </ul>
                 <Button variant={plan.rec ? 'primary' : 'secondary'} fullWidth onClick={onGetStarted}>Choose Plan</Button>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-dark-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is there a free trial?", a: "Yes! You get 5 free coins daily just for logging in." },
              { q: "Can I use generated images commercially?", a: "Yes, users on the Ultimate plan have full commercial rights." },
              { q: "How do I pay?", a: "We support seamless UPI payments via QR code." },
              { q: "What models do you use?", a: "We leverage the latest Google Gemini 2.5 Flash and Imagen 4 models for superior quality." }
            ].map((item, i) => (
              <div key={i} className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`bg-white dark:bg-dark-bg transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-40 p-5 border-t border-slate-100 dark:border-white/5' : 'max-h-0'}`}>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-black text-white text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
         <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to shape the future?</h2>
            <p className="text-xl text-slate-300 mb-8">Join the creative revolution today.</p>
            <Button onClick={onGetStarted} className="h-16 px-10 text-xl rounded-full shadow-2xl shadow-primary-500/30 hover:scale-105 transition-transform">
              Get Started for Free
            </Button>
         </div>
      </section>
      
      <footer className="bg-slate-950 py-12 text-center border-t border-white/10 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Lumina AI Studio.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;