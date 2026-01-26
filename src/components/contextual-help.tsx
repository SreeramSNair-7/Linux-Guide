// file: src/components/contextual-help.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ContextualHelpProps {
  pageType: 'home' | 'distros' | 'distro-detail' | 'compare' | 'quiz' | 'submit';
  onOpenChat?: () => void;
}

const HELP_CONTENT: Record<string, { title: string; description: string; tips: string[] }> = {
  home: {
    title: 'Getting Started',
    description: 'Welcome to Linux Finder! Here are some ways to find your perfect Linux distribution:',
    tips: [
      'Use the "Browse All Distros" button to see our complete catalog',
      'Take the interactive quiz for personalized recommendations',
      'Use the AI assistant (bottom right) to ask specific questions',
      'Filter by desktop environment, system requirements, or use case',
    ],
  },
  distros: {
    title: 'Browsing Distributions',
    description: 'Learn how to effectively search and filter Linux distributions:',
    tips: [
      'Use the search bar to find distributions by name or description',
      'Filter by family (Debian, Red Hat, Arch, etc.) for similar distros',
      'Sort by popularity, release date, or system requirements',
      'Click "Compare" to see multiple distros side-by-side',
      'Use the "Get Help" button on any distro card for AI guidance',
    ],
  },
  'distro-detail': {
    title: 'Distribution Details',
    description: 'Understand all the information available for each distribution:',
    tips: [
      'View system requirements to ensure compatibility',
      'Check available desktop environments and their specs',
      'Download verified ISO files with checksum verification',
      'Follow step-by-step installation guides',
      'Ask the AI assistant for help with installation or troubleshooting',
    ],
  },
  compare: {
    title: 'Comparing Distributions',
    description: 'Use comparison features to make an informed decision:',
    tips: [
      'Compare up to 5 distributions simultaneously',
      'View side-by-side specifications and features',
      'Check system requirements across multiple distros',
      'Compare desktop environments and available tools',
      'Ask the AI for a recommendation based on your needs',
    ],
  },
  quiz: {
    title: 'Interactive Quiz',
    description: 'Get personalized recommendations based on your preferences:',
    tips: [
      'Answer questions about your experience level',
      'Select your preferred desktop environment',
      'Specify your primary use case',
      'Set system requirements based on your hardware',
      'Receive tailored distro recommendations with explanations',
    ],
  },
  submit: {
    title: 'Submit Suggestions',
    description: 'Help us improve our catalog by submitting feedback:',
    tips: [
      'Suggest new distributions to add to our catalog',
      'Report issues or outdated information',
      'Share your experiences with specific distributions',
      'Propose improvements to our guides and documentation',
      'All submissions are reviewed by our team',
    ],
  },
};

export function ContextualHelp({ pageType, onOpenChat }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const content = HELP_CONTENT[pageType] || HELP_CONTENT.home;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <ul className="space-y-2">
            {content.tips.map((tip, idx) => (
              <li key={idx} className="flex gap-2 text-sm">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Need more detailed help?
            </p>
            <Button 
              className="w-full gap-2" 
              onClick={() => {
                setIsOpen(false);
                onOpenChat?.();
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
