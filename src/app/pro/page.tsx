import { redirect } from "next/navigation";

export default function ProRootRedirect() {
  redirect("/pro/dashboard");
}
