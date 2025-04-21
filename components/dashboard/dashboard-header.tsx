import type React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  enableTime?: boolean;
}

export function DashboardHeader({
  heading,
  text,
  children,
  enableTime = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      <div className="flex items-center gap-2">
        {enableTime && (
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
