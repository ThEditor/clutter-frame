import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopPagesStats } from "@/lib/types"

interface TopPagesProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TopPagesStats[];
}

export function TopPages({ className, data, ...props }: TopPagesProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most visited pages on your site</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((page) => (
            <div key={page.page} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{page.page}</p>
                <p className="text-sm text-muted-foreground">{page.count} pageviews</p>
              </div>
              {/* <div className="font-medium">{page.percentage}%</div> */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
