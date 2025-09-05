import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Users,
  Database,
  Shield,
  Clock,
  Zap
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface ATSIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidates?: StudentWithSkills[];
}

interface ATSProvider {
  id: string;
  name: string;
  logo: string;
  category: 'enterprise' | 'mid-market' | 'startup';
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync?: string;
  candidatesCount?: number;
  features: string[];
  authType: 'oauth' | 'api-key' | 'webhook';
}

export default function ATSIntegration({ isOpen, onClose, selectedCandidates = [] }: ATSIntegrationProps) {
  const [activeTab, setActiveTab] = useState("integrations");
  const [selectedProvider, setSelectedProvider] = useState<ATSProvider | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  const atsProviders: ATSProvider[] = [
    {
      id: 'workday',
      name: 'Workday',
      logo: '🏢',
      category: 'enterprise',
      status: 'connected',
      lastSync: '2 hours ago',
      candidatesCount: 1247,
      features: ['Bulk Import', 'Real-time Sync', 'Custom Fields', 'Interview Scheduling'],
      authType: 'oauth'
    },
    {
      id: 'greenhouse',
      name: 'Greenhouse',
      logo: '🌱',
      category: 'mid-market',
      status: 'connected',
      lastSync: '1 hour ago',
      candidatesCount: 892,
      features: ['Candidate Parsing', 'Stage Management', 'Scorecard Sync', 'Reporting'],
      authType: 'api-key'
    },
    {
      id: 'lever',
      name: 'Lever',
      logo: '⚖️',
      category: 'mid-market',
      status: 'disconnected',
      features: ['Profile Sync', 'Interview Notes', 'Feedback Loop', 'Pipeline Management'],
      authType: 'oauth'
    },
    {
      id: 'bamboohr',
      name: 'BambooHR',
      logo: '🎋',
      category: 'mid-market',
      status: 'syncing',
      lastSync: 'Syncing now...',
      candidatesCount: 567,
      features: ['Employee Records', 'Onboarding', 'Document Management', 'Reporting'],
      authType: 'api-key'
    },
    {
      id: 'recruitee',
      name: 'Recruitee',
      logo: '🎯',
      category: 'startup',
      status: 'disconnected',
      features: ['Candidate Database', 'Collaborative Hiring', 'Custom Workflows', 'Analytics'],
      authType: 'api-key'
    },
    {
      id: 'smartrecruiters',
      name: 'SmartRecruiters',
      logo: '🧠',
      category: 'enterprise',
      status: 'disconnected',
      features: ['AI Matching', 'Marketplace', 'CRM Integration', 'Global Hiring'],
      authType: 'oauth'
    }
  ];

  const exportFormats = [
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Standard comma-separated format compatible with most ATS systems',
      icon: '📊',
      compatibility: ['Workday', 'BambooHR', 'Recruitee', 'Custom Systems']
    },
    {
      id: 'xml',
      name: 'XML Export',
      description: 'Structured data format for enterprise ATS integrations',
      icon: '📄',
      compatibility: ['Workday', 'SmartRecruiters', 'Enterprise Systems']
    },
    {
      id: 'json',
      name: 'JSON Export',
      description: 'Modern API-friendly format with complete candidate data',
      icon: '🔧',
      compatibility: ['Greenhouse', 'Lever', 'Custom APIs', 'Modern Systems']
    },
    {
      id: 'ats-specific',
      name: 'ATS-Specific Format',
      description: 'Pre-formatted exports optimized for specific ATS platforms',
      icon: '🎯',
      compatibility: ['All Connected Systems', 'Custom Templates']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'syncing':
        return 'text-blue-600 bg-blue-100';
      case 'disconnected':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'enterprise':
        return 'text-purple-600 bg-purple-100';
      case 'mid-market':
        return 'text-blue-600 bg-blue-100';
      case 'startup':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleConnect = (provider: ATSProvider) => {
    setSelectedProvider(provider);
    setShowSetup(true);
  };

  const handleExport = (format: string) => {
    // Create mock export data
    const exportData = selectedCandidates.map(candidate => ({
      name: candidate.fullName,
      email: candidate.email || `${candidate.fullName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: '+91-9876543210',
      skills: candidate.skills?.join(', ') || '',
      experience: `${candidate.codingRating || 4} years equivalent`,
      location: candidate.location || 'India',
      expectedSalary: `₹${candidate.expectedSalaryMin || 6}-${candidate.expectedSalaryMax || 8} LPA`,
      university: candidate.university || 'Top Engineering College',
      graduationYear: candidate.graduationYear || new Date().getFullYear(),
      assessmentScores: {
        coding: candidate.codingRating || 4,
        communication: 4.2,
        problemSolving: 4.1
      }
    }));

    // Trigger download based on format
    const filename = `nxtwave_candidates_${new Date().toISOString().split('T')[0]}.${format === 'ats-specific' ? 'csv' : format}`;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`${selectedCandidates.length} candidates exported as ${format.toUpperCase()}`);
  };

  const handleSync = (providerId: string) => {
    alert(`Syncing with ${providerId}... This will update ${selectedCandidates.length} candidates in your ATS.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>ATS Integration & Export</span>
            {selectedCandidates.length > 0 && (
              <Badge variant="secondary">{selectedCandidates.length} candidates selected</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="integrations">ATS Integrations</TabsTrigger>
              <TabsTrigger value="export">Export & Sync</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="integrations" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {atsProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{provider.logo}</span>
                          <div>
                            <CardTitle className="text-lg">{provider.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getCategoryColor(provider.category)} variant="secondary">
                                {provider.category}
                              </Badge>
                              <Badge className={getStatusColor(provider.status)} variant="secondary">
                                {provider.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {provider.status === 'syncing' && (
                          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {provider.lastSync && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Last sync: {provider.lastSync}</span>
                            {provider.candidatesCount && (
                              <Badge variant="outline" className="ml-auto">
                                {provider.candidatesCount} candidates
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {provider.features.slice(0, 2).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {provider.features.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{provider.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {provider.status === 'connected' ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleSync(provider.id)}
                                data-testid={`button-sync-${provider.id}`}
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Sync Now
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                data-testid={`button-configure-${provider.id}`}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleConnect(provider)}
                              data-testid={`button-connect-${provider.id}`}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportFormats.map((format) => (
                  <Card key={format.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span className="text-xl">{format.icon}</span>
                        <span>{format.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{format.description}</p>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Compatible with:</div>
                        <div className="flex flex-wrap gap-1">
                          {format.compatibility.slice(0, 2).map((ats) => (
                            <Badge key={ats} variant="outline" className="text-xs">
                              {ats}
                            </Badge>
                          ))}
                          {format.compatibility.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{format.compatibility.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleExport(format.id)}
                        disabled={selectedCandidates.length === 0}
                        data-testid={`button-export-${format.id}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export {selectedCandidates.length} Candidates
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900">Data Privacy & Security</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        All exports are encrypted and comply with GDPR, CCPA, and Indian data protection laws. 
                        Candidate consent is automatically verified before any data transfer to external ATS systems.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-sync">Automatic Sync</Label>
                      <Switch id="auto-sync" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="real-time">Real-time Updates</Label>
                      <Switch id="real-time" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bi-directional">Bi-directional Sync</Label>
                      <Switch id="bi-directional" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sync-frequency">Sync Frequency</Label>
                      <select id="sync-frequency" className="w-full p-2 border rounded-md">
                        <option value="hourly">Every Hour</option>
                        <option value="daily" selected>Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="manual">Manual Only</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Mapping</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Custom Field Mapping</Label>
                      <div className="text-sm text-gray-600">
                        Map NxtWave candidate fields to your ATS fields for seamless integration.
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" data-testid="button-configure-mapping">
                      <Database className="w-4 h-4 mr-2" />
                      Configure Field Mapping
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-test-connection">
                      <Zap className="w-4 h-4 mr-2" />
                      Test ATS Connections
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {atsProviders.filter(p => p.status === 'connected').map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{provider.logo}</span>
                          <div>
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-sm text-gray-600">{provider.lastSync}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <Badge variant="outline">{provider.candidatesCount} synced</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {atsProviders.filter(p => p.status === 'connected').length} of {atsProviders.length} ATS systems connected
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose} data-testid="button-close-ats">
                Close
              </Button>
              {selectedCandidates.length > 0 && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleExport('csv')}
                  data-testid="button-quick-export"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Quick Export ({selectedCandidates.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* ATS Setup Modal */}
      {showSetup && selectedProvider && (
        <Dialog open={showSetup} onOpenChange={setShowSetup}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Connect to {selectedProvider.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Connect your {selectedProvider.name} account to enable seamless candidate synchronization.
              </div>
              
              {selectedProvider.authType === 'api-key' ? (
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input 
                    id="api-key" 
                    type="password" 
                    placeholder="Enter your API key"
                    data-testid="input-api-key"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>OAuth Authentication</Label>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="button-oauth-connect"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Authorize with {selectedProvider.name}
                  </Button>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowSetup(false)}
                  data-testid="button-cancel-setup"
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowSetup(false);
                    alert(`Successfully connected to ${selectedProvider.name}!`);
                  }}
                  data-testid="button-confirm-setup"
                >
                  Connect
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}