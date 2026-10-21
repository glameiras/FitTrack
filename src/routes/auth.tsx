import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar — FitTrack" },
    { name: "description", content: "Entre ou crie sua conta FitTrack." },
    { property: "og:title", content: "Entrar — FitTrack" },
    { property: "og:description", content: "Entre ou crie sua conta FitTrack." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AuthPage,
});

const loginSchema = z.object({ email: z.string().email("Informe um e-mail válido").max(255), password: z.string().min(8, "Use pelo menos 8 caracteres").max(72) });
const signupSchema = loginSchema.extend({ name: z.string().trim().min(2).max(100), confirm: z.string(), weight: z.coerce.number().positive().max(999), height: z.coerce.number().positive().max(3), target: z.coerce.number().positive().max(999), birth: z.string().min(1) }).refine(v => v.password === v.confirm, { path: ["confirm"], message: "As senhas não coincidem" });

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true);
    const fd = new FormData(event.currentTarget);
    const raw = Object.fromEntries(fd);
    try {
      if (mode === "login") {
        const v = loginSchema.parse(raw);
        const { error } = await supabase.auth.signInWithPassword({ email: v.email, password: v.password });
        if (error) throw error;
        await navigate({ to: "/dashboard" });
      } else {
        const v = signupSchema.parse(raw);
        const { data, error } = await supabase.auth.signUp({ email: v.email, password: v.password, options: { emailRedirectTo: window.location.origin, data: { name: v.name, weight: String(v.weight), height: String(v.height), target_weight: String(v.target), birth_date: v.birth } } });
        if (error) throw error;
        if (!data.session) toast.success("Confira seu e-mail para confirmar a conta.");
        else await navigate({ to: "/dashboard" });
      }
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível continuar."); }
    finally { setLoading(false); }
  }

  async function resetPassword() {
    const email = window.prompt("Qual é o seu e-mail?");
    if (!email || !z.string().email().safeParse(email).success) { toast.error("Informe um e-mail válido."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    error ? toast.error(error.message) : toast.success("Enviamos o link de recuperação.");
  }

  async function googleLogin() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(result.error.message);
    if (!result.redirected && !result.error) await navigate({ to: "/dashboard" });
  }

  return <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:grid sm:place-items-center">
    <section className="mx-auto w-full max-w-md">
      <div className="mb-10 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground"><Activity className="size-7" /></span><div><h1 className="text-3xl font-bold">FitTrack</h1><p className="text-sm text-muted-foreground">Evolua todos os dias.</p></div></div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-7">
        <h2 className="text-2xl font-bold">{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h2>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">{mode === "login" ? "Entre para acompanhar sua evolução." : "Comece hoje sua melhor versão."}</p>
        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && <><Field label="Nome"><Input name="name" required maxLength={100} placeholder="Seu nome" /></Field><div className="grid grid-cols-2 gap-3"><Field label="Peso (kg)"><Input name="weight" type="number" step="0.1" required /></Field><Field label="Altura (m)"><Input name="height" type="number" step="0.01" required /></Field></div><div className="grid grid-cols-2 gap-3"><Field label="Nascimento"><Input name="birth" type="date" required /></Field><Field label="Meta (kg)"><Input name="target" type="number" step="0.1" required /></Field></div></>}
          <Field label="E-mail"><Input name="email" type="email" autoComplete="email" required maxLength={255} placeholder="voce@email.com" /></Field>
          <Field label="Senha"><div className="relative"><Input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} maxLength={72} className="pr-12" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-0" onClick={() => setShowPassword(!showPassword)} aria-label="Mostrar senha">{showPassword ? <EyeOff/> : <Eye/>}</Button></div></Field>
          {mode === "signup" && <Field label="Confirmar senha"><Input name="confirm" type="password" required minLength={8} maxLength={72} /></Field>}
          {mode === "login" && <button type="button" onClick={resetPassword} className="text-sm text-primary hover:underline">Esqueci minha senha</button>}
          <Button variant="fitness" size="lg" className="w-full" disabled={loading}>{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}<ArrowRight /></Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">OU</div>
        <Button type="button" variant="outline" className="w-full" onClick={googleLogin}>Continuar com Google</Button>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground">{mode === "login" ? "Ainda não tem conta? Criar conta" : "Já tem uma conta? Entrar"}</button>
      </div>
    </section>
  </main>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }