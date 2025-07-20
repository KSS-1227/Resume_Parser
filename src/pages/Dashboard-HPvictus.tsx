
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Link, FileText, TrendingUp, Star, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeResumeForJob, extractJobRequirements, JobRequirement } from "@/services/jobAnalyzer";
import { scrapeJobPosting } from "@/services/webScraper";
import DetailedAnalysis from "@/components/DetailedAnalysis";
import JobInfo from "@/components/JobInfo";

const Dashboard = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    overallScore: number;
    skillMatch: number;
    experienceMatch: number;
    keywordDensity: number;
    strengths: string[];
    improvements: string[];
    suggestedProjects: Array<{
      title: string;
      description: string;
      relevance: string;
    }>;
    detailedAnalysis: {
      matchedSkills: string[];
      missingSkills: string[];
      experienceGap: string[];
    };
  } | null>(null);
  const [jobRequirements, setJobRequirements] = useState<JobRequirement[]>([]);
  const [jobData, setJobData] = useState<{
    title: string;
    company: string;
    requirements: string[];
    description: string;
    location: string;
  } | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
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
    if (!resumeFile || !jobUrl) {
      toast({
        title: "Missing information",
        description: "Please upload your resume and provide a job URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Scrape job data first
      const scrapedJobData = await scrapeJobPosting(jobUrl);
      setJobData(scrapedJobData);
      
      // Extract job requirements
      const requirements = await extractJobRequirements(jobUrl);
      setJobRequirements(requirements);
      
      // Perform full analysis
      const result = await analyzeResumeForJob(resumeFile, jobUrl);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
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
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Sign Out
          </Button>
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
                Job/Internship URL
              </CardTitle>
              <CardDescription>
                Paste the link to the job you're applying for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="job-url">Job URL</Label>
                  <Input
                    id="job-url"
                    type="url"
                    placeholder="https://linkedin.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleAnalysis} 
                  className="w-full" 
                  disabled={!resumeFile || !jobUrl || isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Match"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Job Information */}
            {jobData && <JobInfo jobData={jobData} />}
            
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Match Score
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                    className="flex items-center gap-2"
                  >
                    {showDetailedAnalysis ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showDetailedAnalysis ? "Hide" : "Show"} Detailed Analysis
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-green-600">
                    {analysisResult.overallScore}%
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${analysisResult.overallScore}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Good match for this position</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            {showDetailedAnalysis && jobRequirements.length > 0 && (
              <DetailedAnalysis
                requirements={jobRequirements}
                matchedSkills={analysisResult.detailedAnalysis.matchedSkills}
                missingSkills={analysisResult.detailedAnalysis.missingSkills}
              />
            )}

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisResult.skillMatch}%</div>
                    <p className="text-sm text-gray-600">Skill Match</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analysisResult.experienceMatch}%</div>
                    <p className="text-sm text-gray-600">Experience Match</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{analysisResult.keywordDensity}%</div>
                    <p className="text-sm text-gray-600">Keyword Density</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Suggested Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested Projects to Improve Your Profile</CardTitle>
                <CardDescription>
                  Build these projects to strengthen your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.suggestedProjects.map((project: {
                    title: string;
                    description: string;
                    relevance: string;
                  }, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{project.title}</h4>
                        <Badge variant="secondary">{project.relevance}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
