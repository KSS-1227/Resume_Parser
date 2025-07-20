# Job Hunt Insights Engine - Free Resume-Job Matching System

A comprehensive, **100% free** resume-job matching and analysis system built with modern web technologies and AI-powered NLP. This system provides detailed insights into how well your resume matches job requirements, with actionable recommendations for improvement.

## 🚀 Features

### Core Analysis Capabilities

- **Multi-format Resume Processing**: PDF, DOCX, and DOC files
- **Intelligent Job Description Scraping**: Extract job details from URLs
- **Advanced NLP Analysis**: TF-IDF, cosine similarity, and semantic analysis
- **Comprehensive Skill Matching**: 200+ technical skills across various domains
- **Experience Level Assessment**: Years of experience and role relevance
- **Keyword Density Analysis**: Important terms coverage
- **Semantic Similarity**: AI-powered content relevance scoring

### Detailed Reporting

- **Overall Match Score**: Weighted combination of all metrics
- **Section-by-Section Analysis**: Skills, experience, education, certifications
- **Missing Skills Identification**: Skills you need to develop
- **Matching Skills Highlighting**: Your strengths for the position
- **Personalized Recommendations**: Actionable improvement suggestions
- **Project Suggestions**: Specific projects to build missing skills
- **Resume Structure Analysis**: How well your resume is organized

### User Interface

- **Modern React Frontend**: Beautiful, responsive design with shadcn/ui
- **Real-time Analysis**: Instant feedback and progress indicators
- **Interactive Visualizations**: Progress bars, charts, and badges
- **Mobile-Friendly**: Works perfectly on all devices
- **Accessibility**: WCAG compliant design

## 🛠️ Technology Stack

### Frontend (Free)

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful components
- **React Router** for navigation

### Backend (Free)

- **Node.js** with Express
- **CORS** enabled for cross-origin requests
- **File upload handling** for resumes
- **Job description scraping** with BeautifulSoup

### AI Service (Free)

- **Python FastAPI** for AI processing
- **PyMuPDF** for PDF text extraction
- **python-docx** for DOCX processing
- **scikit-learn** for TF-IDF and cosine similarity
- **sentence-transformers** for semantic analysis
- **spaCy** for advanced NLP
- **NLTK** for text preprocessing
- **BeautifulSoup** for web scraping

### Hosting Options (Free)

- **Localhost** for development
- **Streamlit Community Cloud** for Streamlit apps
- **Render.com Free Tier** for backend
- **Railway.app Free Tier** for full-stack apps
- **Vercel** for frontend hosting

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

### Quick Start

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd job-hunt-insights-engine-main
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd backend
npm install
```

4. **Install Python AI service dependencies**

```bash
cd ai_service
pip install -r requirements.txt
```

5. **Start all services**

Terminal 1 (Frontend):

```bash
npm run dev
```

Terminal 2 (Backend):

```bash
cd backend
npm start
```

Terminal 3 (AI Service):

```bash
cd ai_service
uvicorn main:app --reload --port 8000
```

6. **Access the application**

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- AI Service: http://localhost:8000

## 🎯 How to Use

### 1. Upload Your Resume

- Click "Upload Resume" or drag and drop
- Supported formats: PDF, DOCX, DOC
- The system will automatically extract text and analyze structure

### 2. Provide Job Information

**Option A: Job URL**

- Paste the job posting URL
- System automatically scrapes and extracts job description

**Option B: Manual Description**

- Copy and paste the job description
- Include all requirements, responsibilities, and skills

### 3. Analyze Match

- Click "Analyze Match" to start the comprehensive analysis
- Wait for the AI to process your resume against the job requirements
- View detailed results with scores and recommendations

### 4. Review Results

The system provides:

**Overall Score**

- Percentage match based on all factors
- Color-coded: Green (80%+), Yellow (60-79%), Red (<60%)

**Detailed Metrics**

- **Skill Match**: Technical skills alignment
- **Experience Match**: Background relevance
- **Keyword Density**: Important terms coverage
- **Semantic Similarity**: AI-powered content relevance

**Skills Analysis**

- **Your Skills**: Detected in your resume
- **Required Skills**: Needed for the position
- **Missing Skills**: Skills you should develop
- **Matching Skills**: Your strengths for this role

**Recommendations**

- **Strengths**: What you're doing well
- **Improvements**: Areas to focus on
- **Suggested Projects**: Specific projects to build missing skills

## 🔧 Advanced Features

### Resume Structure Analysis

The system analyzes your resume sections:

- Contact Information
- Professional Summary
- Work Experience
- Education
- Skills
- Certifications

### Job Requirements Extraction

Automatically identifies:

- Required experience level
- Education requirements
- Technical skills needed
- Preferred qualifications

### Semantic Analysis

Uses advanced AI models to understand:

- Context and meaning beyond keywords
- Role relevance and fit
- Industry-specific terminology

## 📊 Sample Report

| Section          | Match % | Comments                                               |
| ---------------- | ------- | ------------------------------------------------------ |
| Technical Skills | 75%     | Good coverage on Python, missing Docker and AWS        |
| Experience       | 60%     | Lacks project management; add relevant experience      |
| Education        | 90%     | Degree matches requirement                             |
| Certifications   | 0%      | No certifications found; consider basic industry certs |

## 🚀 Deployment Options

### Free Hosting Platforms

**Frontend (React)**

- Vercel (recommended)
- Netlify
- GitHub Pages

**Backend (Node.js)**

- Render.com Free Tier
- Railway.app Free Tier
- Heroku (limited free tier)

**AI Service (Python)**

- Streamlit Community Cloud
- Railway.app Free Tier
- Render.com Free Tier

### Local Development

```bash
# Start all services locally
npm run dev          # Frontend
cd backend && npm start  # Backend
cd ai_service && uvicorn main:app --reload  # AI Service
```

## 🔒 Privacy & Security

- **No data storage**: All processing happens in memory
- **No external APIs**: Everything runs locally or on your servers
- **No tracking**: No analytics or user tracking
- **Open source**: Full transparency of code

## 🛠️ Customization

### Adding New Skills

Edit `ai_service/main.py` and add skills to the `skills_db` list:

```python
skills_db = [
    # Add your custom skills here
    "your-custom-skill",
    "another-skill",
    # ... existing skills
]
```

### Modifying Analysis Weights

Adjust the scoring algorithm in the `analyze_match` function:

```python
overall_score = int((
    skill_match * 0.35 +
    experience_match * 0.25 +
    keyword_density * 0.20 +
    semantic_similarity * 0.20
) * 100)
```

### Customizing UI

The frontend uses shadcn/ui components and Tailwind CSS for easy customization.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the code comments and this README
- **Community**: Join our discussions for help and ideas

## 🎉 Why This System is Special

✅ **100% Free**: No paid APIs, no subscriptions, no hidden costs
✅ **Privacy-First**: All processing happens locally or on your servers
✅ **Advanced AI**: Uses state-of-the-art NLP models
✅ **Comprehensive**: Covers skills, experience, education, and more
✅ **Actionable**: Provides specific recommendations and project ideas
✅ **Beautiful UI**: Modern, responsive design that works everywhere
✅ **Open Source**: Full transparency and customization options

This system gives you enterprise-level resume-job matching capabilities completely free, with the same quality as paid services but with full control over your data and customization options.
