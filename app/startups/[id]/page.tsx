import { StartupDetail } from "@/components/startup/StartupDetail";

export default async function StartupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StartupDetail id={id} />;
}

