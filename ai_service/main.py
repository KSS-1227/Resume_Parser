from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import fitz
from docx import Document
import requests
from bs4 import BeautifulSoup
import nltk
import io
from typing import List, Dict, Any, Optional, Union

# Import shared functions from utils
from utils import extract_skills, calculate_semantic_similarity

# Import job recommendations router
from job_recommendations import router as job_recommendations_router

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = FastAPI()

# Include job recommendations router
app.include_router(job_recommendations_router)



class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    resume_data: Dict[str, Any]

class DocumentAnalysisRequest(BaseModel):
    job_description: str
    resume_data: Dict[str, Any]

@app.post("/analyze")
async def analyze_match(request: AnalysisRequest):
    try:
        print("=== ANALYSIS REQUEST ===")
        print("Resume text received:", request.resume_text[:500])
        print("Job description received:", request.job_description[:500])
        
        # Extract skills from resume and job
        resume_skills = extract_skills(request.resume_text)
        job_skills = extract_skills(request.job_description)
        
        # Extract additional information
        resume_sections = extract_resume_sections(request.resume_text)
        job_requirements = extract_job_requirements(request.job_description)
        
        print("=== SKILL EXTRACTION ===")
        print("Skills found in resume:", resume_skills)
        print("Skills found in job:", job_skills)
        
        # Calculate comprehensive scores
        skill_match = calculate_skill_match(resume_skills, job_skills)
        experience_match = calculate_experience_match(request.resume_text, request.job_description)
        keyword_density = calculate_keyword_density(request.resume_text, request.job_description)
        semantic_similarity = calculate_semantic_similarity(request.resume_text, request.job_description)
        
        print("=== SCORES ===")
        print("Skill match:", skill_match)
        print("Experience match:", experience_match)
        print("Keyword density:", keyword_density)
        print("Semantic similarity:", semantic_similarity)
        
        # Check for complete mismatch
        is_complete_mismatch = skill_match < 0.1 and experience_match < 0.1
        
        # Calculate overall score with weighted components
        overall_score = int((
            skill_match * 0.35 + 
            experience_match * 0.25 + 
            keyword_density * 0.20 + 
            semantic_similarity * 0.20
        ) * 100)
        
        # Check if score is too low
        is_low_score = overall_score < 50
        
        if is_complete_mismatch or is_low_score:
            message = "This position is not suitable for your current skill set." if is_complete_mismatch else "Your skills don't align well with this position."
            
            missing_skills = list(set(job_skills) - set(resume_skills))
            matching_skills = list(set(resume_skills) & set(job_skills))
            
            return {
                "overall_score": overall_score,
                "skill_match": int(skill_match * 100),
                "experience_match": int(experience_match * 100),
                "keyword_density": int(keyword_density * 100),
                "semantic_similarity": int(semantic_similarity * 100),
                "is_complete_mismatch": True,
                "mismatch_message": message,
                "required_skills": list(job_skills),
                "your_skills": list(resume_skills),
                "missing_skills": missing_skills,
                "matching_skills": matching_skills,
                "strengths": generate_strengths(resume_skills, job_skills, matching_skills),
                "improvements": generate_improvements(resume_skills, job_skills, missing_skills),
                "suggested_projects": generate_projects(job_skills, resume_skills),
                "resume_sections": resume_sections,
                "job_requirements": job_requirements
            }
        
        # Generate comprehensive recommendations
        strengths = generate_strengths(resume_skills, job_skills, matching_skills=list(set(resume_skills) & set(job_skills)))
        improvements = generate_improvements(resume_skills, job_skills, missing_skills=list(set(job_skills) - set(resume_skills)))
        projects = generate_projects(job_skills, resume_skills)
        
        return {
            "overall_score": overall_score,
            "skill_match": int(skill_match * 100),
            "experience_match": int(experience_match * 100),
            "keyword_density": int(keyword_density * 100),
            "semantic_similarity": int(semantic_similarity * 100),
            "is_complete_mismatch": False,
            "strengths": strengths,
            "improvements": improvements,
            "suggested_projects": projects,
            "resume_sections": resume_sections,
            "job_requirements": job_requirements
        }
    except Exception as e:
        print("=== ERROR ===")
        print("Error in analysis:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-document")
async def process_document(file: UploadFile = File(...)):
    """Process uploaded resume document (PDF/DOCX)"""
    try:
        content = await file.read()
        
        if file.filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(content)
        elif file.filename.lower().endswith(('.docx', '.doc')):
            text = extract_text_from_docx(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Extract structured data
        parsed_data = {
            "text": text,
            "sections": extract_resume_sections(text),
            "skills": extract_skills(text),
            "experience_years": extract_experience_years(text),
            "education": extract_education(text)
        }
        
        return {
            "filename": file.filename,
            "text": text,
            "parsed_data": parsed_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scrape-job")
async def scrape_job_description(job_url: str) -> Dict[str, Any]:
    """Scrape job description from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(job_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Extract text content
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return {
            "url": job_url,
            "description": text,
            "requirements": extract_job_requirements(text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape job description: {str(e)}")

def extract_text_from_pdf(content: bytes) -> str:
    """Extract text from PDF using PyMuPDF"""
    try:
        doc = fitz.open(stream=content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

def extract_text_from_docx(content: bytes) -> str:
    """Extract text from DOCX using python-docx"""
    try:
        doc = Document(io.BytesIO(content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise Exception(f"Failed to extract text from DOCX: {str(e)}")

def extract_resume_sections(text: str) -> Dict[str, str]:
    """Extract structured sections from resume"""
    sections = {
        "contact": "",
        "summary": "",
        "experience": "",
        "education": "",
        "skills": "",
        "certifications": ""
    }
    
    # Simple section detection based on common headers
    lines = text.split('\n')
    current_section = None
    
    for line in lines:
        line_lower = line.lower().strip()
        
        if any(keyword in line_lower for keyword in ['contact', 'email', 'phone']):
            current_section = 'contact'
        elif any(keyword in line_lower for keyword in ['summary', 'objective', 'profile']):
            current_section = 'summary'
        elif any(keyword in line_lower for keyword in ['experience', 'work history', 'employment']):
            current_section = 'experience'
        elif any(keyword in line_lower for keyword in ['education', 'academic']):
            current_section = 'education'
        elif any(keyword in line_lower for keyword in ['skills', 'technical skills']):
            current_section = 'skills'
        elif any(keyword in line_lower for keyword in ['certifications', 'certificates']):
            current_section = 'certifications'
        elif current_section and line.strip():
            sections[current_section] += line + "\n"
    
    return sections

def extract_job_requirements(text: str) -> Dict[str, Any]:
    """Extract job requirements and qualifications"""
    requirements = {
        "required_skills": [],
        "preferred_skills": [],
        "experience_level": "",
        "education_level": "",
        "responsibilities": []
    }
    
    # Extract experience level
    experience_patterns = [
        r'(\d+)\+?\s*years?\s*experience',
        r'experience\s*level:\s*(\w+)',
        r'(\d+)\+?\s*years?\s*in\s*\w+'
    ]
    
    for pattern in experience_patterns:
        match = re.search(pattern, text.lower())
        if match:
            requirements["experience_level"] = match.group(1)
            break
    
    # Extract education level
    education_patterns = [
        r'bachelor\'s?\s*degree',
        r'master\'s?\s*degree',
        r'phd',
        r'associate\'s?\s*degree'
    ]
    
    for pattern in education_patterns:
        if re.search(pattern, text.lower()):
            requirements["education_level"] = pattern.replace("\\'s?", "'s")
            break
    
    return requirements

def extract_experience_years(text: str) -> int:
    """Extract years of experience from resume"""
    patterns = [
        r'(\d+)\+?\s*years?\s*experience',
        r'(\d+)\+?\s*years?\s*in\s*\w+',
        r'experience:\s*(\d+)\+?\s*years?'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    return 0

def extract_education(text: str) -> List[str]:
    """Extract education information"""
    education = []
    lines = text.split('\n')
    
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in ['bachelor', 'master', 'phd', 'degree', 'university', 'college']):
            education.append(line.strip())
    
    return education



def calculate_skill_match(resume_skills: List[str], job_skills: List[str]) -> float:
    """Calculate skill match percentage"""
    if not job_skills:
        return 0.0
    
    matching_skills = set(resume_skills) & set(job_skills)
    return len(matching_skills) / len(job_skills) if job_skills else 0.0

def calculate_experience_match(resume_text: str, job_description: str) -> float:
    """Calculate experience relevance using TF-IDF"""
    if not resume_text or not job_description:
        return 0.0
    
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return similarity
    except:
        return 0.0

def calculate_keyword_density(resume_text: str, job_description: str) -> float:
    """Calculate keyword density"""
    if not resume_text or not job_description:
        return 0.0
    
    job_words = set(job_description.lower().split())
    resume_words = resume_text.lower().split()
    
    if not job_words:
        return 0.0
    
    matching_words = sum(1 for word in resume_words if word in job_words)
    return min(1.0, matching_words / len(resume_words)) if resume_words else 0.0

def generate_strengths(resume_skills: List[str], job_skills: List[str], matching_skills: List[str]) -> List[str]:
    """Generate strengths based on matching skills"""
    strengths = []
    
    if matching_skills:
        strengths.append(f"Strong technical skills in {', '.join(list(matching_skills)[:3])}")
    
    if len(resume_skills) > 5:
        strengths.append("Diverse skill set with multiple technologies")
    
    if len(matching_skills) > len(job_skills) * 0.7:
        strengths.append("Excellent alignment with job requirements")
    
    return strengths if strengths else ["Good technical foundation"]

def generate_improvements(resume_skills: List[str], job_skills: List[str], missing_skills: List[str]) -> List[str]:
    """Generate improvement suggestions"""
    improvements = []
    
    if missing_skills:
        improvements.append(f"Add missing skills: {', '.join(list(missing_skills)[:3])}")
    
    if len(resume_skills) < 3:
        improvements.append("Expand your technical skill set")
    
    if not resume_skills:
        improvements.append("Highlight technical skills in your resume")
    
    return improvements if improvements else ["Continue developing your technical skills"]

def generate_projects(job_skills: List[str], resume_skills: List[str]) -> List[Dict[str, str]]:
    """Generate project suggestions"""
    missing_skills = set(job_skills) - set(resume_skills)
    
    project_templates = {
        "web": {
            "title": "Full-Stack Web Application",
            "description": "Build a complete web app with frontend and backend",
            "skills": ["javascript", "react", "node.js", "mongodb"]
        },
        "api": {
            "title": "RESTful API Project",
            "description": "Create a scalable API with authentication and database",
            "skills": ["node.js", "express", "mongodb", "sql"]
        },
        "data": {
            "title": "Data Analysis Project",
            "description": "Build a data processing and visualization application",
            "skills": ["python", "machine learning", "data science"]
        }
    }
    
    suggestions = []
    for category, project in project_templates.items():
        if any(skill in missing_skills for skill in project["skills"]):
            suggestions.append({
                "title": project["title"],
                "description": project["description"],
                "relevance": f"Develops missing skills: {', '.join([s for s in project['skills'] if s in missing_skills])}"
            })
    
    return suggestions[:3] if suggestions else [{
        "title": "Portfolio Project",
        "description": "Build a comprehensive project showcasing your skills",
        "relevance": "Demonstrates practical experience"
    }]
