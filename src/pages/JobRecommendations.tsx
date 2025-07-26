import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, TrendingUp, Star, CheckCircle, AlertCircle, MapPin, Building, Briefcase, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define types for job listings and filters
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  experience: string;
  jobType: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  url: string;
  source: string;
  postedDate: string;
}

interface JobFilters {
  location: string;
  jobType: string[];
  experience: number[];
  remote: boolean;
  matchThreshold: number;
}

const JobRecommendations = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    location: "",
    jobType: [],
    experience: [0, 10],
    remote: false,
    matchThreshold: 50,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Handle file upload
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

  // Find job recommendations based on resume
  const findRecommendations = async () => {
    if (!resumeFile) {
      toast({
        title: "Missing resume",
        description: "Please upload your resume to find matching jobs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload resume
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const uploadRes = await fetch('http://resumeparser-production-02e4.up.railway.app/api/resume/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) {
        throw new Error('Failed to upload resume');
      }
      
      const uploadData = await uploadRes.json();
      const { resumeId } = uploadData;

      // Get job recommendations
      const recommendationsRes = await fetch('http://resumeparser-production-02e4.up.railway.app/api/jobs/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeId }),
      });
      
      if (!recommendationsRes.ok) {
        throw new Error('Failed to get job recommendations');
      }
      
      const recommendationsData = await recommendationsRes.json();
      setJobs(recommendationsData.jobs || []);
      setFilteredJobs(recommendationsData.jobs || []);
      
      toast({
        title: "Recommendations found!",
        description: `Found ${recommendationsData.jobs?.length || 0} matching job opportunities`,
      });
      
    } catch (error) {
      console.error('Recommendation error:', error);
      toast({
        title: "Failed to get recommendations",
        description: "There was an error finding job recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to jobs
  useEffect(() => {
    if (jobs.length === 0) return;

    let result = [...jobs];

    // Apply location filter
    if (filters.location) {
      result = result.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply job type filter
    if (filters.jobType.length > 0) {
      result = result.filter(job => 
        filters.jobType.includes(job.jobType)
      );
    }

    // Apply experience filter
    result = result.filter(job => {
      const expYears = parseInt(job.experience.replace(/\D/g, '')) || 0;
      return expYears >= filters.experience[0] && expYears <= filters.experience[1];
    });

    // Apply remote filter
    if (filters.remote) {
      result = result.filter(job => 
        job.location.toLowerCase().includes('remote')
      );
    }

    // Apply match threshold
    result = result.filter(job => 
      job.matchPercentage >= filters.matchThreshold
    );

    // Apply search query
    if (searchQuery) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by match percentage (highest first)
    result.sort((a, b) => b.matchPercentage - a.matchPercentage);

    setFilteredJobs(result);
  }, [jobs, filters, searchQuery]);

  // Handle filter changes
  const updateFilters = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Best Opportunities For You</h1>
            <p className="text-gray-600 mt-1">Find job opportunities that match your skills and experience</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
            Back to Dashboard
          </Button>
        </div>

        {/* Upload Resume Section */}
        {!jobs.length && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Upload your resume to find job opportunities that match your skills and experience
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
                <Button 
                  onClick={findRecommendations} 
                  className="w-full" 
                  disabled={!resumeFile || isLoading}
                >
                  {isLoading ? "Finding opportunities..." : "Find Best Opportunities"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Listings and Filters */}
        {jobs.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6">
            {/* Filters Panel */}
            <Card className="md:col-span-1 h-fit sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      placeholder="Search jobs..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State, or Remote"
                    value={filters.location}
                    onChange={(e) => updateFilters('location', e.target.value)}
                  />
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`job-type-${type}`} 
                          checked={filters.jobType.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilters('jobType', [...filters.jobType, type]);
                            } else {
                              updateFilters('jobType', filters.jobType.filter(t => t !== type));
                            }
                          }}
                        />
                        <label
                          htmlFor={`job-type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Experience (years)</Label>
                    <span className="text-sm text-gray-500">
                      {filters.experience[0]} - {filters.experience[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 10]}
                    max={10}
                    step={1}
                    value={filters.experience}
                    onValueChange={(value) => updateFilters('experience', value)}
                  />
                </div>

                {/* Remote Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remote-only" 
                    checked={filters.remote}
                    onCheckedChange={(checked) => updateFilters('remote', !!checked)}
                  />
                  <label
                    htmlFor="remote-only"
                    className="text-sm font-medium leading-none"
                  >
                    Remote Only
                  </label>
                </div>

                {/* Match Threshold */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Minimum Match %</Label>
                    <span className="text-sm text-gray-500">{filters.matchThreshold}%</span>
                  </div>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={5}
                    value={[filters.matchThreshold]}
                    onValueChange={(value) => updateFilters('matchThreshold', value[0])}
                  />
                </div>

                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setFilters({
                      location: "",
                      jobType: [],
                      experience: [0, 10],
                      remote: false,
                      matchThreshold: 50,
                    });
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                </h2>
                <Select defaultValue="match" onValueChange={(value) => {
                  if (value === 'match') {
                    setFilteredJobs([...filteredJobs].sort((a, b) => b.matchPercentage - a.matchPercentage));
                  } else if (value === 'recent') {
                    setFilteredJobs([...filteredJobs].sort((a, b) => 
                      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
                    ));
                  }
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">No matching jobs found</h3>
                    <p className="text-gray-500 text-center mt-2">
                      Try adjusting your filters or uploading a different resume
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Building className="h-4 w-4" />
                            <span>{job.company}</span>
                            <span className="text-gray-300">•</span>
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.source}
                          </div>
                          <div className="mt-2">
                            <Badge className={`${job.matchPercentage >= 80 ? 'bg-green-100 text-green-800' : job.matchPercentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {job.matchPercentage}% Match
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-gray-600 line-clamp-2">{job.description}</p>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Skills Match</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.matchingSkills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                              {skill}
                            </Badge>
                          ))}
                          {job.matchingSkills.length > 5 && (
                            <Badge variant="outline">+{job.matchingSkills.length - 5} more</Badge>
                          )}
                        </div>
                      </div>

                      {job.missingSkills.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Missing Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.missingSkills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="border-orange-200 text-orange-800">
                                {skill}
                              </Badge>
                            ))}
                            {job.missingSkills.length > 3 && (
                              <Badge variant="outline">+{job.missingSkills.length - 3} more</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <Briefcase className="h-4 w-4 inline mr-1" />
                          {job.experience} • Posted {job.postedDate}
                        </div>
                        <Button asChild>
                          <a href={job.url} target="_blank" rel="noopener noreferrer">
                            Apply Now
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;