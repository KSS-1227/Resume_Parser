
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Link, FileText, TrendingUp, Star, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DetailedAnalysis from "@/components/DetailedAnalysis";

// Add types for analysis result and suggested projects
interface SuggestedProject {
  title: string;
  description: string;
  relevance: string;
}

interface AnalysisResult {
  overall_score?: number;
  skill_match?: number;
  experience_match?: number;
  keyword_density?: number;
  is_complete_mismatch?: boolean;
  mismatch_message?: string;
  required_skills?: string[];
  your_skills?: string[];
  strengths?: string[];
  improvements?: string[];
  suggested_projects?: SuggestedProject[];
  missing_skills?: string[];
  matching_skills?: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashboard = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [useManualDescription, setUseManualDescription] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      toast({
        title: "Resume uploaded successfully",
        description: `${file.name} is ready for analysis`,
      });
    }
  };

  const handleAnalysis = async () => {
    if (!resumeFile) {
      toast({
        title: "No resume uploaded",
        description: "Please upload a resume first",
        variant: "destructive",
      });
      return;
    }

    if (!useManualDescription && !jobUrl.trim()) {
      toast({
        title: "Missing job information",
        description: "Please provide either a job URL or manual description",
        variant: "destructive",
      });
      return;
    }

    if (useManualDescription && !jobDescription.trim()) {
      toast({
        title: "Missing job description",
        description: "Please provide a job description",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log("Starting analysis with API URL:", API_BASE_URL);
      
      // Upload resume
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      console.log("Uploading resume to:", `${API_BASE_URL}/api/resume/upload`);
      
      const uploadRes = await fetch(`${API_BASE_URL}/api/resume/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error("Upload failed:", uploadRes.status, errorText);
        throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
      }
      
      const uploadData = await uploadRes.json();
      console.log("Upload response:", uploadData);
      const { resumeId } = uploadData;

      // Analyze resume
      console.log("Starting analysis for resumeId:", resumeId);
      
      const analysisRes = await fetch(`${API_BASE_URL}/api/analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resumeId, 
          jobUrl: useManualDescription ? "" : jobUrl,
          jobDescription: useManualDescription ? jobDescription : ""
        }),
      });
      
      if (!analysisRes.ok) {
        const errorText = await analysisRes.text();
        console.error("Analysis failed:", analysisRes.status, errorText);
        throw new Error(`Analysis failed: ${analysisRes.status} ${errorText}`);
      }
        
      const analysisData = await analysisRes.json();
      console.log("Analysis response:", analysisData);
      
      // Set the dynamic results
      setAnalysisResult(analysisData.results || {});
      
      // Show appropriate success message based on score
      const score = analysisData.results?.overall_score || 0;
      let message = "Your resume has been analyzed successfully";
      
      if (score >= 70) {
        message = "Great match! Your skills align well with this position.";
      } else if (score >= 50) {
        message = "Fair match. Consider improving some skills to increase your chances.";
      } else {
        message = "Low match. Focus on developing the missing skills for this position.";
      }
      
      toast({
        title: "Analysis complete!",
        description: message,
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      // More specific error messages
      let errorMessage = "There was an error analyzing your resume.";
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = "Cannot connect to the backend server. Make sure the backend is running on http://localhost:3000";
      } else if (error.message.includes('Upload failed')) {
        errorMessage = "Failed to upload resume. Please try again.";
      } else if (error.message.includes('Analysis failed')) {
        errorMessage = "Failed to analyze resume. Please try again.";
      }
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Analysis Dashboard</h1>
            <p className="text-gray-600 mt-1">Upload your resume and job link to get AI-powered insights</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.href = "/job-recommendations"}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Find Best Opportunities
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Upload your resume in PDF or Word format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="resume-upload" className="cursor-pointer">
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <Input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </Label>
                </div>
                {resumeFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {resumeFile.name}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Job/Internship Details
              </CardTitle>
              <CardDescription>
                Choose how to provide job information - either paste a URL or enter the job description manually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Toggle between URL and Manual Description */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={!useManualDescription ? "default" : "outline"}
                    onClick={() => setUseManualDescription(false)}
                    className="flex-1"
                  >
                    Job URL
                  </Button>
                  <Button
                    type="button"
                    variant={useManualDescription ? "default" : "outline"}
                    onClick={() => setUseManualDescription(true)}
                    className="flex-1"
                  >
                    Manual Description
                  </Button>
                </div>

                {/* Job URL Input */}
                {!useManualDescription && (
                  <div>
                    <Label htmlFor="job-url">Job URL</Label>
                    <Input
                      id="job-url"
                      type="url"
                      placeholder="https://linkedin.com/jobs/..."
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste the link to the job posting. We'll automatically extract the job description.
                    </p>
                  </div>
                )}

                {/* Manual Job Description Input */}
                {useManualDescription && (
                  <div>
                    <Label htmlFor="job-description">Job Description</Label>
                    <textarea
                      id="job-description"
                      className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md resize-vertical"
                      placeholder="Paste the job description here... Include requirements, responsibilities, and any skills mentioned."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Copy and paste the job description from the job posting. Include all requirements and responsibilities.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleAnalysis} 
                  className="w-full" 
                  disabled={!resumeFile || (!jobUrl && !jobDescription) || isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Match"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <DetailedAnalysis result={analysisResult} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;



