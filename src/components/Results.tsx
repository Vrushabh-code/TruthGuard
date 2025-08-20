import React from 'react';
import { Shield, ShieldAlert, ThumbsUp, ThumbsDown, ExternalLink, Clock, Globe, Search } from 'lucide-react';
import { PredictionResult } from '../types';

interface ResultsProps {
  result: PredictionResult;
  onFeedback: (resultId: string, feedback: 'correct' | 'incorrect') => void;
}

export const Results: React.FC<ResultsProps> = ({ result, onFeedback }) => {
  const isReal = result.prediction === 'real';
  const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
          isReal ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isReal ? (
            <Shield className="w-6 h-6 text-green-600" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-red-600" />
          )}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${
            isReal ? 'text-green-700' : 'text-red-700'
          }`}>
            {isReal ? 'Likely Real News' : 'Likely Fake News'}
          </h3>
          <p className="text-sm text-gray-600">
            Confidence: {confidencePercentage}%
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Confidence Level</span>
          <span>{confidencePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isReal ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${confidencePercentage}%` }}
          />
        </div>
      </div>

      {/* Article Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">{result.article.title}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {result.timestamp.toLocaleString()}
          </div>
          {result.article.url && (
            <a
              href={result.article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              View Source
            </a>
          )}
        </div>
        <p className="text-gray-700 text-sm line-clamp-3">
          {result.article.content}
        </p>
      </div>

      {/* Key Indicators */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Key Indicators</h4>
        <div className="space-y-2">
          {result.keyIndicators.map((indicator, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isReal ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${
                isReal ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {indicator}
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Verification Sources
        </h4>
        <div className="flex flex-wrap gap-2">
          {result.sources.map((source, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isReal 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {source}
            </span>
          ))}
        </div>
        
        {/* Verification Method Indicator */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <Search className="w-4 h-4" />
          <span>
            Verification method: {
              result.verificationMethod === 'online_verification' ? 'Online Source Check' :
              result.verificationMethod === 'hybrid' ? 'Online + Content Analysis' :
              'Content Analysis Only'
            }
          </span>
        </div>
      </div>

      {/* Feedback */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-3">Was this analysis helpful?</h4>
        {result.userFeedback ? (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            result.userFeedback === 'correct' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {result.userFeedback === 'correct' ? (
              <ThumbsUp className="w-4 h-4" />
            ) : (
              <ThumbsDown className="w-4 h-4" />
            )}
            Thank you for your feedback!
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => onFeedback(result.id, 'correct')}
              className="flex items-center gap-2 px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              Correct
            </button>
            <button
              onClick={() => onFeedback(result.id, 'incorrect')}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              Incorrect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};