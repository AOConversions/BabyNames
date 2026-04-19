import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CelebrateClient from "./CelebrateClient";
import type { NameRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CelebratePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("names")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!data) notFound();
  return <CelebrateClient name={data as NameRow} />;
}
