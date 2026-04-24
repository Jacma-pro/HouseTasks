// HouseTasks — 8 screen mockups. Each is a component rendered inside an IOSDevice frame.

const { Button: Btn, IconButton: IBtn, Input: Inp, Textarea: Ta, Field: Fl, Badge: Bg,
        Priority: Pr, Card: Cd, TaskRow: Tr, BottomNav: Nav, AppHeader: Hd,
        Segmented: Sg, BottomSheet: Sh, CategoryChip: Cc, StatusDot: Sd, Avatar: Av,
        Icons: I } = window;

// ─────────────────────────────────────────────────────────────
// Shared sample data
// ─────────────────────────────────────────────────────────────
const FAMILY = [
  { name: 'Marc',       role: 'Père',         email: 'marc@famille.fr',     status: 'available', tasks: 4 },
  { name: 'Belle Mere', role: 'Belle-mère',   email: 'claire@famille.fr',   status: 'busy',      tasks: 2 },
  { name: 'Dorian',     role: 'Fils',         email: 'dorian@famille.fr',   status: 'available', tasks: 3, me: true },
];
const TASKS = [
  { id:1, title: 'Réparer la clôture du jardin',   assignees:['Marc','Dorian'],    due:{ label:"Sam. 10:00" },           priority:'high',   category:'Jardin',   status:'pending',     needsHelp:true },
  { id:2, title: "Sortir les poubelles",           assignees:['Dorian'],           due:{ label:"Ce soir" },              priority:'medium', category:'Ménage',   status:'pending' },
  { id:3, title: "Courses de la semaine",          assignees:['Belle Mere'],       due:{ label:"Demain" },               priority:'medium', category:'Courses',  status:'in_progress' },
  { id:4, title: "Vider le lave-vaisselle",        assignees:['Dorian'],           due:{ label:"Aujourd'hui" },          priority:'low',    category:'Cuisine',  status:'pending' },
  { id:5, title: "Payer la facture EDF",           assignees:['Marc'],             due:{ label:"En retard" , overdue:true }, priority:'high', category:'Admin', status:'pending' },
  { id:6, title: "Promener le chien",              assignees:['Belle Mere','Dorian'], due:{ label:"18:00" },              priority:'low',    category:'Animaux',  status:'completed' },
  { id:7, title: "Aspi rez-de-chaussée",           assignees:['Belle Mere'],       due:{ label:"Hier" },                 priority:'low',    category:'Ménage',   status:'completed' },
];

// ═════════════════════════════════════════════════════════════
// 1 · LOGIN
// ═════════════════════════════════════════════════════════════
const LoginScreen = () => (
  <div style={{ height: '100%', background: '#FAFAF8', display: 'flex', flexDirection: 'column', padding: '28px 24px 32px' }}>
    <div style={{ flex: 1 }}>
      {/* Logo mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I.Home size={22} style={{ color: '#fff', strokeWidth: 2.25 }} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4, color: '#191917' }}>HouseTasks</div>
      </div>

      <div style={{ marginTop: 48 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.7, color: '#191917', lineHeight: 1.15 }}>
          Content de te revoir.
        </div>
        <div style={{ fontSize: 15, color: '#5A5A52', marginTop: 8, lineHeight: 1.5 }}>
          Connecte-toi pour voir les tâches de la famille et ta disponibilité.
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Fl label="Email"><Inp placeholder="toi@famille.fr" leading={<I.Mail size={18} />} defaultValue="dorian@famille.fr" /></Fl>
        <Fl label="Mot de passe"><Inp type="password" defaultValue="password" leading={<I.Lock size={18} />} trailing={<I.Eye size={18} />} /></Fl>
        <div style={{ textAlign: 'right', marginTop: -4 }}>
          <a style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 600, textDecoration: 'none' }}>Mot de passe oublié ?</a>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Btn variant="primary" size="lg" full>Se connecter</Btn>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#E6E6E1' }} />
        <span style={{ fontSize: 12, color: '#78786F', fontWeight: 500 }}>ou</span>
        <div style={{ flex: 1, height: 1, background: '#E6E6E1' }} />
      </div>

      <Btn variant="outline" size="lg" full>Créer un compte famille</Btn>
    </div>

    <div style={{ textAlign: 'center', fontSize: 12, color: '#78786F' }}>
      En continuant, tu acceptes nos conditions.
    </div>
  </div>
);

// ═════════════════════════════════════════════════════════════
// 2 · DASHBOARD
// ═════════════════════════════════════════════════════════════
const DashboardScreen = () => {
  const mine = TASKS.filter(t => t.assignees.includes('Dorian') && t.status !== 'completed');
  return (
    <div style={{ height: '100%', background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Hd
          title="Bonjour Dorian 👋"
          subtitle="Mardi 24 avril · 3 tâches t'attendent"
          trailing={<IBtn icon={<I.Bell size={20} />} ariaLabel="Notifications" />}
        />

        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '0 20px 8px' }}>
          {[
            { n: 3, l: 'Pour moi',   c: '#2D6A4F', bg: '#EEF6F1' },
            { n: 1, l: 'En retard',  c: '#C2410C', bg: '#FCE8DD' },
            { n: 5, l: 'Cette sem.', c: '#3F3F39', bg: '#F3F3F0' },
          ].map(s => (
            <div key={s.l} style={{ background: s.bg, borderRadius: 14, padding: '14px 12px' }}>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, color: s.c, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#3F3F39', marginTop: 6, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Today */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#191917', letterSpacing: -0.2 }}>À faire aujourd'hui</div>
            <a style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 600 }}>Tout voir</a>
          </div>
          <Cd padding={16}>
            {mine.slice(0, 3).map((t, i, arr) => (
              <div key={t.id} style={{ borderBottom: i === arr.length - 1 ? 'none' : undefined }}>
                <Tr task={t} />
              </div>
            ))}
          </Cd>
        </div>

        {/* Family availability */}
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#191917', letterSpacing: -0.2 }}>La famille maintenant</div>
          </div>
          <Cd padding={14}>
            {FAMILY.map((f, i) => (
              <div key={f.name} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderBottom: i === FAMILY.length - 1 ? 'none' : '1px solid #F3F3F0',
              }}>
                <div style={{ position: 'relative' }}>
                  <Av name={f.name} size={40} />
                  <div style={{ position: 'absolute', right: -2, bottom: -2 }}><Sd status={f.status} /></div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#191917' }}>{f.name}{f.me && ' · toi'}</div>
                  <div style={{ fontSize: 12, color: '#78786F', marginTop: 2 }}>
                    {f.status === 'available' ? 'Disponible' : f.status === 'busy' ? 'Occupé·e jusqu\'à 18:00' : 'Absent'}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#5A5A52' }}>{f.tasks} tâches</div>
              </div>
            ))}
          </Cd>
        </div>

        {/* Needs help CTA */}
        <div style={{ padding: '24px 20px 24px' }}>
          <Cd padding={16} style={{ background: '#EEF6F1', borderColor: '#AFD3BC' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <I.Sparkle size={20} style={{ color: '#fff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1B4232' }}>Marc a besoin de toi</div>
                <div style={{ fontSize: 13, color: '#235540', marginTop: 2, lineHeight: 1.45 }}>Réparer la clôture — samedi 10:00. Tu es libre.</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <Btn size="sm" variant="primary">Accepter</Btn>
                  <Btn size="sm" variant="ghost">Plus tard</Btn>
                </div>
              </div>
            </div>
          </Cd>
        </div>
      </div>
      <Nav active="home" />
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 3 · TASKS LIST
// ═════════════════════════════════════════════════════════════
const TasksScreen = () => {
  const sections = [
    { title: "En retard",    items: TASKS.filter(t => t.due?.overdue) },
    { title: "Aujourd'hui",  items: TASKS.filter(t => !t.due?.overdue && t.status !== 'completed' && ['Aujourd\'hui','Ce soir'].includes(t.due?.label)) },
    { title: "Cette semaine",items: TASKS.filter(t => !t.due?.overdue && t.status !== 'completed' && !['Aujourd\'hui','Ce soir'].includes(t.due?.label)) },
    { title: "Terminées",    items: TASKS.filter(t => t.status === 'completed') },
  ];
  return (
    <div style={{ height: '100%', background: '#FAFAF8', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Hd
          title="Tâches"
          trailing={<><IBtn icon={<I.Search size={20} />} ariaLabel="Search" /><IBtn icon={<I.Filter size={20} />} ariaLabel="Filter" /></>}
        />
        <div style={{ padding: '0 20px 8px' }}>
          <Sg value="me" onChange={() => {}} options={[
            { value: 'all',  label: 'Toutes' },
            { value: 'me',   label: 'Pour moi' },
            { value: 'help', label: 'Besoin d\'aide' },
          ]} />
        </div>

        <div style={{ padding: '8px 20px 100px' }}>
          {sections.filter(s => s.items.length > 0).map(s => (
            <div key={s.title} style={{ marginTop: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#78786F',
                letterSpacing: 0.6, textTransform: 'uppercase', padding: '0 4px 8px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {s.title}
                <span style={{ fontSize: 11, color: '#A8A89F' }}>· {s.items.length}</span>
              </div>
              <Cd padding={16}>
                {s.items.map((t, i) => (
                  <div key={t.id} style={{ borderBottom: i === s.items.length - 1 ? 'none' : undefined, marginBottom: i === s.items.length - 1 ? -14 : 0 }}>
                    <div style={{ padding: '0', opacity: 1 }}>
                      <Tr task={t} />
                    </div>
                  </div>
                ))}
              </Cd>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button style={{
        position: 'absolute', right: 20, bottom: 98,
        width: 56, height: 56, borderRadius: 999, border: 'none',
        background: '#2D6A4F', color: '#fff',
        boxShadow: '0 8px 20px rgba(45,106,79,0.35), 0 2px 6px rgba(25,25,23,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }} aria-label="Nouvelle tâche">
        <I.Plus size={26} style={{ strokeWidth: 2.5 }} />
      </button>

      <Nav active="tasks" />
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 4 · TASK DETAIL
// ═════════════════════════════════════════════════════════════
const TaskDetailScreen = () => (
  <div style={{ height: '100%', background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Hd
        leading={<IBtn icon={<I.ChevronL size={20} />} ariaLabel="Back" />}
        trailing={<><IBtn icon={<I.Edit size={18} />} ariaLabel="Edit" /><IBtn icon={<I.MoreH size={20} />} ariaLabel="More" /></>}
        compact
      />
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Bg tone="accent" dot>Priorité haute</Bg>
          <Bg tone="neutral">Jardin</Bg>
          <Bg tone="info">Besoin d'aide</Bg>
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.55, color: '#191917', lineHeight: 1.2 }}>
          Réparer la clôture du jardin
        </div>
        <div style={{ fontSize: 15, color: '#3F3F39', marginTop: 12, lineHeight: 1.55, textWrap: 'pretty' }}>
          Deux poteaux sont tombés côté ouest. Il faut creuser et remettre du béton. Les outils sont dans la remise.
        </div>
      </div>

      {/* Meta card */}
      <div style={{ padding: '20px' }}>
        <Cd padding={0}>
          {[
            { ic: <I.Calendar size={18} />, k: 'Échéance', v: 'Samedi 27 avril · 10:00' },
            { ic: <I.User size={18} />,     k: 'Créé par', v: 'Marc · il y a 2 heures' },
            { ic: <I.Flag size={18} />,     k: 'Priorité', v: 'Haute', color: '#C2410C' },
          ].map((r, i, arr) => (
            <div key={r.k} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              borderBottom: i === arr.length - 1 ? 'none' : '1px solid #F3F3F0',
            }}>
              <div style={{ color: '#78786F' }}>{r.ic}</div>
              <div style={{ fontSize: 13, color: '#78786F', width: 90 }}>{r.k}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: r.color || '#191917', flex: 1, textAlign: 'right' }}>{r.v}</div>
            </div>
          ))}
        </Cd>
      </div>

      {/* Assignees */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#78786F', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Assigné à</div>
        <Cd padding={14}>
          {[
            { name: 'Marc',   role: 'Responsable', status: 'busy' },
            { name: 'Dorian', role: 'En renfort',  status: 'available' },
          ].map((p, i, arr) => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderBottom: i === arr.length - 1 ? 'none' : '1px solid #F3F3F0',
            }}>
              <div style={{ position: 'relative' }}>
                <Av name={p.name} size={40} />
                <div style={{ position: 'absolute', right: -2, bottom: -2 }}><Sd status={p.status} /></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#191917' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#78786F' }}>{p.role}</div>
              </div>
              <Bg tone={p.status === 'available' ? 'success' : 'danger'} dot size="sm">
                {p.status === 'available' ? 'Libre sam.' : 'Occupé'}
              </Bg>
            </div>
          ))}
        </Cd>
      </div>

      {/* Actions */}
      <div style={{ padding: '24px 20px 120px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Btn variant="primary" size="lg" full leading={<I.CheckCircle size={20} />}>Marquer comme fait</Btn>
        <Btn variant="secondary" size="lg" full leading={<I.Clock size={18} />}>Commencer (en cours)</Btn>
      </div>
    </div>
    <Nav active="tasks" />
  </div>
);

// ═════════════════════════════════════════════════════════════
// 5 · CREATE TASK (bottom sheet over tasks list)
// ═════════════════════════════════════════════════════════════
const CreateTaskScreen = () => (
  <div style={{ height: '100%', background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
    {/* Dimmed tasks list underneath */}
    <div style={{ filter: 'blur(1px)', opacity: 0.85, height: '100%' }}>
      <TasksScreen />
    </div>

    <Sh maxHeight="85%">
      <div style={{ padding: '8px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{ background: 'transparent', border: 'none', color: '#2D6A4F', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#191917' }}>Nouvelle tâche</div>
        <button style={{ background: 'transparent', border: 'none', color: '#2D6A4F', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>Créer</button>
      </div>
      <div style={{ overflow: 'auto', padding: '4px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Fl label="Titre" required><Inp placeholder="Réparer la clôture" defaultValue="Réparer la clôture du jardin" /></Fl>
        <Fl label="Description"><Ta placeholder="Notes, matériel, précisions…" defaultValue="Deux poteaux sont tombés côté ouest. Les outils sont dans la remise." /></Fl>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#3F3F39', marginBottom: 8 }}>Catégorie</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Cc icon={<I.Leaf size={14} />}   label="Jardin" selected />
            <Cc icon={<I.Dish size={14} />}   label="Cuisine" />
            <Cc icon={<I.Cart size={14} />}   label="Courses" />
            <Cc icon={<I.Paw size={14} />}    label="Animaux" />
            <Cc icon={<I.Wrench size={14} />} label="Bricolage" />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#3F3F39', marginBottom: 8 }}>Assigner à</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {FAMILY.map(p => {
              const sel = ['Marc','Dorian'].includes(p.name);
              return (
                <button key={p.name} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px 6px 6px', borderRadius: 999,
                  border: `1.5px solid ${sel ? '#2D6A4F' : '#E6E6E1'}`,
                  background: sel ? '#EEF6F1' : '#fff',
                  fontFamily: 'inherit', cursor: 'pointer',
                }}>
                  <Av name={p.name} size={28} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: sel ? '#1B4232' : '#3F3F39' }}>{p.name}</span>
                  {sel && <I.Check size={14} style={{ color: '#2D6A4F', strokeWidth: 3 }} />}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Fl label="Échéance"><Inp leading={<I.Calendar size={18} />} defaultValue="Sam. 27 avril" /></Fl>
          <Fl label="Heure"><Inp leading={<I.Clock size={18} />} defaultValue="10:00" /></Fl>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#3F3F39', marginBottom: 8 }}>Priorité</div>
          <Sg value="high" onChange={() => {}} options={[
            { value: 'low',    label: 'Basse' },
            { value: 'medium', label: 'Moyenne' },
            { value: 'high',   label: 'Haute' },
          ]} />
        </div>
      </div>
    </Sh>
  </div>
);

// ═════════════════════════════════════════════════════════════
// 6 · CALENDAR / AVAILABILITY
// ═════════════════════════════════════════════════════════════
const CalendarScreen = () => {
  const days = ['Lun 22','Mar 23','Mer 24','Jeu 25','Ven 26','Sam 27','Dim 28'];
  // events: {dayIdx, startH, endH, who, label, tone}
  const evs = [
    { d: 0, s: 9,  e: 17, who: 'Marc',       label: 'Travail',    tone: 'busy' },
    { d: 0, s: 9,  e: 13, who: 'Belle Mere', label: 'Bureau',     tone: 'busy' },
    { d: 2, s: 14, e: 18, who: 'Dorian',     label: 'Cours',      tone: 'busy' },
    { d: 4, s: 19, e: 22, who: 'Marc',       label: 'Dîner',      tone: 'away' },
    { d: 5, s: 10, e: 12, who: 'Dorian',     label: 'Gaming',     tone: 'away' },
    { d: 5, s: 10, e: 12, who: 'Marc',       label: 'Clôture',    tone: 'task', accent: true },
    { d: 5, s: 10, e: 12, who: 'Dorian',     label: 'Clôture',    tone: 'task', accent: true },
    { d: 6, s: 11, e: 14, who: 'Belle Mere', label: 'Famille',    tone: 'away' },
  ];
  const HOUR_H = 28;
  const START = 8, END = 22;
  return (
    <div style={{ height: '100%', background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Hd
          title="Calendrier"
          subtitle="Disponibilité · Semaine du 22 avril"
          trailing={<><IBtn icon={<I.ChevronL size={20} />} ariaLabel="Previous" /><IBtn icon={<I.Chevron size={20} />} ariaLabel="Next" /></>}
        />
        <div style={{ padding: '0 16px 8px' }}>
          <Sg value="week" onChange={() => {}} options={[
            { value: 'day',  label: 'Jour' },
            { value: 'week', label: 'Semaine' },
            { value: 'me',   label: 'Moi' },
          ]} />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, padding: '8px 20px 4px', flexWrap: 'wrap' }}>
          {[
            { c: '#E6E6E1', l: 'Libre' },
            { c: '#F0A685', l: 'Occupé' },
            { c: '#FBE6CC', l: 'Autre' },
            { c: '#2D6A4F', l: 'Tâche', bordered: true },
          ].map(l => (
            <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.c, border: l.bordered ? '1.5px solid #2D6A4F' : 'none' }} />
              <span style={{ fontSize: 12, color: '#5A5A52', fontWeight: 500 }}>{l.l}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ padding: '8px 12px 120px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '36px repeat(7, 1fr)',
            background: '#fff', borderRadius: 14, border: '1px solid #E6E6E1', overflow: 'hidden',
          }}>
            {/* Header row */}
            <div style={{ background: '#FAFAF8', borderBottom: '1px solid #E6E6E1' }} />
            {days.map((d, i) => (
              <div key={d} style={{
                background: '#FAFAF8', borderBottom: '1px solid #E6E6E1',
                padding: '8px 0', textAlign: 'center',
                fontSize: 10, fontWeight: 700, color: i === 2 ? '#2D6A4F' : '#5A5A52',
                letterSpacing: 0.3,
              }}>
                {d.split(' ')[0]}
                <div style={{ fontSize: 14, marginTop: 2, color: i === 2 ? '#2D6A4F' : '#191917', fontWeight: 700, letterSpacing: -0.2 }}>{d.split(' ')[1]}</div>
              </div>
            ))}

            {/* Hours col + day cols */}
            <div style={{ position: 'relative', height: (END - START) * HOUR_H }}>
              {Array.from({ length: END - START + 1 }).map((_, i) => (
                <div key={i} style={{
                  position: 'absolute', top: i * HOUR_H - 6, right: 4,
                  fontSize: 9, color: '#A8A89F', fontFamily: 'ui-monospace, Menlo, monospace',
                }}>{START + i}h</div>
              ))}
            </div>
            {days.map((_, di) => (
              <div key={di} style={{
                position: 'relative',
                borderLeft: '1px solid #F3F3F0',
                height: (END - START) * HOUR_H,
              }}>
                {/* hour lines */}
                {Array.from({ length: END - START }).map((_, i) => (
                  <div key={i} style={{ position: 'absolute', top: i * HOUR_H, left: 0, right: 0, borderTop: i === 0 ? 'none' : '1px dashed #F3F3F0' }} />
                ))}
                {/* events */}
                {evs.filter(e => e.d === di).map((e, i) => {
                  const top = (e.s - START) * HOUR_H;
                  const h = (e.e - e.s) * HOUR_H;
                  const bg = e.tone === 'busy' ? '#FADCCB' : e.tone === 'away' ? '#FBE6CC' : '#EEF6F1';
                  const fg = e.tone === 'busy' ? '#A8502F' : e.tone === 'away' ? '#7A5416' : '#1B4232';
                  return (
                    <div key={i} style={{
                      position: 'absolute', top: top + 1, left: 2 + (i % 2) * 4, right: 2,
                      height: h - 2, borderRadius: 4,
                      background: bg, color: fg,
                      border: e.accent ? '1.5px solid #2D6A4F' : 'none',
                      padding: '3px 4px', overflow: 'hidden',
                      fontSize: 9, fontWeight: 600, lineHeight: 1.2,
                    }}>
                      {e.who.split(' ')[0]}
                      <div style={{ fontSize: 8, opacity: 0.8, fontWeight: 500 }}>{e.label}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <Btn variant="primary" size="md" full leading={<I.Plus size={18} />}>Marquer indisponible</Btn>
          </div>
        </div>
      </div>
      <Nav active="calendar" />
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 7 · FAMILY
// ═════════════════════════════════════════════════════════════
const FamilyScreen = () => (
  <div style={{ height: '100%', background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Hd title="Famille" subtitle="3 membres" trailing={<IBtn icon={<I.Plus size={20} />} ariaLabel="Invite" variant="primary" />} />

      <div style={{ padding: '0 20px 16px' }}>
        <Inp placeholder="Rechercher…" leading={<I.Search size={18} />} />
      </div>

      <div style={{ padding: '0 20px 120px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FAMILY.map(f => (
          <Cd key={f.name} padding={16} interactive>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative' }}>
                <Av name={f.name} size={56} />
                <div style={{ position: 'absolute', right: 0, bottom: 0 }}><Sd status={f.status} size={14} /></div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#191917', letterSpacing: -0.2 }}>{f.name}</div>
                  {f.me && <Bg tone="primary" size="sm">Toi</Bg>}
                </div>
                <div style={{ fontSize: 13, color: '#78786F', marginTop: 2 }}>{f.role} · {f.email}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <Bg tone={f.status === 'available' ? 'success' : 'danger'} dot size="sm">
                    {f.status === 'available' ? 'Disponible' : 'Occupé·e'}
                  </Bg>
                  <Bg tone="neutral" size="sm">{f.tasks} tâches</Bg>
                </div>
              </div>
              <I.Chevron size={18} style={{ color: '#A8A89F' }} />
            </div>
          </Cd>
        ))}

        {/* Invite card */}
        <Cd padding={16} style={{ borderStyle: 'dashed', background: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: '#F3F3F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.Plus size={20} style={{ color: '#5A5A52' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#191917' }}>Inviter un membre</div>
              <div style={{ fontSize: 12, color: '#78786F', marginTop: 2 }}>Envoie un lien par email</div>
            </div>
          </div>
        </Cd>
      </div>
    </div>
    <Nav active="family" />
  </div>
);

// ═════════════════════════════════════════════════════════════
// 8 · PROFILE
// ═════════════════════════════════════════════════════════════
const ProfileScreen = () => (
  <div style={{ height: '100%', background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Hd title="Profil" trailing={<IBtn icon={<I.Edit size={18} />} ariaLabel="Edit profile" />} />

      {/* Hero */}
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Av name="Dorian" size={96} />
          <div style={{ position: 'absolute', right: 2, bottom: 2 }}><Sd status="available" size={18} /></div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, color: '#191917', marginTop: 12 }}>Dorian Jacolin</div>
        <div style={{ fontSize: 14, color: '#78786F', marginTop: 2 }}>dorian@famille.fr</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <Bg tone="success" dot>Disponible</Bg>
          <Bg tone="neutral">Membre depuis avril</Bg>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 20px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { n: 12, l: 'Terminées' },
          { n: 3,  l: 'En cours' },
          { n: 7,  l: 'Streak j.' },
        ].map(s => (
          <Cd key={s.l} padding={14} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#191917', letterSpacing: -0.4, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: '#78786F', marginTop: 6, fontWeight: 500 }}>{s.l}</div>
          </Cd>
        ))}
      </div>

      {/* Settings groups */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#78786F', letterSpacing: 0.6, textTransform: 'uppercase', padding: '0 4px 8px' }}>Disponibilité</div>
        <Cd padding={0}>
          {[
            { ic: <I.Calendar size={18} />, l: 'Mes créneaux récurrents',   v: '3 blocs' },
            { ic: <I.Clock size={18} />,    l: 'Indisponibilité rapide',    v: 'Définir' },
          ].map((r, i, a) => (
            <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i === a.length - 1 ? 'none' : '1px solid #F3F3F0', minHeight: 48 }}>
              <div style={{ color: '#2D6A4F' }}>{r.ic}</div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: '#191917' }}>{r.l}</div>
              <div style={{ fontSize: 13, color: '#78786F' }}>{r.v}</div>
              <I.Chevron size={16} style={{ color: '#A8A89F' }} />
            </div>
          ))}
        </Cd>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#78786F', letterSpacing: 0.6, textTransform: 'uppercase', padding: '0 4px 8px' }}>Préférences</div>
        <Cd padding={0}>
          {[
            { ic: <I.Bell size={18} />,     l: 'Notifications',  v: 'Activées',  toggle: true },
            { ic: <I.Settings size={18} />, l: 'Apparence',       v: 'Système' },
            { ic: <I.User size={18} />,     l: 'Compte',          v: null },
          ].map((r, i, a) => (
            <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i === a.length - 1 ? 'none' : '1px solid #F3F3F0', minHeight: 48 }}>
              <div style={{ color: '#3F3F39' }}>{r.ic}</div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: '#191917' }}>{r.l}</div>
              {r.toggle ? (
                <div style={{ width: 44, height: 26, borderRadius: 999, background: '#2D6A4F', padding: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 999, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                </div>
              ) : r.v ? (
                <><div style={{ fontSize: 13, color: '#78786F' }}>{r.v}</div><I.Chevron size={16} style={{ color: '#A8A89F' }} /></>
              ) : <I.Chevron size={16} style={{ color: '#A8A89F' }} />}
            </div>
          ))}
        </Cd>
      </div>

      <div style={{ padding: '24px 20px 120px' }}>
        <Btn variant="ghost" size="md" full leading={<I.LogOut size={18} />} style={{ color: '#C2410C' }}>Se déconnecter</Btn>
      </div>
    </div>
    <Nav active="profile" />
  </div>
);

Object.assign(window, {
  LoginScreen, DashboardScreen, TasksScreen, TaskDetailScreen,
  CreateTaskScreen, CalendarScreen, FamilyScreen, ProfileScreen,
});
