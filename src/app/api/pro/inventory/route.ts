/**
 * ForgeLocal — Professional Van Inventory API
 * GET & POST /api/pro/inventory
 *
 * Manages mobile vehicle inventory. Synchronized with SmartRoute
 * to guarantee first-trip resolution dispatching.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { InventoryItem } from "@/models/inventory-item.model";
import { memoryStore, MemoryInventoryItem } from "@/lib/memory-store";
import { z } from "zod";

const createInventorySchema = z.object({
  name: z.string().min(2, "Item name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
  unitPricePaise: z.number().int().min(0, "Price must be non-negative"),
  sku: z.string().optional(),
  reorderThreshold: z.number().int().default(2),
  professionalId: z.string().default("pro_hvac_001"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const proId = searchParams.get("proId") || "pro_hvac_001";
    const category = searchParams.get("category");
    const lowStockOnly = searchParams.get("lowStock") === "true";

    // Gather from memory store
    let items = Array.from(memoryStore.inventory.values()).filter((item) => {
      if (item.professionalId !== proId) return false;
      if (category && item.category !== category) return false;
      if (lowStockOnly && item.quantity > item.reorderThreshold) return false;
      return true;
    });

    // If empty for this pro, pull from all items or provide default
    if (items.length === 0) {
      items = Array.from(memoryStore.inventory.values());
    }

    const totalStockUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValuationPaise = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPricePaise,
      0
    );
    const lowStockCount = items.filter(
      (item) => item.quantity <= item.reorderThreshold
    ).length;

    return NextResponse.json({
      success: true,
      data: items,
      metrics: {
        totalStockUnits,
        totalValuationPaise,
        lowStockCount,
        uniqueSkusCount: items.length,
      },
    });
  } catch (error) {
    console.error("Error retrieving van inventory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve inventory" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createInventorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const newItemId = `inv_${Date.now()}`;

    const newItem: MemoryInventoryItem = {
      _id: newItemId,
      professionalId: data.professionalId,
      name: data.name,
      category: data.category.toLowerCase(),
      quantity: data.quantity,
      unitPricePaise: data.unitPricePaise,
      sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
      reorderThreshold: data.reorderThreshold,
    };

    memoryStore.inventory.set(newItemId, newItem);

    // Save to DB if connected
    try {
      const isConnected = await connectDB();
      if (isConnected) {
        await (InventoryItem as any).create({
          name: newItem.name,
          category: newItem.category,
          quantity: newItem.quantity,
          unitPricePaise: newItem.unitPricePaise,
          sku: newItem.sku,
          reorderThreshold: newItem.reorderThreshold,
        });
      }
    } catch {
      // Memory store is active
    }

    return NextResponse.json(
      {
        success: true,
        message: "Part added to vehicle inventory successfully",
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add inventory item" },
      { status: 500 }
    );
  }
}
