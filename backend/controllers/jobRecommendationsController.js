import axios from 'axios';
import * as jobScraper from '../services/jobScraper.js';
import * as aiService from '../services/aiService.js';

// In-memory storage for job recommendations (in a production app, this would be a database)
const jobRecommendationsMap = new Map();

/**
 * Get job recommendations based on a resume
 */
const getJobRecommendations = async (req, res) => {
  try {
    const { resumeId } = req.body;
    
    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' });
    }

    // Check if we already have recommendations for this resume
    if (jobRecommendationsMap.has(resumeId)) {
      return res.status(200).json({ 
        jobs: jobRecommendationsMap.get(resumeId)
      });
    }

    // Get resume data from in-memory storage (this would be from a database in production)
    const resumeData = global.resumeMap.get(resumeId);
    
    if (!resumeData) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Get job recommendations from AI service
    const recommendations = await getRecommendationsFromAI(resumeData.text, resumeData.data);
    
    // Store recommendations in memory
    jobRecommendationsMap.set(resumeId, recommendations);

    return res.status(200).json({ 
      jobs: recommendations
    });
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    return res.status(500).json({ 
      error: 'Failed to get job recommendations',
      details: error.message 
    });
  }
};

/**
 * Get job recommendations from AI service
 */
async function getRecommendationsFromAI(resumeText, resumeData) {
  try {
    // Call AI service to get job recommendations
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.post(`${aiServiceUrl}/job-recommendations`, {
      resumeText,
      resumeData
    });

    return response.data.recommendations;
  } catch (error) {
    console.error('Error calling AI service for job recommendations:', error);
    
    // Return mock data for demonstration purposes
    return getMockJobRecommendations();
  }
}

/**
 * Generate mock job recommendations for demonstration purposes
 */
function getMockJobRecommendations() {
  return [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      description: 'We are looking for a Senior Frontend Developer with experience in React, TypeScript, and modern web technologies to join our team.',
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux'],
      experience: '3-5 years',
      jobType: 'Full-time',
      matchPercentage: 85,
      matchingSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
      missingSkills: ['Redux', 'TypeScript'],
      url: 'https://example.com/job/1',
      source: 'LinkedIn',
      postedDate: '2023-05-15'
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'InnovateSoft',
      location: 'New York, NY',
      description: 'Join our team as a Full Stack Developer working on cutting-edge web applications using React, Node.js, and MongoDB.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
      experience: '2-4 years',
      jobType: 'Full-time',
      matchPercentage: 78,
      matchingSkills: ['React', 'JavaScript', 'Node.js'],
      missingSkills: ['MongoDB', 'Express'],
      url: 'https://example.com/job/2',
      source: 'Indeed',
      postedDate: '2023-05-18'
    },
    {
      id: '3',
      title: 'React Native Developer',
      company: 'MobileApps Inc',
      location: 'San Francisco, CA',
      description: 'Develop cross-platform mobile applications using React Native. Experience with iOS and Android development is a plus.',
      skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Redux'],
      experience: '2+ years',
      jobType: 'Contract',
      matchPercentage: 72,
      matchingSkills: ['JavaScript', 'React Native'],
      missingSkills: ['iOS', 'Android', 'Redux'],
      url: 'https://example.com/job/3',
      source: 'Glassdoor',
      postedDate: '2023-05-20'
    },
    {
      id: '4',
      title: 'Frontend Engineering Intern',
      company: 'StartupXYZ',
      location: 'Remote',
      description: 'Join our engineering team as an intern to work on our web application using React and modern JavaScript.',
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      experience: '0-1 years',
      jobType: 'Internship',
      matchPercentage: 68,
      matchingSkills: ['HTML', 'CSS', 'JavaScript'],
      missingSkills: ['React'],
      url: 'https://example.com/job/4',
      source: 'Internshala',
      postedDate: '2023-05-22'
    },
    {
      id: '5',
      title: 'UI/UX Developer',
      company: 'DesignStudio',
      location: 'Chicago, IL',
      description: 'We are looking for a UI/UX Developer who can translate designs into functional web interfaces using modern frontend technologies.',
      skills: ['HTML', 'CSS', 'JavaScript', 'Figma', 'UI/UX', 'SASS'],
      experience: '1-3 years',
      jobType: 'Full-time',
      matchPercentage: 65,
      matchingSkills: ['HTML', 'CSS', 'JavaScript'],
      missingSkills: ['Figma', 'UI/UX', 'SASS'],
      url: 'https://example.com/job/5',
      source: 'Indeed',
      postedDate: '2023-05-17'
    },
    {
      id: '6',
      title: 'Backend Developer',
      company: 'ServerTech',
      location: 'Austin, TX',
      description: 'Develop and maintain server-side applications using Node.js, Express, and MongoDB.',
      skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'GraphQL'],
      experience: '2-5 years',
      jobType: 'Full-time',
      matchPercentage: 55,
      matchingSkills: ['Node.js', 'REST API'],
      missingSkills: ['Express', 'MongoDB', 'GraphQL'],
      url: 'https://example.com/job/6',
      source: 'LinkedIn',
      postedDate: '2023-05-19'
    },
    {
      id: '7',
      title: 'DevOps Engineer',
      company: 'CloudSystems',
      location: 'Remote',
      description: 'Join our DevOps team to build and maintain our cloud infrastructure using AWS, Docker, and Kubernetes.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      experience: '3+ years',
      jobType: 'Full-time',
      matchPercentage: 45,
      matchingSkills: ['Docker', 'CI/CD'],
      missingSkills: ['AWS', 'Kubernetes', 'Terraform'],
      url: 'https://example.com/job/7',
      source: 'AngelList',
      postedDate: '2023-05-16'
    },
    {
      id: '8',
      title: 'Data Scientist',
      company: 'DataInsights',
      location: 'Boston, MA',
      description: 'Work with large datasets to extract insights and build machine learning models to solve business problems.',
      skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'TensorFlow'],
      experience: '2-4 years',
      jobType: 'Full-time',
      matchPercentage: 40,
      matchingSkills: ['Python', 'SQL'],
      missingSkills: ['Machine Learning', 'Data Analysis', 'TensorFlow'],
      url: 'https://example.com/job/8',
      source: 'Glassdoor',
      postedDate: '2023-05-21'
    }
  ];
}

export { getJobRecommendations };