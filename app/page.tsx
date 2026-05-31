'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock, AlertCircle, Bell, Phone, Wrench, ChevronRight,
  ArrowLeft, CheckCircle,
} from 'lucide-react';
import {
  SCREENS, COHORTS, STAGE_COLOR, ROUTE_LABELS, ROUTE_TAG_STYLES,
  resolveVp,
  type CohortKey, type Route, type Screen,
} from '@/lib/nudge-data';

// ─── Types ───────────────────────────────────────────────────────────────────

type Layer = 'L1' | 'L2' | 'L3_reminder' | 'L3_pbm' | 'L3_ticket' | 'L3_confirm';
type StateMode = 'clean' | 'error';

interface ConfirmState {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  body: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Handle() {
  return <div className="w-[28px] h-[3px] bg-[#E0E0E0] rounded-full mx-auto mb-1" />;
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mt-3">
      <div
        className="relative"
        style={{
          width: 296,
          background: '#1a1a1a',
          borderRadius: 36,
          padding: 9,
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
          style={{ width: 68, height: 20, background: '#1a1a1a', borderRadius: '0 0 12px 12px' }}
        />
        <div
          style={{
            width: '100%',
            aspectRatio: '9/16',
            background: '#F4F5F7',
            borderRadius: 28,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function AppBackground({ screen }: { screen: Screen }) {
  // Mock onboarding screen behind the sheet
  const stageLabel = { A: 'Profile', B: 'Documents', C: 'Verification' }[screen.stage];
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-2 px-4"
      style={{ background: '#E8E9F0', paddingTop: 38 }}
    >
      <div className="opacity-30 text-center flex flex-col items-center gap-2 w-full">
        <div className="w-9 h-9 rounded-full bg-[#C8CBD8]" />
        <div className="h-[7px] w-[90px] bg-[#C0C3D0] rounded-full" />
        <div className="h-[6px] w-[60px] bg-[#D0D3DE] rounded-full" />
        <div className="mt-2 h-10 w-full bg-[#D4D6E0] rounded-xl" />
        <div className="h-10 w-full bg-[#D4D6E0] rounded-xl" />
        <div
          className="mt-1 text-[9px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: STAGE_COLOR[screen.stage].bg, color: STAGE_COLOR[screen.stage].color }}
        >
          Stage {screen.stage} — {stageLabel}
        </div>
      </div>
    </div>
  );
}

// ─── Layer 1: Nudge sheet ─────────────────────────────────────────────────────

function L1Sheet({
  screen, cohort, stateMode, onContinueNow, onContinueLater,
}: {
  screen: Screen;
  cohort: CohortKey;
  stateMode: StateMode;
  onContinueNow: () => void;
  onContinueLater: () => void;
}) {
  const isErr = stateMode === 'error' && screen.error !== null;
  const data = isErr ? screen.error! : screen.clean;
  const c = COHORTS[cohort];
  const sc = STAGE_COLOR[screen.stage];
  const vp = resolveVp(data.vp, cohort);

  return (
    <div
      className="absolute inset-x-0 bottom-0 bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]"
      style={{ borderRadius: '20px 20px 0 0' }}
    >
      <Handle />

      {/* Cohort tag */}
      <span
        className="inline-flex items-center self-start px-[7px] py-[2px] rounded-full text-[10px] font-medium"
        style={{ background: c.bg, color: c.color }}
      >
        {c.label}
      </span>

      {/* Error badge */}
      {isErr && (
        <span className="inline-flex items-center gap-1 self-start px-[7px] py-[2px] rounded-full text-[10px] font-medium bg-[#FEF2F2] text-[#991B1B]">
          <AlertCircle size={10} aria-hidden />
          Issue on this screen
        </span>
      )}

      {/* Progress signal */}
      {screen.prog.type === 'time' ? (
        <div className="flex items-center gap-[5px] text-[10px] text-on-surface-secondary">
          <Clock size={10} aria-hidden />
          {screen.prog.label}
        </div>
      ) : (
        <div className="flex items-center gap-[5px] text-[10px] text-on-surface-secondary">
          <div className="flex-1 h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${screen.prog.pct}%`, background: sc.color }}
            />
          </div>
          <span>{screen.prog.label}</span>
        </div>
      )}

      {/* Header */}
      <p className="text-[14px] font-medium text-on-surface-primary leading-snug m-0">{data.hdr}</p>

      {/* Value prop */}
      <p className="text-[11px] text-on-surface-secondary leading-relaxed m-0">{vp}</p>

      {/* CTAs */}
      <button
        onClick={onContinueNow}
        className="w-full py-[10px] rounded-xl bg-[#18181B] text-white text-[12px] font-medium"
      >
        Continue now
      </button>
      <button
        onClick={onContinueLater}
        className="w-full py-[10px] rounded-xl border border-border-primary bg-surface-primary text-on-surface-primary text-[12px] font-medium"
        style={{ borderWidth: 0.5 }}
      >
        Continue later
      </button>
    </div>
  );
}

// ─── Layer 2: Dropout survey ──────────────────────────────────────────────────

function L2Survey({
  screen, stateMode, onRoute, onSkip,
}: {
  screen: Screen;
  stateMode: StateMode;
  onRoute: (r: Route) => void;
  onSkip: () => void;
}) {
  const isErr = stateMode === 'error' && screen.error !== null;
  const opts = (isErr ? screen.error! : screen.clean).opts;

  return (
    <>
      <div className="flex-1" style={{ background: 'rgba(0,0,0,0.28)' }} />
      <div
        className="bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]"
        style={{ borderRadius: '20px 20px 0 0' }}
      >
        <Handle />
        <p className="text-[10px] font-medium text-on-surface-tertiary uppercase tracking-wide m-0">
          What stopped you?
        </p>
        <div className="flex flex-col gap-[5px]">
          {opts.map((o, i) => (
            <button
              key={i}
              onClick={() => onRoute(o.route)}
              className="flex items-center justify-between gap-[5px] px-[10px] py-[8px] rounded-xl text-[11px] text-on-surface-primary text-left bg-surface-primary"
              style={{ border: '0.5px solid var(--border-primary)' }}
            >
              <span className="flex-1">{o.text}</span>
              <span
                className={`flex-shrink-0 text-[9px] font-medium px-[5px] py-[1px] rounded-full ${ROUTE_TAG_STYLES[o.route]}`}
              >
                {ROUTE_LABELS[o.route]}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onSkip}
          className="w-full py-[5px] text-[11px] text-on-surface-tertiary bg-transparent border-0"
        >
          Skip
        </button>
      </div>
    </>
  );
}

// ─── Layer 3: Reminder picker ─────────────────────────────────────────────────

function L3Reminder({
  onConfirm, onBack,
}: {
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const slots = ['In 1 hour', 'This evening at 6 PM', 'Tomorrow at 9 AM', 'Choose a time'];

  return (
    <>
      <div className="flex-1" style={{ background: '#E8E9F0' }} />
      <div
        className="bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]"
        style={{ borderRadius: '20px 20px 0 0' }}
      >
        <Handle />
        <p className="text-[13px] font-medium text-on-surface-primary m-0">When should we remind you?</p>
        <p className="text-[11px] text-on-surface-secondary m-0">We'll send a link back to your last screen.</p>
        <div className="flex flex-col gap-[5px]">
          {slots.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className="px-[10px] py-[8px] rounded-xl text-[11px] text-left transition-colors"
              style={{
                border: selected === s ? '1px solid #534AB7' : '0.5px solid var(--border-primary)',
                background: selected === s ? '#EEEDFE' : 'var(--surface-primary)',
                color: selected === s ? '#3C3489' : 'var(--on-surface-primary)',
                fontWeight: selected === s ? 500 : 400,
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={selected ? onConfirm : undefined}
          className="w-full py-[10px] rounded-xl text-[12px] font-medium text-white transition-opacity"
          style={{
            background: '#18181B',
            opacity: selected ? 1 : 0.35,
            pointerEvents: selected ? 'auto' : 'none',
          }}
        >
          Set reminder
        </button>
        <button onClick={onBack} className="w-full py-[5px] text-[11px] text-on-surface-tertiary bg-transparent border-0">
          Back
        </button>
      </div>
    </>
  );
}

// ─── Layer 3: PBM callback picker ────────────────────────────────────────────

function L3PBM({
  onConfirm, onBack,
}: {
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const slots = [
    { label: 'Morning', sub: '9 AM – 12 PM' },
    { label: 'Afternoon', sub: '12 PM – 4 PM' },
    { label: 'Evening', sub: '4 PM – 7 PM' },
  ];

  return (
    <>
      <div className="flex-1" style={{ background: '#E8E9F0' }} />
      <div
        className="bg-white flex flex-col gap-[7px] pt-3 px-[13px] pb-[18px]"
        style={{ borderRadius: '20px 20px 0 0' }}
      >
        <Handle />
        <p className="text-[13px] font-medium text-on-surface-primary m-0">Book a callback</p>
        <p className="text-[11px] text-on-surface-secondary m-0">A banking manager will call within one business day.</p>
        <div className="flex flex-col gap-[5px]">
          {slots.map((s) => (
            <button
              key={s.label}
              onClick={() => setSelected(s.label)}
              className="flex items-center justify-between px-[10px] py-[8px] rounded-xl text-[11px] text-left transition-colors"
              style={{
                border: selected === s.label ? '1px solid #166534' : '0.5px solid var(--border-primary)',
                background: selected === s.label ? '#F0FDF4' : 'var(--surface-primary)',
                color: selected === s.label ? '#166534' : 'var(--on-surface-primary)',
                fontWeight: selected === s.label ? 500 : 400,
              }}
            >
              <span>{s.label}</span>
              <span className="text-[10px] text-on-surface-secondary">{s.sub}</span>
            </button>
          ))}
        </div>
        <div
          className="flex justify-between items-center px-[10px] py-[7px] rounded-xl text-[10px]"
          style={{ background: 'var(--surface-secondary)' }}
        >
          <span className="text-on-surface-secondary">We'll call</span>
          <span className="font-medium text-on-surface-primary">+44 7700 900000</span>
        </div>
        <button
          onClick={selected ? onConfirm : undefined}
          className="w-full py-[10px] rounded-xl text-[12px] font-medium text-white transition-opacity"
          style={{
            background: '#18181B',
            opacity: selected ? 1 : 0.35,
            pointerEvents: selected ? 'auto' : 'none',
          }}
        >
          Confirm callback
        </button>
        <button onClick={onBack} className="w-full py-[5px] text-[11px] text-on-surface-tertiary bg-transparent border-0">
          Back
        </button>
      </div>
    </>
  );
}

// ─── Layer 3: Tech ticket confirmation ───────────────────────────────────────

function L3Ticket({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 text-center bg-white">
      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#FEF2F2' }}>
        <Wrench size={20} color="#991B1B" aria-hidden />
      </div>
      <p className="text-[14px] font-medium text-on-surface-primary m-0">We're on it</p>
      <p className="text-[11px] text-on-surface-secondary leading-relaxed m-0 max-w-[220px]">
        We've logged the issue and our team will investigate. We'll reach out once it's resolved — you can continue on your own at any time.
      </p>
      <button onClick={onBack} className="mt-2 text-[11px] text-on-surface-tertiary bg-transparent border-0">
        Back to app
      </button>
    </div>
  );
}

// ─── Layer 3: Confirmation (reminder set / callback booked / default) ─────────

function L3Confirm({ state, onBack }: { state: ConfirmState; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 text-center bg-white">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: state.iconBg }}
      >
        {state.icon}
      </div>
      <p className="text-[14px] font-medium text-on-surface-primary m-0">{state.title}</p>
      <p className="text-[11px] text-on-surface-secondary leading-relaxed m-0 max-w-[220px]">{state.body}</p>
      <button onClick={onBack} className="mt-2 text-[11px] text-on-surface-tertiary bg-transparent border-0">
        Back to app
      </button>
    </div>
  );
}

// ─── Control bar ─────────────────────────────────────────────────────────────

function ControlBar({
  screenIdx, cohort, stateMode,
  setScreenIdx, setCohort, setStateMode,
  hasError,
}: {
  screenIdx: number;
  cohort: CohortKey;
  stateMode: StateMode;
  setScreenIdx: (i: number) => void;
  setCohort: (c: CohortKey) => void;
  setStateMode: (s: StateMode) => void;
  hasError: boolean;
}) {
  const cohortKeys: CohortKey[] = ['B1', 'B2', 'B3', 'B4', 'B5'];
  const btnBase = 'px-[9px] py-[4px] rounded-lg text-[11px] cursor-pointer border transition-all';
  const btnOff = `${btnBase} border-border-primary bg-surface-primary text-on-surface-primary` ;
  const btnOn  = `${btnBase} border-border-primary bg-surface-primary text-on-surface-primary font-medium`;

  return (
    <div className="flex flex-col gap-[6px] px-1 pt-1">
      {/* Screen selector */}
      <div className="flex items-center gap-[6px] flex-wrap">
        <span className="text-[11px] font-medium text-on-surface-secondary min-w-[46px]">Screen</span>
        <select
          value={screenIdx}
          onChange={(e) => setScreenIdx(Number(e.target.value))}
          className="text-[11px] px-2 py-[4px] rounded-lg border text-on-surface-primary bg-surface-primary"
          style={{ borderWidth: 0.5, borderColor: 'var(--border-primary)' }}
        >
          {SCREENS.map((s, i) => (
            <option key={i} value={i}>{s.id}. {s.name}</option>
          ))}
        </select>
      </div>

      {/* Cohort selector */}
      <div className="flex items-center gap-[6px] flex-wrap">
        <span className="text-[11px] font-medium text-on-surface-secondary min-w-[46px]">Cohort</span>
        {cohortKeys.map((c) => (
          <button
            key={c}
            onClick={() => setCohort(c)}
            className={cohort === c ? btnOn : btnOff}
            style={{ borderWidth: 0.5 }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* State selector */}
      <div className="flex items-center gap-[6px] flex-wrap">
        <span className="text-[11px] font-medium text-on-surface-secondary min-w-[46px]">State</span>
        <button
          onClick={() => setStateMode('clean')}
          className={stateMode === 'clean' ? btnOn : btnOff}
          style={{ borderWidth: 0.5 }}
        >
          Clean drop-off
        </button>
        <button
          onClick={() => setStateMode('error')}
          disabled={!hasError}
          className={stateMode === 'error' ? btnOn : btnOff}
          style={{ borderWidth: 0.5, opacity: hasError ? 1 : 0.35, cursor: hasError ? 'pointer' : 'default' }}
        >
          Error state
        </button>
      </div>
    </div>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────

export default function ExitNudgePrototype() {
  const [screenIdx, setScreenIdx] = useState(0);
  const [cohort, setCohort]       = useState<CohortKey>('B1');
  const [stateMode, setStateMode] = useState<StateMode>('clean');
  const [layer, setLayer]         = useState<Layer>('L1');
  const [confirm, setConfirm]     = useState<ConfirmState | null>(null);

  const screen = SCREENS[screenIdx];
  const hasError = screen.error !== null;

  const handleSetScreen = useCallback((i: number) => {
    setScreenIdx(i);
    setStateMode('clean');
    setLayer('L1');
  }, []);

  const handleSetCohort = useCallback((c: CohortKey) => {
    setCohort(c);
    setLayer('L1');
  }, []);

  const handleSetState = useCallback((s: StateMode) => {
    setStateMode(s);
    setLayer('L1');
  }, []);

  const handleRoute = useCallback((route: Route) => {
    if (route === 'reminder') {
      setLayer('L3_reminder');
    } else if (route === 'pbm') {
      setLayer('L3_pbm');
    } else if (route === 'ticket') {
      setLayer('L3_ticket');
    } else {
      // default (skip)
      setConfirm({
        icon: <Clock size={20} color="var(--on-surface-secondary)" aria-hidden />,
        iconBg: 'var(--surface-secondary)',
        title: "We'll remind you",
        body: "Your progress is saved. We'll send you a nudge when the time feels right — continue whenever you're ready.",
      });
      setLayer('L3_confirm');
    }
  }, []);

  const handleReminderConfirm = useCallback(() => {
    setConfirm({
      icon: <Bell size={20} color="#3C3489" aria-hidden />,
      iconBg: '#EEF2FF',
      title: 'Reminder set',
      body: "We'll send you a notification with a link back to your last screen.",
    });
    setLayer('L3_confirm');
  }, []);

  const handlePBMConfirm = useCallback(() => {
    setConfirm({
      icon: <Phone size={20} color="#166534" aria-hidden />,
      iconBg: '#F0FDF4',
      title: 'Callback booked',
      body: "We'll call you at your selected time. Your progress is saved.",
    });
    setLayer('L3_confirm');
  }, []);

  const goBackToL1 = useCallback(() => setLayer('L1'), []);

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
      <div className="w-full max-w-[430px] bg-surface-primary rounded-2xl p-3 mb-2 border border-border-primary" style={{ borderWidth: 0.5 }}>
        <ControlBar
          screenIdx={screenIdx}
          cohort={cohort}
          stateMode={stateMode}
          setScreenIdx={handleSetScreen}
          setCohort={handleSetCohort}
          setStateMode={handleSetState}
          hasError={hasError}
        />
      </div>

      {/* Layer indicator */}
      <div className="w-full max-w-[430px] flex gap-1 mb-1 px-1">
        {(['L1', 'L2', 'L3'] as const).map((l) => {
          const active = layer === l || layer.startsWith(l);
          return (
            <div
              key={l}
              className="flex-1 h-[3px] rounded-full transition-all duration-300"
              style={{ background: active ? STAGE_COLOR[screen.stage].color : '#E0E0E0' }}
            />
          );
        })}
      </div>
      <div className="w-full max-w-[430px] flex gap-0 mb-0 px-1">
        {[
          { id: 'L1', label: 'Layer 1 — Nudge' },
          { id: 'L2', label: 'Layer 2 — Survey' },
          { id: 'L3', label: 'Layer 3 — Outcome' },
        ].map(({ id, label }) => {
          const active = layer === id || layer.startsWith(id);
          return (
            <p key={id} className="flex-1 text-center text-[9px] font-medium transition-colors" style={{ color: active ? STAGE_COLOR[screen.stage].color : '#B0B3BD' }}>
              {label}
            </p>
          );
        })}
      </div>

      {/* Phone shell */}
      <PhoneShell>
        <AnimatePresence mode="wait">
          {/* ── Layer 1 ──────────────────────────────────────── */}
          {layer === 'L1' && (
            <motion.div
              key="L1"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <AppBackground screen={screen} />
              <L1Sheet
                screen={screen}
                cohort={cohort}
                stateMode={stateMode}
                onContinueNow={goBackToL1}
                onContinueLater={() => setLayer('L2')}
              />
            </motion.div>
          )}

          {/* ── Layer 2 ──────────────────────────────────────── */}
          {layer === 'L2' && (
            <motion.div
              key="L2"
              className="absolute inset-0 flex flex-col"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <L2Survey
                screen={screen}
                stateMode={stateMode}
                onRoute={handleRoute}
                onSkip={() => handleRoute('default')}
              />
            </motion.div>
          )}

          {/* ── Layer 3: Reminder ─────────────────────────────── */}
          {layer === 'L3_reminder' && (
            <motion.div
              key="L3_reminder"
              className="absolute inset-0 flex flex-col"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <L3Reminder onConfirm={handleReminderConfirm} onBack={() => setLayer('L1')} />
            </motion.div>
          )}

          {/* ── Layer 3: PBM ──────────────────────────────────── */}
          {layer === 'L3_pbm' && (
            <motion.div
              key="L3_pbm"
              className="absolute inset-0 flex flex-col"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <L3PBM onConfirm={handlePBMConfirm} onBack={() => setLayer('L1')} />
            </motion.div>
          )}

          {/* ── Layer 3: Ticket ───────────────────────────────── */}
          {layer === 'L3_ticket' && (
            <motion.div
              key="L3_ticket"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <L3Ticket onBack={() => setLayer('L1')} />
            </motion.div>
          )}

          {/* ── Layer 3: Confirm ──────────────────────────────── */}
          {layer === 'L3_confirm' && confirm && (
            <motion.div
              key="L3_confirm"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <L3Confirm state={confirm} onBack={() => setLayer('L1')} />
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneShell>

      {/* Legend */}
      <div className="w-full max-w-[430px] mt-5 p-3 rounded-2xl bg-surface-primary border border-border-primary" style={{ borderWidth: 0.5 }}>
        <p className="text-[10px] font-medium text-on-surface-tertiary uppercase tracking-wide mb-2">Route key</p>
        <div className="flex flex-wrap gap-2">
          {([
            { label: 'Reminder', style: 'bg-surface-secondary text-on-surface-secondary' },
            { label: 'PBM call', style: 'bg-[#EEF2FF] text-[#3C3489]' },
            { label: 'Tech ticket', style: 'bg-[#FEF2F2] text-[#991B1B]' },
          ] as const).map((r) => (
            <span key={r.label} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${r.style}`}>
              {r.label}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <p className="text-[10px] text-on-surface-secondary m-0">
            <span className="font-medium">15 screens</span> across 3 stages: A (profile) → B (documents) → C (verification &amp; activation)
          </p>
          <p className="text-[10px] text-on-surface-secondary m-0">
            <span className="font-medium">Error state</span> available on screens 2, 6, 7, 8, 9, 10, 11, 12, 14, 15. Button disabled on screens with no error variant.
          </p>
          <p className="text-[10px] text-on-surface-secondary m-0">
            <span className="font-medium">Skip</span> on Layer 2 always routes to default reminder confirmation.
          </p>
        </div>
      </div>
    </main>
  );
}
