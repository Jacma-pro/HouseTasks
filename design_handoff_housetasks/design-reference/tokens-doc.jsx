// HouseTasks — Tokens showcase artboards (swatches, type scale, components)

const TokensCover = () => (
  <div style={{ padding: 48, background: '#FAFAF8', width: '100%', height: '100%', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#2D6A4F', textTransform: 'uppercase' }}>Design System · v1</div>
    <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2.5, color: '#191917', lineHeight: 1, marginTop: 16 }}>
      HouseTasks
    </div>
    <div style={{ fontSize: 22, color: '#3F3F39', maxWidth: 560, marginTop: 20, lineHeight: 1.4, textWrap: 'pretty' }}>
      Un système calme et chaleureux pour l'app de gestion de tâches familiales.
      Mobile-first, accessible WCAG&nbsp;AA, touch-friendly. 3 couleurs. 1 font. 8 écrans.
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 56 }}>
      {[
        { k: 'Primary', v: '#2D6A4F', sub: 'Forest — calme, familial' },
        { k: 'Accent',  v: '#D97757', sub: 'Terracotta — urgent, CTA sec.' },
        { k: 'Neutral', v: '#191917', sub: 'Warm gray — text & surfaces' },
      ].map(c => (
        <div key={c.k}>
          <div style={{ height: 120, background: c.v, borderRadius: 16 }} />
          <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: '#191917' }}>{c.k} · {c.v}</div>
          <div style={{ fontSize: 13, color: '#78786F', marginTop: 2 }}>{c.sub}</div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
      {[
        { n: '375px', l: 'Baseline width' },
        { n: '48px',  l: 'Touch target min' },
        { n: 'AA',    l: 'Contrast standard' },
        { n: '1 font', l: 'Plus Jakarta Sans' },
      ].map(s => (
        <div key={s.n} style={{ padding: 20, background: '#fff', borderRadius: 16, border: '1px solid #E6E6E1' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D6A4F', letterSpacing: -0.6 }}>{s.n}</div>
          <div style={{ fontSize: 13, color: '#5A5A52', marginTop: 4 }}>{s.l}</div>
        </div>
      ))}
    </div>
  </div>
);

const ColorPalette = () => {
  const Row = ({ name, scale }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#191917', marginBottom: 10, letterSpacing: -0.1 }}>{name}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${scale.length}, 1fr)`, gap: 8 }}>
        {scale.map(([k, v, fg]) => (
          <div key={k}>
            <div style={{ height: 72, borderRadius: 10, background: v, border: '1px solid rgba(0,0,0,0.04)', padding: 8, display: 'flex', alignItems: 'flex-end', color: fg }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{k}</span>
            </div>
            <div style={{ fontSize: 10, color: '#5A5A52', marginTop: 4, fontFamily: 'ui-monospace, Menlo, monospace' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
  const primary = [
    ['50','#EEF6F1','#1B4232'], ['100','#D6E9DD','#1B4232'], ['200','#AFD3BC','#1B4232'],
    ['300','#82B898','#fff'],   ['400','#529B77','#fff'],   ['500','#2D6A4F','#fff'],
    ['600','#235540','#fff'],   ['700','#1B4232','#fff'],   ['800','#153325','#fff'], ['900','#0E2319','#fff'],
  ];
  const accent = [
    ['50','#FDF2EC','#A8502F'], ['100','#FADCCB','#A8502F'], ['300','#F0A685','#fff'],
    ['500','#D97757','#fff'],   ['700','#A8502F','#fff'],
  ];
  const neutral = [
    ['0','#FFFFFF','#191917'], ['50','#FAFAF8','#191917'], ['100','#F3F3F0','#191917'],
    ['200','#E6E6E1','#191917'], ['300','#D1D1CA','#191917'], ['400','#A8A89F','#fff'],
    ['500','#78786F','#fff'], ['600','#5A5A52','#fff'], ['700','#3F3F39','#fff'], ['900','#191917','#fff'],
  ];
  const semantic = [
    ['success','#2D6A4F','#fff'], ['warning','#D4A017','#fff'],
    ['danger','#C2410C','#fff'],  ['info','#2B6CB0','#fff'],
  ];
  return (
    <div style={{ padding: 40, background: '#FAFAF8', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2D6A4F', textTransform: 'uppercase' }}>Colors</div>
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.9, color: '#191917', marginTop: 4, marginBottom: 28 }}>Palette</div>
      <Row name="Primary — Forest (brand)" scale={primary} />
      <Row name="Accent — Terracotta (CTA, due soon)" scale={accent} />
      <Row name="Neutral — Warm gray" scale={neutral} />
      <Row name="Semantic" scale={semantic} />
      <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 12, border: '1px solid #E6E6E1', fontSize: 13, color: '#3F3F39', lineHeight: 1.55 }}>
        <b style={{ color: '#191917' }}>Usage rules.</b> Primary 500 = boutons principaux, focus, navigation active. Accent 500 = deadline imminente, notifications. Neutrals = 90% de l'UI. Jamais &gt; 3 couleurs visibles sur un écran.
      </div>
    </div>
  );
};

const Typography = () => {
  const rows = [
    { name: 'Display · 4xl',  sz: 34, w: 700, lh: 1.15, tr: -0.85, sample: 'Bonjour Dorian' },
    { name: 'Title · 3xl',    sz: 28, w: 700, lh: 1.25, tr: -0.56, sample: 'Tâches du jour' },
    { name: 'Title · 2xl',    sz: 24, w: 600, lh: 1.3,  tr: -0.36, sample: 'Cette semaine' },
    { name: 'Heading · xl',   sz: 20, w: 600, lh: 1.35, tr: -0.2,  sample: 'Fix the fence' },
    { name: 'Body large · lg',sz: 18, w: 500, lh: 1.45, tr: -0.18, sample: 'Needs help with digging the posts.' },
    { name: 'Body · base',    sz: 16, w: 400, lh: 1.5,  tr: 0,     sample: 'Marc a besoin de toi samedi matin.' },
    { name: 'Label · sm',     sz: 14, w: 600, lh: 1.45, tr: 0,     sample: 'ASSIGNÉ À' },
    { name: 'Caption · xs',   sz: 12, w: 500, lh: 1.5,  tr: 0,     sample: 'il y a 2 heures · Maison' },
  ];
  return (
    <div style={{ padding: 40, background: '#FAFAF8', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2D6A4F', textTransform: 'uppercase' }}>Typography</div>
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.9, color: '#191917', marginTop: 4, marginBottom: 6 }}>Plus Jakarta Sans</div>
      <div style={{ fontSize: 14, color: '#5A5A52', marginBottom: 28 }}>Humaniste. Chaleureuse. 400/500/600/700. Optimisée 14–18px.</div>
      <div style={{ background: '#fff', border: '1px solid #E6E6E1', borderRadius: 16, overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={r.name} style={{
            display: 'grid', gridTemplateColumns: '200px 1fr 180px',
            alignItems: 'center', padding: '18px 20px',
            borderTop: i === 0 ? 'none' : '1px solid #F3F3F0',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#191917' }}>{r.name}</div>
              <div style={{ fontSize: 11, color: '#78786F', fontFamily: 'ui-monospace, Menlo, monospace', marginTop: 2 }}>
                {r.sz}/{Math.round(r.sz * r.lh)} · w{r.w}
              </div>
            </div>
            <div style={{ fontSize: r.sz, fontWeight: r.w, lineHeight: r.lh, letterSpacing: r.tr, color: '#191917' }}>
              {r.sample}
            </div>
            <div style={{ fontSize: 11, color: '#78786F', fontFamily: 'ui-monospace, Menlo, monospace', textAlign: 'right' }}>
              lh {r.lh} · tr {r.tr}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SpacingRadii = () => {
  const space = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80];
  const radii = [
    { k: 'sm · 6',   v: 6 }, { k: 'md · 10',  v: 10 },
    { k: 'lg · 14',  v: 14 }, { k: 'xl · 20',  v: 20 },
    { k: '2xl · 24', v: 24 }, { k: 'full',     v: 999 },
  ];
  return (
    <div style={{ padding: 40, background: '#FAFAF8', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2D6A4F', textTransform: 'uppercase' }}>Spacing · Radii · Elevation</div>
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.9, color: '#191917', marginTop: 4, marginBottom: 28 }}>Rythme</div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#191917', marginBottom: 12 }}>Spacing scale (4px base)</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, padding: 20, background: '#fff', borderRadius: 16, border: '1px solid #E6E6E1', overflowX: 'auto' }}>
        {space.map(s => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: Math.max(s, 4), height: Math.max(s, 4), background: '#2D6A4F', borderRadius: 4 }} />
            <div style={{ fontSize: 11, fontFamily: 'ui-monospace, Menlo, monospace', color: '#5A5A52' }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#191917', margin: '32px 0 12px' }}>Radii</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {radii.map(r => (
          <div key={r.k} style={{ background: '#fff', padding: 16, border: '1px solid #E6E6E1', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ width: 72, height: 48, background: '#EEF6F1', border: '1.5px solid #2D6A4F', borderRadius: r.v, margin: '0 auto 10px' }} />
            <div style={{ fontSize: 11, fontFamily: 'ui-monospace, Menlo, monospace', color: '#3F3F39' }}>{r.k}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#191917', margin: '32px 0 12px' }}>Elevation</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { n: 'xs', s: '0 1px 2px rgba(25,25,23,0.04)' },
          { n: 'sm', s: '0 1px 3px rgba(25,25,23,0.06), 0 1px 2px rgba(25,25,23,0.04)' },
          { n: 'md', s: '0 4px 12px rgba(25,25,23,0.06), 0 2px 4px rgba(25,25,23,0.04)' },
          { n: 'lg', s: '0 12px 28px rgba(25,25,23,0.10), 0 4px 8px rgba(25,25,23,0.04)' },
        ].map(e => (
          <div key={e.n} style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ width: '100%', height: 72, background: '#fff', borderRadius: 14, boxShadow: e.s }} />
            <div style={{ fontSize: 11, fontFamily: 'ui-monospace, Menlo, monospace', color: '#3F3F39', marginTop: 10 }}>shadow.{e.n}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const { Button, IconButton, Input, Textarea, Field, Badge, Priority, Avatar,
        Segmented, CategoryChip, StatusDot, TaskRow, Card } = window;
const Ic2 = window.Icons;

const Components = () => (
  <div style={{ padding: 36, background: '#FAFAF8', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2D6A4F', textTransform: 'uppercase' }}>Components</div>
    <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.9, color: '#191917', marginTop: 4, marginBottom: 28 }}>Library</div>

    {/* Buttons */}
    <Section title="Buttons">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="primary" leading={<Ic2.Plus size={18} />}>Create task</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost" leading={<Ic2.Filter size={18} />}>Filter</Button>
        <Button variant="danger" leading={<Ic2.Trash size={16} />}>Delete</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 12 }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium · 48</Button>
        <Button size="lg">Large · 56</Button>
        <IconButton icon={<Ic2.Plus size={20} />} ariaLabel="Add" variant="primary" />
        <IconButton icon={<Ic2.MoreH size={20} />} ariaLabel="More" />
        <IconButton icon={<Ic2.Bell size={20} />} ariaLabel="Notifications" />
      </div>
    </Section>

    {/* Inputs */}
    <Section title="Inputs">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 680 }}>
        <Field label="Email" required><Input placeholder="marc@family.fr" leading={<Ic2.Mail size={18} />} /></Field>
        <Field label="Password" helper="At least 8 characters"><Input type="password" placeholder="••••••••" leading={<Ic2.Lock size={18} />} trailing={<Ic2.Eye size={18} />} /></Field>
        <Field label="Task title"><Input placeholder="Fix the fence" /></Field>
        <Field label="Due date"><Input placeholder="Sat, May 3" leading={<Ic2.Calendar size={18} />} /></Field>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Description" helper="Optional context for the assignee"><Textarea placeholder="Needs help digging the fence posts. Tools are in the shed." /></Field>
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Invalid example" error="This email is already in use"><Input defaultValue="marc@family.fr" leading={<Ic2.Mail size={18} />} style={{ borderColor: '#C2410C', boxShadow: '0 0 0 3px rgba(194,65,12,0.15)' }} /></Field>
        </div>
      </div>
    </Section>

    {/* Badges */}
    <Section title="Badges & priority">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge tone="primary" dot>In progress</Badge>
        <Badge tone="success" dot>Completed</Badge>
        <Badge tone="accent" dot>Due today</Badge>
        <Badge tone="danger" dot>Overdue</Badge>
        <Badge tone="warning" dot>Pending</Badge>
        <Badge tone="neutral">Household</Badge>
        <Badge tone="info">Needs help</Badge>
        <Priority level="low" />
        <Priority level="medium" />
        <Priority level="high" />
      </div>
    </Section>

    {/* Avatars & availability */}
    <Section title="Avatars & status">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Avatar name="Marc" size={28} />
        <Avatar name="Belle Mere" size={36} />
        <Avatar name="Dorian" size={44} />
        <Avatar name="Eva Roux" size={64} />
        <div style={{ position: 'relative' }}>
          <Avatar name="Dorian" size={44} />
          <div style={{ position: 'absolute', right: -2, bottom: -2 }}><StatusDot status="available" /></div>
        </div>
        <div style={{ position: 'relative' }}>
          <Avatar name="Marc" size={44} />
          <div style={{ position: 'absolute', right: -2, bottom: -2 }}><StatusDot status="busy" /></div>
        </div>
      </div>
    </Section>

    {/* Segmented */}
    <Section title="Segmented & chips">
      <div style={{ maxWidth: 360, marginBottom: 16 }}>
        <Segmented value="all" onChange={() => {}} options={[
          { value: 'all', label: 'All' },
          { value: 'me',  label: 'For me' },
          { value: 'done',label: 'Done' },
        ]} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <CategoryChip icon={<Ic2.Dish size={14} />} label="Kitchen" selected />
        <CategoryChip icon={<Ic2.Leaf size={14} />} label="Garden" />
        <CategoryChip icon={<Ic2.Cart size={14} />} label="Groceries" />
        <CategoryChip icon={<Ic2.Paw size={14} />} label="Pets" />
        <CategoryChip icon={<Ic2.Wrench size={14} />} label="Repairs" />
      </div>
    </Section>

    {/* TaskRow samples */}
    <Section title="Task rows">
      <Card padding={20} style={{ maxWidth: 560 }}>
        <TaskRow task={{ title: 'Fix the garden fence', assignees: ['Marc', 'Dorian'], due: { label: 'Sat · 10:00' }, priority: 'high', category: 'Garden' }} />
        <TaskRow task={{ title: 'Take out the trash', assignees: ['Dorian'], due: { label: 'Tonight' }, priority: 'medium', category: 'Household' }} />
        <TaskRow task={{ title: 'Grocery run', assignees: ['Belle Mere'], due: { label: 'Tomorrow' }, priority: 'low', category: 'Groceries', status: 'completed' }} />
      </Card>
    </Section>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ fontSize: 14, fontWeight: 700, color: '#191917', marginBottom: 14, letterSpacing: -0.1 }}>{title}</div>
    {children}
  </div>
);

Object.assign(window, { TokensCover, ColorPalette, Typography, SpacingRadii, Components });
