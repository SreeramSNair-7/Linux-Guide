// file: src/components/onboarding-tour.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  target: string;
  action: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to Linux Finder!',
    description: 'This interactive tour will show you how to find your perfect Linux distribution. Click "Next" to continue.',
    target: 'body',
    action: 'browse',
  },
  {
    title: 'Browse All Distributions',
    description: 'Click "Browse All Distros" to explore our complete catalog of 20+ Linux distributions with detailed information.',
    target: 'browse-button',
    action: 'browse',
  },
  {
    title: 'Take the Quiz',
    description: 'Not sure which distro is right for you? Take our interactive quiz to get personalized recommendations based on your needs.',
    target: 'quiz-button',
    action: 'quiz',
  },
  {
    title: 'Search & Filter',
    description: 'Use advanced filters to narrow down distributions by family, desktop environment, RAM requirements, and more.',
    target: 'search-area',
    action: 'search',
  },
  {
    title: 'Compare Distributions',
    description: 'Compare up to 5 distributions side-by-side to find the best fit for your use case.',
    target: 'compare-button',
    action: 'compare',
  },
  {
    title: 'AI Assistant Help',
    description: 'Click the chat icon in the bottom right to ask our AI assistant for help with installation, troubleshooting, and more.',
    target: 'chat-button',
    action: 'chat',
  },
];

interface OnboardingTourProps {
  isFirstVisit: boolean;
  onClose: () => void;
}

export function OnboardingTour({ isFirstVisit, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isFirstVisit);

  useEffect(() => {
    if (!isFirstVisit) {
      setIsVisible(false);
    }
  }, [isFirstVisit]);

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
    localStorage.setItem('tour-completed', 'true');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-96 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close tour">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{step.description}</p>
          
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={handlePrev}
              disabled={isFirstStep}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
