'use client';

import { ReactNode, Suspense } from "react";
import LoaderSpinner from "@/components/ui/LoaderSpinner";

interface CustomSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const CustomSuspenseBoundary = ({ children, fallback }: CustomSuspenseProps) => {
  return (
    <Suspense fallback={fallback ?? <LoaderSpinner/> }>
      {children}
    </Suspense>
  );
};

export default CustomSuspenseBoundary;
