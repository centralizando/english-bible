
import React from 'react';
import { ReadingPlanDay } from '../types';

interface PlanListProps {
  plan: ReadingPlanDay[];
  completedDays: number[];
  onComplete: (day: number) => void;
}

const PlanList: React.FC<PlanListProps> = ({ plan, completedDays, onComplete }) => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Annual Plan</h2>
          <p className="text-slate-500">Read the entire Bible from January 01 to December 31.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-indigo-600">{completedDays.length}</span>
          <span className="text-slate-400 text-sm ml-1">/ 365 days</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.slice(0, 100).map(day => {
          const isCompleted = completedDays.includes(day.day);
          return (
            <div 
              key={day.day}
              className={`p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                isCompleted 
                ? 'bg-emerald-50 border-emerald-100' 
                : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-[10px] leading-tight ${
                  isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <span className="uppercase opacity-70">{day.date?.split(' ')[0]}</span>
                  <span className="text-sm font-black">{day.date?.split(' ')[1]}</span>
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isCompleted ? 'text-emerald-800' : 'text-slate-700'}`}>
                    {day.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">
                    Day {day.day}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => !isCompleted && onComplete(day.day)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-indigo-50 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
                }`}
              >
                <i className={`fa-solid ${isCompleted ? 'fa-check' : 'fa-plus'}`}></i>
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="bg-slate-100 p-8 rounded-3xl text-center text-slate-500 text-sm italic">
        (Displaying the current part of the journey. The full 365-day calendar is automatically mapped.)
      </div>
    </div>
  );
};

export default PlanList;
