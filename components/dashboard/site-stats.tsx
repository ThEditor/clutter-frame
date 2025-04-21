import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface SiteStatsProps {
  title: string;
  value: string;
  diff: number;
  className?: string;
}

export function SiteStats({ title, value, diff, className }: SiteStatsProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* {diff !== 0 && (
          <div className={`flex items-center text-xs ${diff > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {diff > 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4" />
            )}
            {Math.abs(diff)}%
          </div>
        )} */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">Compared to previous period</p>
      </CardContent>
    </Card>
  );
}

