import React from 'react';
import { Shield, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TruthGuard</h1>
            <p className="text-sm text-gray-600">AI-Powered Fake News Detection</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Live Detection</span>
          </div>
        </div>
      </div>
    </header>
  );
};