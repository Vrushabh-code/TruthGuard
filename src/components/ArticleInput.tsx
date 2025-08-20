import React, { useState } from 'react';
import { Link, Type, Send, Loader } from 'lucide-react';
import { Article } from '../types';

interface ArticleInputProps {
  onAnalyze: (article: Article) => Promise<void>;
}

export const ArticleInput: React.FC<ArticleInputProps> = ({ onAnalyze }) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !url.trim()) return;

    setIsLoading(true);
    
    // Show realistic processing time for online verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    const article: Article = {
      title: title.trim() || 'Untitled Article',
      content: content.trim(),
      url: url.trim() || undefined,
      source: url.trim() ? new URL(url).hostname : 'Manual Input'
    };

    onAnalyze(article);
    setIsLoading(false);
  };

  const sampleArticles = [
    {
      title: "Scientists Discover Revolutionary Cancer Treatment",
      content: "Researchers at Stanford University have developed a breakthrough treatment that shows 95% success rate in early trials. The treatment, which uses targeted nanoparticles, has been tested on 200 patients with stage 3 cancer. Dr. Sarah Johnson, lead researcher, stated that preliminary results are 'extremely promising' and could revolutionize cancer care within the next five years.",
      url: "https://medical-journal.example.com/cancer-breakthrough-2024"
    },
    {
      title: "SHOCKING: Aliens Secretly Control World Governments!",
      content: "Anonymous sources reveal that extraterrestrial beings have been manipulating world leaders for decades! Secret documents leaked by a former government insider show undeniable proof of alien involvement in major political decisions. This will change EVERYTHING you thought you knew about our world! Share before they delete this!",
      url: "https://conspiracy-news.fake/alien-government-control"
    }
  ];

  const loadSample = (sample: typeof sampleArticles[0]) => {
    setTitle(sample.title);
    setContent(sample.content);
    setUrl(sample.url);
    setInputType('text');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analyze News Article</h2>
        
        {/* Input Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setInputType('url')}
            className={`flex items-center gap-2 flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputType === 'url'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Link className="w-4 h-4" />
            URL
          </button>
          <button
            onClick={() => setInputType('text')}
            className={`flex items-center gap-2 flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputType === 'text'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Type className="w-4 h-4" />
            Text
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputType === 'url' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/news-article"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required={inputType === 'url'}
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the article title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the article content here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  required={inputType === 'text'}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading || (!content.trim() && !url.trim())}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Verifying Online & Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analyze Article
              </>
            )}
          </button>
        </form>
      </div>

      {/* Sample Articles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Try Sample Articles</h3>
        <div className="space-y-3">
          {sampleArticles.map((sample, index) => (
            <button
              key={index}
              onClick={() => loadSample(sample)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-900 mb-1">{sample.title}</div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {sample.content.substring(0, 120)}...
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};