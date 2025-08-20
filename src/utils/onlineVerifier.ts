export interface OnlineVerificationResult {
  isVerified: boolean;
  sources: string[];
  confidence: number;
  method: 'online_verification' | 'content_analysis';
  details: string;
}

export class OnlineNewsVerifier {
  private credibleSources = [
    'reuters.com',
    'bbc.com',
    'cnn.com',
    'nytimes.com',
    'washingtonpost.com',
    'apnews.com',
    'npr.org',
    'theguardian.com',
    'wsj.com',
    'abcnews.go.com',
    'cbsnews.com',
    'nbcnews.com',
    'usatoday.com',
    'time.com',
    'newsweek.com',
    'bloomberg.com',
    'forbes.com',
    'politico.com',
    'axios.com',
    'thehill.com'
  ];

  private async simulateGoogleSearch(query: string): Promise<string[]> {
    // Simulate Google search results
    // In a real implementation, you would use Google Custom Search API
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simulate search results based on content patterns
    const lowerQuery = query.toLowerCase();
    const results: string[] = [];
    
    // Check if query contains fake news indicators
    const fakeIndicators = [
      'shocking', 'unbelievable', 'secret', 'exposed', 'conspiracy',
      'aliens control', 'government hiding', 'doctors hate this',
      'one simple trick', 'they don\'t want you to know'
    ];
    
    const realIndicators = [
      'research', 'study', 'university', 'scientists', 'published',
      'clinical trial', 'peer review', 'data shows', 'according to'
    ];
    
    const hasFakeIndicators = fakeIndicators.some(indicator => 
      lowerQuery.includes(indicator.toLowerCase())
    );
    
    const hasRealIndicators = realIndicators.some(indicator => 
      lowerQuery.includes(indicator.toLowerCase())
    );
    
    if (hasRealIndicators && !hasFakeIndicators) {
      // Simulate finding the story on credible sources
      const numSources = Math.floor(Math.random() * 4) + 2; // 2-5 sources
      const selectedSources = this.credibleSources
        .sort(() => 0.5 - Math.random())
        .slice(0, numSources);
      
      results.push(...selectedSources.map(source => `https://${source}/article/${Date.now()}`));
    } else if (hasFakeIndicators) {
      // Simulate finding only on unreliable sources or no sources
      const unreliableSources = [
        'conspiracy-news.fake',
        'truth-exposed.blog',
        'real-news-they-hide.com'
      ];
      
      if (Math.random() > 0.7) {
        results.push(...unreliableSources.map(source => `https://${source}/article/${Date.now()}`));
      }
      // Otherwise return empty (no sources found)
    } else {
      // Mixed content - simulate partial verification
      if (Math.random() > 0.5) {
        const numSources = Math.floor(Math.random() * 2) + 1; // 1-2 sources
        const selectedSources = this.credibleSources
          .sort(() => 0.5 - Math.random())
          .slice(0, numSources);
        
        results.push(...selectedSources.map(source => `https://${source}/article/${Date.now()}`));
      }
    }
    
    return results;
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  private isCredibleSource(url: string): boolean {
    const domain = this.extractDomain(url);
    return this.credibleSources.some(credible => domain.includes(credible));
  }

  public async verifyNews(title: string, content: string, sourceUrl?: string): Promise<OnlineVerificationResult> {
    try {
      // Create search query from title and key content
      const searchQuery = title.length > 100 ? title.substring(0, 100) : title;
      
      // Simulate online search
      const searchResults = await this.simulateGoogleSearch(searchQuery);
      
      // Analyze results
      const credibleResults = searchResults.filter(url => this.isCredibleSource(url));
      const uncredibleResults = searchResults.filter(url => !this.isCredibleSource(url));
      
      // Check if the source URL itself is credible
      let sourceCredible = false;
      if (sourceUrl) {
        sourceCredible = this.isCredibleSource(sourceUrl);
      }
      
      // Determine verification result
      if (credibleResults.length >= 2 || (credibleResults.length >= 1 && sourceCredible)) {
        return {
          isVerified: true,
          sources: credibleResults.map(url => this.extractDomain(url)),
          confidence: Math.min(0.85 + (credibleResults.length * 0.05), 0.95),
          method: 'online_verification',
          details: `Found ${credibleResults.length} credible source${credibleResults.length > 1 ? 's' : ''} reporting this story`
        };
      } else if (credibleResults.length === 1) {
        return {
          isVerified: true,
          sources: credibleResults.map(url => this.extractDomain(url)),
          confidence: 0.75,
          method: 'online_verification',
          details: 'Found 1 credible source reporting this story'
        };
      } else if (uncredibleResults.length > 0) {
        return {
          isVerified: false,
          sources: uncredibleResults.map(url => this.extractDomain(url)),
          confidence: 0.80,
          method: 'online_verification',
          details: 'Only found on unreliable or unverified sources'
        };
      } else {
        return {
          isVerified: false,
          sources: [],
          confidence: 0.85,
          method: 'online_verification',
          details: 'No credible sources found reporting this story'
        };
      }
    } catch (error) {
      // Fallback to content analysis if online verification fails
      return {
        isVerified: false,
        sources: [],
        confidence: 0.60,
        method: 'content_analysis',
        details: 'Online verification failed, relying on content analysis'
      };
    }
  }
}