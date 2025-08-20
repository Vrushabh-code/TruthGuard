## TruthGuard – AI‑Powered Fake News Detection (Demo)

TruthGuard is a React + TypeScript demo app that helps evaluate whether a news article is likely real or fake. It combines simulated online verification (cross-checking against a list of well-known outlets) with lightweight content analysis (keyword/semantic indicators) to produce a prediction, confidence score, and key indicators. A dashboard shows quick stats and lets users provide feedback on each analysis.

### Features
- **Hybrid detection**: Combines simulated online verification with content-based scoring.
- **URL or text input**: Paste a link or enter article title + content; includes sample articles to try.
- **Clear results**: Prediction (real/fake), confidence bar, key indicators, and sources used.
- **User feedback loop**: Mark results as correct/incorrect to track perceived accuracy.
- **Dashboard metrics**: Total analyses, counts by class, average confidence, and recent analyses.
- **Modern UI**: Tailwind CSS styling and `lucide-react` icons.

### How it works (at a glance)
- **Online verification**: `OnlineNewsVerifier.verifyNews` simulates searching for credible sources and returns whether the story is “found” on reputable domains with a confidence score and details.
- **Content analysis**: `FakeNewsDetector.analyzeArticle` scores language features:
  - Fake-leaning: emotional/clickbait/conspiracy/unreliable/extreme claims, URL heuristics, excessive caps/exclamations.
  - Real-leaning: professional/factual/balanced wording and credible references.
- **Decision**: If online verification is strong, it drives the result; otherwise, content analysis prevails. When both agree, confidence increases; when they disagree, online verification is favored.

### Tech stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: `lucide-react`

### Getting started
Prerequisites: Node.js 18+

```bash
# Install
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage
1. Open the app and choose input mode: URL or Text.
2. Paste a link or enter title + content (or load a sample).
3. Click “Analyze Article” to see the prediction, confidence, indicators, and sources.
4. Switch to the Dashboard to view metrics and mark analyses as correct/incorrect.

### Project structure
