import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
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
  CheckCircle
} from 'lucide-react';

// Simplified form schema focusing on core fields
const jobRequirementsSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
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
  const [, navigate] = useLocation();
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

  // Auto-open the form when there are no existing roles
  useEffect(() => {
    if (!isLoading && requirements.length === 0 && !editingId) {
      setIsAdding(true);
    }
  }, [isLoading, requirements.length]);

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
    onSuccess: (savedReq) => {
      const wasEditing = !!editingId;
      toast({
        title: "🎉 Success!",
        description: wasEditing ? "Job updated — showing matched candidates" : "Job posted — showing matched candidates",
      });
      handleCancel();
      refetch();
      // Redirect to Browse page with job ID so it auto-triggers job match
      if (savedReq?.id) {
        navigate(`/browse?jobId=${savedReq.id}`);
      } else {
        navigate('/browse');
      }
    },
    onError: (err: any) => {
      const msg = err?.message || "Could not save the job requirement. Please try again.";
      toast({
        title: "Error saving job",
        description: msg.length < 200 ? msg : "Validation failed — please check all required fields.",
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
    if (!jobDescription || jobDescription.length < 20) {
      toast({
        title: "JD Too Short",
        description: "Please enter more details in the job description to use AI parsing.",
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
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Action row */}
      {!isAdding && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{requirements.length === 0 ? 'No open roles yet' : `${requirements.length} open role${requirements.length > 1 ? 's' : ''}`}</p>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm font-semibold"
            data-testid="button-add-requirement"
          >
            <Plus className="w-4 h-4" />
            Post a Job
          </Button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          {/* Form header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingId ? 'Edit Job' : 'Post a New Job'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Upload a JD file or fill in the details below</p>
              </div>
            </div>
            {(requirements.length > 0 || editingId) && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* File upload */}
                {!useManualEntry && (
                  <div className="border border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 text-center">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Upload className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Upload Job Description</p>
                    <p className="text-xs text-slate-400 mb-4">PDF, Word, or .txt — AI will fill the form automatically</p>

                    {uploadedFile ? (
                      <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium truncate max-w-[200px]">{uploadedFile.name}</span>
                        {isUploading
                          ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-blue-600 ml-1" />
                          : <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                        }
                      </div>
                    ) : (
                      <>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" className="hidden" data-testid="input-file-upload" />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm"
                          data-testid="button-upload-file"
                        >
                          <Upload className="w-4 h-4" /> Choose File
                        </Button>
                      </>
                    )}

                    <div className="mt-3">
                      <button type="button" onClick={() => setUseManualEntry(true)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors" data-testid="button-manual-entry">
                        Fill in manually instead
                      </button>
                    </div>
                  </div>
                )}

                {/* Section: Job Description */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Job Description
                      {!useManualEntry && uploadedFile && <span className="ml-2 text-blue-500 normal-case tracking-normal">Auto-filled</span>}
                    </label>
                    {useManualEntry && (
                      <button type="button" onClick={() => setUseManualEntry(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                        Switch to file upload
                      </button>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Paste the full job description here — AI will extract title, salary, location, and requirements automatically..."
                            className="min-h-[110px] border-slate-200 focus:border-blue-400 text-sm resize-none"
                            {...field}
                            data-testid="textarea-job-description"
                          />
                        </FormControl>
                        {useManualEntry && (
                          <div className="flex items-center gap-2 pt-1">
                            <Button type="button" variant="outline" size="sm" onClick={handleParseJD} disabled={isParsingJD} className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs" data-testid="button-parse-jd">
                              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                              {isParsingJD ? 'Parsing...' : 'Parse with AI'}
                            </Button>
                            <span className="text-xs text-slate-400">Auto-fill fields from the description above</span>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section: Core details */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Role Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-600">Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Frontend Developer" className="border-slate-200 focus:border-blue-400 text-sm" {...field} data-testid="input-job-title" />
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
                          <FormLabel className="text-xs font-semibold text-slate-600">Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-200 focus:border-blue-400 text-sm" data-testid="select-experience-level">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fresher">Fresher (0 years)</SelectItem>
                              <SelectItem value="0-1">0–1 years</SelectItem>
                              <SelectItem value="1-3">1–3 years</SelectItem>
                              <SelectItem value="3-5">3–5 years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-600">Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Bangalore, Mumbai" className="border-slate-200 focus:border-blue-400 text-sm" {...field} data-testid="input-job-location" />
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
                          <FormLabel className="text-xs font-semibold text-slate-600">Work Mode</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-200 focus:border-blue-400 text-sm" data-testid="select-work-mode">
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
                </div>

                {/* Section: Salary */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Salary Range <span className="normal-case tracking-normal text-slate-300 font-normal">(in ₹ thousands — e.g. 300 = ₹3 LPA)</span></p>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-600">Minimum</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="300" className="border-slate-200 focus:border-blue-400 text-sm" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} data-testid="input-salary-min" />
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
                          <FormLabel className="text-xs font-semibold text-slate-600">Maximum</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="800" className="border-slate-200 focus:border-blue-400 text-sm" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} data-testid="input-salary-max" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section: Academic */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Academic Preferences <span className="normal-case tracking-normal text-slate-300 font-normal">(optional)</span></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredColleges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-600">Preferred Colleges</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. IIT, NIT, BITS" className="border-slate-200 focus:border-blue-400 text-sm" {...field} data-testid="input-preferred-colleges" />
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
                          <FormLabel className="text-xs font-semibold text-slate-600">Minimum CGPA</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" min="0" max="10" placeholder="7.0" className="border-slate-200 focus:border-blue-400 text-sm" {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} data-testid="input-minimum-cgpa" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section: Hires */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Headcount</p>
                  <FormField
                    control={form.control}
                    name="hiresExpected"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Number of Hires Expected</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" className="border-slate-200 focus:border-blue-400 text-sm max-w-[160px]" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} data-testid="input-hires-expected" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <Button type="submit" disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold" data-testid="button-save-requirement">
                    {saveMutation.isPending
                      ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</>
                      : <><CheckCircle className="w-4 h-4" /> {editingId ? 'Update Job' : 'Post Job'}</>
                    }
                  </Button>
                  {(requirements.length > 0 || editingId) && (
                    <Button type="button" variant="outline" onClick={handleCancel} className="border-slate-200 text-slate-600 hover:bg-slate-50" data-testid="button-cancel-requirement">
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      {/* Requirements list */}
      {requirements.length > 0 && (
      <div className="space-y-3">
        {requirements.map((req) => (
            <div key={req.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
              {/* Blue accent line */}
              <div className="h-0.5 bg-blue-600" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title + status */}
                    <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{req.jobTitle}</h3>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${req.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {req.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Meta tags — all neutral */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { icon: IndianRupee, text: `₹${req.salaryMin/100}L – ₹${req.salaryMax/100}L` },
                        { icon: MapPin,      text: req.jobLocation },
                        { icon: Users,       text: `${req.hiresExpected} hire${req.hiresExpected > 1 ? 's' : ''}` },
                        { icon: GraduationCap, text: req.experienceLevel },
                      ].map(({ icon: Icon, text }) => (
                        <span key={text} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg">
                          <Icon className="w-3 h-3 text-slate-400 shrink-0" />
                          {text}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{req.jobDescription}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(req)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                      data-testid={`button-edit-${req.id}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                      data-testid={`button-delete-${req.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      )}
    </div>
  );
}