import Analysis from "../models/Analysis.js";
import Resume from "../models/Resume.js";
import { analyzeResume } from "../services/aiService.js";
import { scrapeJobDescription } from "../services/jobScraper.js";

export async function startAnalysis(req, res) {
  try {
    const { resumeId, jobUrl, jobDescription } = req.body;

    // Get resume data from in-memory storage
    const resume = global.resumes.get(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    let jobDescriptionText = "";

    // If manual description is provided, use it
    if (jobDescription && jobDescription.trim()) {
      console.log("Using manual job description");
      jobDescriptionText = jobDescription;
    } else if (jobUrl && jobUrl.trim()) {
      // Otherwise scrape job description from URL
      console.log("Scraping job description from URL:", jobUrl);
      jobDescriptionText = await scrapeJobDescription(jobUrl);
    } else {
      return res
        .status(400)
        .json({ error: "Either job URL or job description must be provided" });
    }

    console.log("Job description length:", jobDescriptionText.length);
    console.log(
      "Job description preview:",
      jobDescriptionText.substring(0, 200)
    );

    // Debug resume text
    console.log("=== RESUME TEXT DEBUG ===");
    console.log("Resume text length:", resume.resumeText.length);
    console.log("Resume text preview:", resume.resumeText.substring(0, 300));
    console.log("Resume filename:", resume.filename);

    // Call Python AI service with real data
    const aiResult = await analyzeResume(
      resume.resumeText, // Real parsed resume text
      jobDescriptionText, // Scraped or manual job description
      resume.parsedData || {}
    );

    const analysisId = Date.now().toString();
    global.analyses.set(analysisId, {
      id: analysisId,
      resumeId,
      jobData: { url: jobUrl, description: jobDescriptionText },
      results: aiResult,
      status: "completed",
    });

    res.json({
      analysisId,
      status: "completed",
      results: aiResult,
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function getAnalysis(req, res) {
  try {
    const analysis = global.analyses.get(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }
    res.json({
      status: analysis.status,
      results: analysis.results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
