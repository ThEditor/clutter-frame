import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopReferrersStats } from "@/lib/types"

interface TopSourcesProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TopReferrersStats[];
}

export function TopSources({ className, data, ...props }: TopSourcesProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Top Sources</CardTitle>
        <CardDescription>Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((source) => (
            <div key={source.referrer ? source.referrer : "Not set"} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{source.referrer ? source.referrer : "Not set"}</p>
                <p className="text-sm text-muted-foreground">{source.count} visitors</p>
              </div>
              {/* <div className="font-medium">{source.percentage}%</div> */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
