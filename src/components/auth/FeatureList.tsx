
import { Check } from "lucide-react";

interface FeatureItemProps {
  text: string;
  delay: number;
}

const FeatureItem = ({ text, delay }: FeatureItemProps) => (
  <div 
    className="feature-item bg-white/40 backdrop-blur-sm rounded-xl p-4" 
    style={{ animationDelay: `${delay}s` }}
  >
    <Check className="w-5 h-5 text-primary shrink-0" />
    <span className="text-gray-700">{text}</span>
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
