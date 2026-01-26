// file: src/components/setup-guide-display.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Zap } from 'lucide-react';
import type { SetupGuide, SetupGuideStep } from '@/lib/setup-guide';

interface SetupGuideDisplayProps {
  guide: SetupGuide;
  onSelectStep?: (step: SetupGuideStep) => void;
}

export function SetupGuideDisplay({ guide, onSelectStep }: SetupGuideDisplayProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const toggleComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const progressPercent = Math.round((completedSteps.size / guide.steps.length) * 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{guide.title}</CardTitle>
        <CardDescription>{guide.description}</CardDescription>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{guide.totalDuration} min total</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span>{guide.steps.length} steps</span>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          {guide.steps.map((step, idx) => (
            <div key={step.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full p-3 flex items-center justify-between hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(step.id);
                    }}
                    className="flex-shrink-0"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        completedSteps.has(step.id)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {completedSteps.has(step.id) && (
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {idx + 1}. {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.duration_minutes} min
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-xs ${difficultyColor[step.difficulty]}`}
                  >
                    {step.difficulty}
                  </Badge>
                </div>
              </button>

              {expandedStep === step.id && (
                <div className="border-t bg-muted p-3 space-y-3">
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      onSelectStep?.(step);
                    }}
                  >
                    Get Help with This Step
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
          💡 Tip: Click "Get Help with This Step" to ask the AI assistant for detailed guidance on any step.
        </p>
      </CardContent>
    </Card>
  );
}
