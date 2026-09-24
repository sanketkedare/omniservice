"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  KeyRound,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";

export default function AdminProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [adminData, setAdminData] = useState({
    name: "System Administrator",
    email: "admin@omniservice.com",
    phone: "+91 9876543210",
    role: "Super Admin",
    region: "Hyderabad Metro",
    status: "Active",
  });

  const [formValues, setFormValues] = useState({
    name: "System Administrator",
    email: "admin@omniservice.com",
    phone: "+91 9876543210",
    region: "Hyderabad Metro",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setAdminData((prev) => ({ ...prev, name: u.name, email: u.email || prev.email }));
        if (u.name) setFormValues((prev) => ({ ...prev, name: u.name, email: u.email || prev.email }));
      }
    } catch {}
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      setAdminData((prev) => ({ ...prev, ...formValues }));
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem("omniservice_user", JSON.stringify({ ...u, name: formValues.name, email: formValues.email }));
      }
      toast.success("Profile Updated", "Admin credentials saved successfully.");
      setIsEditing(false);
    } catch {
      toast.error("Error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-serif" style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}>
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#f05a28]" /> Admin Security Profile
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Manage root administrator account details and platform governance credentials.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-orange-50 text-[#f05a28] border-orange-200 text-xs px-3 py-1 font-bold">
          Super Admin Privileges
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Summary */}
        <Card className="md:col-span-1 border-orange-200/70 bg-gradient-to-br from-white to-orange-50/30 shadow-md">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-3">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#f05a28] to-amber-500 p-1 shadow-lg">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-[#f05a28] font-bold text-xl">
                <User className="h-10 w-10 text-[#f05a28]" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg text-neutral-900">{adminData.name}</h2>
              <p className="text-xs text-neutral-600">{adminData.email}</p>
            </div>
            <div className="w-full pt-3 border-t border-neutral-200/80 space-y-2 text-xs text-left">
              <div className="flex justify-between text-neutral-600">
                <span>Role:</span>
                <span className="font-bold text-neutral-900">{adminData.role}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {adminData.status}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Coverage:</span>
                <span className="font-bold text-neutral-900">{adminData.region}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details & Form */}
        <Card className="md:col-span-2 border-orange-200/70 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100">
            <CardTitle className="text-base font-bold text-neutral-900">Administrator Details</CardTitle>
            {!isEditing ? (
              <Button size="sm" variant="outline" className="border-orange-200 text-[#f05a28] hover:bg-orange-50" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                <Input
                  disabled={!isEditing}
                  value={formValues.name}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-white border-neutral-300 text-neutral-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
                <Input
                  disabled={!isEditing}
                  type="email"
                  value={formValues.email}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-neutral-300 text-neutral-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Phone Contact</label>
                <Input
                  disabled={!isEditing}
                  value={formValues.phone}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))}
                  className="bg-white border-neutral-300 text-neutral-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Administrative Jurisdiction</label>
                <Input
                  disabled={!isEditing}
                  value={formValues.region}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, region: e.target.value }))}
                  className="bg-white border-neutral-300 text-neutral-900 text-xs"
                />
              </div>

              {isEditing && (
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isSaving} className="bg-[#f05a28] hover:bg-[#d04618] text-white text-xs px-6 font-bold shadow-md">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
