import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
                                                   title,
                                                   description,
                                                   icon,
                                                   className,
                                                   style,
                                                 }) => {
  return (
    <div
      className={cn(
        "bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-sky-100 flex items-start gap-5",
        className
      )}
      style={style}
    >
      <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-sky-100 text-sky-400">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-sky-700">{title}</h3>
        <p className="text-text-primary">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
