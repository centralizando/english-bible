
import React from 'react';
import { ReadingPlanDay, AppTab } from '../types';

interface DashboardProps {
  plan: ReadingPlanDay[];
  completedDays: number[];
  onNavigate: (tab: AppTab) => void;
  startDate: string | null;
  onSetStartDate: (date: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plan, completedDays, onNavigate, startDate, onSetStartDate }) => {
  const progressPercent = Math.round((completedDays.length / 365) * 100);
  const currentDay = completedDays.length + 1;
  const todayEntry = plan.find(d => d.day === currentDay);
  const todayPassage = todayEntry?.passages[0] || "Plan completed!";

  const calculateFinishDate = () => {
    if (!startDate) return "Dec 31, " + new Date().getFullYear();
    const d = new Date(startDate);
    d.setDate(d.getDate() + 364);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome, Word Traveler</h1>
          <p className="text-slate-500 mt-1">Your personalized 365-day spiritual journey.</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Start Date</label>
          <div className="flex items-center gap-2">
            <input 
              type="date"
              value={startDate || ""}
              onChange={(e) => onSetStartDate(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
            <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 min-w-[120px]">
               <span className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest block leading-none mb-1">Estimated Finish</span>
               <p className="text-slate-800 font-black text-sm">{calculateFinishDate()}</p>
            </div>
          </div>
        </div>
      </header>

      {!startDate && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-center gap-4 animate-bounce">
          <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-700">
            <i className="fa-solid fa-calendar-day text-xl"></i>
          </div>
          <div>
            <h4 className="font-bold text-amber-900">Choose your start date!</h4>
            <p className="text-amber-800 text-sm">Select when you want to begin your journey to calculate your daily readings.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Annual Progress</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">{progressPercent}%</span>
              <span className="text-slate-400 text-sm">completed</span>
            </div>
            <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            You have read <span className="font-semibold text-slate-700">{completedDays.length}</span> of 365 days.
          </p>
        </div>

        {/* Current Reading Card */}
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Today: {todayEntry?.date || '...'}</span>
            <h2 className="text-2xl font-bold mt-2">{todayPassage}</h2>
            <p className="mt-1 text-indigo-100 text-sm opacity-80">Day {currentDay} of annual plan</p>
          </div>
          <button 
            onClick={() => onNavigate(AppTab.READER)}
            className="mt-6 bg-white text-indigo-600 font-bold py-3 px-6 rounded-2xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-play"></i>
            Read Today
          </button>
        </div>

        {/* AI Insight Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Daily Wisdom</span>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed italic">
              "For the word of God is living and active, sharper than any two-edged sword..."
            </p>
          </div>
          <button 
            onClick={() => onNavigate(AppTab.LEARN)}
            className="mt-6 border-2 border-slate-100 text-slate-600 font-bold py-3 px-6 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
            Bible Insights
          </button>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Your Toolbox</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction icon="fa-bookmark" label="Bookmarks" color="text-rose-500" />
          <QuickAction icon="fa-note-sticky" label="My Notes" color="text-blue-500" />
          <QuickAction icon="fa-users" label="Community" color="text-emerald-500" />
          <QuickAction icon="fa-gear" label="Settings" color="text-slate-500" />
        </div>
      </section>
    </div>
  );
};

const QuickAction: React.FC<{ icon: string, label: string, color: string }> = ({ icon, label, color }) => (
  <button className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:border-indigo-200 transition-colors">
    <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center ${color}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <span className="text-xs font-semibold text-slate-600">{label}</span>
  </button>
);

export default Dashboard;
