
import { Check } from "lucide-react";

interface FeatureItemProps {
  text: string;
  delay: number;
}

const FeatureItem = ({ text, delay }: FeatureItemProps) => (
  <div 
    className="feature-item" 
    style={{ animationDelay: `${delay}s` }}
  >
    <Check className="w-4 h-4 text-primary shrink-0" />
    <span className="text-gray-600 text-base">{text}</span>
  </div>
);

export const FeatureList = () => {
  const features = [
    "Reduce response time by up to 70%",
    "AI-powered ticket automation",
    "Smart analytics and insights",
    "Seamless integration with your tools",
  ];

  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <FeatureItem 
          key={index} 
          text={feature} 
          delay={0.4 + (index * 0.1)} 
        />
      ))}
    </div>
  );
};
