import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const cookieStore = await cookies();
  const role = cookieStore.get("omniservice-role")?.value;

  if (role === "admin") {
    redirect("/admin/dashboard");
  } else if (role === "professional") {
    redirect("/pro/dashboard");
  } else {
    redirect("/customer/dashboard");
  }
}
