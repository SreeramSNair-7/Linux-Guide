// file: src/components/install-stepper.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRiskClasses } from '@/lib/utils';
import type { InstallStep } from '@/types/distro.schema';
import { Clock, AlertTriangle, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface InstallStepperProps {
  steps: InstallStep[];
  distroName: string;
}

export function InstallStepper({ steps, distroName }: InstallStepperProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set([steps[0]?.id]));
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const toggleComplete = (stepId: string) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const totalMinutes = steps.reduce((sum, step) => sum + step.estimated_minutes, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Installation Steps for {distroName}</CardTitle>
          <CardDescription>
            Estimated total time: {totalMinutes} minutes · {steps.length} steps
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id);
          const isCompleted = completedSteps.has(step.id);

          return (
            <Card key={step.id} className={isCompleted ? 'border-green-500' : ''}>
              <CardHeader className="cursor-pointer" onClick={() => toggleStep(step.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" aria-hidden="true" />
                      ) : (
                        <div className="step-number">{index + 1}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {step.estimated_minutes} min
                        </Badge>
                        <Badge className={getRiskClasses(step.risk)}>
                          <AlertTriangle className="mr-1 h-3 w-3" aria-hidden="true" />
                          {step.risk} risk
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-4">
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.detail_md}</ReactMarkdown>
                  </div>

                  {step.commands && step.commands.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Commands</h4>
                      {step.commands.map((cmd, idx) => (
                        <div key={idx} className="rounded-lg border bg-muted p-3">
                          <div className="mb-1 flex items-center justify-between">
                            <Badge variant="outline">{cmd.platform}</Badge>
                          </div>
                          <code className="block overflow-x-auto text-sm">{cmd.command}</code>
                          <p className="mt-2 text-xs text-muted-foreground">{cmd.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant={isCompleted ? 'outline' : 'default'}
                      onClick={() => toggleComplete(step.id)}
                      size="sm"
                    >
                      {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
