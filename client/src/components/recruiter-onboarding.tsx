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
  hiringVelocity: z.enum(["low", "medium", "high"], {
    required_error: "Please select hiring velocity",
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
    onboardingMutation.mutate(data);
  };

  const getCompanySizeDescription = (size: string) => {
    const descriptions = {
      startup: "1-50 employees",
      small: "51-200 employees", 
      medium: "201-1,000 employees",
      large: "1,001-10,000 employees",
      enterprise: "10,000+ employees"
    };
    return descriptions[size as keyof typeof descriptions];
  };

  const getHiringVelocityDescription = (velocity: string) => {
    const descriptions = {
      low: "1-5 hires per month",
      medium: "6-20 hires per month",
      high: "20+ hires per month"
    };
    return descriptions[velocity as keyof typeof descriptions];
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hiringVelocity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                          <TrendingUp className="w-4 h-4" />
                          How frequently do you hire? *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-hiring-velocity" className="h-12">
                              <SelectValue placeholder="Select hiring frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">Occasional</span>
                                <span className="text-xs text-gray-500">1-5 hires per month</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">Regular</span>
                                <span className="text-xs text-gray-500">6-20 hires per month</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex flex-col py-1">
                                <span className="font-medium">High Volume</span>
                                <span className="text-xs text-gray-500">20+ hires per month</span>
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