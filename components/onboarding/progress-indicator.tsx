"use client";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-1.5 w-8 rounded-full transition-colors ${
            currentStep >= index + 1 ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

