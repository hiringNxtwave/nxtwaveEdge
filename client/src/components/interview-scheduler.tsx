import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, Video, MapPin, User, MessageSquare } from "lucide-react";
import { format, addDays } from "date-fns";

interface InterviewSchedulerProps {
  studentId: string;
  studentName: string;
  onScheduled?: () => void;
  onClose?: () => void;
}

export default function InterviewScheduler({ 
  studentId, 
  studentName, 
  onScheduled,
  onClose 
}: InterviewSchedulerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '10:00',
    duration: '60',
    interviewType: 'technical',
    notes: '',
    meetingLink: ''
  });

  const scheduleInterviewMutation = useMutation({
    mutationFn: async (data: any) => {
      const scheduledAt = new Date(`${data.date}T${data.time}:00`);
      return await apiRequest("/api/interviews", "POST", {
        studentId,
        scheduledAt: scheduledAt.toISOString(),
        duration: parseInt(data.duration),
        interviewType: data.interviewType,
        notes: data.notes,
        meetingLink: data.meetingLink
      });
    },
    onSuccess: () => {
      toast({
        title: "Interview Scheduled Successfully!",
        description: `Interview with ${studentName} has been scheduled.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      onScheduled?.();
      onClose?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error Scheduling Interview",
        description: error.message || "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendInvitationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/messages", "POST", {
        receiverId: studentId,
        messageType: "interview_invite",
        content: `Interview Invitation: ${formData.interviewType} interview scheduled for ${format(new Date(`${formData.date}T${formData.time}:00`), 'PPP')} at ${formData.time}. Duration: ${formData.duration} minutes.`,
        conversationId: `${user?.id}-${studentId}`
      });
    },
    onSuccess: () => {
      toast({
        title: "Invitation Sent",
        description: "Interview invitation has been sent to the student.",
      });
    }
  });

  const handleSchedule = async () => {
    setLoading(true);
    try {
      await scheduleInterviewMutation.mutateAsync(formData);
      await sendInvitationMutation.mutateAsync();
    } catch (error) {
      // Error handled in mutation onError
    } finally {
      setLoading(false);
    }
  };

  const generateMeetLink = () => {
    const meetId = Math.random().toString(36).substring(2, 15);
    setFormData(prev => ({
      ...prev,
      meetingLink: `https://meet.google.com/${meetId}`
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-blue-600" />
          Schedule Interview
        </CardTitle>
        <p className="text-sm text-gray-600">
          Schedule an interview with {studentName}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              data-testid="input-interview-date"
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              data-testid="input-interview-time"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="type">Interview Type</Label>
            <Select
              value={formData.interviewType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, interviewType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="hr">HR Round</SelectItem>
                <SelectItem value="final">Final Round</SelectItem>
                <SelectItem value="cultural">Cultural Fit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="meetingLink">Meeting Link</Label>
          <div className="flex gap-2">
            <Input
              id="meetingLink"
              placeholder="https://meet.google.com/..."
              value={formData.meetingLink}
              onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
              data-testid="input-meeting-link"
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateMeetLink}
              data-testid="button-generate-meet-link"
            >
              Generate
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Additional interview details or preparation notes..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            data-testid="textarea-interview-notes"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSchedule}
            disabled={loading || !formData.date || !formData.time}
            className="flex-1"
            data-testid="button-schedule-interview"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </>
            )}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose} data-testid="button-cancel-interview">
              Cancel
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-3 h-3" />
            <span className="font-medium">What happens next?</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Student will receive interview invitation via email</li>
            <li>Calendar invite will be sent automatically</li>
            <li>Interview link will be shared 30 minutes before</li>
            <li>You can reschedule or cancel anytime</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}