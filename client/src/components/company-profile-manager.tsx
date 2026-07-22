import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import {
  Plus,
  Edit3,
  Trash2,
  MapPin,
  IndianRupee,
  Users,
  Briefcase,
  CheckCircle,
  X,
  Inbox,
} from 'lucide-react';
import { sendGTMEvent } from '@/lib/gtm';

interface JobRequirement {
  id: string;
  jobTitle: string;
  jobDescription: string;
  jobLocation: string;
  salaryMin: number | null;
  salaryMax: number | null;
  hiresExpected: number;
  experienceLevel: string;
  workMode: string;
  isActive: boolean;
  createdAt: string;
}

export function CompanyProfileManager() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [roleName, setRoleName] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [formError, setFormError] = useState('');

  const { data: requirements = [], isLoading } = useQuery<JobRequirement[]>({
    queryKey: ['/api/company/requirements'],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { jobTitle: string; jobLocation: string; salaryMax: number }) => {
      if (editingId) {
        const res = await apiRequest('PUT', `/api/company/requirements/${editingId}`, data);
        return res.json();
      }
      const res = await apiRequest('POST', '/api/company/requirements', data);
      return res.json();
    },
    onSuccess: (saved) => {
      toast({ title: editingId ? 'Job updated!' : 'Job posted!', description: 'Finding matched candidates…' });
      queryClient.invalidateQueries({ queryKey: ['/api/company/requirements'] });
      handleCancel();
      if (saved?.id) navigate(`/browse?jobId=${saved.id}`);
      else navigate('/browse');
    },
    onError: (err: any) => {
      const msg = err?.message || 'Could not save job. Please try again.';
      toast({ title: 'Error', description: msg.slice(0, 200), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/company/requirements/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Deleted', description: 'Job removed.' });
      queryClient.invalidateQueries({ queryKey: ['/api/company/requirements'] });
    },
  });

  function handleCancel() {
    setIsAdding(false);
    setEditingId(null);
    setRoleName('');
    setLocation('');
    setSalary('');
    setFormError('');
  }

  function handleEdit(req: JobRequirement) {
    setEditingId(req.id);
    setRoleName(req.jobTitle);
    setLocation(req.jobLocation);
    setSalary(req.salaryMax ? String(Math.round(req.salaryMax / 100)) : '');
    setIsAdding(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!roleName.trim()) { setFormError('Role name is required.'); return; }
    if (!location.trim()) { setFormError('Location is required.'); return; }
    setFormError('');
    const salaryLPA = parseFloat(salary) || 0;
    saveMutation.mutate({
      jobTitle: roleName.trim(),
      jobLocation: location.trim(),
      salaryMax: Math.round(salaryLPA * 100),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {requirements.length === 0 ? 'No roles' : `${requirements.length} role${requirements.length !== 1 ? 's' : ''}`}
          </span>
          <button
            id="company_profile_post_job_click"
            onClick={() => { sendGTMEvent("company_profile_post_job_click"); setIsAdding(true); }}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            data-testid="button-add-requirement"
          >
            <Plus className="w-3.5 h-3.5" />
            Post Job
          </button>
        </div>

        {requirements.length === 0 && !isAdding && (
          <div className="surface-card p-8 text-center">
            <div className="empty-state py-0">
              <div className="empty-state-icon">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="empty-state-title">No jobs posted yet</div>
              <div className="empty-state-description">
                Click "Post Job" to create your first listing.
              </div>
            </div>
          </div>
        )}

        {requirements.map((req) => (
          <button
            key={req.id}
            id={`company_profile_job_name_${req.id}_click`}
            onClick={() => { sendGTMEvent("company_profile_job_name_click", { jobId: req.id, jobTitle: req.jobTitle }); navigate(`/browse?jobId=${req.id}`); }}
            className={`w-full text-left surface-card p-4 transition-all hover:shadow-sm ${
              !isAdding && !editingId ? 'hover:border-primary/30' : ''
            }`}
            data-testid={`job-card-${req.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">{req.jobTitle}</h3>
                  <span className={`badge-status shrink-0 ${req.isActive ? 'badge-active' : 'bg-muted text-muted-foreground border border-border'}`}>
                    {req.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {req.jobLocation}
                  </span>
                  {req.salaryMax ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <IndianRupee className="w-3 h-3" />
                      {(req.salaryMax / 100).toFixed(1)} LPA
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  id={`company_profile_edit_job_${req.id}_click`}
                  onClick={(e) => { e.stopPropagation(); sendGTMEvent("company_profile_edit_job_click", { jobId: req.id, jobTitle: req.jobTitle }); handleEdit(req); }}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  data-testid={`button-edit-${req.id}`}
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`company_profile_delete_job_${req.id}_click`}
                  onClick={(e) => { e.stopPropagation(); if (confirm('Delete this job?')) { sendGTMEvent("company_profile_delete_job_click", { jobId: req.id, jobTitle: req.jobTitle }); deleteMutation.mutate(req.id); } }}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  data-testid={`button-delete-${req.id}`}
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div>
        {isAdding ? (
          <div className="surface-card animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{editingId ? 'Edit Job' : 'Post a New Role'}</h3>
                  <p className="text-xs text-muted-foreground">Fill in the details below</p>
                </div>
              </div>
              <button
                id="company_profile_form_cancel_click"
                type="button"
                onClick={() => { sendGTMEvent("company_profile_form_cancel_click"); handleCancel(); }}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Role Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => { setRoleName(e.target.value); setFormError(''); }}
                  placeholder="e.g. Software Engineer"
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-job-title"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Location <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setFormError(''); }}
                  placeholder="e.g. Hyderabad"
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-job-location"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Salary (LPA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 8"
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-salary"
                />
              </div>

              {formError && (
                <p className="text-xs text-destructive">{formError}</p>
              )}

              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <button
                  id="company_profile_save_job_click"
                  type="submit"
                  disabled={saveMutation.isPending}
                  onClick={() => { if (!saveMutation.isPending) sendGTMEvent("company_profile_save_job_click", { action: editingId ? "update" : "create" }); }}
                  className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  data-testid="button-save-requirement"
                >
                  {saveMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      {editingId ? 'Update Job' : 'Post Job'}
                    </>
                  )}
                </button>
                <button
                  id="company_profile_form_cancel_footer_click"
                  type="button"
                  onClick={() => { sendGTMEvent("company_profile_form_cancel_click"); handleCancel(); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="surface-card animate-fade-in">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Inbox className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {requirements.length > 0 ? 'Select a job to view details' : 'No job selected'}
              </p>
              <p className="text-xs text-muted-foreground max-w-[240px]">
                {requirements.length > 0
                  ? 'Click a job on the left to browse candidates, or create a new one.'
                  : 'Post your first job to start finding candidates.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
