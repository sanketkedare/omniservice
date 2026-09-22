"use client";

import React, { useState } from "react";
import { Search, UserCheck, Shield, Phone, Mail, MoreHorizontal, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "professional" | "admin";
  kycStatus: "verified" | "pending" | "rejected";
  joinedDate: string;
  totalBookings: number;
}

const DEMO_USERS: AdminUser[] = [
  { id: "usr_01", name: "Sanket Kedare", email: "volcanic.digitalsolutions@gmail.com", phone: "+91 86248 51910", role: "customer", kycStatus: "verified", joinedDate: "Jan 12, 2026", totalBookings: 6 },
  { id: "usr_02", name: "Suresh Kumar", email: "suresh.apex@volcanic.world", phone: "+91 98201 11223", role: "professional", kycStatus: "verified", joinedDate: "Nov 04, 2025", totalBookings: 28 },
  { id: "usr_03", name: "Vikram Patil", email: "vikram.coolair@volcanic.world", phone: "+91 98202 33445", role: "professional", kycStatus: "verified", joinedDate: "Dec 18, 2025", totalBookings: 19 },
  { id: "usr_04", name: "Priya Nair", email: "priya.nair@volcanic.world", phone: "+91 98203 55667", role: "customer", kycStatus: "verified", joinedDate: "Feb 01, 2026", totalBookings: 2 },
  { id: "usr_05", name: "Rahul Deshmukh", email: "rahul.wire@volcanic.world", phone: "+91 98204 77889", role: "professional", kycStatus: "pending", joinedDate: "Mar 10, 2026", totalBookings: 0 },
  { id: "usr_06", name: "Ananya Iyer", email: "ananya.iyer@volcanic.world", phone: "+91 98205 99001", role: "customer", kycStatus: "verified", joinedDate: "Jan 29, 2026", totalBookings: 5 },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = DEMO_USERS.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.phone.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Identity Directory"
        description="Governs customers, verified technicians, and internal platform operators."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Users" },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#f05a28]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {["all", "customer", "professional", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                roleFilter === role
                  ? "bg-[#f05a28] text-white"
                  : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Data Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{u.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{u.id}</div>
                  </td>
                  <td className="py-3 px-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                      <Phone className="h-3 w-3 text-neutral-400" />
                      <span>{u.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                      <Mail className="h-3 w-3" />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === "professional" ? "brand" : u.role === "admin" ? "destructive" : "outline"} size="sm">
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={u.kycStatus === "verified" ? "success" : "warning"} size="sm">
                      {u.kycStatus.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {u.totalBookings} Jobs
                  </td>
                  <td className="py-3 px-4 text-neutral-400">{u.joinedDate}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="outline" size="sm">
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
