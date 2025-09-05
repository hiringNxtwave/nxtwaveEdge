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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target } from "lucide-react";

const onboardingSchema = z.object({
  collegesTier: z.enum(["only-iits", "iits-nits-bits", "tier1-including-iits", "tier2-colleges", "tier3-colleges"], {
    required_error: "Please select which colleges you hire from",
  }),
  annualFresherHires: z.enum(["1-5", "6-15", "16-30", "31-50", "50+"], {
    required_error: "Please select how many freshers you hire annually",
  }),
  budgetRange: z.string().min(1, "Budget range is required"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface RecruiterOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  userEmail?: string;
  userName?: string;
}

export function RecruiterOnboarding({ 
  isOpen, 
  onComplete, 
  userEmail, 
  userName 
}: RecruiterOnboardingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      collegesTier: undefined,
      annualFresherHires: undefined,
      budgetRange: "",
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      return apiRequest("/api/auth/complete-onboarding", "PUT", {
        ...data,
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

  const onSubmit = (data: OnboardingFormData) => {
    console.log("Form data being submitted:", data);
    console.log("Form errors:", form.formState.errors);
    onboardingMutation.mutate(data);
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onComplete()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-blue-900">
            Welcome to NxtWave! 🚀
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Just two quick questions to personalize your experience with India's top 10% freshers
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                  Quick Setup
                </CardTitle>
                <CardDescription>
                  Help us personalize your talent discovery experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="collegesTier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                          <Target className="w-4 h-4" />
                          Which colleges did you hire from last year? *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-colleges-tier" className="h-12">
                              <SelectValue placeholder="Select college tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="only-iits">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">Only IITs</span>
                                <span className="text-xs text-gray-500">Top-tier Indian Institutes of Technology</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="iits-nits-bits">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">IITs, NITs & BITS</span>
                                <span className="text-xs text-gray-500">Premier technical institutes</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="tier1-including-iits">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">Tier 1 Colleges including IITs</span>
                                <span className="text-xs text-gray-500">Top engineering and management institutes</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="tier2-colleges">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">Tier 2 Colleges like VIT, SRM etc</span>
                                <span className="text-xs text-gray-500">Well-known private and state universities</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="tier3-colleges">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">Tier 3 Colleges</span>
                                <span className="text-xs text-gray-500">Regional and local institutions</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annualFresherHires"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                          <TrendingUp className="w-4 h-4" />
                          How many freshers do you hire from campus every year? *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-annual-fresher-hires" className="h-12">
                              <SelectValue placeholder="Select number of hires" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-5">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">1-5 freshers</span>
                                <span className="text-xs text-gray-500">Small-scale hiring</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="6-15">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">6-15 freshers</span>
                                <span className="text-xs text-gray-500">Medium-scale hiring</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="16-30">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">16-30 freshers</span>
                                <span className="text-xs text-gray-500">Large-scale hiring</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="31-50">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">31-50 freshers</span>
                                <span className="text-xs text-gray-500">Enterprise-level hiring</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="50+">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">50+ freshers</span>
                                <span className="text-xs text-gray-500">Mass recruitment</span>
                              </div>
                            </SelectItem>
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
                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                          <DollarSign className="w-4 h-4" />
                          Typical salary budget for freshers? *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-budget-range" className="h-12">
                              <SelectValue placeholder="Select salary range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="8-12">8-12 LPA</SelectItem>
                            <SelectItem value="12-18">12-18 LPA</SelectItem>
                            <SelectItem value="18-25">18-25 LPA</SelectItem>
                            <SelectItem value="25-35">25-35 LPA</SelectItem>
                            <SelectItem value="35+">35+ LPA</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={onboardingMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
                data-testid="button-complete-setup"
              >
                {onboardingMutation.isPending ? "Setting up..." : "Get Started"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}