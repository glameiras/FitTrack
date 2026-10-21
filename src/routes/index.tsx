import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "FitTrack — Treinos, dieta e evolução" }, { name: "description", content: "Acompanhe seus treinos, dieta e evolução física com o FitTrack." }, { property: "og:title", content: "FitTrack — Treinos, dieta e evolução" }, { property: "og:description", content: "Acompanhe seus treinos, dieta e evolução física com o FitTrack." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => { supabase.auth.getUser().then(({ data }) => navigate({ to: data.user ? "/dashboard" : "/auth", replace: true })); }, [navigate]);
  return <main className="grid min-h-screen place-items-center bg-background"><div className="flex items-center gap-3 text-primary"><Activity className="size-9 animate-pulse"/><span className="font-display text-3xl font-bold text-foreground">FitTrack</span></div></main>;
}