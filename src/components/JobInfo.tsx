import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Calendar, Users } from "lucide-react";
import { ScrapedJobData } from "@/services/webScraper";

interface JobInfoProps {
  jobData: ScrapedJobData | null;
}

const JobInfo: React.FC<JobInfoProps> = ({ jobData }) => {
  if (!jobData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Job Information
        </CardTitle>
        <CardDescription>
          Details extracted from the job posting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{jobData.title}</h3>
            <p className="text-sm text-gray-600">{jobData.company}</p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {jobData.location}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {jobData.requirements.length} requirements
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
            <p className="text-sm text-gray-600 line-clamp-3">
              {jobData.description}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Key Requirements</h4>
            <div className="flex flex-wrap gap-2">
              {jobData.requirements.slice(0, 6).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {jobData.requirements.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{jobData.requirements.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobInfo; 