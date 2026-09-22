import { redirect } from "next/navigation";

export default async function RequestSowRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/customer/requests/${id}/sow`);
}
