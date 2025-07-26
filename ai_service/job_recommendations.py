from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import random
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import re

# Import functions from main.py
from main import extract_skills, calculate_semantic_similarity

router = APIRouter()

class JobRecommendationRequest(BaseModel):
    resumeText: str
    resumeData: Dict[str, Any]

class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    skills: List[str]
    experience: str
    jobType: str
    matchPercentage: float
    matchingSkills: List[str]
    missingSkills: List[str]
    url: str
    source: str
    postedDate: str

class JobRecommendationResponse(BaseModel):
    recommendations: List[JobListing]

@router.post("/job-recommendations", response_model=JobRecommendationResponse)
async def get_job_recommendations(request: JobRecommendationRequest):
    try:
        # Extract skills from resume
        resume_skills = extract_skills(request.resumeText)
        
        # In a real implementation, we would:
        # 1. Scrape job listings from multiple sources
        # 2. Calculate match percentages based on skills and experience
        # 3. Return the best matches
        
        # For now, we'll return mock data
        mock_jobs = generate_mock_jobs(resume_skills)
        
        return {"recommendations": mock_jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating job recommendations: {str(e)}")

def generate_mock_jobs(resume_skills: List[str]) -> List[JobListing]:
    """Generate mock job listings for demonstration purposes"""
    # Job sources
    sources = ["LinkedIn", "Indeed", "Glassdoor", "AngelList", "Internshala", "Naukri", "Cutshort"]
    
    # Job types
    job_types = ["Full-time", "Part-time", "Contract", "Internship"]
    
    # Locations
    locations = ["Remote", "New York, NY", "San Francisco, CA", "Bangalore, India", "London, UK", "Berlin, Germany"]
    
    # Experience levels
    experience_levels = ["0-1 years", "1-3 years", "2-4 years", "3-5 years", "5+ years"]
    
    # Common skills by category
    skill_categories = {
        "frontend": ["React", "Angular", "Vue.js", "JavaScript", "TypeScript", "HTML", "CSS", "SASS", "Redux", "Webpack"],
        "backend": ["Node.js", "Express", "Django", "Flask", "Ruby on Rails", "Spring Boot", "ASP.NET", "PHP"],
        "database": ["MongoDB", "PostgreSQL", "MySQL", "SQL Server", "Oracle", "Redis", "Elasticsearch"],
        "devops": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "Terraform"],
        "mobile": ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin"],
        "data": ["Python", "R", "Machine Learning", "Data Analysis", "TensorFlow", "PyTorch", "Pandas", "NumPy"],
        "design": ["Figma", "Adobe XD", "Sketch", "UI/UX", "Photoshop", "Illustrator"],
        "soft": ["Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management"]
    }
    
    # Job titles by category
    job_titles = {
        "frontend": ["Frontend Developer", "UI Developer", "React Developer", "JavaScript Engineer"],
        "backend": ["Backend Developer", "API Developer", "Node.js Developer", "Python Developer"],
        "fullstack": ["Full Stack Developer", "Software Engineer", "Web Developer", "MERN Stack Developer"],
        "mobile": ["Mobile Developer", "iOS Developer", "Android Developer", "React Native Developer"],
        "data": ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "AI Researcher"],
        "devops": ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer", "Infrastructure Engineer"],
        "design": ["UI/UX Designer", "Product Designer", "Web Designer", "Graphic Designer"]
    }
    
    # Companies
    companies = ["TechCorp", "InnovateSoft", "DataInsights", "MobileApps Inc", "CloudSystems", "DesignStudio", "StartupXYZ", "ServerTech"]
    
    # Generate random dates within the last month
    def random_date():
        days_ago = random.randint(1, 30)
        date = datetime.now() - timedelta(days=days_ago)
        return date.strftime("%Y-%m-%d")
    
    # Determine the user's primary skill category based on resume skills
    user_skill_categories = []
    for category, skills in skill_categories.items():
        if any(skill.lower() in [s.lower() for s in resume_skills] for skill in skills):
            user_skill_categories.append(category)
    
    # If no clear category, default to fullstack
    if not user_skill_categories:
        user_skill_categories = ["fullstack"]
    
    # Generate jobs
    jobs = []
    for i in range(10):  # Generate 10 mock jobs
        # Select a random category from user's skill categories
        category = random.choice(user_skill_categories)
        
        # For variety, occasionally use a different category
        if random.random() < 0.3:
            category = random.choice(list(job_titles.keys()))
        
        # Select job title based on category
        title = random.choice(job_titles.get(category, job_titles["fullstack"]))
        
        # Add seniority level to some job titles
        if random.random() < 0.7:
            seniority = random.choice(["Junior ", "Senior ", "Lead ", "Principal ", ""])
            title = seniority + title
        
        # Generate required skills based on category
        required_skills = random.sample(skill_categories.get(category, []) + skill_categories["soft"], 
                                      min(random.randint(4, 8), len(skill_categories.get(category, []) + skill_categories["soft"])))
        
        # Calculate matching and missing skills
        matching_skills = [skill for skill in required_skills if skill.lower() in [s.lower() for s in resume_skills]]
        missing_skills = [skill for skill in required_skills if skill.lower() not in [s.lower() for s in resume_skills]]
        
        # Calculate match percentage
        match_percentage = round((len(matching_skills) / len(required_skills)) * 100) if required_skills else 0
        
        # Add some randomness to match percentage
        match_percentage = min(100, max(0, match_percentage + random.randint(-10, 10)))
        
        # Generate job description
        description = f"We are looking for a {title} to join our team. "
        description += f"The ideal candidate will have experience with {', '.join(required_skills[:-1])} and {required_skills[-1] if required_skills else ''}. "
        description += "You will be responsible for developing and maintaining our applications, collaborating with cross-functional teams, and ensuring high-quality code."
        
        # Create job listing
        job = {
            "id": str(i + 1),
            "title": title,
            "company": random.choice(companies),
            "location": random.choice(locations),
            "description": description,
            "skills": required_skills,
            "experience": random.choice(experience_levels),
            "jobType": random.choice(job_types),
            "matchPercentage": match_percentage,
            "matchingSkills": matching_skills,
            "missingSkills": missing_skills,
            "url": f"https://example.com/job/{i+1}",
            "source": random.choice(sources),
            "postedDate": random_date()
        }
        
        jobs.append(job)
    
    # Sort by match percentage (highest first)
    jobs.sort(key=lambda x: x["matchPercentage"], reverse=True)
    
    return jobs

# In a real implementation, we would add functions to scrape job listings from various sources
def scrape_linkedin_jobs(keywords, location):
    """Scrape job listings from LinkedIn"""
    # Implementation would go here
    pass

def scrape_indeed_jobs(keywords, location):
    """Scrape job listings from Indeed"""
    # Implementation would go here
    pass

def scrape_naukri_jobs(keywords, location):
    """Scrape job listings from Naukri"""
    # Implementation would go here
    pass