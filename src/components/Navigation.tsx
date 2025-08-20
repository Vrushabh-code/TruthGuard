import React from 'react';
import { Search, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentView: 'analyze' | 'dashboard';
  onViewChange: (view: 'analyze' | 'dashboard') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          <button
            onClick={() => onViewChange('analyze')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              currentView === 'analyze'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Search className="w-4 h-4" />
            Analyze Article
          </button>
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              currentView === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
};