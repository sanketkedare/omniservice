"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Minus,
  Search,
  Truck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Barcode,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { formatPaise } from "@/lib/utils";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unitPricePaise: number;
  sku: string;
  reorderThreshold: number;
}

export default function ProfessionalInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("hvac");
  const [newItemQty, setNewItemQty] = useState(5);
  const [newItemPrice, setNewItemPrice] = useState(450);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultInventoryFallback: InventoryItem[] = [
    { _id: "inv_hvac_01", name: "45µF Dual Run Motor Capacitor", category: "hvac", quantity: 6, unitPricePaise: 45000, sku: "CAP-45UF-OEM", reorderThreshold: 2 },
    { _id: "inv_hvac_02", name: "30A Compressor Heavy Duty Contactor", category: "hvac", quantity: 4, unitPricePaise: 85000, sku: "CNT-30A-HD", reorderThreshold: 2 },
    { _id: "inv_hvac_03", name: "R-32 Eco Refrigerant Canister (1kg)", category: "hvac", quantity: 3, unitPricePaise: 120000, sku: "GAS-R32-1KG", reorderThreshold: 1 },
    { _id: "inv_hvac_04", name: "Indoor Unit Blower Motor Bearing Set", category: "hvac", quantity: 5, unitPricePaise: 35000, sku: "BRG-IDU-SET", reorderThreshold: 2 },
    { _id: "inv_hvac_05", name: "Universal AC Remote & Sensor PCB Kit", category: "hvac", quantity: 2, unitPricePaise: 65000, sku: "PCB-UNI-AC", reorderThreshold: 1 },
    { _id: "inv_plm_01", name: "Solid Brass Quarter-Turn Angle Valve", category: "plumbing", quantity: 8, unitPricePaise: 38000, sku: "VLV-ANG-BRS", reorderThreshold: 3 },
  ];

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pro/inventory?proId=pro_hvac_001");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setItems(json.data);
      } else {
        setItems(defaultInventoryFallback);
      }
    } catch {
      setItems(defaultInventoryFallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustQuantity = async (itemId: string, delta: number) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );

    try {
      await fetch(`/api/pro/inventory/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
    } catch (err) {
      console.error(err);
      fetchInventory(); // revert on failure
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pro/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: "pro_hvac_001",
          name: newItemName.trim(),
          category: newItemCategory,
          quantity: Number(newItemQty),
          unitPricePaise: Number(newItemPrice) * 100,
          reorderThreshold: 2,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => [data.data, ...prev]);
        setIsAddOpen(false);
        setNewItemName("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValuePaise = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPricePaise,
    0
  );
  const lowStockCount = items.filter(
    (item) => item.quantity <= item.reorderThreshold
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8 text-neutral-900">
      {/* Header */}
      <PageHeader
        title="Van Inventory & Parts Catalog"
        description="Mobile vehicle stock synchronized with SmartRoute for guaranteed first-trip fix dispatching."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Provider Dashboard", href: "/pro/dashboard" },
          { label: "Van Inventory" },
        ]}
        actions={
          <Button
            size="sm"
            variant="brand"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddOpen(true)}
            className="font-bold shadow-md shadow-orange-500/20"
          >
            Add Part to Van
          </Button>
        }
      />

      {/* Vehicle Info Bar & Sync Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-neutral-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="rounded-xl bg-neutral-100 p-3 text-[#f05a28]">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 font-bold block">Assigned Van</span>
            <p className="text-sm font-bold text-neutral-900">Tata Ace EV</p>
            <span className="text-[11px] font-mono text-neutral-500">TS-09-UB-4120</span>
          </div>
        </Card>

        <Card className="bg-white border-neutral-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-200">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 font-bold block">Stocked Inventory</span>
            <p className="text-sm font-bold text-neutral-900">{totalUnits} Units ({items.length} SKUs)</p>
            <span className="text-[11px] font-mono text-emerald-600">
              Valuation: {formatPaise(totalValuePaise)}
            </span>
          </div>
        </Card>

        <Card className="bg-white border-neutral-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 font-bold block">SmartRoute First-Trip</span>
            <p className="text-sm font-bold text-neutral-900">100% Synced</p>
            <span className="text-[11px] text-amber-600">
              {lowStockCount > 0 ? `${lowStockCount} items low stock` : "Optimal replenishment"}
            </span>
          </div>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search parts by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 shadow-xs focus:outline-hidden focus:border-[#f05a28]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "hvac", "plumbing", "electrical"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                categoryFilter === cat
                  ? "bg-[#f05a28] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 shadow-xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Table */}
      <Card className="bg-white border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Part / Component Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Unit Value</th>
                <th className="py-3 px-4 text-center">Van Quantity</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredItems.map((item) => {
                const isLow = item.quantity <= item.reorderThreshold;
                return (
                  <tr key={item._id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 text-sm">{item.name}</div>
                      {isLow && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 mt-0.5">
                          <AlertTriangle className="h-3 w-3" />
                          Low stock (Reorder threshold: {item.reorderThreshold})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" size="sm" className="capitalize bg-neutral-100 text-neutral-700 border-neutral-200">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px]">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                      {formatPaise(item.unitPricePaise)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block min-w-8 py-0.5 px-2 rounded-md font-mono font-bold text-xs ${
                          isLow
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustQuantity(item._id, -1)}
                          disabled={item.quantity === 0}
                          className="h-7 w-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 flex items-center justify-center text-neutral-700 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdjustQuantity(item._id, 1)}
                          className="h-7 w-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Part Modal */}
      <Dialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Part to Van Inventory"
        description="Synchronize new hardware or OEM components stocked in your vehicle."
      >
        <form onSubmit={handleAddItem} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Part / Material Name</label>
            <Input
              required
              placeholder="e.g. 50µF Motor Run Capacitor"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#f05a28]"
              >
                <option value="hvac">HVAC</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hardware">General Hardware</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Quantity in Van</label>
              <Input
                type="number"
                min={1}
                value={newItemQty}
                onChange={(e) => setNewItemQty(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Unit Price (₹)</label>
            <Input
              type="number"
              min={0}
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(Number(e.target.value))}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="sm"
              disabled={isSubmitting}
              className="font-bold"
            >
              {isSubmitting ? "Saving..." : "Save to Van"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
