import axios from "axios";

export async function analyzeResume(resumeText, jobDescription, resumeData) {
  try {
    const response = await axios.post(process.env.AI_SERVICE_URL + "/analyze", {
      resume_text: resumeText,
      job_description: jobDescription,
      resume_data: resumeData,
    });
    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error("Failed to analyze resume");
  }
}
