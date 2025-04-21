"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { sitesApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { ApiError } from "@/lib/types";

const siteSchema = z.object({
  siteUrl: z.string()
});

export default function AddSitePage() {
  const [siteUrl, setSiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdSiteId, setCreatedSiteId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddSite = async () => {
    try {
      const result = siteSchema.safeParse({ siteUrl });
      if (!result.success) {
        toast({
          title: "Invalid input",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      const response = await sitesApi.createSite(siteUrl);
      
      toast({
        title: "Success",
        description: `Site ${siteUrl} added successfully!`,
      });
      
      // Store the created site ID
      setCreatedSiteId(response.site_id);
      setLoading(false);
    } catch (err) {
      const error = err as Error | ApiError;
      toast({
        title: "Error",
        description: 'message' in error ? error.message : "Failed to add site. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/sites");
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Add a new site" text="Enter your website details to start tracking." />

      {!createdSiteId ? (
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Website Details</CardTitle>
            <CardDescription>Enter the domain name of the website you want to track</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input 
                id="domain" 
                placeholder="www.example.com" 
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value.toLowerCase())}
                required 
              />
              <p className="text-sm text-muted-foreground">Enter the domain without http:// or https://</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/sites">Cancel</Link>
            </Button>
            <Button onClick={handleAddSite} disabled={loading}>
              {loading ? "Adding..." : "Add Site"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>
                Add this tracking code to your website to start collecting analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="rounded-md bg-muted p-4 overflow-x-auto">
                <code>{`<script>window.clutterConfig={siteId:"${createdSiteId}"}</script><script defer src="https://raw.githubusercontent.com/ThEditor/clutter-ink/refs/heads/main/script.js"></script>`}</code>
              </pre>
              <p className="mt-4 text-sm text-muted-foreground">
                Add this script to the <code>&lt;head&gt;</code> section of your website.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleGoToDashboard}>
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </DashboardShell>
  );
}
