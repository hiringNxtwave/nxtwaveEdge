import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Textarea 
} from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Slider 
} from '@/components/ui/slider';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Separator 
} from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Brain, 
  Target, 
  MapPin, 
  IndianRupee, 
  Users, 
  BookOpen, 
  Lightbulb,
  Save,
  Wand2
} from 'lucide-react';

// Form validation schema
const jobRequirementsSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  department: z.string().optional(),
  experienceLevel: z.string().default('fresher'),
  hiresExpected: z.coerce.number().int().min(1, 'At least 1 hire expected'),
  urgencyLevel: z.string().default('medium'),
  jobLocation: z.string().min(1, 'Job location is required'),
  remoteAllowed: z.boolean().default(false),
  workMode: z.string().default('onsite'),
  relocationAssistance: z.boolean().default(false),
  salaryMin: z.coerce.number().int().min(0, 'Minimum salary must be positive'),
  salaryMax: z.coerce.number().int().min(0, 'Maximum salary must be positive'),
  minimumCGPA: z.coerce.number().min(0).max(10).optional(),
  dsaWeight: z.coerce.number().int().min(0).max(100).default(25),
  csFundamentalsWeight: z.coerce.number().int().min(0).max(100).default(25),
  aptitudeWeight: z.coerce.number().int().min(0).max(100).default(25),
  communicationWeight: z.coerce.number().int().min(0).max(100).default(25),
  positionsOfResponsibility: z.boolean().default(false),
  portfolioRequired: z.boolean().default(false),
  githubRequired: z.boolean().default(false),
});

type JobRequirementsForm = z.infer<typeof jobRequirementsSchema>;

interface CompanyRequirement {
  id: string;
  jobTitle: string;
  jobDescription: string;
  department?: string;
  experienceLevel: string;
  hiresExpected: number;
  urgencyLevel: string;
  jobLocation: string;
  remoteAllowed: boolean;
  workMode: string;
  salaryMin: number;
  salaryMax: number;
  requiredSkills?: string;
  preferredSkills?: string;
  minimumCGPA?: number;
  dsaWeight: number;
  csFundamentalsWeight: number;
  aptitudeWeight: number;
  communicationWeight: number;
  isActive: boolean;
  createdAt: string;
}

interface ParsedJDData {
  requiredSkills: string[];
  preferredSkills: string[];
  technicalKeywords: string[];
  salaryRange?: { min: number; max: number };
  location?: string;
  experienceLevel?: string;
  academicRequirements?: {
    minimumCGPA?: number;
    requiredDegrees?: string[];
    graduationYears?: string[];
  };
  assessmentWeights?: {
    dsaWeight: number;
    csFundamentalsWeight: number;
    aptitudeWeight: number;
    communicationWeight: number;
  };
}

export function CompanyProfileManager() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<CompanyRequirement | null>(null);
  const [parsedData, setParsedData] = useState<ParsedJDData | null>(null);
  const [isParsingJD, setIsParsingJD] = useState(false);

  // Fetch company requirements
  const { data: requirements = [], isLoading, refetch } = useQuery<CompanyRequirement[]>({
    queryKey: ['/api/company/requirements'],
  });

  // Form setup
  const form = useForm<JobRequirementsForm>({
    resolver: zodResolver(jobRequirementsSchema),
    defaultValues: {
      experienceLevel: 'fresher',
      urgencyLevel: 'medium',
      workMode: 'onsite',
      remoteAllowed: false,
      relocationAssistance: false,
      hiresExpected: 1,
      salaryMin: 300,
      salaryMax: 800,
      dsaWeight: 25,
      csFundamentalsWeight: 25,
      aptitudeWeight: 25,
      communicationWeight: 25,
      positionsOfResponsibility: false,
      portfolioRequired: false,
      githubRequired: false,
    },
  });

  // Parse JD mutation
  const parseJDMutation = useMutation({
    mutationFn: async (jobDescription: string): Promise<ParsedJDData> => {
      const response = await apiRequest('POST', '/api/company/parse-jd', { jobDescription });
      return await response.json();
    },
    onSuccess: (data: ParsedJDData) => {
      setParsedData(data);
      
      // Auto-fill form fields with parsed data
      if (data.salaryRange) {
        form.setValue('salaryMin', data.salaryRange.min);
        form.setValue('salaryMax', data.salaryRange.max);
      }
      
      if (data.location) {
        form.setValue('jobLocation', data.location);
      }
      
      if (data.experienceLevel) {
        form.setValue('experienceLevel', data.experienceLevel);
      }
      
      if (data.academicRequirements?.minimumCGPA) {
        form.setValue('minimumCGPA', data.academicRequirements.minimumCGPA);
      }
      
      if (data.assessmentWeights) {
        form.setValue('dsaWeight', data.assessmentWeights.dsaWeight);
        form.setValue('csFundamentalsWeight', data.assessmentWeights.csFundamentalsWeight);
        form.setValue('aptitudeWeight', data.assessmentWeights.aptitudeWeight);
        form.setValue('communicationWeight', data.assessmentWeights.communicationWeight);
      }

      toast({
        title: "JD Parsed Successfully",
        description: `Extracted ${data.requiredSkills.length} required skills and ${data.preferredSkills.length} preferred skills`,
      });
    },
    onError: () => {
      toast({
        title: "Parsing Failed",
        description: "Could not parse the job description. Please fill in the details manually.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsParsingJD(false);
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: JobRequirementsForm) => {
      const payload = {
        ...data,
        requiredSkills: JSON.stringify(parsedData?.requiredSkills || []),
        preferredSkills: JSON.stringify(parsedData?.preferredSkills || []),
        technicalKeywords: JSON.stringify(parsedData?.technicalKeywords || []),
      };

      if (editingRequirement) {
        const response = await apiRequest('PUT', `/api/company/requirements/${editingRequirement.id}`, payload);
        return await response.json();
      } else {
        const response = await apiRequest('POST', '/api/company/requirements', payload);
        return await response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: editingRequirement ? "Requirements Updated" : "Requirements Created",
        description: "Your job requirements have been saved successfully.",
      });
      setIsDialogOpen(false);
      setEditingRequirement(null);
      setParsedData(null);
      form.reset();
      refetch();
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Could not save the requirements. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/company/requirements/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Requirements Deleted",
        description: "The job requirements have been deleted successfully.",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Could not delete the requirements. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleParseJD = () => {
    const jobDescription = form.getValues('jobDescription');
    if (!jobDescription || jobDescription.length < 50) {
      toast({
        title: "JD Too Short",
        description: "Please enter a detailed job description (at least 50 characters) to parse.",
        variant: "destructive",
      });
      return;
    }

    setIsParsingJD(true);
    parseJDMutation.mutate(jobDescription);
  };

  const handleEdit = (requirement: CompanyRequirement) => {
    setEditingRequirement(requirement);
    
    // Populate form with existing data
    form.reset({
      jobTitle: requirement.jobTitle,
      jobDescription: requirement.jobDescription,
      department: requirement.department || '',
      experienceLevel: requirement.experienceLevel,
      hiresExpected: requirement.hiresExpected,
      urgencyLevel: requirement.urgencyLevel,
      jobLocation: requirement.jobLocation,
      remoteAllowed: requirement.remoteAllowed,
      workMode: requirement.workMode,
      salaryMin: requirement.salaryMin,
      salaryMax: requirement.salaryMax,
      minimumCGPA: requirement.minimumCGPA,
      dsaWeight: requirement.dsaWeight,
      csFundamentalsWeight: requirement.csFundamentalsWeight,
      aptitudeWeight: requirement.aptitudeWeight,
      communicationWeight: requirement.communicationWeight,
    });

    // Set parsed data if available
    if (requirement.requiredSkills) {
      try {
        const requiredSkills = JSON.parse(requirement.requiredSkills);
        const preferredSkills = requirement.preferredSkills ? JSON.parse(requirement.preferredSkills) : [];
        setParsedData({
          requiredSkills,
          preferredSkills,
          technicalKeywords: requiredSkills.concat(preferredSkills),
        });
      } catch (e) {
        console.error('Error parsing existing skills data:', e);
      }
    }

    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingRequirement(null);
    setParsedData(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job requirement?')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: JobRequirementsForm) => {
    // Validate assessment weights sum to 100
    const totalWeight = data.dsaWeight + data.csFundamentalsWeight + data.aptitudeWeight + data.communicationWeight;
    if (totalWeight !== 100) {
      toast({
        title: "Invalid Assessment Weights",
        description: "Assessment weights must sum to 100%",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Company Profile & Job Requirements</h2>
          <p className="text-muted-foreground">
            Manage your job postings and requirements for better candidate matching
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="button-add-requirements">
          <Plus className="w-4 h-4 mr-2" />
          Add Job Requirements
        </Button>
      </div>

      {requirements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Job Requirements Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first job requirements to start getting better candidate matches
            </p>
            <Button onClick={handleAdd} data-testid="button-first-requirements">
              <Plus className="w-4 h-4 mr-2" />
              Create First Job Posting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requirements.map((requirement) => (
            <Card key={requirement.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {requirement.jobTitle}
                      <Badge variant={requirement.isActive ? "default" : "secondary"}>
                        {requirement.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        {requirement.urgencyLevel}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {requirement.department && `${requirement.department} • `}
                      {requirement.hiresExpected} hire{requirement.hiresExpected > 1 ? 's' : ''} needed
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(requirement)}
                      data-testid={`button-edit-requirement-${requirement.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(requirement.id)}
                      data-testid={`button-delete-requirement-${requirement.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{requirement.jobLocation}</span>
                    {requirement.remoteAllowed && (
                      <Badge variant="secondary" className="text-xs">Remote OK</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      ₹{requirement.salaryMin / 100}L - ₹{requirement.salaryMax / 100}L
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{requirement.experienceLevel}</span>
                  </div>
                </div>
                
                {requirement.requiredSkills && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {JSON.parse(requirement.requiredSkills).slice(0, 5).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {JSON.parse(requirement.requiredSkills).length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{JSON.parse(requirement.requiredSkills).length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">DSA</p>
                    <p className="text-sm font-medium">{requirement.dsaWeight}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CS Fund.</p>
                    <p className="text-sm font-medium">{requirement.csFundamentalsWeight}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Aptitude</p>
                    <p className="text-sm font-medium">{requirement.aptitudeWeight}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Comm.</p>
                    <p className="text-sm font-medium">{requirement.communicationWeight}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Job Requirements Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRequirement ? 'Edit Job Requirements' : 'Add Job Requirements'}
            </DialogTitle>
            <DialogDescription>
              Create detailed job requirements to get better candidate matches. Use our AI-powered JD parser to extract requirements automatically.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="jd">Job Description</TabsTrigger>
                  <TabsTrigger value="compensation">Compensation</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment Criteria</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Software Engineer - Backend" {...field} data-testid="input-job-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Engineering" {...field} data-testid="input-department" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-experience-level">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fresher">Fresher</SelectItem>
                              <SelectItem value="0-1">0-1 Years</SelectItem>
                              <SelectItem value="1-3">1-3 Years</SelectItem>
                              <SelectItem value="3-5">3-5 Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hiresExpected"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Hires Expected</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              data-testid="input-hires-expected"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jobLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Bangalore, Mumbai" {...field} data-testid="input-job-location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urgencyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-urgency-level">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="workMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Mode</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-work-mode">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select work mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="onsite">Onsite</SelectItem>
                              <SelectItem value="remote">Remote</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="remoteAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Remote Allowed</FormLabel>
                            <FormDescription className="text-xs">
                              Can this role be done remotely?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              data-testid="checkbox-remote-allowed"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="relocationAssistance"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Relocation Assistance</FormLabel>
                            <FormDescription className="text-xs">
                              Do you provide relocation assistance?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              data-testid="checkbox-relocation-assistance"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="jd" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your complete job description here. Our AI will automatically extract skills, requirements, and other details..."
                            className="min-h-[200px]"
                            {...field}
                            data-testid="textarea-job-description"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed job description. Our AI will parse it to extract skills, salary range, and other requirements automatically.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleParseJD}
                      disabled={isParsingJD}
                      data-testid="button-parse-jd"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isParsingJD ? 'Parsing...' : 'Parse JD with AI'}
                    </Button>
                    {parsedData && (
                      <Badge variant="secondary" className="self-center">
                        <Brain className="w-3 h-3 mr-1" />
                        Parsed Successfully
                      </Badge>
                    )}
                  </div>

                  {parsedData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Extracted Information</CardTitle>
                        <CardDescription>
                          Review the extracted information and make any necessary adjustments
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {parsedData.requiredSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Required Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {parsedData.requiredSkills.map((skill, index) => (
                                <Badge key={index} variant="default" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.preferredSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Preferred Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {parsedData.preferredSkills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.assessmentWeights && (
                          <div>
                            <p className="text-sm font-medium mb-2">Suggested Assessment Weights:</p>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div>
                                <p className="text-xs text-muted-foreground">DSA</p>
                                <p className="text-sm font-medium">{parsedData.assessmentWeights.dsaWeight}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">CS Fundamentals</p>
                                <p className="text-sm font-medium">{parsedData.assessmentWeights.csFundamentalsWeight}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Aptitude</p>
                                <p className="text-sm font-medium">{parsedData.assessmentWeights.aptitudeWeight}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Communication</p>
                                <p className="text-sm font-medium">{parsedData.assessmentWeights.communicationWeight}%</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="compensation" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Salary (in thousands)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 800 for 8 LPA"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              data-testid="input-salary-min"
                            />
                          </FormControl>
                          <FormDescription>Enter in thousands (e.g., 800 for 8 LPA)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Salary (in thousands)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 1200 for 12 LPA"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              data-testid="input-salary-max"
                            />
                          </FormControl>
                          <FormDescription>Enter in thousands (e.g., 1200 for 12 LPA)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="minimumCGPA"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum CGPA (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            placeholder="e.g., 7.5"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            data-testid="input-minimum-cgpa"
                          />
                        </FormControl>
                        <FormDescription>Set minimum CGPA requirement (0-10 scale)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="positionsOfResponsibility"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Positions of Responsibility</FormLabel>
                            <FormDescription className="text-xs">
                              Required leadership experience?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              data-testid="checkbox-positions-responsibility"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="portfolioRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Portfolio Required</FormLabel>
                            <FormDescription className="text-xs">
                              Must have a portfolio?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              data-testid="checkbox-portfolio-required"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="githubRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>GitHub Required</FormLabel>
                            <FormDescription className="text-xs">
                              Must have GitHub profile?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              data-testid="checkbox-github-required"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="assessment" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Assessment Criteria Weights</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set the importance of each assessment component for this role. Total must equal 100%.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dsaWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            Data Structures & Algorithms
                            <span className="font-mono">{field.value}%</span>
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              data-testid="slider-dsa-weight"
                            />
                          </FormControl>
                          <FormDescription>
                            Importance of DSA skills for this role
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="csFundamentalsWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            CS Fundamentals
                            <span className="font-mono">{field.value}%</span>
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              data-testid="slider-cs-fundamentals-weight"
                            />
                          </FormControl>
                          <FormDescription>
                            Importance of CS fundamentals knowledge
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aptitudeWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            Aptitude & Problem Solving
                            <span className="font-mono">{field.value}%</span>
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              data-testid="slider-aptitude-weight"
                            />
                          </FormControl>
                          <FormDescription>
                            Importance of logical reasoning skills
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="communicationWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            Communication Skills
                            <span className="font-mono">{field.value}%</span>
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              data-testid="slider-communication-weight"
                            />
                          </FormControl>
                          <FormDescription>
                            Importance of verbal and written communication
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Weight:</span>
                      <span className={`font-mono text-lg ${
                        form.watch('dsaWeight') + form.watch('csFundamentalsWeight') + 
                        form.watch('aptitudeWeight') + form.watch('communicationWeight') === 100
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {form.watch('dsaWeight') + form.watch('csFundamentalsWeight') + 
                         form.watch('aptitudeWeight') + form.watch('communicationWeight')}%
                      </span>
                    </div>
                    {form.watch('dsaWeight') + form.watch('csFundamentalsWeight') + 
                     form.watch('aptitudeWeight') + form.watch('communicationWeight') !== 100 && (
                      <p className="text-sm text-red-600 mt-1">
                        Assessment weights must total exactly 100%
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel-requirements"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  data-testid="button-save-requirements"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveMutation.isPending ? 'Saving...' : (editingRequirement ? 'Update Requirements' : 'Save Requirements')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}