"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { SiteStats } from "@/components/dashboard/site-stats";
import { TopPages } from "@/components/dashboard/top-pages";
import { TopSources } from "@/components/dashboard/top-sources";
import { authApi, sitesApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Site, SiteAnalytics } from "@/lib/types";

export function ActualDashboardPage() {
  const forSiteId = useSearchParams().get("for");
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [analytics, setAnalytics] = useState<SiteAnalytics | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await authApi.getCurrentUser();
        if (!userData.email_verified) {
          router.push('/verify');
          return;
        }
        setUser(userData);
      } catch (err) {
        router.push("/login");
        return;
      }

      try {
        const sitesData = await sitesApi.getAllSites();
        setSites(sitesData);

        const forSite = sitesData?.find((v) => v.id === forSiteId);

        if (forSite) {
          setCurrentSite(forSite);
        } else if (sitesData && sitesData.length > 0) {
          setCurrentSite(sitesData[0]);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load site data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    async function updateAnalyticsData() {
      if (!currentSite) return;
      try {
        const analyticsData = await sitesApi.getSiteAnalytics(
          currentSite.id,
          new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
          new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        );
        setAnalytics(analyticsData?.page_views ? analyticsData : null);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load site data.",
          variant: "destructive",
        });
      }
    }

    updateAnalyticsData();
  }, [currentSite]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[250px]" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="col-span-4 h-[350px] w-full" />
            <Skeleton className="col-span-3 h-[350px] w-full" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!currentSite) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="No sites found"
          text="Add a site to start tracking analytics."
        />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              You haven't added any sites yet.
            </p>
            <button
              onClick={() => router.push("/sites/add")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Add Your First Site
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Analytics: ${currentSite.site_url}`}
        text="View your site statistics and insights."
      />
      {analytics ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <SiteStats
              title="Unique Visitors"
              value={String(analytics?.unique_visitors) ?? "N/A"}
              diff={12}
            />
            <SiteStats
              title="Total Pageviews"
              value={String(analytics?.page_views) ?? "N/A"}
              diff={8}
            />
            {/* <SiteStats title="Bounce Rate" value={"42%"} diff={-4} />
    <SiteStats title="Visit Duration" value={"1m 32s"} diff={7} /> */}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Overview
              className="col-span-4"
              siteId={currentSite.id}
              data={analytics?.visitor_graph ?? []}
            />
            <TopSources
              className="col-span-3"
              data={analytics?.top_referrers ?? []}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <TopPages
              className="col-span-4"
              data={analytics?.top_pages ?? []}
            />
            <RecentSales
              className="col-span-3"
              data={analytics?.device_stats ?? []}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-medium">No analytics data available</h3>
            <p className="text-muted-foreground">
              We haven't collected any data for this site yet.
            </p>
            <p className="text-muted-foreground text-sm">
              Analytics data will appear here once visitors start browsing your site.
            </p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <ActualDashboardPage />
    </Suspense>
  )
}
