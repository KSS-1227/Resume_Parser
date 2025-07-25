import re
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Load sentence transformer model for semantic similarity
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except:
    model = None

def extract_skills(text: str) -> List[str]:
    """Extract skills from text using a comprehensive skill database"""
    if not text or not text.strip():
        return []
    
    # Convert to lowercase for matching
    text_lower = text.lower()
    
    # A comprehensive set of skills from various fields
    skills_db = [
        # Programming Languages
        "JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin", "TypeScript",
        "Scala", "Perl", "R", "MATLAB", "Assembly", "COBOL", "Fortran", "Lisp", "Prolog", "Haskell",
        
        # Web Technologies
        "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "ASP.NET",
        "Ruby on Rails", "Laravel", "Spring Boot", "JSP", "Servlet", "JSTL", "Thymeleaf", "Handlebars",
        "EJS", "Pug", "SASS", "LESS", "Stylus", "Bootstrap", "Tailwind CSS", "Material-UI", "Ant Design",
        
        # Databases
        "SQL", "MySQL", "PostgreSQL", "Oracle", "SQL Server", "SQLite", "MongoDB", "Redis", "Cassandra",
        "DynamoDB", "Firebase", "Supabase", "CouchDB", "Neo4j", "InfluxDB", "Elasticsearch",
        
        # Cloud & DevOps
        "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
        "Terraform", "Ansible", "Chef", "Puppet", "Vagrant",
        
        # Mobile Development
        "React Native", "Flutter", "Xamarin", "Ionic", "Cordova", "PhoneGap", "iOS", "Android",
        "Swift", "Kotlin", "Objective-C", "Java", "Xcode", "Android Studio",
        
        # Data Science & ML
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Pandas",
        "NumPy", "Matplotlib", "Seaborn", "Plotly", "Jupyter", "R", "SAS", "SPSS", "Tableau", "Power BI",
        
        # Design & UX
        "Figma", "Adobe XD", "Sketch", "InVision", "Framer", "Adobe Photoshop", "Adobe Illustrator",
        "Adobe InDesign", "UI/UX", "User Research", "Wireframing", "Prototyping", "Design Systems",
        
        # Testing
        "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Playwright", "Puppeteer", "JUnit", "TestNG",
        "PyTest", "Unit Testing", "Integration Testing", "E2E Testing", "TDD", "BDD",
        
        # Version Control
        "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "Mercurial",
        
        # Project Management
        "Agile", "Scrum", "Kanban", "Jira", "Confluence", "Trello", "Asana", "Monday.com", "Notion",
        
        # Communication & Collaboration
        "Slack", "Microsoft Teams", "Discord", "Zoom", "Google Meet", "Webex", "Skype",
        
        # Documentation
        "Swagger", "OpenAPI", "Postman", "Insomnia", "API Documentation", "Technical Writing",
        
        # Security
        "OAuth", "JWT", "SSL/TLS", "HTTPS", "Penetration Testing", "Security Auditing", "OWASP",
        
        # Performance & Monitoring
        "New Relic", "Datadog", "Sentry", "LogRocket", "Google Analytics", "Mixpanel", "Amplitude",
        
        # Business Skills
        "Project Management", "Product Management", "Business Analysis", "Requirements Gathering",
        "Stakeholder Management", "Risk Management", "Budget Management", "Team Leadership",
        
        # Soft Skills
        "Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management",
        "Leadership", "Adaptability", "Creativity", "Emotional Intelligence", "Conflict Resolution",
        
        # Industry Knowledge
        "E-commerce", "FinTech", "HealthTech", "EdTech", "SaaS", "B2B", "B2C", "Marketplace",
        "Social Media", "Content Management", "CRM", "ERP", "HRIS", "Accounting Software",
        
        # Methodologies
        "REST API", "GraphQL", "Microservices", "Serverless", "Event-Driven Architecture",
        "Domain-Driven Design", "Clean Architecture", "SOLID Principles", "Design Patterns",
        
        # Tools & Platforms
        "VS Code", "IntelliJ IDEA", "Eclipse", "Sublime Text", "Atom", "Vim", "Emacs",
        "Postman", "Insomnia", "Swagger", "Figma", "Slack", "Trello", "Jira", "Confluence"
    ]
    
    found_skills = []
    
    # Improved skill matching algorithm with better precision
    for skill in skills_db:
        skill_lower = skill.lower()
        
        # Method 1: Check for word boundaries (most precise)
        if re.search(r'\b' + re.escape(skill_lower) + r'\b', text_lower):
            found_skills.append(skill)
            continue
            
        # Method 2: Check for skill as a substring (for multi-word skills only)
        if ' ' in skill_lower:  # Only for multi-word skills like "Machine Learning"
            if skill_lower in text_lower:
                found_skills.append(skill)
                continue
                
        # Method 3: Check for common variations (only for multi-word skills)
        if ' ' in skill_lower:
            variations = [
                skill_lower.replace(' ', ''),  # "Machine Learning" -> "machinelearning"
                skill_lower.replace(' ', '-'),  # "Machine Learning" -> "machine-learning"
                skill_lower.replace(' ', '_'),  # "Machine Learning" -> "machine_learning"
            ]
            
            for variation in variations:
                if variation in text_lower:
                    found_skills.append(skill)
                    break
    
    # Remove duplicates while preserving order
    unique_skills = []
    for skill in found_skills:
        if skill not in unique_skills:
            unique_skills.append(skill)
    
    # Debug logging
    print(f"Text length: {len(text)}")
    print(f"Text preview: {text[:200]}...")
    print(f"Found skills: {unique_skills}")
    
    # Additional debugging for problematic skills
    problematic_skills = ["C#", "Go", "R"]
    for skill in problematic_skills:
        if skill in unique_skills:
            print(f"⚠️  WARNING: {skill} detected in text. Checking why...")
            skill_lower = skill.lower()
            if re.search(r'\b' + re.escape(skill_lower) + r'\b', text_lower):
                print(f"   ✓ {skill} found with word boundaries")
            elif skill_lower in text_lower:
                print(f"   ⚠️  {skill} found as substring - this might be a false positive")
                # Show the context around the match
                import re
                matches = re.finditer(re.escape(skill_lower), text_lower)
                for match in matches:
                    start = max(0, match.start() - 20)
                    end = min(len(text), match.end() + 20)
                    context = text[start:end]
                    print(f"      Context: ...{context}...")
            else:
                print(f"   ❓ {skill} in results but not found in text - this is a bug")
    
    return unique_skills

def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """Calculate semantic similarity between two texts using sentence transformers"""
    if model is None:
        # Fallback to simple text similarity if model is not available
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return len(intersection) / len(union) if union else 0
    
    try:
        # Encode texts to embeddings
        embeddings1 = model.encode([text1])
        embeddings2 = model.encode([text2])
        
        # Calculate cosine similarity
        from sklearn.metrics.pairwise import cosine_similarity
        similarity = cosine_similarity(embeddings1, embeddings2)[0][0]
        return float(similarity)
    except Exception as e:
        print(f"Error calculating semantic similarity: {e}")
        # Fallback to simple text similarity
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return len(intersection) / len(union) if union else 0