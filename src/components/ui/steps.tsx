
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
  status: 'pending' | 'current' | 'complete';
}

interface StepsProps {
  steps: Step[];
}

export function Steps({ steps }: StepsProps) {
  return (
    <div className="space-y-4">
      <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
        <ol className="relative z-10 flex justify-between">
          {steps.map((step, index) => (
            <li key={step.title} className="flex items-center gap-2 bg-white p-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                  {
                    "border-primary bg-primary text-white": step.status === "complete",
                    "border-primary bg-white text-primary": step.status === "current",
                    "border-gray-300 bg-white text-gray-300": step.status === "pending",
                  }
                )}
              >
                {index + 1}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ol className="grid grid-cols-3 gap-4">
        {steps.map((step) => (
          <li key={step.title} className="text-center">
            <h3 className={cn(
              "font-medium",
              {
                "text-primary": step.status === "complete" || step.status === "current",
                "text-gray-500": step.status === "pending",
              }
            )}>
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
