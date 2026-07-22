import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Upload,
  Share2,
  Send,
  CheckCircle,
  Copy,
  FileSpreadsheet,
  Users,
  Building2,
  Eye,
  Clock,
  ArrowUpRight,
  Inbox,
} from "lucide-react";

interface JobWithCompany {
  id: string;
  companyId: string;
  jobTitle: string;
  jobDescription: string;
  jobLocation: string;
  salaryMin: number | null;
  salaryMax: number | null;
  requiredSkills: string | null;
  status: string | null;
  isActive: boolean | null;
  hiresExpected: number;
  createdAt: Date | null;
  companyName: string;
  shareCount: number;
}

interface SharedCandidate {
  id: string;
  jobId: string;
  studentId: string;
  companyId: string;
  token: string;
  expiresAt: Date;
  status: string | null;
  viewedAt: Date | null;
  createdAt: Date | null;
  jobTitle: string;
  studentName: string;
  companyName: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  degree: string;
  major: string;
  cgpa: string | null;
  dsaScore: number | null;
  overallAssessmentScore: number | null;
  recommendation: string | null;
  location: string;
}

const TABS = [
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "import", label: "Import", icon: Upload },
  { id: "shared", label: "Shared", icon: Share2 },
  { id: "send", label: "Send", icon: Send },
] as const;

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("jobs");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobWithCompany | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [shareExpiry, setShareExpiry] = useState("24");
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importFileName, setImportFileName] = useState("");

  if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
    navigate("/");
    return null;
  }

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<JobWithCompany[]>({
    queryKey: ["/api/admin/jobs"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: sharedCandidates = [], isLoading: sharedLoading } = useQuery<SharedCandidate[]>({
    queryKey: ["/api/admin/shared-candidates"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const importMutation = useMutation({
    mutationFn: async (studentsData: any[]) => {
      return apiRequest("POST", "/api/admin/import-candidates", { students: studentsData });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Import successful",
        description: data.message || "Students imported successfully",
      });
      setImportPreview([]);
      setImportFileName("");
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
    },
    onError: (error: any) => {
      toast({
        title: "Import failed",
        description: error.message || "Failed to import students",
        variant: "destructive",
      });
    },
  });

  const shareMutation = useMutation({
    mutationFn: async (data: { jobId: string; studentIds: string[]; companyId: string; expiresInHours: number }) => {
      return apiRequest("POST", "/api/admin/share-candidates", data);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Candidates shared",
        description: `Shared ${data.shares?.length || 0} candidates successfully`,
      });
      setShareDialogOpen(false);
      setSelectedStudents([]);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shared-candidates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Share failed",
        description: error.message || "Failed to share candidates",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);

    try {
      let rows: any[] = [];

      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const lines = text.split("\n").filter((l) => l.trim());
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        rows = lines.slice(1).map((line) => {
          const values = line.split(",");
          const row: any = {};
          headers.forEach((header, i) => {
            row[header] = values[i]?.trim() || "";
          });
          return row;
        });
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const XLSX = await import("xlsx");
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        rows = XLSX.utils.sheet_to_json(worksheet);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file",
          variant: "destructive",
        });
        return;
      }

      const mapped = rows.map((row) => ({
        firstName: row.first_name || row.firstName || row.firstname || "",
        lastName: row.last_name || row.lastName || row.lastname || "",
        email: row.email || "",
        phone: row.phone || row.mobile || "",
        university: row.university || row.college || row.institution || "",
        degree: row.degree || row.course || "B.Tech",
        major: row.major || row.branch || row.specialization || "",
        graduationYear: parseInt(row.graduation_year || row.graduationYear || row.year || "2024"),
        cgpa: row.cgpa || row.gpa || null,
        location: row.location || row.city || "",
        dsaScore: parseInt(row.dsa_score || row.dsaScore || "0") || null,
        csFundamentalsScore: parseInt(row.cs_fundamentals_score || row.csFundamentalsScore || "0") || null,
        aptitudeScore: parseInt(row.aptitude_score || row.aptitudeScore || "0") || null,
        verbalCommunicationScore: parseInt(row.verbal_score || row.verbalCommunicationScore || "0") || null,
        overallAssessmentScore: parseInt(row.overall_score || row.overallAssessmentScore || "0") || null,
      }));

      setImportPreview(mapped.slice(0, 10));
      toast({
        title: "File parsed",
        description: `Found ${mapped.length} students. Preview shows first 10.`,
      });

      (window as any).__importData = mapped;
    } catch (error) {
      toast({
        title: "Parse error",
        description: "Failed to parse file. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const confirmImport = () => {
    const data = (window as any).__importData;
    if (data && data.length > 0) {
      importMutation.mutate(data);
    }
  };

  const copyShareLink = (jobId: string, token: string) => {
    const link = `${window.location.origin}/browse?jobId=${jobId}&token=${token}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return <span className="badge-status badge-active">Active</span>;
      case "closed":
        return <span className="badge-status badge-closed">Closed</span>;
      case "draft":
        return <span className="badge-status badge-draft">Draft</span>;
      case "viewed":
        return <span className="badge-status badge-viewed">Viewed</span>;
      case "expired":
        return <span className="badge-status bg-muted text-muted-foreground border border-border">Expired</span>;
      default:
        return <span className="badge-status bg-muted text-muted-foreground border border-border">{status || "Unknown"}</span>;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const totalShared = sharedCandidates.length;
  const viewedCount = sharedCandidates.filter((s) => s.status === "viewed").length;

  return (
    <div className="page-container sidebar-margin">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage jobs, import candidates, and share with companies</p>
      </div>

      <div className="card-grid-4 section-gap">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="mt-3">
            <div className="stat-value">{totalJobs}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="stat-value">{activeJobs}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="stat-value">{totalShared}</div>
            <div className="stat-label">Shared Candidates</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="stat-value">{viewedCount}</div>
            <div className="stat-label">Viewed by Companies</div>
          </div>
        </div>
      </div>

      <div className="tab-bar section-gap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-item flex items-center gap-2 ${activeTab === tab.id ? "tab-item-active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "jobs" && (
        <div className="table-wrapper animate-fade-in">
          {jobsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="empty-state-title">No jobs yet</div>
              <div className="empty-state-description">
                Create a job from the Jobs page to get started.
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="table-cell-header">Job Title</TableHead>
                  <TableHead className="table-cell-header">Company</TableHead>
                  <TableHead className="table-cell-header">Location</TableHead>
                  <TableHead className="table-cell-header">Salary</TableHead>
                  <TableHead className="table-cell-header">Status</TableHead>
                  <TableHead className="table-cell-header text-center">Shared</TableHead>
                  <TableHead className="table-cell-header">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id} className="group">
                    <TableCell className="table-cell font-medium text-foreground">
                      {job.jobTitle}
                    </TableCell>
                    <TableCell className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center shrink-0">
                          <Building2 className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <span className="truncate">{job.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="table-cell text-muted-foreground">
                      {job.jobLocation}
                    </TableCell>
                    <TableCell className="table-cell text-muted-foreground">
                      {job.salaryMin && job.salaryMax
                        ? `${(job.salaryMin / 100).toFixed(1)}–${(job.salaryMax / 100).toFixed(1)} LPA`
                        : "—"}
                    </TableCell>
                    <TableCell className="table-cell">{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="table-cell text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                        {job.shareCount}
                      </span>
                    </TableCell>
                    <TableCell className="table-cell">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs font-medium"
                        onClick={() => {
                          setSelectedJob(job);
                          setShareDialogOpen(true);
                        }}
                      >
                        <Share2 className="w-3.5 h-3.5 mr-1.5" />
                        Share
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {activeTab === "import" && (
        <div className="animate-fade-in space-y-5">
          <div className="surface-card p-6">
            <div
              className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/40 hover:bg-primary/[0.02] transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Upload CSV or Excel file
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supported formats: .csv, .xlsx, .xls
              </p>
              <Button variant="outline" size="sm" className="pointer-events-none">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Choose File
              </Button>
              {importFileName && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{importFileName}</span>
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {importPreview.length > 0 && (
            <div className="table-wrapper">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div>
                  <span className="text-sm font-medium">Preview</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    First {importPreview.length} rows
                  </span>
                </div>
                <Button
                  size="sm"
                  className="h-8"
                  onClick={confirmImport}
                  disabled={importMutation.isPending}
                >
                  {importMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent mr-1.5" />
                      Importing…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Confirm Import
                    </>
                  )}
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="table-cell-header">Name</TableHead>
                    <TableHead className="table-cell-header">Email</TableHead>
                    <TableHead className="table-cell-header">University</TableHead>
                    <TableHead className="table-cell-header">Degree</TableHead>
                    <TableHead className="table-cell-header">CGPA</TableHead>
                    <TableHead className="table-cell-header">DSA</TableHead>
                    <TableHead className="table-cell-header">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importPreview.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="table-cell font-medium">
                        {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground truncate max-w-[180px]">
                        {row.email}
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground truncate max-w-[160px]">
                        {row.university}
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground">
                        {row.degree} — {row.major}
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground">{row.cgpa || "—"}</TableCell>
                      <TableCell className="table-cell text-muted-foreground">{row.dsaScore || "—"}</TableCell>
                      <TableCell className="table-cell text-muted-foreground">{row.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="surface-card p-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Expected columns
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Required: </span>
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">first_name</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">last_name</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">email</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">university</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">degree</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">major</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">graduation_year</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">location</code>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Optional: </span>
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">phone</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">cgpa</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">dsa_score</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">cs_fundamentals_score</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">aptitude_score</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">verbal_score</code>{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">overall_score</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "shared" && (
        <div className="table-wrapper animate-fade-in">
          {sharedLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            </div>
          ) : sharedCandidates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="empty-state-title">No shared candidates</div>
              <div className="empty-state-description">
                Use the Jobs tab to share candidates with companies.
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="table-cell-header">Student</TableHead>
                  <TableHead className="table-cell-header">Job</TableHead>
                  <TableHead className="table-cell-header">Company</TableHead>
                  <TableHead className="table-cell-header">Status</TableHead>
                  <TableHead className="table-cell-header">Shared</TableHead>
                  <TableHead className="table-cell-header">Expires</TableHead>
                  <TableHead className="table-cell-header">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharedCandidates.map((share) => (
                  <TableRow key={share.id} className="group">
                    <TableCell className="table-cell font-medium text-foreground">
                      {share.studentName}
                    </TableCell>
                    <TableCell className="table-cell text-muted-foreground">
                      {share.jobTitle}
                    </TableCell>
                    <TableCell className="table-cell text-muted-foreground">
                      {share.companyName}
                    </TableCell>
                    <TableCell className="table-cell">{getStatusBadge(share.status)}</TableCell>
                    <TableCell className="table-cell text-muted-foreground">
                      {share.createdAt ? new Date(share.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="table-cell text-muted-foreground">
                      {share.expiresAt ? new Date(share.expiresAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="table-cell">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => copyShareLink(share.jobId, share.token)}
                        title="Copy link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {activeTab === "send" && (
        <div className="surface-card p-8 animate-fade-in">
          <div className="empty-state py-0">
            <div className="empty-state-icon">
              <Send className="w-6 h-6" />
            </div>
            <div className="empty-state-title">Send candidates to a company</div>
            <div className="empty-state-description">
              Go to the Jobs tab, select a job, and click "Share" to send candidates to a company.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("jobs")}
            >
              <Briefcase className="w-3.5 h-3.5 mr-1.5" />
              Go to Jobs
            </Button>
          </div>
        </div>
      )}

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Share Candidates</DialogTitle>
            <DialogDescription>
              {selectedJob
                ? `Share candidates for "${selectedJob.jobTitle}" at ${selectedJob.companyName}`
                : "Select candidates to share"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Link Expiry</Label>
              <Select value={shareExpiry} onValueChange={setShareExpiry}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours (default)</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                A unique token link will be generated for each selected student. The link expires in{" "}
                <span className="font-medium text-foreground">{shareExpiry} hours</span>.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (selectedJob) {
                  toast({
                    title: "Feature coming soon",
                    description: "Student selection UI will be added next",
                  });
                }
              }}
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Generate Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
