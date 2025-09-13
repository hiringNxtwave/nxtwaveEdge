import { useState, useRef } from 'react';
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
  GraduationCap,
  Upload,
  FileText,
  CheckCircle,
  Zap,
  Star,
  Target
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Parse JD from file mutation
  const parseFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('jdFile', file);
      
      const response = await fetch('/api/company/parse-jd-file', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse file');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      // Auto-fill form fields with parsed data
      if (data.jobTitle) {
        form.setValue('jobTitle', data.jobTitle);
      }
      if (data.jobDescription) {
        form.setValue('jobDescription', data.jobDescription);
      }
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
        title: "🎉 JD File Parsed Successfully!",
        description: "All fields have been auto-filled from your uploaded file",
      });
    },
    onError: () => {
      toast({
        title: "❌ Parsing Failed",
        description: "Could not parse the file. You can fill in details manually instead.",
        variant: "destructive",
      });
      setUseManualEntry(true);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Parse JD from text mutation
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
        title: "✨ JD Parsed Successfully!",
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
        title: "🎉 Success!",
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
        title: "🗑️ Deleted",
        description: "Job requirement has been deleted",
      });
      refetch();
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "❌ Invalid File Type",
        description: "Please upload a PDF, Word document, or text file",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    parseFileMutation.mutate(file);
  };

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
    setUploadedFile(null);
    setUseManualEntry(false);
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: JobRequirementsForm) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Colorful Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Job Requirements</h2>
            <p className="text-blue-100 text-lg">
              Manage your hiring requirements with AI-powered JD parsing
            </p>
          </div>
          {!isAdding && (
            <Button 
              onClick={() => setIsAdding(true)} 
              className="bg-white text-purple-700 hover:bg-gray-100 gap-2 px-6 py-3 text-lg font-semibold" 
              data-testid="button-add-requirement"
            >
              <Plus className="w-5 h-5" />
              Add New Requirement
            </Button>
          )}
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <Zap className="w-32 h-32" />
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="border-2 border-blue-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-gray-800">
                {editingId ? 'Edit Job Requirement' : 'Create New Job Requirement'}
              </span>
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Upload a JD file for instant parsing or fill in details manually
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* File Upload Section - Primary Option */}
                {!useManualEntry && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-xl p-8">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-green-100 rounded-full">
                          <Upload className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          🚀 Option 1: Upload Job Description File
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Upload a PDF, Word document, or text file and let AI extract all details automatically
                        </p>
                      </div>

                      {uploadedFile ? (
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-3 justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-800">{uploadedFile.name}</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          {isUploading && (
                            <div className="mt-2 text-center">
                              <div className="inline-flex items-center gap-2 text-blue-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                <span>Parsing file...</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            data-testid="input-file-upload"
                          />
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg gap-3"
                            data-testid="button-upload-file"
                          >
                            <Upload className="w-5 h-5" />
                            Choose JD File to Upload
                          </Button>
                        </>
                      )}

                      <div className="text-center pt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setUseManualEntry(true)}
                          className="text-gray-600 hover:text-gray-800"
                          data-testid="button-manual-entry"
                        >
                          Or fill in details manually instead →
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Job Description - Always Available */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      📄 Job Description {!useManualEntry && uploadedFile && '(Auto-filled from file)'}
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          Job Description
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Parsable
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={uploadedFile && !useManualEntry 
                              ? "Job description will be auto-filled from your uploaded file, or you can edit it manually here..." 
                              : "Paste your full job description here. Our AI will automatically extract job title, salary, location, and requirements..."
                            }
                            className="min-h-[120px] border-blue-200 focus:border-blue-400"
                            {...field}
                            data-testid="textarea-job-description"
                          />
                        </FormControl>
                        {useManualEntry && (
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleParseJD}
                              disabled={isParsingJD}
                              className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                              data-testid="button-parse-jd"
                            >
                              <Sparkles className="w-4 h-4" />
                              {isParsingJD ? 'Parsing...' : 'Parse with AI'}
                            </Button>
                            <span className="text-xs text-gray-500 self-center">
                              Auto-fill form fields from job description
                            </span>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Manual Entry Toggle */}
                {useManualEntry && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setUseManualEntry(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ← Switch back to file upload mode
                    </Button>
                  </div>
                )}

                {/* Core Job Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Job Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            Job Title
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Frontend Developer" 
                              className="border-gray-300 focus:border-blue-400"
                              {...field} 
                              data-testid="input-job-title" 
                            />
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
                          <FormLabel className="text-gray-700 font-medium">Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-blue-400" data-testid="select-experience-level">
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fresher">🎓 Fresher (0 years)</SelectItem>
                              <SelectItem value="0-1">💼 0-1 years</SelectItem>
                              <SelectItem value="1-3">🚀 1-3 years</SelectItem>
                              <SelectItem value="3-5">⭐ 3-5 years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Salary Range */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                      <IndianRupee className="w-4 h-4 text-green-600" />
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
                                className="border-green-300 focus:border-green-400"
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
                                className="border-green-300 focus:border-green-400"
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
                    <p className="text-xs text-green-700 mt-2">
                      💰 Enter amounts in thousands (e.g., 300 for ₹3 LPA, 800 for ₹8 LPA)
                    </p>
                  </div>

                  {/* Location & Work Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="jobLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                            <MapPin className="w-4 h-4 text-red-500" />
                            Job Location
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Bangalore, Mumbai" 
                              className="border-gray-300 focus:border-red-400"
                              {...field} 
                              data-testid="input-job-location" 
                            />
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
                          <FormLabel className="text-gray-700 font-medium">Work Mode</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-blue-400" data-testid="select-work-mode">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="onsite">🏢 On-site</SelectItem>
                              <SelectItem value="hybrid">🌍 Hybrid</SelectItem>
                              <SelectItem value="remote">💻 Remote</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* College Requirements */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    College & Academic Requirements
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="preferredColleges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                            <Star className="w-4 h-4 text-yellow-500" />
                            Preferred Colleges
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., IIT, NIT, BITS (optional)" 
                              className="border-purple-300 focus:border-purple-400"
                              {...field} 
                              data-testid="input-preferred-colleges" 
                            />
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
                          <FormLabel className="text-gray-700 font-medium">Minimum CGPA</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              placeholder="7.0 (optional)"
                              className="border-purple-300 focus:border-purple-400"
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
                </div>

                {/* Hiring Details */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                  <FormField
                    control={form.control}
                    name="hiresExpected"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium text-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                          Number of Hires Expected
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            className="border-blue-300 focus:border-blue-400 max-w-xs"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            data-testid="input-hires-expected"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg gap-2"
                    data-testid="button-save-requirement"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {editingId ? 'Update Requirement' : 'Create Requirement'}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="px-8 py-3 text-lg border-gray-300 hover:bg-gray-50"
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
          <Card className="text-center py-16 border-2 border-dashed border-gray-300">
            <CardContent className="pt-6">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Building className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">No job requirements yet</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Create your first job requirement to start finding the right candidates
              </p>
              <Button 
                onClick={() => setIsAdding(true)} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2 px-8 py-3 text-lg"
              >
                <Plus className="w-5 h-5" />
                Create First Requirement
              </Button>
            </CardContent>
          </Card>
        ) : (
          requirements.map((req, index) => (
            <Card key={req.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <div className={`h-1 bg-gradient-to-r ${
                  index % 3 === 0 ? 'from-blue-500 to-purple-500' :
                  index % 3 === 1 ? 'from-green-500 to-emerald-500' :
                  'from-orange-500 to-red-500'
                }`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{req.jobTitle}</h3>
                        <Badge 
                          variant={req.isActive ? 'default' : 'secondary'}
                          className={req.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                        >
                          {req.isActive ? '✅ Active' : '⏸️ Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-medium">₹{req.salaryMin/100}L - ₹{req.salaryMax/100}L</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{req.jobLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{req.hiresExpected} hire{req.hiresExpected > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-purple-50 text-purple-700 px-3 py-2 rounded-lg">
                          <GraduationCap className="w-4 h-4" />
                          <span className="font-medium">{req.experienceLevel}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 line-clamp-2 text-sm">
                        {req.jobDescription}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(req)}
                        className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                        data-testid={`button-edit-${req.id}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(req.id)}
                        className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                        data-testid={`button-delete-${req.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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