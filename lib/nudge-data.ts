// ─── Cohort definitions ───────────────────────────────────────────────────────

export type CohortKey = 'B1' | 'B2' | 'B3' | 'B4' | 'B5';

export interface Cohort {
  key: CohortKey;
  label: string;
  bg: string;
  color: string;
  hook: string;
}

export const COHORTS: Record<CohortKey, Cohort> = {
  B1: { key: 'B1', label: 'B1 — Compliance',    bg: '#FEF2F2', color: '#991B1B', hook: 'open the account that makes your India transfers FEMA-compliant' },
  B2: { key: 'B2', label: 'B2 — High-value',     bg: '#FFFBEB', color: '#92400E', hook: 'make every large transfer to India free' },
  B3: { key: 'B3', label: 'B3 — Fee-sensitive',  bg: '#ECFDF5', color: '#065F46', hook: 'stop paying transfer fees permanently' },
  B4: { key: 'B4', label: 'B4 — Digital-first',  bg: '#F5F3FF', color: '#5B21B6', hook: 'add NRI Banking with 7% interest and free transfers' },
  B5: { key: 'B5', label: 'B5 — General',        bg: '#F3F4F6', color: '#374151', hook: 'open your NRE and NRO accounts' },
};

// ─── Stage colours (progress bar / step indicator) ───────────────────────────

export type Stage = 'A' | 'B' | 'C';

export const STAGE_COLOR: Record<Stage, { bg: string; color: string }> = {
  A: { bg: '#EEF2FF', color: '#3C3489' },
  B: { bg: '#FFF7ED', color: '#92400E' },
  C: { bg: '#F0FDF4', color: '#166534' },
};

// ─── Routing outcomes ─────────────────────────────────────────────────────────

export type Route = 'reminder' | 'pbm' | 'ticket' | 'default';

export interface DropoutOption {
  text: string;
  route: Route;
}

// ─── Progress signal ──────────────────────────────────────────────────────────

export interface ProgressSignal {
  type: 'time' | 'steps';
  label: string;
  pct: number; // 0-100 for bar fill
}

// ─── Screen spec ──────────────────────────────────────────────────────────────

export interface ScreenState {
  hdr: string;
  vp: string; // contains {hook} placeholder
  opts: DropoutOption[];
}

export interface Screen {
  id: number;
  name: string;
  stage: Stage;
  prog: ProgressSignal;
  clean: ScreenState;
  error: ScreenState | null;
}

// ─── All 15 screens ───────────────────────────────────────────────────────────

export const SCREENS: Screen[] = [
  {
    id: 1,
    name: 'Full name and date of birth',
    stage: 'A',
    prog: { type: 'time', label: 'About 10 minutes to complete', pct: 5 },
    clean: {
      hdr: 'Your NRE/NRO account is 10 minutes away',
      vp: 'Complete your setup to {hook}.',
      opts: [
        { text: "I'm not sure this is the right account for me", route: 'pbm' },
        { text: "Something wasn't clear", route: 'pbm' },
        { text: "I'll come back to this later", route: 'reminder' },
      ],
    },
    error: null,
  },
  {
    id: 2,
    name: 'Address',
    stage: 'A',
    prog: { type: 'time', label: 'About 9 minutes left', pct: 12 },
    clean: {
      hdr: 'Just getting started — your details are saved',
      vp: 'Name and date of birth saved. Continue to {hook}.',
      opts: [
        { text: "I don't remember my postcode", route: 'reminder' },
        { text: "Something wasn't clear", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: 'We had trouble finding your address',
      vp: "Address lookups occasionally run into errors — we'll check. Once resolved, {hook}.",
      opts: [
        { text: "The address lookup isn't working", route: 'ticket' },
        { text: "I'll try again later", route: 'reminder' },
      ],
    },
  },
  {
    id: 3,
    name: 'Occupation and annual income',
    stage: 'A',
    prog: { type: 'time', label: 'About 8 minutes left', pct: 20 },
    clean: {
      hdr: 'Two more questions before documents',
      vp: 'Address saved. Complete these questions to {hook}.',
      opts: [
        { text: "I'm not comfortable sharing my income", route: 'pbm' },
        { text: "I'm not sure how to answer this", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: null,
  },
  {
    id: 4,
    name: 'Marital status',
    stage: 'A',
    prog: { type: 'time', label: 'About 7 minutes left', pct: 26 },
    clean: {
      hdr: 'Almost through your profile',
      vp: 'Occupation and income saved. A few more questions to {hook}.',
      opts: [
        { text: "I'm not sure why this is needed", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: null,
  },
  {
    id: 5,
    name: 'Education',
    stage: 'A',
    prog: { type: 'time', label: 'About 6 minutes left', pct: 32 },
    clean: {
      hdr: 'One question left before documents',
      vp: 'Almost through your profile. Answer this to {hook}.',
      opts: [
        { text: "I'm not sure why this is needed", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: null,
  },
  {
    id: 6,
    name: 'Passport details',
    stage: 'B',
    prog: { type: 'steps', label: 'Step 1 of 5 — identity and documents', pct: 38 },
    clean: {
      hdr: 'Profile complete — documents are next',
      vp: 'Profile complete. Passport details are the first document step to {hook}.',
      opts: [
        { text: "I don't have my passport with me", route: 'reminder' },
        { text: "I'm not sure what details to enter", route: 'pbm' },
        { text: "I'm not sure if my passport will be accepted", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: 'We had trouble with your passport details',
      vp: "Passport details sometimes fail on formatting differences — we'll investigate. Come back to {hook}.",
      opts: [
        { text: "The details I entered look correct", route: 'pbm' },
        { text: "I'll double-check and retry", route: 'reminder' },
        { text: "I ran into a technical issue", route: 'ticket' },
      ],
    },
  },
  {
    id: 7,
    name: 'Live selfie',
    stage: 'B',
    prog: { type: 'steps', label: 'Step 2 of 5 — identity and documents', pct: 46 },
    clean: {
      hdr: 'Passport saved — just a selfie next',
      vp: 'Passport details saved. A selfie and two more documents to {hook}.',
      opts: [
        { text: "The lighting isn't good right now", route: 'reminder' },
        { text: "I'll do this somewhere quieter", route: 'reminder' },
        { text: "Something wasn't working", route: 'ticket' },
      ],
    },
    error: {
      hdr: "We couldn't verify your selfie",
      vp: "Selfie verification can be sensitive to lighting conditions — we'll look into it. Once sorted, {hook}.",
      opts: [
        { text: "I kept getting an error", route: 'ticket' },
        { text: "I'll try again in better light", route: 'reminder' },
        { text: "I need help with this", route: 'pbm' },
      ],
    },
  },
  {
    id: 8,
    name: 'UK visa type and share code',
    stage: 'B',
    prog: { type: 'steps', label: 'Step 3 of 5 — identity and documents', pct: 53 },
    clean: {
      hdr: 'Selfie done — just your visa details next',
      vp: 'Passport and selfie saved. Share code is the next step to {hook}.',
      opts: [
        { text: "I don't have my share code with me", route: 'reminder' },
        { text: "I don't know where to find my share code", route: 'pbm' },
        { text: "I'm not sure which visa type applies to me", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: "We couldn't verify your share code",
      vp: "Share code verification occasionally hits delays on the UKVI system — we'll check. Come back to {hook}.",
      opts: [
        { text: "The code I entered looks correct", route: 'pbm' },
        { text: "I'll double-check my code and retry", route: 'reminder' },
        { text: "I ran into a technical issue", route: 'ticket' },
      ],
    },
  },
  {
    id: 9,
    name: 'Proof of address',
    stage: 'B',
    prog: { type: 'steps', label: 'Step 4 of 5 — identity and documents', pct: 60 },
    clean: {
      hdr: 'Three documents done — one more to go',
      vp: 'Identity documents saved. One more upload to {hook}.',
      opts: [
        { text: "I don't have a utility bill or bank statement handy", route: 'reminder' },
        { text: "I'm not sure which documents are accepted", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: 'We had trouble reading your document',
      vp: "Document verification can fail on image quality — we'll investigate. One more upload and {hook}.",
      opts: [
        { text: "I'll try uploading a clearer version", route: 'reminder' },
        { text: "I'm not sure what went wrong", route: 'pbm' },
        { text: "I ran into a technical issue", route: 'ticket' },
      ],
    },
  },
  {
    id: 10,
    name: 'UK tax details and FATCA',
    stage: 'B',
    prog: { type: 'steps', label: 'Step 5 of 5 — identity and documents', pct: 67 },
    clean: {
      hdr: 'Last step before the final section',
      vp: 'All documents saved. Tax details are the last step before you can {hook}.',
      opts: [
        { text: "I'm not sure about my tax situation", route: 'pbm' },
        { text: "The FATCA questions confused me", route: 'pbm' },
        { text: "I don't have my tax ID with me", route: 'reminder' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: 'We had trouble with your tax details',
      vp: "Tax ID validation occasionally flags correct details — we'll look into it. Sorting this means you can {hook}.",
      opts: [
        { text: "The details I entered look correct", route: 'pbm' },
        { text: "I'll check my details and retry", route: 'reminder' },
      ],
    },
  },
  {
    id: 11,
    name: 'PAN number',
    stage: 'C',
    prog: { type: 'steps', label: '4 steps remaining', pct: 67 },
    clean: {
      hdr: 'Documents done — 4 steps left',
      vp: 'Documents and tax details verified. Complete these final steps to {hook}.',
      opts: [
        { text: "I don't have my PAN card with me", route: 'reminder' },
        { text: "I don't have a PAN", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: "We couldn't verify your PAN",
      vp: "PAN verification sometimes fails on name discrepancies between records — we'll investigate. Verify this and {hook}.",
      opts: [
        { text: "The details I entered look correct", route: 'pbm' },
        { text: "I'll double-check and retry", route: 'reminder' },
        { text: "I ran into a technical issue", route: 'ticket' },
      ],
    },
  },
  {
    id: 12,
    name: 'SIM binding',
    stage: 'C',
    prog: { type: 'steps', label: '3 steps remaining', pct: 75 },
    clean: {
      hdr: 'PAN verified — 3 steps left',
      vp: 'PAN verified. SIM, nominee, notarisation, and signing to {hook}.',
      opts: [
        { text: "I'm not sure how SIM binding works", route: 'pbm' },
        { text: "I'm not on the right SIM right now", route: 'reminder' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: "We couldn't verify your SIM",
      vp: "SIM binding can fail due to network or carrier delays — we'll check. Come back on your UK number to {hook}.",
      opts: [
        { text: "I was on the right SIM", route: 'pbm' },
        { text: "I'll try again on my UK number", route: 'reminder' },
        { text: "I ran into a technical issue", route: 'ticket' },
      ],
    },
  },
  {
    id: 13,
    name: 'Nominee details and address',
    stage: 'C',
    prog: { type: 'steps', label: '2 steps remaining', pct: 83 },
    clean: {
      hdr: 'SIM verified — 2 steps left after this',
      vp: 'PAN and SIM verified. Add nominee, then notarisation and signing to {hook}.',
      opts: [
        { text: "I don't have my nominee's details with me", route: 'reminder' },
        { text: "I haven't decided on a nominee yet", route: 'pbm' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: null,
  },
  {
    id: 14,
    name: 'Digital notarisation',
    stage: 'C',
    prog: { type: 'steps', label: '1 step remaining', pct: 92 },
    clean: {
      hdr: 'One step from the finish line',
      vp: 'Almost there. One notarisation session and a signature to {hook}.',
      opts: [
        { text: "I don't understand what notarisation means", route: 'pbm' },
        { text: "I need to schedule a better time for this", route: 'reminder' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: 'Something went wrong with your notarisation session',
      vp: "Notarisation sessions can drop due to connectivity issues — we'll investigate. Once resolved, {hook}.",
      opts: [
        { text: "The session kept dropping", route: 'ticket' },
        { text: "I'll try when I have a stable connection", route: 'reminder' },
        { text: "I need help understanding this step", route: 'pbm' },
      ],
    },
  },
  {
    id: 15,
    name: 'Document signing (ZohoSign)',
    stage: 'C',
    prog: { type: 'steps', label: 'Final step', pct: 100 },
    clean: {
      hdr: 'Notarisation done — just your signature left',
      vp: 'Notarisation complete. One signature to {hook}.',
      opts: [
        { text: "I want to read the documents before signing", route: 'reminder' },
        { text: "Something wasn't working", route: 'ticket' },
        { text: "I'll do this later", route: 'reminder' },
      ],
    },
    error: {
      hdr: 'Your signing session ran into an issue',
      vp: "Signing sessions occasionally fail to load — we'll look into it. One signature and {hook}.",
      opts: [
        { text: "The document wouldn't load", route: 'ticket' },
        { text: "I'll try again shortly", route: 'reminder' },
      ],
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function resolveVp(template: string, cohort: CohortKey): string {
  return template.replace('{hook}', COHORTS[cohort].hook);
}

export const ROUTE_LABELS: Record<Route, string> = {
  reminder: 'Reminder',
  pbm: 'PBM call',
  ticket: 'Tech ticket',
  default: 'Default',
};

export const ROUTE_TAG_STYLES: Record<Route, string> = {
  reminder: 'bg-surface-secondary text-on-surface-secondary',
  pbm:      'bg-[#EEF2FF] text-[#3C3489]',
  ticket:   'bg-error-light text-error-on-light',
  default:  'bg-surface-secondary text-on-surface-secondary',
};
