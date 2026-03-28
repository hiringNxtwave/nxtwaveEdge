import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Plus, Edit3, Trash2, MapPin, IndianRupee, Users, GraduationCap, Briefcase, CheckCircle, ChevronRight } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Top action row */}
      {!isAdding && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {requirements.length === 0 ? 'No open roles yet' : `${requirements.length} open role${requirements.length !== 1 ? 's' : ''}`}
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            data-testid="button-add-requirement"
          >
            <Plus className="w-4 h-4" /> Post a Job
          </button>
        </div>
      )}

      {/* Add / Edit form */}
      {isAdding && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{editingId ? 'Edit Job' : 'Post a New Role'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Fill in the basic details</p>
              </div>
            </div>
            <button type="button" onClick={handleCancel} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={roleName}
                onChange={e => { setRoleName(e.target.value); setFormError(''); }}
                placeholder="e.g. Software Engineer"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                data-testid="input-job-title"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={location}
                onChange={e => { setLocation(e.target.value); setFormError(''); }}
                placeholder="e.g. Hyderabad"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                data-testid="input-job-location"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Salary (LPA)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="e.g. 8"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                data-testid="input-salary"
              />
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                data-testid="button-save-requirement"
              >
                {saveMutation.isPending
                  ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving…</>
                  : <><CheckCircle className="w-4 h-4" /> {editingId ? 'Update Job' : 'Post Job'}</>
                }
              </button>
              <button type="button" onClick={handleCancel} className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs list */}
      {requirements.length > 0 && (
        <div className="space-y-3">
          {requirements.map((req) => (
            <div key={req.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-0.5 bg-blue-600" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Clickable left section */}
                  <button
                    className="flex-1 min-w-0 text-left"
                    onClick={() => navigate(`/browse?jobId=${req.id}`)}
                  >
                    <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{req.jobTitle}</h3>
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${req.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {req.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {req.salaryMax ? (
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg">
                          <IndianRupee className="w-3 h-3 text-slate-400" />
                          {(req.salaryMax / 100).toFixed(1)} LPA
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {req.jobLocation}
                      </span>
                    </div>
                  </button>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/browse?jobId=${req.id}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                      data-testid={`button-view-candidates-${req.id}`}
                    >
                      <Users className="w-3.5 h-3.5" /> View Candidates
                    </button>
                    <button
                      onClick={() => handleEdit(req)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                      data-testid={`button-edit-${req.id}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this job?')) deleteMutation.mutate(req.id); }}
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

      {/* Empty state when not adding */}
      {requirements.length === 0 && !isAdding && (
        <div className="text-center py-16 text-slate-400">
          <Briefcase className="w-8 h-8 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium">No jobs posted yet</p>
          <p className="text-xs mt-1">Click "Post a Job" to get started</p>
        </div>
      )}
    </div>
  );
}
