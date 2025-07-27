
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const FeatureCard = ({ title, description, Icon }: FeatureCardProps) => {
  return (
    <Card className="hover-card-effect bg-white/70 backdrop-blur-sm border-none">
      <CardContent className="p-6">
        <div className="bg-gradient-to-r from-brand to-brand-dark w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-md">
          <Icon className="text-white" size={24} />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-brand-dark">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
