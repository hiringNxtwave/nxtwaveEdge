import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, DollarSign, Clock, Target } from "lucide-react";

const onboardingSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  companyName: z.string().min(2, "Company name is required"),
  companySize: z.enum(["startup", "small", "medium", "large", "enterprise"], {
    required_error: "Please select company size",
  }),
  industry: z.string().min(2, "Industry is required"),
  hiringVelocity: z.enum(["low", "medium", "high"], {
    required_error: "Please select hiring velocity",
  }),
  typicalRoles: z.array(z.string()).min(1, "Please select at least one role"),
  budgetRange: z.string().min(1, "Budget range is required"),
  preferredExperience: z.enum(["fresher", "experienced", "both"], {
    required_error: "Please select experience preference",
  }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface RecruiterOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  userEmail?: string;
  userName?: string;
}

const COMMON_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Quality Assurance",
  "Business Analyst",
  "Cybersecurity Specialist",
];

const INDUSTRIES = [
  "Technology/Software",
  "E-commerce",
  "Fintech",
  "Healthcare",
  "Education",
  "Gaming",
  "Media & Entertainment",
  "Consulting",
  "Manufacturing",
  "Banking & Finance",
  "Telecommunications",
  "Government",
];

export function RecruiterOnboarding({ 
  isOpen, 
  onComplete, 
  userEmail, 
  userName 
}: RecruiterOnboardingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      industry: "",
      typicalRoles: [],
      budgetRange: "",
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      return apiRequest("/api/auth/complete-onboarding", "PUT", {
        ...data,
        typicalRoles: JSON.stringify(data.typicalRoles),
        onboardingCompleted: true,
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to NxtWave!",
        description: "Your profile has been set up successfully. You can now start discovering top talent.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRoleToggle = (role: string) => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    setSelectedRoles(updated);
    form.setValue("typicalRoles", updated);
  };

  const onSubmit = (data: OnboardingFormData) => {
    onboardingMutation.mutate(data);
  };

  const getCompanySizeDescription = (size: string) => {
    const descriptions = {
      startup: "1-50 employees",
      small: "51-200 employees", 
      medium: "201-1,000 employees",
      large: "1,001-10,000 employees",
      enterprise: "10,000+ employees"
    };
    return descriptions[size as keyof typeof descriptions];
  };

  const getHiringVelocityDescription = (velocity: string) => {
    const descriptions = {
      low: "1-5 hires per month",
      medium: "6-20 hires per month",
      high: "20+ hires per month"
    };
    return descriptions[velocity as keyof typeof descriptions];
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-blue-900">
            Welcome to NxtWave! 🚀
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Let's set up your recruiter profile to help you find the perfect candidates from India's top 10% freshers
          </DialogDescription>
          {userName && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-sm">
                Setting up for: {userName} ({userEmail})
              </Badge>
            </div>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Tell us about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., TechCorp Solutions"
                          data-testid="input-company-name"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Job Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Senior Talent Acquisition Manager"
                          data-testid="input-job-title"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-industry">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Size *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-company-size">
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["startup", "small", "medium", "large", "enterprise"].map((size) => (
                            <SelectItem key={size} value={size}>
                              <div className="flex flex-col">
                                <span className="capitalize">{size}</span>
                                <span className="text-xs text-gray-500">
                                  {getCompanySizeDescription(size)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Hiring Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Hiring Preferences
                </CardTitle>
                <CardDescription>
                  Help us understand your hiring needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="hiringVelocity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Hiring Velocity *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-hiring-velocity">
                              <SelectValue placeholder="Select velocity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["low", "medium", "high"].map((velocity) => (
                              <SelectItem key={velocity} value={velocity}>
                                <div className="flex flex-col">
                                  <span className="capitalize">{velocity}</span>
                                  <span className="text-xs text-gray-500">
                                    {getHiringVelocityDescription(velocity)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Typical Budget Range *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-budget-range">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3-6">3-6 LPA</SelectItem>
                            <SelectItem value="6-10">6-10 LPA</SelectItem>
                            <SelectItem value="10-15">10-15 LPA</SelectItem>
                            <SelectItem value="15-25">15-25 LPA</SelectItem>
                            <SelectItem value="25-40">25-40 LPA</SelectItem>
                            <SelectItem value="40+">40+ LPA</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Experience Preference *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-experience-preference">
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fresher">Fresh Graduates</SelectItem>
                            <SelectItem value="experienced">Experienced (2+ years)</SelectItem>
                            <SelectItem value="both">Both Fresh & Experienced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Roles Selection */}
                <div>
                  <FormLabel className="text-base font-medium mb-3 block">
                    Roles You Typically Hire For *
                  </FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {COMMON_ROLES.map((role) => (
                      <div
                        key={role}
                        onClick={() => handleRoleToggle(role)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedRoles.includes(role)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`role-${role.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedRoles.includes(role)}
                            onChange={() => {}}
                          />
                          <label className="text-sm font-medium cursor-pointer">
                            {role}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.typicalRoles && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.typicalRoles.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={onboardingMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 min-w-32"
                data-testid="button-complete-setup"
              >
                {onboardingMutation.isPending ? "Setting up..." : "Complete Setup"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}