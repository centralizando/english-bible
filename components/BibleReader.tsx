
import React, { useState, useEffect } from 'react';
import { fetchChapter, BOOKS } from '../bibleService';
import { BibleChapter } from '../types';
import { getBiblicalInsight } from '../geminiService';
import { addNote } from '../db';

interface BibleReaderProps {
  onNoteAdded: () => void;
}

const BibleReader: React.FC<BibleReaderProps> = ({ onNoteAdded }) => {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [data, setData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    loadChapter();
  }, [book, chapter]);

  const loadChapter = async () => {
    setLoading(true);
    setInsight(null);
    try {
      const res = await fetchChapter(book, chapter);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGetInsight = async () => {
    if (!data) return;
    setLoadingInsight(true);
    const textSample = data.verses.slice(0, 5).map(v => v.text).join(' ');
    const res = await getBiblicalInsight(`${book} ${chapter}`, `Text: ${textSample}`);
    setInsight(res || "Error loading insight.");
    setLoadingInsight(false);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;
    await addNote(`${book} ${chapter}`, noteContent);
    setNoteContent('');
    setShowNoteModal(false);
    onNoteAdded();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <select 
            value={book} 
            onChange={(e) => setBook(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <input 
            type="number" 
            min="1" 
            value={chapter} 
            onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
            className="w-16 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGetInsight}
            disabled={loadingInsight}
            className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-amber-200 transition-colors disabled:opacity-50"
          >
            {loadingInsight ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            AI Insights
          </button>
          <button 
             onClick={() => setShowNoteModal(true)}
             className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors"
          >
            <i className="fa-solid fa-pen-nib"></i>
            Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="h-4 w-64 bg-slate-100 rounded"></div>
                  <div className="h-4 w-48 bg-slate-100 rounded"></div>
                  <div className="h-4 w-56 bg-slate-100 rounded"></div>
               </div>
            </div>
          ) : (
            <div className="bible-text space-y-4 text-lg text-slate-700 leading-relaxed">
              <h2 className="text-3xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4">{book} {chapter}</h2>
              {data?.verses.map(v => (
                <p key={v.verse} className="group">
                  <sup className="text-indigo-500 font-bold mr-2 text-xs">{v.verse}</sup>
                  {v.text}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {insight && (
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 animate-slide-up">
              <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-3">
                <i className="fa-solid fa-lightbulb"></i>
                AI Light
              </h3>
              <div className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap font-medium">
                {insight}
              </div>
            </div>
          )}
          
          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Study Tip</h3>
              <p className="text-slate-400 text-sm">Use the insights feature to better understand complex poetic or prophetic passages.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <i className="fa-solid fa-scroll text-8xl rotate-12"></i>
            </div>
          </div>
        </div>
      </div>

      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">New Note</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider">
                Reference: {book} {chapter}
              </div>
              <textarea 
                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What did the Spirit speak to your heart today?"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              ></textarea>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setShowNoteModal(false)}
                className="flex-1 py-3 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNote}
                className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleReader;
