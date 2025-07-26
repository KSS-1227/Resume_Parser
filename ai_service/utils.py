import re
from typing import List

def extract_skills(text: str) -> List[str]:
    """Extract skills from text with improved detection."""
    if not text:
        return []
    
    text_lower = text.lower()
    detected_skills = []
    
    # Enhanced skills database
    skills_patterns = {
        # Programming Languages
        r'\b(python|py)\b': 'Python',
        r'\b(javascript|js)\b': 'JavaScript',
        r'\b(typescript|ts)\b': 'TypeScript',
        r'\b(java)\b(?!\s*script)': 'Java',
        r'\b(c\+\+|cpp)\b': 'C++',
        r'\b(c#|csharp)\b': 'C#',
        r'\b(php)\b': 'PHP',
        r'\b(ruby)\b': 'Ruby',
        r'\b(go|golang)\b': 'Go',
        r'\b(rust)\b': 'Rust',
        r'\b(swift)\b': 'Swift',
        r'\b(kotlin)\b': 'Kotlin',
        
        # Web Technologies
        r'\b(html5?)\b': 'HTML',
        r'\b(css3?)\b': 'CSS',
        r'\b(react\.?js|reactjs|react)\b': 'React',
        r'\b(angular)\b': 'Angular',
        r'\b(vue\.?js|vuejs|vue)\b': 'Vue.js',
        r'\b(node\.?js|nodejs)\b': 'Node.js',
        r'\b(express\.?js|express)\b': 'Express.js',
        r'\b(django)\b': 'Django',
        r'\b(flask)\b': 'Flask',
        r'\b(spring)\b': 'Spring',
        r'\b(laravel)\b': 'Laravel',
        r'\b(jquery)\b': 'jQuery',
        r'\b(bootstrap)\b': 'Bootstrap',
        r'\b(tailwind)\b': 'Tailwind CSS',
        
        # Databases
        r'\b(mysql)\b': 'MySQL',
        r'\b(postgresql|postgres)\b': 'PostgreSQL',
        r'\b(mongodb|mongo)\b': 'MongoDB',
        r'\b(redis)\b': 'Redis',
        r'\b(sqlite)\b': 'SQLite',
        r'\b(oracle)\b': 'Oracle',
        r'\b(sql\s+server)\b': 'SQL Server',
        
        # Cloud & DevOps
        r'\b(aws|amazon\s+web\s+services)\b': 'AWS',
        r'\b(azure|microsoft\s+azure)\b': 'Azure',
        r'\b(gcp|google\s+cloud)\b': 'Google Cloud',
        r'\b(docker)\b': 'Docker',
        r'\b(kubernetes|k8s)\b': 'Kubernetes',
        r'\b(jenkins)\b': 'Jenkins',
        r'\b(git)\b': 'Git',
        r'\b(github)\b': 'GitHub',
        r'\b(gitlab)\b': 'GitLab',
        
        # Tools & Frameworks
        r'\b(rest\s+api|restful)\b': 'REST API',
        r'\b(graphql)\b': 'GraphQL',
        r'\b(api)\b': 'API Development',
        r'\b(microservices)\b': 'Microservices',
        r'\b(agile)\b': 'Agile',
        r'\b(scrum)\b': 'Scrum',
        r'\b(ci/cd)\b': 'CI/CD',
        
        # Soft Skills
        r'\b(leadership)\b': 'Leadership',
        r'\b(teamwork|team\s+work)\b': 'Teamwork',
        r'\b(communication)\b': 'Communication',
        r'\b(problem\s+solving)\b': 'Problem Solving',
        r'\b(project\s+management)\b': 'Project Management',
    }
    
    for pattern, skill in skills_patterns.items():
        if re.search(pattern, text_lower):
            detected_skills.append(skill)
    
    return list(set(detected_skills))

def extract_job_requirements(job_text: str) -> List[str]:
    """Extract job requirements with enhanced detection."""
    if not job_text:
        return []
    
    # Look for requirement sections
    requirement_patterns = [
        r'requirements?:?\s*(.*?)(?=\n\n|\n[A-Z]|$)',
        r'qualifications?:?\s*(.*?)(?=\n\n|\n[A-Z]|$)',
        r'skills?:?\s*(.*?)(?=\n\n|\n[A-Z]|$)',
        r'experience:?\s*(.*?)(?=\n\n|\n[A-Z]|$)',
        r'must have:?\s*(.*?)(?=\n\n|\n[A-Z]|$)',
        r'required:?\s*(.*?)(?=\n\n|\n[A-Z]|$)',
    ]
    
    requirements_text = ""
    for pattern in requirement_patterns:
        matches = re.findall(pattern, job_text, re.IGNORECASE | re.DOTALL)
        requirements_text += " ".join(matches) + " "
    
    # If no specific sections found, use the whole text
    if not requirements_text.strip():
        requirements_text = job_text
    
    return extract_skills(requirements_text)

def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """Calculate semantic similarity between two texts."""
    # Simple implementation - can be enhanced with sentence transformers
    if not text1 or not text2:
        return 0.0
    
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    if not union:
        return 0.0
    
    return len(intersection) / len(union)