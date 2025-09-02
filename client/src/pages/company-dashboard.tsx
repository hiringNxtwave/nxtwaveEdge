import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { type Company, type ContactRequest } from "@shared/schema";
import Header from "@/components/header";
import CompanyStats from "@/components/company-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, MessageSquare, Building2, Plus, ExternalLink } from "lucide-react";

export default function CompanyDashboard() {
  useScrollToTop();
  
  const { user } = useAuth();

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["/api/company"],
    enabled: !!user,
  });

  const { data: contactRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/contact-requests"],
    enabled: !!company,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/company/stats"],
    enabled: !!company,
  });

  if (companyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-no-company">
              No Company Profile Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You need to create a company profile to access the dashboard.
            </p>
            <Button data-testid="button-create-company">
              <Plus className="mr-2 h-4 w-4" />
              Create Company Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-company-name">
            {company.name} Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your talent recruitment and company profile
          </p>
        </div>

        {/* Stats Overview */}
        <CompanyStats stats={stats || { totalViews: 0, contactsSent: 0, responseRate: 0, activeSearches: 0 }} />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Recent Contact Requests */}
          <div className="lg:col-span-2">
            <Card data-testid="card-contact-requests">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Contact Requests</CardTitle>
                    <CardDescription>
                      Students you've reached out to
                    </CardDescription>
                  </div>
                  <Link href="/browse">
                    <Button variant="outline" size="sm" data-testid="button-browse-more">
                      <Users className="mr-2 h-4 w-4" />
                      Browse More
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !contactRequests || contactRequests.length === 0 ? (
                  <div className="text-center py-8" data-testid="text-no-requests">
                    <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No contact requests yet.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Start browsing students to send contact requests.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="list-contact-requests">
                    {contactRequests?.slice(0, 5).map((request: ContactRequest & { studentName: string }) => (
                      <div key={request.id} className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg" data-testid={`request-${request.id}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white" data-testid={`text-request-student-${request.id}`}>
                              {request.studentName}
                            </h4>
                            <Badge 
                              variant={
                                request.status === 'pending' ? 'secondary' :
                                request.status === 'responded' ? 'default' : 'destructive'
                              }
                              data-testid={`badge-request-status-${request.id}`}
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300" data-testid={`text-request-message-${request.id}`}>
                            {request.message.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" data-testid={`text-request-date-${request.id}`}>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" data-testid={`button-view-request-${request.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Company Profile */}
          <div className="space-y-6">
            <Card data-testid="card-company-profile">
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</span>
                  <p data-testid="text-company-industry">{(company as Company)?.industry || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Size</span>
                  <p data-testid="text-company-size">{(company as Company)?.size || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</span>
                  <p data-testid="text-company-location">{(company as Company)?.location || 'Not specified'}</p>
                </div>
                {(company as Company)?.website && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</span>
                    <a 
                      href={(company as Company).website || ''} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      data-testid="link-company-website"
                    >
                      {(company as Company).website}
                    </a>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" data-testid="button-edit-profile">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/browse">
                  <Button className="w-full justify-start" variant="outline" data-testid="button-quick-browse">
                    <Users className="mr-2 h-4 w-4" />
                    Browse Students
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline" data-testid="button-quick-post-job">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job
                </Button>
                <Button className="w-full justify-start" variant="outline" data-testid="button-quick-manage-requests">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Manage Requests
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}