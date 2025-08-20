## TruthGuard - AI-Powered Fake News Detection

## 🚀 Project Overview

TruthGuard is an intelligent web application that evaluates whether a news article is likely real or fake. It combines simulated online verification (cross-checking against credible outlets) with content analysis heuristics to produce a prediction, confidence score, key indicators, and referenced sources—ideal for learning, prototyping, and demonstrations.

## ✨ Key Features

- **Hybrid Detection**: Simulated online verification + content-based scoring
- **Flexible Input**: Analyze via URL or by entering title + content; includes sample articles
- **Transparent Results**: Prediction, confidence bar, key indicators, and verification sources
- **User Feedback**: Mark results as correct/incorrect to track perceived accuracy
- **Analytics Dashboard**: Totals, real/fake counts, average confidence, and recent analyses
- **Modern UI**: Tailwind CSS styling with `lucide-react` icons

## 🏗️ Architecture

### Frontend Components

1. **Header**
   - App branding and status indicator
   - Lightweight header with iconography

2. **Navigation**
   - Toggle between Analyze and Dashboard views
   - Clear active state and accessible navigation

3. **ArticleInput**
   - URL or text-based input mode
   - Sample article loader for quick demos
   - Submit with loading state and validations

4. **Results**
   - Prediction (real/fake) with confidence bar
   - Key indicators and verification sources
   - Feedback actions (Correct/Incorrect)

5. **Dashboard**
   - Metrics cards (totals, real/fake counts, avg. confidence)
   - User-rated accuracy (based on feedback)
   - Recent analyses list with quick feedback controls

6. **App (Root)**
   - View management, analysis history, and state orchestration
   - Coordinates hybrid detection pipeline

### Backend Services

- No dedicated backend service. The app simulates online verification entirely on the frontend:
  - **Online Verification (Simulated)**: Heuristic check for credible domains
  - **Content Analysis**: Text pattern scoring for fake vs real indicators

## 🎯 User Experience Features

### Navigation System
- **Two-Tab Layout**: Simple switch between Analyze and Dashboard
- **Clear States**: Active view highlighting and consistent styling
- **Responsive Layout**: Scales across desktop and mobile

### Guidance
- **Sample Inputs**: One-click sample articles to try the app quickly
- **Inline Clarity**: Clear labels, placeholders, and button states
- **Result Transparency**: Confidence, indicators, and sources shown prominently

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (bundled with Node)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd FakeNewsDetaction-main
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser
- Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 📖 How to Use

### 1. Analyze Articles
- Choose input mode: URL or Text
- Paste a URL or enter the article title + content
- Optionally load a sample article for quick testing
- Click “Analyze Article” to run hybrid detection

### 2. Review Results
- See prediction (Likely Real/Fake) with confidence bar
- Review key indicators and verification sources
- Provide feedback: mark the result as Correct or Incorrect

### 3. Explore Dashboard
- View totals, real/fake counts, and average confidence
- Check user-rated accuracy (from your feedback)
- Browse recent analyses and adjust feedback inline

## 🎨 UI/UX Features

### Modern Design
- **Tailwind CSS**: Clean and consistent utility-first styling
- **Iconography**: `lucide-react` icons for clarity
- **Responsive Layout**: Works across device sizes

### User Interface
- **Accessible Controls**: Clear labels and states
- **Progress Feedback**: Loading indicators during analysis
- **Readable Output**: Structured results and concise indicators

### Accessibility
- **Keyboard-Friendly**: Click targets and form controls
- **Contrast & Clarity**: Legible typography and color usage
- Notes: This is a demo; additional ARIA and a11y enhancements are welcome

## 🔧 Technical Stack

### Frontend
- **React** (18) + **TypeScript**
- **Vite** (dev/build tooling)
- **Tailwind CSS** (styling)
- **lucide-react** (icons)
- **ESLint** + **TypeScript ESLint** (linting)

### Analysis Logic (Frontend)
- `src/utils/onlineVerifier.ts`: Simulated online verification against credible domains
- `src/utils/fakeNewsDetector.ts`: Content heuristics and hybrid decisioning

### Project Structure 

FakeNewsDetaction-main/
├── src/
│   ├── App.tsx                          # Root app, routing between views
│   ├── components/
│   │   ├── Header.tsx                   # Branding header
│   │   ├── Navigation.tsx               # Analyze/Dashboard tabs
│   │   ├── ArticleInput.tsx             # URL/Text inputs + samples
│   │   ├── Results.tsx                  # Prediction + confidence + feedback
│   │   └── Dashboard.tsx                # Metrics and recent analyses
│   ├── utils/
│   │   ├── fakeNewsDetector.ts          # Hybrid content + verification logic
│   │   └── onlineVerifier.ts            # Simulated credible source checks
│   └── types/
│       └── index.ts                     # Article / PredictionResult types
├── index.html
├── package.json
└── README.md


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes (tests and accessibility improvements welcome)
4. Ensure lint passes (`npm run lint`)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License (or add your preferred license).

## 🆘 Support

For questions and suggestions:
- Open an issue in the repository
- Propose enhancements via pull requests

## 🔮 Future Enhancements

- Real search/API integration (e.g., custom search/Bing) with rate limiting
- Persistence for history and feedback
- NLP/ML-based content scoring instead of purely hand-crafted heuristics
- Advanced explainability and evidence linking
- Browser extension or shareable deep links for pre-filled analyses

---

**TruthGuard** — Helping users evaluate news credibility with transparent, demo-friendly heuristics.
