
import { Check } from "lucide-react";

interface FeatureItemProps {
  text: string;
  delay: number;
}

const FeatureItem = ({ text, delay }: FeatureItemProps) => (
  <div 
    className="feature-item hover:scale-105 transition-all duration-300 ease-in-out" 
    style={{ animationDelay: `${delay}s` }}
  >
    <Check className="w-3.5 h-3.5 text-primary shrink-0 animate-scale-in" 
      style={{ animationDelay: `${delay + 0.1}s` }} 
    />
    <span className="text-gray-600 text-sm transition-colors duration-300 hover:text-primary">{text}</span>
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
    <div className="space-y-2 animate-fade-in">
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
