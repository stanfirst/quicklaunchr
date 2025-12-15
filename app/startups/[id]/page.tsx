import { StartupDetail } from "@/components/startup/StartupDetail";

export default async function StartupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return <StartupDetail id={id} />;
}

