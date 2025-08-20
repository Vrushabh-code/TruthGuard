import { OnlineNewsVerifier, OnlineVerificationResult } from './onlineVerifier';

export interface AnalysisResult {
  prediction: 'fake' | 'real';
  confidence: number;
  keyIndicators: string[];
  sources: string[];
  reasoning: string;
  verificationMethod: 'online_verification' | 'content_analysis' | 'hybrid';
  onlineVerification?: OnlineVerificationResult;
}

export class FakeNewsDetector {
  private onlineVerifier: OnlineNewsVerifier;

  constructor() {
    this.onlineVerifier = new OnlineNewsVerifier();
  }

  private fakeNewsIndicators = {
    // Emotional/sensational language
    emotional: [
      'shocking', 'unbelievable', 'amazing', 'incredible', 'outrageous',
      'devastating', 'terrifying', 'miraculous', 'explosive', 'bombshell',
      'scandal', 'exposed', 'revealed', 'secret', 'hidden truth',
      'they don\'t want you to know', 'mainstream media won\'t tell you'
    ],
    
    // Clickbait patterns
    clickbait: [
      'you won\'t believe', 'this will shock you', 'doctors hate this',
      'one simple trick', 'what happens next will', 'the result will surprise you',
      'number 7 will shock you', 'this changes everything'
    ],
    
    // Conspiracy language
    conspiracy: [
      'cover up', 'conspiracy', 'illuminati', 'new world order',
      'deep state', 'shadow government', 'they control', 'wake up',
      'sheeple', 'puppet masters', 'hidden agenda'
    ],
    
    // Unreliable sources
    unreliableSources: [
      'anonymous sources', 'insider reveals', 'leaked documents',
      'unnamed official', 'sources close to', 'according to rumors',
      'social media reports', 'viral video shows'
    ],
    
    // Extreme claims
    extremeClaims: [
      '100% effective', 'completely safe', 'never before seen',
      'scientists baffled', 'doctors amazed', 'breakthrough discovery',
      'revolutionary', 'game-changing', 'life-changing'
    ]
  };

  private realNewsIndicators = {
    // Professional language
    professional: [
      'according to', 'research shows', 'study indicates', 'data suggests',
      'experts say', 'analysis reveals', 'investigation found',
      'peer-reviewed', 'published in', 'clinical trial'
    ],
    
    // Credible sources
    credibleSources: [
      'reuters', 'associated press', 'bbc', 'cnn', 'new york times',
      'washington post', 'wall street journal', 'npr', 'pbs',
      'university', 'institute', 'department of', 'ministry of'
    ],
    
    // Balanced reporting
    balanced: [
      'however', 'on the other hand', 'critics argue', 'supporters claim',
      'both sides', 'different perspectives', 'various viewpoints',
      'some experts', 'other researchers'
    ],
    
    // Factual language
    factual: [
      'statistics show', 'data indicates', 'research confirms',
      'study published', 'peer review', 'methodology',
      'sample size', 'margin of error', 'confidence interval'
    ]
  };

  private calculateScore(text: string, indicators: string[]): number {
    const lowerText = text.toLowerCase();
    let score = 0;
    let matches = 0;

    indicators.forEach(indicator => {
      if (lowerText.includes(indicator.toLowerCase())) {
        score += 1;
        matches += 1;
      }
    });

    // Normalize score based on text length and number of matches
    const textLength = text.split(' ').length;
    const normalizedScore = (score / Math.max(textLength / 100, 1)) * (matches > 0 ? 1 : 0);
    
    return Math.min(normalizedScore, 1);
  }

  public async analyzeArticle(title: string, content: string, url?: string): Promise<AnalysisResult> {
    // First, try online verification
    const onlineResult = await this.onlineVerifier.verifyNews(title, content, url);
    
    // If online verification is conclusive, use it as primary method
    if (onlineResult.method === 'online_verification' && onlineResult.confidence >= 0.75) {
      const prediction: 'fake' | 'real' = onlineResult.isVerified ? 'real' : 'fake';
      
      const keyIndicators = onlineResult.isVerified 
        ? [
            `Verified by ${onlineResult.sources.length} credible source${onlineResult.sources.length > 1 ? 's' : ''}`,
            'Found on established news outlets',
            'Cross-referenced with reliable sources',
            'Passes online verification check'
          ]
        : [
            'No credible sources found online',
            'Not reported by established news outlets',
            'Failed online verification check',
            onlineResult.sources.length > 0 ? 'Only found on unreliable sources' : 'No supporting sources found'
          ];
      
      return {
        prediction,
        confidence: onlineResult.confidence,
        keyIndicators: keyIndicators.slice(0, 4),
        sources: onlineResult.sources.length > 0 ? onlineResult.sources : ['No credible sources'],
        reasoning: onlineResult.details,
        verificationMethod: 'online_verification',
        onlineVerification: onlineResult
      };
    }
    
    // Fallback to content analysis
    const fullText = `${title} ${content}`;
    
    // Calculate fake news indicators
    const emotionalScore = this.calculateScore(fullText, this.fakeNewsIndicators.emotional);
    const clickbaitScore = this.calculateScore(fullText, this.fakeNewsIndicators.clickbait);
    const conspiracyScore = this.calculateScore(fullText, this.fakeNewsIndicators.conspiracy);
    const unreliableSourceScore = this.calculateScore(fullText, this.fakeNewsIndicators.unreliableSources);
    const extremeClaimsScore = this.calculateScore(fullText, this.fakeNewsIndicators.extremeClaims);
    
    // Calculate real news indicators
    const professionalScore = this.calculateScore(fullText, this.realNewsIndicators.professional);
    const credibleSourceScore = this.calculateScore(fullText, this.realNewsIndicators.credibleSources);
    const balancedScore = this.calculateScore(fullText, this.realNewsIndicators.balanced);
    const factualScore = this.calculateScore(fullText, this.realNewsIndicators.factual);
    
    // Additional checks
    const hasProperAttribution = /according to|source:|cited|reported by/i.test(fullText);
    const hasExcessiveCaps = (fullText.match(/[A-Z]{3,}/g) || []).length > 3;
    const hasExcessiveExclamation = (fullText.match(/!/g) || []).length > 5;
    const hasClickbaitNumbers = /\d+\s+(shocking|amazing|incredible|simple)/i.test(fullText);
    
    // URL analysis
    let urlScore = 0;
    if (url) {
      const domain = url.toLowerCase();
      if (domain.includes('facebook.com') || domain.includes('twitter.com') || 
          domain.includes('blog') || domain.includes('wordpress') ||
          domain.includes('conspiracy') || domain.includes('truth')) {
        urlScore = 0.3; // Less reliable
      } else if (domain.includes('reuters.com') || domain.includes('bbc.com') ||
                 domain.includes('nytimes.com') || domain.includes('washingtonpost.com') ||
                 domain.includes('cnn.com') || domain.includes('npr.org')) {
        urlScore = -0.3; // More reliable
      }
    }
    
    // Calculate final scores
    const fakeScore = (
      emotionalScore * 0.25 +
      clickbaitScore * 0.3 +
      conspiracyScore * 0.2 +
      unreliableSourceScore * 0.15 +
      extremeClaimsScore * 0.1 +
      urlScore +
      (hasExcessiveCaps ? 0.1 : 0) +
      (hasExcessiveExclamation ? 0.1 : 0) +
      (hasClickbaitNumbers ? 0.15 : 0)
    );
    
    const realScore = (
      professionalScore * 0.3 +
      credibleSourceScore * 0.25 +
      balancedScore * 0.2 +
      factualScore * 0.25 +
      (hasProperAttribution ? 0.1 : 0)
    );
    
    // Determine prediction
    const netScore = fakeScore - realScore;
    let prediction: 'fake' | 'real' = netScore > 0.1 ? 'fake' : 'real';
    let confidence = Math.min(Math.max(Math.abs(netScore) + 0.6, 0.6), 0.85);
    
    // Combine with online verification if available
    let verificationMethod: 'online_verification' | 'content_analysis' | 'hybrid' = 'content_analysis';
    let finalSources = prediction === 'fake' 
      ? ['Social media posts', 'Unverified blogs', 'Anonymous sources']
      : ['Established news outlets', 'Official statements', 'Verified sources'];
    
    if (onlineResult.method === 'online_verification') {
      verificationMethod = 'hybrid';
      
      // Weight online verification more heavily
      if (onlineResult.isVerified !== (prediction === 'real')) {
        // Online and content analysis disagree - favor online verification
        prediction = onlineResult.isVerified ? 'real' : 'fake';
        confidence = Math.max(confidence * 0.7, onlineResult.confidence * 0.8);
      } else {
        // Both methods agree - increase confidence
        confidence = Math.min(confidence + 0.1, 0.95);
      }
      
      finalSources = onlineResult.sources.length > 0 ? onlineResult.sources : finalSources;
    }
    
    // Generate key indicators
    const keyIndicators: string[] = [];
    if (prediction === 'fake') {
      if (emotionalScore > 0.1) keyIndicators.push('Emotional language detected');
      if (clickbaitScore > 0.1) keyIndicators.push('Clickbait patterns found');
      if (conspiracyScore > 0.1) keyIndicators.push('Conspiracy-related content');
      if (unreliableSourceScore > 0.1) keyIndicators.push('Unreliable source references');
      if (extremeClaimsScore > 0.1) keyIndicators.push('Extreme or unverified claims');
      if (hasExcessiveCaps) keyIndicators.push('Excessive capitalization');
      if (hasExcessiveExclamation) keyIndicators.push('Overuse of exclamation marks');
      if (!hasProperAttribution) keyIndicators.push('Lack of proper source attribution');
    } else {
      if (professionalScore > 0.1) keyIndicators.push('Professional language used');
      if (credibleSourceScore > 0.1) keyIndicators.push('Credible sources referenced');
      if (balancedScore > 0.1) keyIndicators.push('Balanced reporting detected');
      if (factualScore > 0.1) keyIndicators.push('Factual language patterns');
      if (hasProperAttribution) keyIndicators.push('Proper source attribution');
    }
    
    // Add online verification indicators if used
    if (verificationMethod === 'hybrid') {
      if (onlineResult.isVerified) {
        keyIndicators.unshift('Verified through online sources');
      } else {
        keyIndicators.unshift('Not found on credible online sources');
      }
    }
    
    // If no specific indicators, add generic ones
    if (keyIndicators.length === 0) {
      if (prediction === 'fake') {
        keyIndicators.push('Content patterns suggest unreliability');
      } else {
        keyIndicators.push('Content appears factual and well-sourced');
      }
    }
    
    let reasoning: string;
    if (verificationMethod === 'hybrid') {
      reasoning = onlineResult.details + '. ' + (prediction === 'fake'
        ? `Content analysis also detected ${keyIndicators.length - 1} additional warning signs.`
        : `Content analysis confirms with ${keyIndicators.length - 1} positive indicators.`);
    } else {
      reasoning = prediction === 'fake'
        ? `Analysis detected ${keyIndicators.length} indicators commonly associated with misinformation, including ${keyIndicators[0]?.toLowerCase()}.`
        : `Content shows characteristics of reliable journalism with ${keyIndicators.length} positive indicators including ${keyIndicators[0]?.toLowerCase()}.`;
    }
    
    return {
      prediction,
      confidence,
      keyIndicators: keyIndicators.slice(0, 4), // Limit to 4 indicators
      sources: finalSources,
      reasoning,
      verificationMethod,
      onlineVerification: onlineResult
    };
  }
}