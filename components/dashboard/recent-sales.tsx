import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceStats } from "@/lib/types"

interface RecentSalesProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DeviceStats[];
}

export function RecentSales({ className, data, ...props }: RecentSalesProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Breakdown by device type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.map((device) => (
            <div key={device.device_type} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={device.device_type} alt="Avatar" />
                <AvatarFallback>{device.device_type.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{device.device_type}</p>
                {/* <p className="text-sm text-muted-foreground">{device.percentage}% of visitors</p> */}
              </div>
              <div className="ml-auto font-medium">{device.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
