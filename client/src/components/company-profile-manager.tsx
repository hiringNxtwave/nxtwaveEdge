import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  MapPin, 
  IndianRupee, 
  Building, 
  Users,
  Briefcase,
  GraduationCap
} from 'lucide-react';

// Simplified form schema focusing on core fields
const jobRequirementsSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  experienceLevel: z.string().default('fresher'),
  hiresExpected: z.coerce.number().int().min(1, 'At least 1 hire expected'),
  jobLocation: z.string().min(1, 'Job location is required'),
  workMode: z.string().default('onsite'),
  salaryMin: z.coerce.number().int().min(0, 'Minimum salary must be positive'),
  salaryMax: z.coerce.number().int().min(0, 'Maximum salary must be positive'),
  preferredColleges: z.string().optional(),
  minimumCGPA: z.coerce.number().min(0).max(10).optional(),
});

type JobRequirementsForm = z.infer<typeof jobRequirementsSchema>;

interface CompanyRequirement {
  id: string;
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  hiresExpected: number;
  jobLocation: string;
  workMode: string;
  salaryMin: number;
  salaryMax: number;
  preferredColleges?: string;
  minimumCGPA?: number;
  requiredSkills?: string;
  isActive: boolean;
  createdAt: string;
}

export function CompanyProfileManager() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
      workMode: 'onsite',
      hiresExpected: 1,
      salaryMin: 300,
      salaryMax: 800,
    },
  });

  // Parse JD mutation
  const parseJDMutation = useMutation({
    mutationFn: async (jobDescription: string) => {
      const response = await apiRequest('POST', '/api/company/parse-jd', { jobDescription });
      return await response.json();
    },
    onSuccess: (data) => {
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
      
      toast({
        title: "JD Parsed Successfully!",
        description: "Fields have been auto-filled from your job description",
      });
    },
    onError: () => {
      toast({
        title: "Parsing Failed",
        description: "Could not parse the job description. Please fill in details manually.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsParsingJD(false);
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: JobRequirementsForm) => {
      if (editingId) {
        const response = await apiRequest('PUT', `/api/company/requirements/${editingId}`, data);
        return await response.json();
      } else {
        const response = await apiRequest('POST', '/api/company/requirements', data);
        return await response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: editingId ? "Job requirement updated" : "Job requirement created",
      });
      handleCancel();
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not save the job requirement. Please try again.",
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
        title: "Deleted",
        description: "Job requirement has been deleted",
      });
      refetch();
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
    setEditingId(requirement.id);
    form.reset({
      jobTitle: requirement.jobTitle,
      jobDescription: requirement.jobDescription,
      experienceLevel: requirement.experienceLevel,
      hiresExpected: requirement.hiresExpected,
      jobLocation: requirement.jobLocation,
      workMode: requirement.workMode,
      salaryMin: requirement.salaryMin,
      salaryMax: requirement.salaryMax,
      preferredColleges: requirement.preferredColleges || '',
      minimumCGPA: requirement.minimumCGPA,
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job requirement?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    form.reset();
  };

  const onSubmit = (data: JobRequirementsForm) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Requirements</h2>
          <p className="text-muted-foreground">
            Manage your hiring requirements and let our AI parse job descriptions
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2" data-testid="button-add-requirement">
            <Plus className="w-4 h-4" />
            Add New Requirement
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="border-dashed border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {editingId ? 'Edit Job Requirement' : 'Create New Job Requirement'}
            </CardTitle>
            <CardDescription>
              Fill in the details below or paste a job description for AI parsing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Job Description with AI Parse */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Job Description
                          <Badge variant="secondary" className="text-xs">AI Parsable</Badge>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your full job description here. Our AI will automatically extract job title, salary, location, and requirements..."
                            className="min-h-[120px]"
                            {...field}
                            data-testid="textarea-job-description"
                          />
                        </FormControl>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleParseJD}
                            disabled={isParsingJD}
                            className="gap-2"
                            data-testid="button-parse-jd"
                          >
                            <Sparkles className="w-4 h-4" />
                            {isParsingJD ? 'Parsing...' : 'Parse with AI'}
                          </Button>
                          <span className="text-xs text-muted-foreground self-center">
                            Auto-fill form fields from job description
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Core Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Frontend Developer" {...field} data-testid="input-job-title" />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-experience-level">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fresher">Fresher (0 years)</SelectItem>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Salary Range */}
                <div className="space-y-3">
                  <FormLabel className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Salary Range (in thousands)
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="300"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-salary-min"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="800"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-salary-max"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter amounts in thousands (e.g., 300 for ₹3 LPA, 800 for ₹8 LPA)
                  </p>
                </div>

                {/* Location & Work Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Job Location
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bangalore, Mumbai" {...field} data-testid="input-job-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-work-mode">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="onsite">On-site</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* College Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferredColleges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Preferred Colleges
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., IIT, NIT, BITS (optional)" {...field} data-testid="input-preferred-colleges" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minimumCGPA"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum CGPA</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            placeholder="7.0 (optional)"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            data-testid="input-minimum-cgpa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hiring Details */}
                <FormField
                  control={form.control}
                  name="hiresExpected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Number of Hires Expected
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          data-testid="input-hires-expected"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="gap-2"
                    data-testid="button-save-requirement"
                  >
                    {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Requirement' : 'Create Requirement'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    data-testid="button-cancel-requirement"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Requirements List */}
      <div className="space-y-4">
        {requirements.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No job requirements yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first job requirement to start finding the right candidates
              </p>
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Requirement
              </Button>
            </CardContent>
          </Card>
        ) : (
          requirements.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{req.jobTitle}</h3>
                      <Badge variant={req.isActive ? 'default' : 'secondary'}>
                        {req.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IndianRupee className="w-4 h-4" />
                        <span>₹{req.salaryMin/100}L - ₹{req.salaryMax/100}L</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{req.jobLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{req.hiresExpected} hire{req.hiresExpected > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        <span>{req.experienceLevel}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {req.jobDescription}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(req)}
                      className="gap-2"
                      data-testid={`button-edit-${req.id}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(req.id)}
                      className="gap-2 text-red-600 hover:text-red-700"
                      data-testid={`button-delete-${req.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}