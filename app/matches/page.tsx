import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MatchesClient from "./MatchesClient";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  return <MatchesClient userId={user.id} />;
}
