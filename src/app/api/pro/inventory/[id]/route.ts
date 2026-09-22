/**
 * ForgeLocal — Professional Van Inventory Item API
 * PATCH & DELETE /api/pro/inventory/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/memory-store";
import { z } from "zod";

const updateSchema = z.object({
  quantity: z.number().int().min(0).optional(),
  delta: z.number().int().optional(),
  unitPricePaise: z.number().int().min(0).optional(),
  reorderThreshold: z.number().int().min(0).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itemId } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const item = memoryStore.inventory.get(itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Inventory item not found" },
        { status: 404 }
      );
    }

    if (parsed.data.quantity !== undefined) {
      item.quantity = parsed.data.quantity;
    } else if (parsed.data.delta !== undefined) {
      item.quantity = Math.max(0, item.quantity + parsed.data.delta);
    }

    if (parsed.data.unitPricePaise !== undefined) {
      item.unitPricePaise = parsed.data.unitPricePaise;
    }

    if (parsed.data.reorderThreshold !== undefined) {
      item.reorderThreshold = parsed.data.reorderThreshold;
    }

    memoryStore.inventory.set(itemId, item);

    return NextResponse.json({
      success: true,
      message: "Inventory updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inventory item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itemId } = await params;
    const deleted = memoryStore.inventory.delete(itemId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from van inventory",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete inventory item" },
      { status: 500 }
    );
  }
}
