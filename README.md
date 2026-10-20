# FitTrack

Aplicativo mobile-first para acompanhamento de treinos, dieta e evolução física.

**App publicado:** https://workout-diet-mate.lovable.app

## Funcionalidades

- Autenticação por e-mail/senha (com recuperação de senha) e login com Google
- Home com resumo diário: peso, meta, IMC, treinos e refeições concluídas
- Treinos: criação de treinos e exercícios (séries, repetições, carga, observações), marcação diária de conclusão e histórico
- Dieta: refeições com horário e alimentos, progresso diário e marcação de refeições realizadas
- Evolução: registros de peso, massa corporal, cargas e cardio, com gráficos (Recharts) e histórico
- Fotos de evolução com upload privado (armazenamento restrito por usuário)
- Perfil editável com cálculo automático de IMC e progresso até a meta de peso
- Interface mobile-first com navegação inferior, responsiva para desktop

## Stack

- **TanStack Start** (React 19 + TypeScript) com roteamento por arquivos
- **Tailwind CSS v4** + componentes shadcn/ui (Radix)
- **Supabase** (via Lovable Cloud): autenticação, banco de dados Postgres com Row Level Security e storage privado
- **Recharts** para gráficos, **Zod** para validação de formulários

## Privacidade e segurança

Cada usuário acessa somente os próprios dados: todas as tabelas possuem políticas de RLS por usuário e as fotos ficam em buckets privados. Este app não substitui orientação profissional de saúde.

## Executando localmente

Requisitos: Node.js 20+ e npm (ou bun).

```sh
npm install
npm run dev
```

Scripts disponíveis: `npm run dev` (desenvolvimento), `npm run build` (produção), `npm run lint` (análise estática).

## Variáveis de ambiente

Crie um `.env` local (nunca versionado) com os nomes abaixo — valores são fornecidos pelo Lovable Cloud:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_PROJECT_ID`

## Autoria

Desenvolvido por **Gustavo Lameiras** com [Lovable](https://lovable.dev).