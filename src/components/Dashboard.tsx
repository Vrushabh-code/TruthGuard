import React from 'react';
import { TrendingUp, TrendingDown, Clock, ThumbsUp, ThumbsDown, Shield, ShieldAlert } from 'lucide-react';
import { PredictionResult } from '../types';

interface DashboardProps {
  history: PredictionResult[];
  onFeedback: (resultId: string, feedback: 'correct' | 'incorrect') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ history, onFeedback }) => {
  const totalAnalyses = history.length;
  const fakeNewsCount = history.filter(r => r.prediction === 'fake').length;
  const realNewsCount = history.filter(r => r.prediction === 'real').length;
  const accuracyFeedback = history.filter(r => r.userFeedback === 'correct').length;
  const totalFeedback = history.filter(r => r.userFeedback).length;

  const averageConfidence = history.length > 0 
    ? Math.round((history.reduce((sum, r) => sum + r.confidence, 0) / history.length) * 100)
    : 0;

  const accuracy = totalFeedback > 0 ? Math.round((accuracyFeedback / totalFeedback) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold text-gray-900">{totalAnalyses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Real News</p>
              <p className="text-2xl font-bold text-gray-900">{realNewsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Fake News</p>
              <p className="text-2xl font-bold text-gray-900">{fakeNewsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Confidence</p>
              <p className="text-2xl font-bold text-gray-900">{averageConfidence}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance */}
      {totalFeedback > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">User Accuracy Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalFeedback}</div>
              <div className="text-sm text-gray-600">Feedback Responses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{averageConfidence}%</div>
              <div className="text-sm text-gray-600">Average Confidence</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Analyses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No analyses yet. Start by analyzing your first article!
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 10).map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                      result.prediction === 'real' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {result.prediction === 'real' ? (
                        <Shield className="w-4 h-4 text-green-600" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {result.article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {result.timestamp.toLocaleString()}
                        <span>•</span>
                        <span className={result.prediction === 'real' ? 'text-green-600' : 'text-red-600'}>
                          {Math.round(result.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {result.keyIndicators.slice(0, 2).map((indicator, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${
                          result.prediction === 'real'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {indicator}
                      </span>
                    ))}
                  </div>

                  {result.userFeedback ? (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      result.userFeedback === 'correct' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {result.userFeedback === 'correct' ? (
                        <ThumbsUp className="w-3 h-3" />
                      ) : (
                        <ThumbsDown className="w-3 h-3" />
                      )}
                      {result.userFeedback}
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        onClick={() => onFeedback(result.id, 'correct')}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Mark as correct"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onFeedback(result.id, 'incorrect')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Mark as incorrect"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};