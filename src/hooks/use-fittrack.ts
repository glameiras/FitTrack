import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FitDataState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  userId: string;
  refresh: () => Promise<void>;
}

/**
 * Carrega dados autenticados do usuário com estados de loading/erro.
 * - Ignora atualizações após o componente desmontar.
 * - Expõe `error` para que a tela mostre um estado de erro com retry.
 */
export function useFitData<T>(load: (userId: string) => Promise<T>, deps: unknown[] = []): FitDataState<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!auth.user) throw new Error("Sessão expirada. Entre novamente.");
      const result = await load(auth.user.id);
      if (!mounted.current) return;
      setUserId(auth.user.id);
      setData(result);
    } catch (err) {
      if (!mounted.current) return;
      setError(err instanceof Error ? err.message : "Não foi possível carregar seus dados.");
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, userId, refresh };
}