"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }
  return (
    <button
      onClick={signOut}
      className="mt-6 w-full rounded-2xl bg-white py-4 text-base font-bold text-slate-700 shadow-soft"
    >
      Sign out
    </button>
  );
}
