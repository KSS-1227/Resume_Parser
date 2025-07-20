import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  BookOpen, 
  Briefcase, 
  Award,
  Star,
  Target,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface AnalysisResult {
  overall_score?: number;
  skill_match?: number;
  experience_match?: number;
  keyword_density?: number;
  semantic_similarity?: number;
  is_complete_mismatch?: boolean;
  mismatch_message?: string;
  required_skills?: string[];
  your_skills?: string[];
  strengths?: string[];
  improvements?: string[];
  suggested_projects?: Array<{
    title: string;
    description: string;
    relevance: string;
  }>;
  missing_skills?: string[];
  matching_skills?: string[];
  resume_sections?: Record<string, string>;
  job_requirements?: {
    required_skills?: string[];
    preferred_skills?: string[];
    experience_level?: string;
    education_level?: string;
    responsibilities?: string[];
  };
}

interface DetailedAnalysisProps {
  result: AnalysisResult;
}

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6 text-blue-600" />
            Overall Match Score
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your resume against the job requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {result.overall_score || 0}%
              </div>
              <div className={`text-sm font-medium ${getScoreColor(result.overall_score || 0)}`}>
                {getScoreLabel(result.overall_score || 0)} Match
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getScoreIcon(result.overall_score || 0)}
              <span className="text-sm text-gray-600">
                {result.overall_score && result.overall_score >= 70 
                  ? "Strong candidate for this position"
                  : result.overall_score && result.overall_score >= 50
                  ? "Consider improving key areas"
                  : "Focus on developing required skills"
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-green-600" />
              Skill Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Technical Skills</span>
                <span className={`font-semibold ${getScoreColor(result.skill_match || 0)}`}>
                  {result.skill_match || 0}%
                </span>
              </div>
              <Progress value={result.skill_match || 0} className="h-2" />
              <div className="text-xs text-gray-500">
                {result.matching_skills && result.matching_skills.length > 0
                  ? `${result.matching_skills.length} matching skills found`
                  : "No matching skills detected"
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Experience Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Relevance</span>
                <span className={`font-semibold ${getScoreColor(result.experience_match || 0)}`}>
                  {result.experience_match || 0}%
                </span>
              </div>
              <Progress value={result.experience_match || 0} className="h-2" />
              <div className="text-xs text-gray-500">
                Based on experience and background alignment
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Keyword Density
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Keyword Coverage</span>
                <span className={`font-semibold ${getScoreColor(result.keyword_density || 0)}`}>
                  {result.keyword_density || 0}%
                </span>
              </div>
              <Progress value={result.keyword_density || 0} className="h-2" />
              <div className="text-xs text-gray-500">
                Important terms from job description found in resume
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Semantic Similarity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Content Relevance</span>
                <span className={`font-semibold ${getScoreColor(result.semantic_similarity || 0)}`}>
                  {result.semantic_similarity || 0}%
                </span>
              </div>
              <Progress value={result.semantic_similarity || 0} className="h-2" />
              <div className="text-xs text-gray-500">
                AI-powered content similarity analysis
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Your Skills
            </CardTitle>
            <CardDescription>
              Skills detected in your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.your_skills && result.your_skills.length > 0 ? (
                result.your_skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No skills detected</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Required Skills
            </CardTitle>
            <CardDescription>
              Skills required for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.required_skills && result.required_skills.length > 0 ? (
                result.required_skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="border-blue-200 text-blue-800"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No skills specified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missing Skills */}
      {result.missing_skills && result.missing_skills.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <XCircle className="h-5 w-5" />
              Missing Skills
            </CardTitle>
            <CardDescription className="text-orange-700">
              Skills you should consider developing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.missing_skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="border-orange-300 text-orange-800 bg-orange-100"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Lightbulb className="h-5 w-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strengths && result.strengths.length > 0 ? (
                result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">No specific strengths identified</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <ArrowUpRight className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.improvements && result.improvements.length > 0 ? (
                result.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">No specific improvements needed</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Projects */}
      {result.suggested_projects && result.suggested_projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Suggested Projects
            </CardTitle>
            <CardDescription>
              Projects to help you develop missing skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {result.suggested_projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold text-sm mb-2">{project.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {project.relevance}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume Sections Analysis */}
      {result.resume_sections && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Resume Structure Analysis
            </CardTitle>
            <CardDescription>
              How well your resume sections are organized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(result.resume_sections).map(([section, content]) => (
                <div key={section} className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm capitalize mb-2">{section}</h4>
                  <div className="text-xs text-gray-600">
                    {content ? (
                      <span className="text-green-600">✓ Present</span>
                    ) : (
                      <span className="text-red-600">✗ Missing</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Requirements Analysis */}
      {result.job_requirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Job Requirements Analysis
            </CardTitle>
            <CardDescription>
              Key requirements extracted from the job description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.job_requirements.experience_level && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Experience Level</span>
                  <Badge variant="outline">{result.job_requirements.experience_level} years</Badge>
                </div>
              )}
              {result.job_requirements.education_level && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Education</span>
                  <Badge variant="outline">{result.job_requirements.education_level}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mismatch Warning */}
      {result.is_complete_mismatch && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <XCircle className="h-5 w-5" />
              Position Mismatch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{result.mismatch_message}</p>
            <div className="mt-3 p-3 bg-red-100 rounded-lg">
              <p className="text-sm text-red-800">
                Consider focusing on positions that better align with your current skill set, 
                or invest time in developing the required skills for this role.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedAnalysis; 