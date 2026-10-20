import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Redefinir senha — FitTrack" }, { name: "description", content: "Defina uma nova senha para sua conta FitTrack." }, { property: "og:title", content: "Redefinir senha — FitTrack" }, { property: "og:description", content: "Defina uma nova senha para sua conta FitTrack." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ResetPassword,
});
function ResetPassword() {
  const navigate = useNavigate(); const [ready, setReady] = useState(false); const [password, setPassword] = useState("");
  useEffect(() => { setReady(window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery")); const { data } = supabase.auth.onAuthStateChange((e) => { if (e === "PASSWORD_RECOVERY") setReady(true); }); return () => data.subscription.unsubscribe(); }, []);
  return <main className="grid min-h-screen place-items-center p-5"><form className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6" onSubmit={async e => { e.preventDefault(); const { error } = await supabase.auth.updateUser({ password }); if (error) toast.error(error.message); else { toast.success("Senha atualizada."); navigate({ to: "/dashboard" }); } }}><h1 className="text-2xl font-bold">Nova senha</h1>{!ready ? <p className="text-muted-foreground">Abra o link enviado ao seu e-mail para continuar.</p> : <><Input type="password" minLength={8} maxLength={72} value={password} onChange={e => setPassword(e.target.value)} placeholder="No mínimo 8 caracteres" required/><Button variant="fitness" className="w-full">Salvar nova senha</Button></>}</form></main>;
}