
import React, { useState, useEffect } from 'react';
import { AppTab, ReadingPlanDay, UserNote } from './types';
import { initDb, getProgress, getNotes, saveProgress, getSetting, setSetting } from './db';
import { generateReadingPlan } from './bibleService';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import BibleReader from './components/BibleReader';
import PlanList from './components/PlanList';
import Learn from './components/Learn';
import NotesView from './components/NotesView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [readingPlan, setReadingPlan] = useState<ReadingPlanDay[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    await initDb();
    const savedStartDate = await getSetting('plan_start_date');
    const progress = await getProgress();
    const savedNotes = await getNotes();
    
    setStartDate(savedStartDate);
    const plan = generateReadingPlan(savedStartDate || undefined);
    
    setReadingPlan(plan);
    setCompletedDays(progress);
    setNotes(savedNotes as any);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetStartDate = async (date: string) => {
    await setSetting('plan_start_date', date);
    setStartDate(date);
    const plan = generateReadingPlan(date);
    setReadingPlan(plan);
  };

  const handleCompleteDay = async (day: number) => {
    await saveProgress(day);
    setCompletedDays(prev => [...prev, day]);
  };

  const refreshNotes = async () => {
    const savedNotes = await getNotes();
    setNotes(savedNotes as any);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pl-20">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
        {activeTab === AppTab.DASHBOARD && (
          <Dashboard 
            plan={readingPlan} 
            completedDays={completedDays} 
            onNavigate={(tab) => setActiveTab(tab)}
            startDate={startDate}
            onSetStartDate={handleSetStartDate}
          />
        )}
        {activeTab === AppTab.READER && <BibleReader onNoteAdded={refreshNotes} />}
        {activeTab === AppTab.PLAN && (
          <PlanList 
            plan={readingPlan} 
            completedDays={completedDays} 
            onComplete={handleCompleteDay} 
          />
        )}
        {activeTab === AppTab.LEARN && <Learn />}
        {activeTab === AppTab.NOTES && <NotesView notes={notes} />}
      </main>
    </div>
  );
};

export default App;
