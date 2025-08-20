import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArticleInput } from './components/ArticleInput';
import { Results } from './components/Results';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { PredictionResult, Article } from './types';
import { FakeNewsDetector } from './utils/fakeNewsDetector';

function App() {
  const [currentView, setCurrentView] = useState<'analyze' | 'dashboard'>('analyze');
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PredictionResult[]>([]);
  const detector = new FakeNewsDetector();

  const handleAnalysis = async (article: Article) => {
    // Use actual content-based analysis
    const analysis = await detector.analyzeArticle(article.title, article.content, article.url);
    
    const result: PredictionResult = {
      id: Date.now().toString(),
      article,
      prediction: analysis.prediction,
      confidence: analysis.confidence,
      keyIndicators: analysis.keyIndicators,
      timestamp: new Date(),
      sources: analysis.sources,
      verificationMethod: analysis.verificationMethod
    };

    setCurrentResult(result);
    setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const handleFeedback = (resultId: string, feedback: 'correct' | 'incorrect') => {
    setAnalysisHistory(prev => 
      prev.map(result => 
        result.id === resultId 
          ? { ...result, userFeedback: feedback }
          : result
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentView === 'analyze' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ArticleInput onAnalyze={handleAnalysis} />
            </div>
            <div>
              {currentResult && (
                <Results 
                  result={currentResult} 
                  onFeedback={handleFeedback}
                />
              )}
            </div>
          </div>
        ) : (
          <Dashboard 
            history={analysisHistory}
            onFeedback={handleFeedback}
          />
        )}
      </main>
    </div>
  );
}

export default App;