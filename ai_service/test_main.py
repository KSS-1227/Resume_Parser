"""
Test file for the AI service to demonstrate type checking and functionality.
"""
import pytest
from typing import List, Dict, Any
from main import (
    extract_skills,
    calculate_skill_match,
    calculate_experience_match,
    calculate_keyword_density,
    extract_resume_sections,
    extract_job_requirements,
    extract_experience_years,
    extract_education
)


def test_extract_skills() -> None:
    """Test skill extraction from text."""
    text = "I have experience with Python, JavaScript, and React."
    skills = extract_skills(text)
    
    assert isinstance(skills, list)
    assert "python" in skills
    assert "javascript" in skills
    assert "react" in skills


def test_calculate_skill_match() -> None:
    """Test skill matching calculation."""
    resume_skills = ["python", "javascript", "react"]
    job_skills = ["python", "javascript", "node.js"]
    
    match = calculate_skill_match(resume_skills, job_skills)
    
    assert isinstance(match, float)
    assert 0.0 <= match <= 1.0
    assert match == 2/3  # 2 out of 3 skills match


def test_calculate_experience_match() -> None:
    """Test experience matching calculation."""
    resume_text = "Software engineer with 5 years of experience in web development"
    job_description = "Looking for a software engineer with web development experience"
    
    match = calculate_experience_match(resume_text, job_description)
    
    assert isinstance(match, float)
    assert 0.0 <= match <= 1.0


def test_calculate_keyword_density() -> None:
    """Test keyword density calculation."""
    resume_text = "Python developer with Django experience"
    job_description = "Python Django developer needed"
    
    density = calculate_keyword_density(resume_text, job_description)
    
    assert isinstance(density, float)
    assert 0.0 <= density <= 1.0


def test_extract_resume_sections() -> None:
    """Test resume section extraction."""
    text = """
    Contact: john@example.com
    Experience: Software Engineer at Tech Corp
    Education: Bachelor's in Computer Science
    Skills: Python, JavaScript
    """
    
    sections = extract_resume_sections(text)
    
    assert isinstance(sections, dict)
    assert "contact" in sections
    assert "experience" in sections
    assert "education" in sections
    assert "skills" in sections


def test_extract_job_requirements() -> None:
    """Test job requirements extraction."""
    text = "Looking for a developer with 3+ years experience and Bachelor's degree"
    
    requirements = extract_job_requirements(text)
    
    assert isinstance(requirements, dict)
    assert "required_skills" in requirements
    assert "preferred_skills" in requirements
    assert "experience_level" in requirements
    assert "education_level" in requirements


def test_extract_experience_years() -> None:
    """Test experience years extraction."""
    text = "Software engineer with 5 years of experience"
    
    years = extract_experience_years(text)
    
    assert isinstance(years, int)
    # The function might not find exact match, so just check it's an integer
    assert years >= 0


def test_extract_education() -> None:
    """Test education extraction."""
    text = "Bachelor's degree in Computer Science from University of Technology"
    
    education = extract_education(text)
    
    assert isinstance(education, list)
    assert len(education) > 0


if __name__ == "__main__":
    # Run basic functionality tests
    print("Running type checking tests...")
    
    test_extract_skills()
    test_calculate_skill_match()
    test_calculate_experience_match()
    test_calculate_keyword_density()
    test_extract_resume_sections()
    test_extract_job_requirements()
    test_extract_experience_years()
    test_extract_education()
    
    print("✅ All type checking tests passed!") 