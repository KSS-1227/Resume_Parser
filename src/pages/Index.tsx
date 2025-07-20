
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Target, 
  Brain, 
  TrendingUp, 
  CheckCircle, 
  Users, 
  Award,
  ArrowRight,
  Star
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Smart Resume Analysis",
      description: "AI-powered parsing and analysis of your resume content, skills, and experience"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Job Matching",
      description: "Automatically match your profile against job requirements from popular job boards"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Recommendations",
      description: "Get personalized suggestions for improving your resume and skill gaps"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Performance Tracking",
      description: "Track your improvement over time and see how your match scores evolve"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Resumes Analyzed" },
    { number: "85%", label: "Average Match Improvement" },
    { number: "500+", label: "Companies Supported" },
    { number: "95%", label: "User Satisfaction" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "ResumeMatch Pro helped me identify exactly what skills I was missing for my dream job. Got hired within 2 weeks!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Data Scientist",
      company: "Microsoft",
      content: "The AI suggestions were spot-on. I built the recommended projects and significantly improved my interview success rate.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Product Manager",
      company: "Amazon",
      content: "Finally, a tool that understands what recruiters are looking for. The match scoring is incredibly accurate.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ResumeMatch Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => window.location.href = "/auth"}>
                Sign In
              </Button>
              <Button onClick={() => window.location.href = "/auth"}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            ✨ Powered by Advanced AI Technology
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Perfect Your Resume for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Every Job Application
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your resume, paste any job link, and get AI-powered insights to maximize your chances of landing interviews. 
            Identify skill gaps, optimize keywords, and get personalized project recommendations.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => window.location.href = "/auth"}>
              Start Free Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform analyzes, optimizes, and guides you through the entire job application process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How ResumeMatch Pro Works
            </h2>
            <p className="text-xl text-gray-600">Simple 3-step process to optimize your job applications</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
              <p className="text-gray-600">Upload your resume in PDF or Word format. Our AI will parse and analyze your content.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Job Link</h3>
              <p className="text-gray-600">Paste the URL of any job posting from LinkedIn, Indeed, or other job boards.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
              <p className="text-gray-600">Receive detailed analysis, match scores, and personalized recommendations to improve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="text-xl text-gray-600">See how ResumeMatch Pro helped others land their dream jobs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers who've improved their success rate with ResumeMatch Pro
          </p>
          <Button size="lg" variant="secondary" onClick={() => window.location.href = "/auth"}>
            Start Your Free Analysis Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ResumeMatch Pro</span>
              </div>
              <p className="text-gray-400">
                AI-powered resume optimization platform helping job seekers land their dream careers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeMatch Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
