
import React, { useState } from 'react';
import { answerTheologicalQuestion } from '../geminiService';

const Learn: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const res = await answerTheologicalQuestion(question);
    setAnswer(res);
    setLoading(false);
  };

  const suggestions = [
    "What does it mean to be in the image and likeness of God?",
    "Explain the parable of the Prodigal Son.",
    "What is the historical significance of the Tabernacle?",
    "How can we apply the Sermon on the Mount today?"
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-100">
          <i className="fa-solid fa-wand-magic-sparkles text-3xl"></i>
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Wisdom Center</h1>
        <p className="text-slate-500 max-w-md mx-auto">Ask your deepest theological questions with the help of our biblical AI.</p>
      </header>

      <form onSubmit={handleSubmit} className="relative group">
        <input 
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about any biblical theme..."
          className="w-full bg-white border border-slate-200 rounded-3xl py-6 pl-8 pr-32 shadow-xl shadow-slate-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-lg font-medium"
        />
        <button 
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-3 top-3 bottom-3 bg-indigo-600 text-white px-8 rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
          Send
        </button>
      </form>

      {!answer && !loading && (
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Study suggestions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map(s => (
              <button 
                key={s}
                onClick={() => setQuestion(s)}
                className="bg-white border border-slate-100 p-4 rounded-2xl text-left text-sm font-semibold text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="h-6 bg-slate-100 rounded-full w-3/4 animate-pulse mx-auto"></div>
          <div className="h-6 bg-slate-50 rounded-full w-1/2 animate-pulse mx-auto"></div>
          <div className="h-40 bg-slate-50 rounded-3xl w-full animate-pulse"></div>
        </div>
      )}

      {answer && !loading && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-slide-up">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-book"></i>
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Theological Answer</h3>
              <p className="text-slate-800 font-bold mt-1">Reflection on: "{question}"</p>
            </div>
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
            {answer}
          </div>
          <button 
            onClick={() => setAnswer(null)}
            className="mt-8 text-indigo-600 font-bold text-sm hover:underline"
          >
            Ask another question
          </button>
        </div>
      )}
    </div>
  );
};

export default Learn;
