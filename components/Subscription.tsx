import React, { useState } from 'react';
import { PLANS, storeService } from '../services/storeService';
import { Plan } from '../types';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Input from './Input';
import { Check, Coins, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

const Subscription: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [utr, setUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setSuccess(false);
    setUtr('');
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('mrattitude885-4@okhdfcbank');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !user || !utr) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      storeService.createTransaction(user.id, user.name, selectedPlan, utr);
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSelectedPlan(null);
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const upiId = 'mrattitude885-4@okhdfcbank';
  const getQrUrl = (amount: number) => {
    const upiString = `upi://pay?pa=${upiId}&pn=LuminaAI&am=${amount}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  return (
    <div className="max-w-6xl mx-auto pb-safe-area animate-slide-up">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">Upgrade Plan</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Get more coins to create, edit, and analyze without limits.
        </p>
      </div>

      {/* Plans Grid - Single column on mobile, 4 on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative bg-white dark:bg-dark-surface rounded-2xl p-6 border transition-all duration-300 flex flex-col shadow-sm hover:shadow-md ${
              plan.recommended 
                ? 'border-primary-500 ring-1 ring-primary-500/50 order-first lg:order-none' 
                : 'border-slate-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </div>
            )}
            
            <div className="mb-4 pt-2">
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">₹{plan.price}</span>
                <span className="text-slate-500 text-sm ml-1">/mo</span>
              </div>
              <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-700 dark:text-amber-400 font-bold text-sm">
                <Coins className="w-5 h-5" />
                {plan.coins} Coins
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-grow border-t border-slate-100 dark:border-white/5 pt-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.recommended ? 'primary' : 'secondary'}
              fullWidth
              onClick={() => handleSelectPlan(plan)}
              className="mt-auto"
            >
              Select Plan
            </Button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-slate-200 dark:border-dark-border flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white dark:bg-dark-surface z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Details</h3>
              <button onClick={() => setSelectedPlan(null)} className="text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2">
                 Close
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {success ? (
                <div className="text-center space-y-4 py-8">
                   <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                     <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                   </div>
                   <h4 className="text-xl font-bold text-slate-900 dark:text-white">Request Submitted!</h4>
                   <p className="text-slate-600 dark:text-slate-400 text-sm">
                     Admin will verify your transaction shortly.
                   </p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-sm text-slate-500 mb-2">Scan via UPI App</p>
                    <div className="bg-white p-3 inline-block rounded-2xl shadow-sm border border-slate-200 mx-auto">
                      <img 
                        src={getQrUrl(selectedPlan.price)} 
                        alt="Payment QR Code" 
                        className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
                      />
                    </div>
                    <div className="mt-4 flex flex-col items-center gap-2">
                       <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{selectedPlan.price}</span>
                       <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300 break-all">{upiId}</span>
                        <button onClick={handleCopyUPI} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded">
                          <Copy className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitPayment} className="space-y-4 border-t border-slate-100 dark:border-white/5 pt-4">
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl flex gap-2 text-xs text-amber-800 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>Complete payment on your app, then enter the 12-digit UTR / Ref ID below.</p>
                    </div>
                    
                    <Input 
                      label="UTR / Reference ID"
                      placeholder="e.g. 3245xxxxxxxx"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      required
                      className="text-center tracking-widest font-mono text-sm"
                      pattern="\d*"
                    />

                    <Button 
                      type="submit" 
                      fullWidth 
                      isLoading={isSubmitting}
                      disabled={utr.length < 8}
                      className="h-12"
                    >
                      Submit Payment
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;