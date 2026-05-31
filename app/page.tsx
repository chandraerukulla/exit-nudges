'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock, AlertCircle, Bell, Phone, Wrench, ChevronRight,
} from 'lucide-react';
import {
  SCREENS, COHORTS, STAGE_COLOR, ROUTE_LABELS, ROUTE_TAG_STYLES,
  resolveVp,
  type CohortKey, type Route, type Screen,
} from '@/lib/nudge-data';

// ─── Types ────────────────────────────────────────────────────────────────────

type DesignVariant = 'v1' | 'v2';

// Shared layer vocabulary across both variants.
// V1 path: nudge → survey → outcome
// V2 path: nudge → outcome (survey is embedded in the nudge sheet)
type Layer = 'nudge' | 'survey' | 'reminder' | 'pbm' | 'ticket' | 'confirm';

type StateMode = 'clean' | 'error';

interface ConfirmState {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  body: string;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Handle() {
  return <div className="w-[28px] h-[3px] bg-[#E0E0E0] rounded-full mx-auto" />;
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mt-3">
      <div className="relative" style={{ width: 296, background: '#1a1a1a', borderRadius: 36, padding: 9 }}>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
          style={{ width: 68, height: 20, background: '#1a1a1a', borderRadius: '0 0 12px 12px' }}
        />
        <div style={{ width: '100%', aspectRatio: '9/16', background: '#F4F5F7', borderRadius: 28, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function AppBackground({ screen }: { screen: Screen }) {
  const stageLabel = { A: 'Profile', B: 'Documents', C: 'Verification' }[screen.stage];
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4" style={{ background: '#E8E9F0', paddingTop: 38 }}>
      <div className="opacity-30 text-center flex flex-col items-center gap-2 w-full">
        <div className="w-9 h-9 rounded-full bg-[#C8CBD8]" />
        <div className="h-[7px] w-[90px] bg-[#C0C3D0] rounded-full" />
        <div className="h-[6px] w-[60px] bg-[#D0D3DE] rounded-full" />
        <div className="mt-2 h-10 w-full bg-[#D4D6E0] rounded-xl" />
        <div className="h-10 w-full bg-[#D4D6E0] rounded-xl" />
        <div className="mt-1 text-[9px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: STAGE_COLOR[screen.stage].bg, color: STAGE_COLOR[screen.stage].color }}>
          Stage {screen.stage} — {stageLabel}
        </div>
      </div>
    </div>
  );
}

// ─── V1: Nudge sheet ─ original two-button layout ────────────────────────────

function V1NudgeSheet({ screen, cohort, stateMode, onContinueNow, onContinueLater }: {
  screen: Screen; cohort: CohortKey; stateMode: StateMode;
  onContinueNow: () => void; onContinueLater: () => void;
}) {
  const isErr = stateMode === 'error' && screen.error !== null;
  const data  = isErr ? screen.error! : screen.clean;
  const c     = COHORTS[cohort];
  const sc    = STAGE_COLOR[screen.stage];
  const vp    = resolveVp(data.vp, cohort);

  return (
    <div className="absolute inset-x-0 bottom-0 bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]"
      style={{ borderRadius: '20px 20px 0 0' }}>
      <Handle />

      <span className="inline-flex items-center self-start px-[7px] py-[2px] rounded-full text-[10px] font-medium mt-1"
        style={{ background: c.bg, color: c.color }}>{c.label}</span>

      {isErr && (
        <span className="inline-flex items-center gap-1 self-start px-[7px] py-[2px] rounded-full text-[10px] font-medium bg-[#FEF2F2] text-[#991B1B]">
          <AlertCircle size={10} aria-hidden /> Issue on this screen
        </span>
      )}

      {screen.prog.type === 'time' ? (
        <div className="flex items-center gap-[5px] text-[10px] text-on-surface-secondary">
          <Clock size={10} aria-hidden /> {screen.prog.label}
        </div>
      ) : (
        <div className="flex items-center gap-[5px] text-[10px] text-on-surface-secondary">
          <div className="flex-1 h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${screen.prog.pct}%`, background: sc.color }} />
          </div>
          <span>{screen.prog.label}</span>
        </div>
      )}

      <p className="text-[14px] font-medium text-on-surface-primary leading-snug m-0">{data.hdr}</p>
      <p className="text-[11px] text-on-surface-secondary leading-relaxed m-0">{vp}</p>

      <button onClick={onContinueNow}
        className="w-full py-[10px] rounded-xl bg-[#18181B] text-white text-[12px] font-medium mt-1">
        Continue now
      </button>
      <button onClick={onContinueLater}
        className="w-full py-[10px] rounded-xl text-[12px] font-medium text-on-surface-primary bg-surface-primary"
        style={{ border: '0.5px solid var(--border-primary)' }}>
        Continue later
      </button>
    </div>
  );
}

// ─── V1: Survey sheet ─ separate step ────────────────────────────────────────

function V1SurveySheet({ screen, stateMode, onRoute, onSkip }: {
  screen: Screen; stateMode: StateMode;
  onRoute: (r: Route) => void; onSkip: () => void;
}) {
  const isErr = stateMode === 'error' && screen.error !== null;
  const opts  = (isErr ? screen.error! : screen.clean).opts;

  return (
    <>
      <div className="flex-1" style={{ background: 'rgba(0,0,0,0.28)' }} />
      <div className="bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]"
        style={{ borderRadius: '20px 20px 0 0' }}>
        <Handle />
        <p className="text-[10px] font-medium text-on-surface-tertiary uppercase tracking-wide m-0 mt-1">
          What stopped you?
        </p>
        <div className="flex flex-col gap-[5px]">
          {opts.map((o, i) => (
            <button key={i} onClick={() => onRoute(o.route)}
              className="flex items-center justify-between gap-[5px] px-[10px] py-[8px] rounded-xl text-[11px] text-on-surface-primary text-left bg-surface-primary"
              style={{ border: '0.5px solid var(--border-primary)' }}>
              <span className="flex-1">{o.text}</span>
              <span className={`flex-shrink-0 text-[9px] font-medium px-[5px] py-[1px] rounded-full ${ROUTE_TAG_STYLES[o.route]}`}>
                {ROUTE_LABELS[o.route]}
              </span>
            </button>
          ))}
        </div>
        <button onClick={onSkip} className="w-full py-[5px] text-[11px] text-on-surface-tertiary bg-transparent border-0">
          Skip
        </button>
      </div>
    </>
  );
}

// ─── V2: Combined nudge + options sheet ──────────────────────────────────────

function V2Sheet({ screen, cohort, stateMode, onContinueNow, onRoute, onSkip }: {
  screen: Screen; cohort: CohortKey; stateMode: StateMode;
  onContinueNow: () => void; onRoute: (r: Route) => void; onSkip: () => void;
}) {
  const isErr = stateMode === 'error' && screen.error !== null;
  const data  = isErr ? screen.error! : screen.clean;
  const c     = COHORTS[cohort];
  const sc    = STAGE_COLOR[screen.stage];
  const vp    = resolveVp(data.vp, cohort);

  return (
    <div className="absolute inset-x-0 bottom-0 bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]"
      style={{ borderRadius: '20px 20px 0 0' }}>

      {/* Handle row with Continue now pill tucked top-right */}
      <div className="flex items-center justify-between mb-[2px]">
        <div className="flex-1" />
        <Handle />
        <div className="flex-1 flex justify-end">
          <button onClick={onContinueNow}
            className="flex items-center gap-[4px] px-[9px] py-[4px] rounded-full text-[10px] font-medium bg-[#18181B] text-white">
            Continue now <ChevronRight size={10} aria-hidden />
          </button>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex items-center gap-[5px] flex-wrap">
        <span className="inline-flex items-center px-[7px] py-[2px] rounded-full text-[10px] font-medium"
          style={{ background: c.bg, color: c.color }}>{c.label}</span>
        {isErr && (
          <span className="inline-flex items-center gap-1 px-[7px] py-[2px] rounded-full text-[10px] font-medium bg-[#FEF2F2] text-[#991B1B]">
            <AlertCircle size={10} aria-hidden /> Issue on this screen
          </span>
        )}
      </div>

      {/* Progress */}
      {screen.prog.type === 'time' ? (
        <div className="flex items-center gap-[5px] text-[10px] text-on-surface-secondary">
          <Clock size={10} aria-hidden /> {screen.prog.label}
        </div>
      ) : (
        <div className="flex items-center gap-[5px] text-[10px] text-on-surface-secondary">
          <div className="flex-1 h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${screen.prog.pct}%`, background: sc.color }} />
          </div>
          <span>{screen.prog.label}</span>
        </div>
      )}

      <p className="text-[13px] font-medium text-on-surface-primary leading-snug m-0">{data.hdr}</p>
      <p className="text-[11px] text-on-surface-secondary leading-relaxed m-0">{vp}</p>

      <div className="h-px bg-border-primary" />

      <p className="text-[10px] font-medium text-on-surface-tertiary uppercase tracking-wide m-0">
        What stopped you?
      </p>
      <div className="flex flex-col gap-[4px]">
        {data.opts.map((o, i) => (
          <button key={i} onClick={() => onRoute(o.route)}
            className="flex items-center justify-between gap-[5px] px-[10px] py-[8px] rounded-xl text-[11px] text-on-surface-primary text-left bg-surface-primary"
            style={{ border: '0.5px solid var(--border-primary)' }}>
            <span className="flex-1">{o.text}</span>
            <span className={`flex-shrink-0 text-[9px] font-medium px-[5px] py-[1px] rounded-full ${ROUTE_TAG_STYLES[o.route]}`}>
              {ROUTE_LABELS[o.route]}
            </span>
          </button>
        ))}
      </div>
      <button onClick={onSkip} className="w-full py-[4px] text-[11px] text-on-surface-tertiary bg-transparent border-0">
        Skip
      </button>
    </div>
  );
}

// ─── Shared outcome: Reminder picker ─────────────────────────────────────────

function ReminderSheet({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const slots = ['In 1 hour', 'This evening at 6 PM', 'Tomorrow at 9 AM', 'Choose a time'];
  return (
    <>
      <div className="flex-1" style={{ background: '#E8E9F0' }} />
      <div className="bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]" style={{ borderRadius: '20px 20px 0 0' }}>
        <Handle />
        <p className="text-[13px] font-medium text-on-surface-primary m-0 mt-1">When should we remind you?</p>
        <p className="text-[11px] text-on-surface-secondary m-0">We'll send a link back to your last screen.</p>
        <div className="flex flex-col gap-[5px]">
          {slots.map((s) => (
            <button key={s} onClick={() => setSelected(s)}
              className="px-[10px] py-[8px] rounded-xl text-[11px] text-left transition-colors"
              style={{
                border: selected === s ? '1px solid #534AB7' : '0.5px solid var(--border-primary)',
                background: selected === s ? '#EEEDFE' : 'var(--surface-primary)',
                color: selected === s ? '#3C3489' : 'var(--on-surface-primary)',
                fontWeight: selected === s ? 500 : 400,
              }}>{s}</button>
          ))}
        </div>
        <button onClick={selected ? onConfirm : undefined}
          className="w-full py-[10px] rounded-xl text-[12px] font-medium text-white"
          style={{ background: '#18181B', opacity: selected ? 1 : 0.35, pointerEvents: selected ? 'auto' : 'none' }}>
          Set reminder
        </button>
        <button onClick={onBack} className="w-full py-[5px] text-[11px] text-on-surface-tertiary bg-transparent border-0">Back</button>
      </div>
    </>
  );
}

// ─── Shared outcome: PBM picker ───────────────────────────────────────────────

function PBMSheet({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const slots = [
    { label: 'Morning', sub: '9 AM – 12 PM' },
    { label: 'Afternoon', sub: '12 PM – 4 PM' },
    { label: 'Evening', sub: '4 PM – 7 PM' },
  ];
  return (
    <>
      <div className="flex-1" style={{ background: '#E8E9F0' }} />
      <div className="bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]" style={{ borderRadius: '20px 20px 0 0' }}>
        <Handle />
        <p className="text-[13px] font-medium text-on-surface-primary m-0 mt-1">Book a callback</p>
        <p className="text-[11px] text-on-surface-secondary m-0">A banking manager will call within one business day.</p>
        <div className="flex flex-col gap-[5px]">
          {slots.map((s) => (
            <button key={s.label} onClick={() => setSelected(s.label)}
              className="flex items-center justify-between px-[10px] py-[8px] rounded-xl text-[11px] text-left transition-colors"
              style={{
                border: selected === s.label ? '1px solid #166534' : '0.5px solid var(--border-primary)',
                background: selected === s.label ? '#F0FDF4' : 'var(--surface-primary)',
                color: selected === s.label ? '#166534' : 'var(--on-surface-primary)',
                fontWeight: selected === s.label ? 500 : 400,
              }}>
              <span>{s.label}</span>
              <span className="text-[10px] text-on-surface-secondary">{s.sub}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center px-[10px] py-[7px] rounded-xl text-[10px]"
          style={{ background: 'var(--surface-secondary)' }}>
          <span className="text-on-surface-secondary">We'll call</span>
          <span className="font-medium text-on-surface-primary">+44 7700 900000</span>
        </div>
        <button onClick={selected ? onConfirm : undefined}
          className="w-full py-[10px] rounded-xl text-[12px] font-medium text-white"
          style={{ background: '#18181B', opacity: selected ? 1 : 0.35, pointerEvents: selected ? 'auto' : 'none' }}>
          Confirm callback
        </button>
        <button onClick={onBack} className="w-full py-[5px] text-[11px] text-on-surface-tertiary bg-transparent border-0">Back</button>
      </div>
    </>
  );
}

// ─── Shared outcome: Ticket + Confirm ─────────────────────────────────────────

function TicketScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 text-center bg-white">
      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#FEF2F2' }}>
        <Wrench size={20} color="#991B1B" aria-hidden />
      </div>
      <p className="text-[14px] font-medium text-on-surface-primary m-0">We're on it</p>
      <p className="text-[11px] text-on-surface-secondary leading-relaxed m-0 max-w-[220px]">
        We've logged the issue and our team will investigate. We'll reach out once it's resolved — you can continue on your own at any time.
      </p>
      <button onClick={onBack} className="mt-2 text-[11px] text-on-surface-tertiary bg-transparent border-0">Back to app</button>
    </div>
  );
}

function ConfirmScreen({ state, onBack }: { state: ConfirmState; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 text-center bg-white">
      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: state.iconBg }}>
        {state.icon}
      </div>
      <p className="text-[14px] font-medium text-on-surface-primary m-0">{state.title}</p>
      <p className="text-[11px] text-on-surface-secondary leading-relaxed m-0 max-w-[220px]">{state.body}</p>
      <button onClick={onBack} className="mt-2 text-[11px] text-on-surface-tertiary bg-transparent border-0">Back to app</button>
    </div>
  );
}

// ─── Control bar ──────────────────────────────────────────────────────────────

function ControlBar({
  screenIdx, cohort, stateMode, variant,
  setScreenIdx, setCohort, setStateMode, setVariant,
  hasError,
}: {
  screenIdx: number; cohort: CohortKey; stateMode: StateMode; variant: DesignVariant;
  setScreenIdx: (i: number) => void; setCohort: (c: CohortKey) => void;
  setStateMode: (s: StateMode) => void; setVariant: (v: DesignVariant) => void;
  hasError: boolean;
}) {
  const cohortKeys: CohortKey[] = ['B1', 'B2', 'B3', 'B4', 'B5'];
  const selectCls = 'text-[11px] px-2 py-[4px] rounded-lg border text-on-surface-primary bg-surface-primary';
  const selectStyle = { borderWidth: 0.5, borderColor: 'var(--border-primary)' } as React.CSSProperties;
  const btnBase = 'px-[9px] py-[4px] rounded-lg text-[11px] cursor-pointer border transition-all';
  const btnOff  = `${btnBase} border-border-primary bg-surface-primary text-on-surface-primary`;
  const btnOn   = `${btnBase} border-border-primary bg-surface-primary text-on-surface-primary font-medium`;

  return (
    <div className="flex flex-col gap-[6px] px-1 pt-1">
      {/* Design variant */}
      <div className="flex items-center gap-[6px] flex-wrap">
        <span className="text-[11px] font-medium text-on-surface-secondary min-w-[46px]">Design</span>
        <select value={variant} onChange={(e) => setVariant(e.target.value as DesignVariant)}
          className={selectCls} style={selectStyle}>
          <option value="v1">Option 1 — Continue now / Continue later</option>
          <option value="v2">Option 2 — Continue now pill + options upfront</option>
        </select>
      </div>

      {/* Screen */}
      <div className="flex items-center gap-[6px] flex-wrap">
        <span className="text-[11px] font-medium text-on-surface-secondary min-w-[46px]">Screen</span>
        <select value={screenIdx} onChange={(e) => setScreenIdx(Number(e.target.value))}
          className={selectCls} style={selectStyle}>
          {SCREENS.map((s, i) => (
            <option key={i} value={i}>{s.id}. {s.name}</option>
          ))}
        </select>
      </div>

      {/* Cohort */}
      <div className="flex items-center gap-[6px] flex-wrap">
        <span className="text-[11px] font-medium text-on-surface-secondary min-w-[46px]">Cohort</span>
        {cohortKeys.map((c) => (
          <button key={c} onClick={() => setCohort(c)}
            className={cohort === c ? btnOn : btnOff} style={{ borderWidth: 0.5 }}>{c}</button>
        ))}
      </div>

      {/* State */}
      <div className="flex items-center gap-[6px] flex-wrap">
        <span className="text-[11px] font-medium text-on-surface-secondary min-w-[46px]">State</span>
        <button onClick={() => setStateMode('clean')}
          className={stateMode === 'clean' ? btnOn : btnOff} style={{ borderWidth: 0.5 }}>
          Clean drop-off
        </button>
        <button onClick={() => setStateMode('error')} disabled={!hasError}
          className={stateMode === 'error' ? btnOn : btnOff}
          style={{ borderWidth: 0.5, opacity: hasError ? 1 : 0.35, cursor: hasError ? 'pointer' : 'default' }}>
          Error state
        </button>
      </div>
    </div>
  );
}

// ─── Layer indicator ──────────────────────────────────────────────────────────

function LayerIndicator({ layer, variant, screen }: { layer: Layer; variant: DesignVariant; screen: Screen }) {
  const color = STAGE_COLOR[screen.stage].color;

  // V1: 3 steps — Nudge · Survey · Outcome
  // V2: 2 steps — Nudge+options · Outcome
  const v1Steps = [
    { key: 'nudge',   label: 'Layer 1 — Nudge',   active: layer === 'nudge' },
    { key: 'survey',  label: 'Layer 2 — Survey',   active: layer === 'survey' },
    { key: 'outcome', label: 'Layer 3 — Outcome',  active: ['reminder','pbm','ticket','confirm'].includes(layer) },
  ];
  const v2Steps = [
    { key: 'nudge',   label: 'Layer 1 — Nudge + options', active: layer === 'nudge' },
    { key: 'outcome', label: 'Layer 2 — Outcome',          active: ['reminder','pbm','ticket','confirm'].includes(layer) },
  ];
  const steps = variant === 'v1' ? v1Steps : v2Steps;

  return (
    <div className="w-full max-w-[430px] px-1">
      <div className="flex gap-1 mb-1">
        {steps.map((s) => (
          <div key={s.key} className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{ background: s.active ? color : '#E0E0E0' }} />
        ))}
      </div>
      <div className="flex">
        {steps.map((s) => (
          <p key={s.key} className="flex-1 text-center text-[9px] font-medium transition-colors m-0"
            style={{ color: s.active ? color : '#B0B3BD' }}>{s.label}</p>
        ))}
      </div>
    </div>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────

export default function ExitNudgePrototype() {
  const [screenIdx, setScreenIdx] = useState(0);
  const [cohort, setCohort]       = useState<CohortKey>('B1');
  const [stateMode, setStateMode] = useState<StateMode>('clean');
  const [variant, setVariant]     = useState<DesignVariant>('v1');
  const [layer, setLayer]         = useState<Layer>('nudge');
  const [confirm, setConfirm]     = useState<ConfirmState | null>(null);

  const screen   = SCREENS[screenIdx];
  const hasError = screen.error !== null;

  const reset = useCallback(() => setLayer('nudge'), []);

  const handleSetScreen = useCallback((i: number) => {
    setScreenIdx(i); setStateMode('clean'); setLayer('nudge');
  }, []);

  const handleSetCohort = useCallback((c: CohortKey) => {
    setCohort(c); setLayer('nudge');
  }, []);

  const handleSetState = useCallback((s: StateMode) => {
    setStateMode(s); setLayer('nudge');
  }, []);

  const handleSetVariant = useCallback((v: DesignVariant) => {
    setVariant(v); setLayer('nudge');
  }, []);

  const handleRoute = useCallback((route: Route) => {
    if (route === 'reminder') { setLayer('reminder'); }
    else if (route === 'pbm') { setLayer('pbm'); }
    else if (route === 'ticket') { setLayer('ticket'); }
    else {
      setConfirm({
        icon: <Clock size={20} color="var(--on-surface-secondary)" aria-hidden />,
        iconBg: 'var(--surface-secondary)',
        title: "We'll remind you",
        body: "Your progress is saved. We'll send you a nudge when the time feels right — continue whenever you're ready.",
      });
      setLayer('confirm');
    }
  }, []);

  const handleReminderConfirm = useCallback(() => {
    setConfirm({
      icon: <Bell size={20} color="#3C3489" aria-hidden />,
      iconBg: '#EEF2FF',
      title: 'Reminder set',
      body: "We'll send you a notification with a link back to your last screen.",
    });
    setLayer('confirm');
  }, []);

  const handlePBMConfirm = useCallback(() => {
    setConfirm({
      icon: <Phone size={20} color="#166534" aria-hidden />,
      iconBg: '#F0FDF4',
      title: 'Callback booked',
      body: "We'll call you at your selected time. Your progress is saved.",
    });
    setLayer('confirm');
  }, []);

  return (
    <main className="min-h-screen bg-surface-secondary flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="w-full max-w-[430px] mb-6">
        <h1 className="text-[18px] font-semibold text-on-surface-primary mb-1">Exit Nudge Prototype</h1>
        <p className="text-[12px] text-on-surface-secondary">
          NRE/NRO onboarding · 15 screens · 5 cohorts · clean + error states
        </p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-[430px] bg-surface-primary rounded-2xl p-3 mb-3 border border-border-primary" style={{ borderWidth: 0.5 }}>
        <ControlBar
          screenIdx={screenIdx} cohort={cohort} stateMode={stateMode} variant={variant}
          setScreenIdx={handleSetScreen} setCohort={handleSetCohort}
          setStateMode={handleSetState} setVariant={handleSetVariant}
          hasError={hasError}
        />
      </div>

      {/* Layer indicator */}
      <LayerIndicator layer={layer} variant={variant} screen={screen} />

      {/* Phone shell */}
      <PhoneShell>
        <AnimatePresence mode="wait">

          {/* ── Nudge layer ─────────────────────────────────── */}
          {layer === 'nudge' && variant === 'v1' && (
            <motion.div key="v1-nudge" className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}>
              <AppBackground screen={screen} />
              <V1NudgeSheet
                screen={screen} cohort={cohort} stateMode={stateMode}
                onContinueNow={reset}
                onContinueLater={() => setLayer('survey')}
              />
            </motion.div>
          )}

          {layer === 'nudge' && variant === 'v2' && (
            <motion.div key="v2-nudge" className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}>
              <AppBackground screen={screen} />
              <V2Sheet
                screen={screen} cohort={cohort} stateMode={stateMode}
                onContinueNow={reset}
                onRoute={handleRoute}
                onSkip={() => handleRoute('default')}
              />
            </motion.div>
          )}

          {/* ── V1 only: Survey layer ───────────────────────── */}
          {layer === 'survey' && (
            <motion.div key="v1-survey" className="absolute inset-0 flex flex-col"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.22 }}>
              <V1SurveySheet
                screen={screen} stateMode={stateMode}
                onRoute={handleRoute}
                onSkip={() => handleRoute('default')}
              />
            </motion.div>
          )}

          {/* ── Shared outcomes ─────────────────────────────── */}
          {layer === 'reminder' && (
            <motion.div key="reminder" className="absolute inset-0 flex flex-col"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.22 }}>
              <ReminderSheet onConfirm={handleReminderConfirm} onBack={reset} />
            </motion.div>
          )}

          {layer === 'pbm' && (
            <motion.div key="pbm" className="absolute inset-0 flex flex-col"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.22 }}>
              <PBMSheet onConfirm={handlePBMConfirm} onBack={reset} />
            </motion.div>
          )}

          {layer === 'ticket' && (
            <motion.div key="ticket" className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}>
              <TicketScreen onBack={reset} />
            </motion.div>
          )}

          {layer === 'confirm' && confirm && (
            <motion.div key="confirm" className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}>
              <ConfirmScreen state={confirm} onBack={reset} />
            </motion.div>
          )}

        </AnimatePresence>
      </PhoneShell>

      {/* Legend */}
      <div className="w-full max-w-[430px] mt-5 p-3 rounded-2xl bg-surface-primary border border-border-primary" style={{ borderWidth: 0.5 }}>
        <p className="text-[10px] font-medium text-on-surface-tertiary uppercase tracking-wide mb-2">Route key</p>
        <div className="flex flex-wrap gap-2">
          {([
            { label: 'Reminder',    style: 'bg-surface-secondary text-on-surface-secondary' },
            { label: 'PBM call',    style: 'bg-[#EEF2FF] text-[#3C3489]' },
            { label: 'Tech ticket', style: 'bg-[#FEF2F2] text-[#991B1B]' },
          ] as const).map((r) => (
            <span key={r.label} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${r.style}`}>{r.label}</span>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <p className="text-[10px] text-on-surface-secondary m-0">
            <span className="font-medium">Option 1</span> — 3-step flow: nudge sheet → dropout survey → outcome.
          </p>
          <p className="text-[10px] text-on-surface-secondary m-0">
            <span className="font-medium">Option 2</span> — 2-step flow: nudge + options in one sheet → outcome.
          </p>
          <p className="text-[10px] text-on-surface-secondary m-0">
            <span className="font-medium">Error state</span> available on screens 2, 6, 7, 8, 9, 10, 11, 12, 14, 15.
          </p>
        </div>
      </div>
    </main>
  );
}
