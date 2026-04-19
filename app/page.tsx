import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/swipe");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="relative w-full max-w-sm">
        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-br from-peach-300 via-sunshine-300 to-lavender-300 blur-2xl opacity-70" />
        <div className="rounded-[2.25rem] bg-white/80 p-8 shadow-soft backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex h-14 w-14 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-peach-300 to-lavender-500 text-3xl">
              ✨
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-slate-900">
              Our Baby Name
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Swipe together. Find the one. Celebrate our first baby 💛
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
