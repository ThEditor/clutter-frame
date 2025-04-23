"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PlusCircle, Trash } from "lucide-react";
import { sitesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Site, ApiError } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [siteToBeDeleted, setSiteToBeDeleted] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function fetchSites() {
    setLoading(true);
    setError(false);
    try {
      const sitesData = await sitesApi.getAllSites();
      setSites(sitesData || []);
    } catch (err) {
      setError(true);
      toast({
        title: "Error",
        description: "Failed to load your sites. Please try again.",
        variant: "destructive",
      });

      // Check if error is due to authentication
      const apiError = err as ApiError;
      if (
        apiError.status === 401 ||
        apiError.message?.includes("unauthorized") ||
        apiError.message?.includes("Unauthorized")
      ) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSites();
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Your Sites"
          text="Manage and track your websites."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Sites Unavailable"
          text="We couldn't load your sites at the moment."
        >
          <Button onClick={() => fetchSites()}>Try Again</Button>
        </DashboardHeader>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              There was an error loading your sites.
            </p>
            <Button onClick={() => fetchSites()}>Refresh</Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <AlertDialog>
        <DashboardHeader
          heading="Your Sites"
          text="Manage and track your websites."
        >
          <Button asChild>
            <Link href="/sites/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Site
            </Link>
          </Button>
        </DashboardHeader>

        {sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">
              You haven't added any sites yet.
            </p>
            <Button asChild>
              <Link href="/sites/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Site
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <Card key={site.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{site.site_url}</CardTitle>
                  <CardDescription>
                    Added on {new Date(site.created_at).toLocaleDateString()}
                    <br />
                    ID: {site.id}
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                <div className="text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Today's visitors:</span>
                    <span className="font-medium">{site.today_visitors || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Month to date:</span>
                    <span className="font-medium">{site.month_visitors || 0}</span>
                  </div>
                </div>
              </CardContent> */}
                <CardFooter className="flex justify-between">
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => setSiteToBeDeleted(site.id)}
                      variant="outline"
                    >
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <Button asChild>
                    <Link
                      href={{
                        pathname: "/",
                        query: {
                          for: site.id,
                        },
                      }}
                    >
                      View Stats
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              site and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSiteToBeDeleted(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (siteToBeDeleted) {
                  await sitesApi.deleteSite(siteToBeDeleted);
                  await fetchSites();
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
