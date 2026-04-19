import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";
import BottomNav from "@/components/BottomNav";
import AddNameFab from "@/components/AddNameFab";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-28 pt-[calc(var(--safe-top)+1rem)]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-mint-700">
          Profile
        </p>
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Hi there 👋
        </h1>
      </header>

      <section className="mt-6 rounded-3xl bg-white/80 p-6 shadow-soft backdrop-blur-xl">
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="mt-1 font-display text-xl font-bold text-slate-900">
          {user.email}
        </p>
      </section>

      <SignOutButton />
      <BottomNav />
      <AddNameFab />
    </main>
  );
}
