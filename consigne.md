# HouseTasks - Brief pour Claude Code

## Contexte
App de gestion de tâches familiale mobile-first. Le design est déjà fait. La DB est déjà créée sur Supabase.

## Système de familles
- Un utilisateur crée son compte
- Il peut créer une famille ou rejoindre une famille existante via invitation
- Une famille peut avoir N membres
- Chaque membre a un rôle : admin ou member

## Stack
- **Backend :** Node.js 24 + Express + TypeScript
- **DB + Auth :** Supabase (PostgreSQL)
- **Frontend :** React 18 + Vite + TypeScript + TailwindCSS (à faire après le backend)
- **Déploiement :** Backend sur Render (Docker), Frontend sur Vercel

## Situation actuelle
- Repo Git créé
- Dossier `/backend` créé avec `package.json` initialisé (`npm init -y`)
- Schema SQL déjà exécuté sur Supabase (toutes les tables sont créées)

## Schema DB (déjà en place sur Supabase)

```sql
profiles        : id (UUID, lié à auth.users), name, avatar_url, created_at, updated_at
families        : id, name, created_by (→ profiles), created_at
family_members  : family_id (→ families), user_id (→ profiles), role (admin/member), joined_at — PK composite
invitations     : id, family_id, email, token (unique), invited_by, accepted, created_at, expires_at
tasks           : id, family_id, title, description, created_by, status (pending/in_progress/completed/cancelled), priority (low/medium/high), due_date, completed_at, created_at, updated_at
task_assignments  : task_id, user_id — PK composite (qui est assigné)
task_dependencies : task_id, user_id — PK composite (qui doit aider)
availability    : id, user_id, family_id, day_of_week (0-6 si récurrent), specific_date (si one-time), start_time, end_time, reason, is_recurring, created_at
task_history    : id, task_id, changed_by, action (created/assigned/status_changed/updated/deleted), old_value (JSONB), new_value (JSONB), created_at
```

## API Endpoints à construire

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET  /api/auth/me`

**Families**
- `POST /api/families` — créer une famille
- `GET  /api/families/me` — ma famille
- `POST /api/families/invite` — inviter un membre par email
- `POST /api/families/join/:token` — rejoindre via token d'invitation

**Tasks**
- `GET    /api/tasks` — toutes les tâches de la famille (filtres : status, assigned_to, created_by)
- `GET    /api/tasks/:id`
- `POST   /api/tasks` — créer (avec assignments + dependencies)
- `PUT    /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH  /api/tasks/:id/status`

**Availability**
- `GET    /api/availability` — toutes les dispos de la famille
- `GET    /api/availability/:userId`
- `POST   /api/availability`
- `PUT    /api/availability/:id`
- `DELETE /api/availability/:id`

**Users**
- `GET /api/users` — tous les membres de la famille
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `GET /api/users/:id/tasks`

**Dashboard**
- `GET /api/dashboard` — toutes les données dashboard en une seule requête

## Ce que tu dois faire, dans l'ordre
1. Installer les dépendances et configurer TypeScript
2. Connecter Supabase
3. Mettre en place l'auth (register, login, logout, me)
4. Familles : créer, inviter, rejoindre
5. Endpoints tasks → availability → users → dashboard
6. Middlewares : auth guard, validation, gestion d'erreurs
7. Dockerfile pour déploiement sur Render

## Règles importantes
- Fichiers complets, pas de snippets
- TypeScript strict
- Gestion d'erreurs sur tous les endpoints
- Fournir des commandes curl pour tester chaque endpoint
- Pas de features hors MVP
- créer un fichier suivi.md et le modifier afin de suivre tes changements

test