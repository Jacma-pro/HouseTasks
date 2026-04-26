# HouseTasks — Suivi de développement

## Backend — État actuel : ✅ Complet

### Structure créée
```
backend/
├── src/
│   ├── index.ts               ✅ Entry point Express
│   ├── config/supabase.ts     ✅ Clients Supabase (admin + auth)
│   ├── middleware/
│   │   ├── auth.ts            ✅ JWT guard (requireAuth)
│   │   └── errorHandler.ts    ✅ Gestion d'erreurs globale
│   ├── lib/helpers.ts         ✅ getUserFamily, logTaskHistory
│   ├── types/index.ts         ✅ AuthUser, AuthRequest, AppError
│   └── routes/
│       ├── auth.ts            ✅ register / login / logout / me
│       ├── families.ts        ✅ créer / lire / inviter / rejoindre
│       ├── tasks.ts           ✅ CRUD + status patch + history
│       ├── availability.ts    ✅ CRUD créneaux
│       ├── users.ts           ✅ list / get / update / tasks
│       └── dashboard.ts       ✅ Données agrégées
├── .env                       ✅ Credentials Supabase (gitignored)
├── .env.example               ✅
├── tsconfig.json              ✅ TypeScript strict
├── Dockerfile                 ✅ Multi-stage build (node:24-alpine)
└── package.json               ✅ scripts : dev / build / start
```

### Stack versions installées
- `@supabase/supabase-js` ^2.104.1
- `express` ^5.2.1
- `zod` ^4.3.6
- `typescript` ^6.0.3
- `tsx` ^4.21.0

### Endpoints implémentés

#### Auth
| Méthode | Route | Statut |
|---------|-------|--------|
| POST | /api/auth/register | ✅ |
| POST | /api/auth/login | ✅ |
| POST | /api/auth/logout | ✅ |
| GET  | /api/auth/me | ✅ |

#### Families
| Méthode | Route | Statut |
|---------|-------|--------|
| POST | /api/families | ✅ |
| GET  | /api/families/me | ✅ |
| POST | /api/families/invite | ✅ |
| POST | /api/families/join/:token | ✅ |

#### Tasks
| Méthode | Route | Statut |
|---------|-------|--------|
| GET    | /api/tasks | ✅ (filtres : status, assigned_to, created_by) |
| GET    | /api/tasks/:id | ✅ |
| POST   | /api/tasks | ✅ (avec assignments + helpers) |
| PUT    | /api/tasks/:id | ✅ |
| DELETE | /api/tasks/:id | ✅ |
| PATCH  | /api/tasks/:id/status | ✅ |

#### Availability
| Méthode | Route | Statut |
|---------|-------|--------|
| GET    | /api/availability | ✅ |
| GET    | /api/availability/:userId | ✅ |
| POST   | /api/availability | ✅ |
| PUT    | /api/availability/:id | ✅ |
| DELETE | /api/availability/:id | ✅ |

#### Users
| Méthode | Route | Statut |
|---------|-------|--------|
| GET | /api/users | ✅ |
| GET | /api/users/:id | ✅ |
| PUT | /api/users/:id | ✅ |
| GET | /api/users/:id/tasks | ✅ |

#### Dashboard
| Méthode | Route | Statut |
|---------|-------|--------|
| GET | /api/dashboard | ✅ |

---

## Tests Backend — État : ✅ Complet

### Structure
```
backend/
├── vitest.config.ts               ✅ Config vitest (globalSetup + setupFiles + coverage)
└── src/
    ├── app.ts                     ✅ Express app exportée (sans listen) — pour Supertest
    ├── index.ts                   ✅ Refactoré : importe app.ts + listen
    └── __tests__/
        ├── globalSetup.ts         ✅ Charge dotenv avant les workers
        ├── setup.ts               ✅ Charge dotenv dans chaque worker
        ├── config/
        │   └── supabase.test.ts   ✅ Connexion réelle BDD (skip auto si .env absent)
        ├── middleware/
        │   ├── errorHandler.test.ts ✅ Tests unitaires purs (createError + errorHandler)
        │   └── auth.test.ts       ✅ requireAuth avec mock Supabase
        ├── lib/
        │   └── helpers.test.ts    ✅ getUserFamily + logTaskHistory avec mock Supabase
        └── routes/
            ├── health.test.ts     ✅ GET /health via Supertest
            └── auth.test.ts       ✅ Register + Login + Me via Supertest + mock Supabase
```

### Résultats
- **32 tests passés**, 5 skippés (tests connexion BDD nécessitent `.env`)
- Pour activer les tests de connexion BDD : créer `backend/.env` depuis `.env.example`

### Commandes
```bash
npm test               # run une fois
npm run test:watch     # mode watch
npm run test:coverage  # avec rapport de couverture
```

---

## Frontend — État : ✅ En cours

### Pages implémentées
- `LoginPage` ✅
- `RegisterPage` ✅
- `OnboardingPage` ✅ (créer / rejoindre famille)
- `DashboardPage` ✅ (stats, membres, À faire)
- `TasksPage` ✅ (segmented control filtre, liste animée, FAB création)
- `AgendaPage` ✅ (calendrier mensuel, disponibilités par membre)
- `AvailabilityPage` ✅ (gestion créneaux récurrents / ponctuels)
- `ProfilePage` ✅ (édition profil, membres famille, invitation)

### Composants UI
- `Button`, `Input`, `Card`, `Avatar`, `Badge`, `Overlay`, `BottomNav` ✅

---

## Améliorations à faire — Backlog priorisé

| # | Tâche | Priorité | Statut |
|---|-------|----------|--------|
| 1 | Édition de tâche (titre, desc, priorité, échéance) depuis le modal | 🔴 Haute | ✅ Fait |
| 2 | Indicateur visuel de retard (tâche dont l'échéance est dépassée) | 🔴 Haute | ✅ Fait |
| 3 | Feedback optimiste sur les mutations (changement de statut) | 🔴 Haute | ✅ Fait |
| 4 | Corriger `due_soon` backend (exclure tâches déjà en retard) | 🟠 Moyenne | ✅ Fait |
| 5 | TaskRow dashboard → ouvrir directement la tâche | 🟠 Moyenne | ✅ Fait |
| 6 | Upload d'avatar (photo de profil) | 🟡 Basse | ✅ Fait |
| 7 | Recherche de tâches | 🟡 Basse | ✅ Fait |

---

## Commandes curl de test

### Prérequis : définir TOKEN après login
```bash
TOKEN="votre_access_token_ici"
```

### Auth
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Alice"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Me
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### Families
```bash
# Créer une famille
curl -X POST http://localhost:3000/api/families \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Les Dupont"}'

# Ma famille
curl http://localhost:3000/api/families/me \
  -H "Authorization: Bearer $TOKEN"

# Inviter un membre (admin seulement)
curl -X POST http://localhost:3000/api/families/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com"}'

# Rejoindre via token
curl -X POST http://localhost:3000/api/families/join/TOKEN_ICI \
  -H "Authorization: Bearer $TOKEN"
```

### Tasks
```bash
# Créer une tâche
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Faire les courses","priority":"high","assigned_to":[],"helpers":[]}'

# Liste des tâches (avec filtres optionnels)
curl "http://localhost:3000/api/tasks?status=pending" \
  -H "Authorization: Bearer $TOKEN"

# Détail d'une tâche
curl http://localhost:3000/api/tasks/TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Changer le statut
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Supprimer
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Availability
```bash
# Ajouter un créneau récurrent (lundi = 1)
curl -X POST http://localhost:3000/api/availability \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_recurring":true,"day_of_week":1,"start_time":"09:00","end_time":"12:00","reason":"Travail"}'

# Ajouter un créneau one-time
curl -X POST http://localhost:3000/api/availability \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_recurring":false,"specific_date":"2026-05-01","start_time":"14:00","end_time":"18:00"}'

# Voir les dispos de la famille
curl http://localhost:3000/api/availability \
  -H "Authorization: Bearer $TOKEN"
```

### Dashboard
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```
