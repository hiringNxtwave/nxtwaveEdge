import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Target, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            TalentConnect India
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Connecting India's brightest students with top companies. Find the perfect talent or showcase your skills to leading employers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" data-testid="button-explore-talent">
                Explore Talent Pool
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card data-testid="card-feature-students">
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Top Students</CardTitle>
              <CardDescription>
                Access skilled students from IITs, NITs, and top universities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-companies">
            <CardHeader>
              <Building2 className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Leading Companies</CardTitle>
              <CardDescription>
                Connect with India's most innovative companies and startups
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-skills">
            <CardHeader>
              <Target className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Skill Matching</CardTitle>
              <CardDescription>
                Advanced filtering by skills, experience, and expertise
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-growth">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Career Growth</CardTitle>
              <CardDescription>
                Opportunities that accelerate professional development
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of students and companies already using TalentConnect India
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse talent above to explore our platform
          </p>
        </div>
      </div>
    </div>
  );
}