"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Wind,
  Tv,
  Hammer,
  Droplets,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { INITIAL_CATEGORIES } from "@/lib/mock-data";

const iconMap: Record<string, React.ReactNode> = {
  Wrench: <Wrench className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  Wind: <Wind className="h-5 w-5" />,
  Tv: <Tv className="h-5 w-5" />,
  Hammer: <Hammer className="h-5 w-5" />,
  Droplets: <Droplets className="h-5 w-5" />,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length) {
          setCategories(data.data);
        }
      })
      .catch(() => {
        // Fallback already set
      });
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    const matchesName = cat.name.toLowerCase().includes(q);
    const matchesDesc = cat.description.toLowerCase().includes(q);
    const matchesSubs = cat.subcategories?.some((s) =>
      s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
    return matchesName || matchesDesc || matchesSubs;
  });

  return (
    <div className="w-full max-w-none px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="Service Categories & Discovery"
        description="InspectAI supports precision video diagnostics across all certified household mechanical, electrical, and plumbing trades."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories" },
        ]}
      />

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Input
          placeholder="Search symptoms, parts, or repairs (e.g. 'compressor leak', 'switchboard', 'unclog')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const icon = iconMap[cat.iconName] || <Wrench className="h-5 w-5" />;
          const minRupees = Math.round(cat.typicalPriceRangePaise.min / 100);
          const maxRupees = Math.round(cat.typicalPriceRangePaise.max / 100);

          return (
            <Card key={cat.slug} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    {icon}
                  </div>
                  <Badge variant="brand" size="sm">
                    AI Enabled
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-3">{cat.name}</CardTitle>
                <CardDescription className="text-xs">{cat.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* Subcategories list */}
                <div className="space-y-1.5 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Common Diagnostics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories?.slice(0, 3).map((sub) => (
                      <span
                        key={sub.slug}
                        className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div>
                    <span className="text-[10px] text-neutral-400">Typical Scope Range</span>
                    <p className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      ₹{minRupees.toLocaleString()} – ₹{maxRupees.toLocaleString()}
                    </p>
                  </div>

                  <Link href={`/customer/new-request?category=${cat.slug}`}>
                    <Button size="sm" variant="brand" rightIcon={<Sparkles className="h-3 w-3" />}>
                      Diagnose
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="py-12 text-center text-neutral-500">
          <p className="text-sm">No service categories found matching &quot;{searchQuery}&quot;.</p>
        </div>
      )}
    </div>
  );
}
