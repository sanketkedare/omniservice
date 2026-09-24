import { redirect } from "next/navigation";

export default function CustomerRootRedirect() {
  redirect("/customer/dashboard");
}
