import axios from "axios";

export async function analyzeResume(resumeText, jobDescription, resumeData) {
  try {
    // Use Railway URL for AI service or fallback to localhost
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
    const response = await axios.post(aiServiceUrl + "/analyze", {
      resume_text: resumeText,
      job_description: jobDescription,
      resume_data: resumeData,
    });
    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    // Return mock data if AI service is unavailable
    return {
      overall_score: 65,
      skill_match: 70,
      experience_match: 60,
      keyword_density: 65,
      strengths: ["Good technical foundation", "Relevant experience"],
      improvements: ["Add more specific skills", "Include more projects"],
      suggested_projects: [
        {
          title: "Portfolio Project",
          description: "Build a comprehensive project showcasing your skills",
          relevance: "Demonstrates practical experience",
        },
      ],
    };
  }
}
