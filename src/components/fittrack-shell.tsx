import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Apple, ChartNoAxesCombined, Dumbbell, House, LogOut, TriangleAlert, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/dashboard" as const, label: "Início", icon: House },
  { to: "/workouts" as const, label: "Treinos", icon: Dumbbell },
  { to: "/diet" as const, label: "Dieta", icon: Apple },
  { to: "/progress" as const, label: "Evolução", icon: ChartNoAxesCombined },
  { to: "/profile" as const, label: "Perfil", icon: UserRound },
];

export function FitTrackShell({ children, title, action }: { children: React.ReactNode; title?: string; action?: React.ReactNode }) {
  const navigate = useNavigate();
  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold" aria-label="FitTrack — ir para o início">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Activity aria-hidden="true" />
            </span>
            FitTrack
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold sm:text-base">{title}</span>
            {action}
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair da conta">
              <LogOut aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>
      <main id="conteudo" className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:pt-8">
        {children}
      </main>
      <nav aria-label="Navegação principal" className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl justify-around px-2 pt-2">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex min-h-11 min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors"
            >
              <item.icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, text, action }: { icon: typeof Dumbbell; text: string; action?: React.ReactNode }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
      <div>
        <Icon className="mx-auto mb-4 size-10 text-muted-foreground" aria-hidden="true" />
        <p className="mb-5 text-muted-foreground">{text}</p>
        {action}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="grid min-h-64 place-items-center rounded-2xl border border-destructive/40 bg-destructive/10 p-8 text-center">
      <div>
        <TriangleAlert className="mx-auto mb-4 size-10 text-destructive" aria-hidden="true" />
        <p className="mb-1 font-semibold">Algo não carregou</p>
        <p className="mb-5 text-sm text-muted-foreground">{message}</p>
        <Button variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}

export function LoadingState({ text = "Carregando..." }: { text?: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-64 place-items-center rounded-2xl border border-border bg-card/40 p-8">
      <div className="text-center">
        <span className="mx-auto mb-4 block size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}