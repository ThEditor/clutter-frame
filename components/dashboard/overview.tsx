"use client"

import type React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VisitorGraphStats } from "@/lib/types";

interface OverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  siteId?: string;
  data: VisitorGraphStats[];
}

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export function Overview({ className, data, siteId, ...props }: OverviewProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Visitors Overview</CardTitle>
        <CardDescription>
          Daily unique visitor count for last 28 days
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => formatDate(new Date(v))} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="unique_visitors" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

