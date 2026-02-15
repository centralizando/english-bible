
import React from 'react';
import { UserNote } from '../types';

interface NotesViewProps {
  notes: UserNote[];
}

const NotesView: React.FC<NotesViewProps> = ({ notes }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">My Spiritual Notes</h2>
        <p className="text-slate-500">Recordings of what God has spoken to you.</p>
      </header>

      {notes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <i className="fa-solid fa-pen-nib text-2xl"></i>
          </div>
          <p className="text-slate-400 font-medium">You don't have any notes yet. Go to the reader to start!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {note.reference}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed italic">
                "{note.content}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesView;
