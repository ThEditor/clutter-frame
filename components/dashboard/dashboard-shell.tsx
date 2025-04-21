import type React from "react"
import { SiteSelector } from "@/components/dashboard/site-selector"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  enableSiteSelector?: boolean
}

export function DashboardShell({ children, className, enableSiteSelector = false, ...props }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <a href="/">
              <h2 className="text-lg font-bold">Clutter</h2>
            </a>
              
            {enableSiteSelector && <SiteSelector />}
          </div>
          <nav className="flex items-center gap-4">
            <a href="/sites" className="text-sm font-medium">
              Sites
            </a>
            {/* <a href="/settings" className="text-sm font-medium">
              Settings
            </a>
            <a href="/logout" className="text-sm font-medium">
              Logout
            </a> */}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container grid items-start gap-6 py-8">{children}</div>
      </main>
    </div>
  )
}

