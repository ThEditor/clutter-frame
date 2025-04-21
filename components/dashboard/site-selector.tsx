"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { sitesApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Site } from "@/lib/types"

interface SiteOption {
  value: string;
  label: string;
}

interface SiteSelectorProps {
  onSiteChange?: (siteId: string) => void;
}

export function SiteSelector({ onSiteChange }: SiteSelectorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [sites, setSites] = useState<SiteOption[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSites() {
      try {
        const sitesData = await sitesApi.getAllSites();
        const siteOptions = sitesData.map((site: Site) => ({
          value: site.id,
          label: site.site_url
        }));
        
        setSites(siteOptions);
        
        // Set default site if available
        if (sitesData.length > 0) {
          setValue(sitesData[0].id);
          onSiteChange?.(sitesData[0].id);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load your sites.",
          variant: "destructive",
        });
        
        // Fallback to demo data
        setSites([
          { value: "example.com", label: "example.com" },
          { value: "mysite.com", label: "mysite.com" },
          { value: "blog.example.com", label: "blog.example.com" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSites();
  }, [toast, onSiteChange]);

  const handleSiteSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSiteChange?.(currentValue);
  };

  if (loading) {
    return <Skeleton className="w-[200px] h-10" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? sites.find((site) => site.value === value)?.label : "Select site..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search site..." />
          <CommandList>
            <CommandEmpty>No site found.</CommandEmpty>
            <CommandGroup>
              {sites.map((site) => (
                <CommandItem
                  key={site.value}
                  value={site.value}
                  onSelect={handleSiteSelect}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === site.value ? "opacity-100" : "opacity-0")} />
                  {site.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

