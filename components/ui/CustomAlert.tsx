import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomAlertProps {
  variant?: "default" | "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  closable?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const variantConfig = {
  default: {
    icon: Info,
    className: "border-border bg-background",
  },
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950",
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
  },
};

const CustomAlert = ({
                       variant = "default",
                       title,
                       description,
                       closable = true,
                       onClose,
                       children,
                       className,
                     }: CustomAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className="h-4 w-4" />
      {(title || closable) && (
        <AlertTitle className="flex items-center justify-between">
          {title}
          {closable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </AlertTitle>
      )}
      {description && <AlertDescription className="mt-2">{description}</AlertDescription>}
      {children && <div className="mt-2">{children}</div>}
    </Alert>
  );
};

export default CustomAlert;