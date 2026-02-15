
import React from 'react';
import { AppTab } from '../types';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.DASHBOARD, icon: 'fa-house', label: 'Home' },
    { id: AppTab.READER, icon: 'fa-book-open', label: 'Reading' },
    { id: AppTab.PLAN, icon: 'fa-calendar-check', label: 'Plan' },
    { id: AppTab.LEARN, icon: 'fa-brain', label: 'Learn' },
    { id: AppTab.NOTES, icon: 'fa-pen-to-square', label: 'Notes' },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 md:hidden z-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <i className={`fa-solid ${tab.icon} text-lg`}></i>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-slate-200 flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
          <i className="fa-solid fa-cross text-xl"></i>
        </div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
              activeTab === tab.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xl`}></i>
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
