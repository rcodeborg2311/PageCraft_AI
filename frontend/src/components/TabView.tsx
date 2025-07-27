import React from 'react';
import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="flex bg-zinc-800 rounded-lg p-1 border border-zinc-700">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
          activeTab === 'code'
            ? 'bg-white text-black shadow-sm'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
        }`}
      >
        <Code2 className="w-4 h-4" />
        Code Editor
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
          activeTab === 'preview'
            ? 'bg-white text-black shadow-sm'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
        }`}
      >
        <Eye className="w-4 h-4" />
        Live Preview
      </button>
    </div>
  );
}