import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SwipeClient from "./SwipeClient";

export const dynamic = "force-dynamic";

export default async function SwipePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  return <SwipeClient userId={user.id} />;
}
