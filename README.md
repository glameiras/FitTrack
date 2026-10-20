# 💪 FitTrack

**Seu treino, sua alimentação e sua evolução em um só lugar.**

O **FitTrack** é uma aplicação web responsiva para organizar rotinas de exercícios, acompanhar refeições e registrar a evolução física. Desenvolvida com foco em uma experiência simples no celular e no computador.

[**🚀 Acessar o aplicativo**](https://workout-diet-mate.lovable.app) · [**💻 Código-fonte**](https://github.com/glameiras/FitTrack)

---

## ✨ Funcionalidades

| Módulo | O que você pode fazer |
| --- | --- |
| 🔐 **Conta** | Cadastro, login e recuperação de senha |
| 🏠 **Painel** | Visualizar um resumo de treinos, alimentação e metas |
| 🏋️ **Treinos** | Criar rotinas, cadastrar exercícios, séries, repetições e cargas |
| 🥗 **Dieta** | Organizar refeições e acompanhar as refeições realizadas |
| 📈 **Evolução** | Registrar peso, cargas, cardio e acompanhar o histórico |
| 📸 **Fotos** | Adicionar fotos para comparar a evolução ao longo do tempo |
| 👤 **Perfil** | Atualizar dados físicos, visualizar IMC e definir uma meta de peso |

## 🛠️ Tecnologias

- **React 19** e **TypeScript** — interface e tipagem.
- **TanStack Start** e **TanStack Router** — estrutura da aplicação e rotas.
- **Tailwind CSS 4** e **Radix UI** — estilos e componentes de interface.
- **Supabase** — autenticação, banco de dados e armazenamento.
- **Recharts** — visualização de dados.
- **Vite** — ferramentas de desenvolvimento.

## 📁 Estrutura do projeto

```text
FitTrack/
├── public/               # Arquivos públicos
├── src/
│   ├── components/       # Componentes e interface
│   ├── hooks/            # Hooks reutilizáveis
│   ├── integrations/     # Integrações com serviços
│   ├── lib/              # Utilitários
│   └── routes/           # Páginas e rotas
├── supabase/
│   └── migrations/       # Migrações do banco de dados
├── .env.example          # Exemplo de configuração
├── package.json
└── README.md
```

## 🚀 Executar localmente

**Pré-requisitos:** Node.js e npm instalados.

```bash
git clone https://github.com/glameiras/FitTrack.git
cd FitTrack
npm install
npm run dev
```

> **Atenção:** o código completo está inicialmente na branch `integracao-lovable`. Até a integração ser aprovada, use `git switch integracao-lovable` antes de instalar as dependências.

Crie um arquivo `.env` local com base no `.env.example` e preencha as configurações necessárias para o Supabase. **Nunca publique senhas, tokens ou chaves secretas.**

### Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Pré-visualiza o build |
| `npm run lint` | Executa a análise estática |

## 🔒 Privacidade

O FitTrack lida com informações pessoais e fotos de evolução. O acesso aos dados deve ser protegido por autenticação, políticas de acesso no banco e regras adequadas de armazenamento. Antes de disponibilizar uma instalação própria, revise as configurações do Supabase e as permissões de cada recurso.

O aplicativo é uma ferramenta de organização pessoal e **não substitui acompanhamento médico ou nutricional**.

## 👨‍💻 Desenvolvimento

Projeto desenvolvido por **Gustavo Lameiras**, com apoio da plataforma [Lovable](https://lovable.dev), como parte do aprendizado e da construção de portfólio em desenvolvimento de software.

---

**FitTrack — acompanhe sua constância e celebre sua evolução.**
