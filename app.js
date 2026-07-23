"use strict";

/* ===========================
 * CONFIG
 * =========================== */
// ==========================
// SUPABASE (PREENCHA)
// ==========================
// ⚠️ IMPORTANTE: coloque aqui a URL e a ANON KEY do seu projeto Supabase.
// Ex.: https://xxxx.supabase.co
const SUPABASE_URL = "https://ydypdeafbcdcamwigjuq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lg9teAniku65cd2dnZJvIQ_Zii0XneZ";

function getSupabaseClient() {
  const g = window.supabase;
  const createClient = g?.createClient || g?.default?.createClient;
  if (!createClient) {
    throw new Error(
      "Supabase não carregou. Verifique se o <script> do supabase-js está no index.html."
    );
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Falta configurar SUPABASE_URL e SUPABASE_ANON_KEY no app.js.");
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const BASE_TEST_URL = "https://integradaneuropsicologia.github.io";
const BASE_FORM_URL = "https://integradaneuropsicologia.github.io/sistema-de-cadastro-de-formularios-v.2.0/share";

const TEST_URLS = {
  BAI: "https://integradaneuropsicologia.github.io/BAI/",
  BAI_V2: "https://integradaneuropsicologia.github.io/BAI/",
  BDI_V2: "https://integradaneuropsicologia.github.io/formularios/BDI_V2/",
  BHS_V2: "https://integradaneuropsicologia.github.io/formularios/BHS_V2/",
  GAD7_V2: "https://integradaneuropsicologia.github.io/formularios/GAD7_V2/",
  GAI_V2: "https://integradaneuropsicologia.github.io/formularios/GAI_V2/",
  IDATE_V2: "https://integradaneuropsicologia.github.io/formularios/IDATE_V2/",
  TORRE_DE_LONDRES_V2: "https://integradaneuropsicologia.github.io/formularios/TORRE_DE_LONDRES_V2/",
  IDADI_V2: "https://integradaneuropsicologia.github.io/formularios/IDADI_V2/",
  SRS2_AUTORRELATO: "https://integradaneuropsicologia.github.io/srs2/",
  SRS2_HETERORRELATO: "https://integradaneuropsicologia.github.io/SRS2_HETERORRELATO/",
  SRS2_AUTORRELATO_V2: "https://integradaneuropsicologia.github.io/SRS2_AUTORRELATO_V2/",
  SRS2_HETERORRELATO_V2: "https://integradaneuropsicologia.github.io/SRS2_HETERORRELATO_V2/",
  SRS2_IDADE_ESCOLAR_PAIS_V2: "https://integradaneuropsicologia.github.io/SRS2_IDADE_ESCOLAR_PAIS_V2/",
  SRS2_IDADE_ESCOLAR_PROF_V2: "https://integradaneuropsicologia.github.io/SRS2_IDADE_ESCOLAR_PROF_V2/",
  SRBCSS_PAIS_V2: "https://integradaneuropsicologia.github.io/SRBCSS_PAIS_V2/",
  SRBCSS_PROFESSORES_V2: "https://integradaneuropsicologia.github.io/SRBCSS_PROFESSORES_V2/",
  SRSS_CRIANCA_V2: "https://integradaneuropsicologia.github.io/SSRS_CRIANCA_V2/",
  SRSS_PAIS_V2: "https://integradaneuropsicologia.github.io/SSRS_PAIS_V2/",
  SRSS_PROFESSORES_V2: "https://integradaneuropsicologia.github.io/SSRS_PROFESSORES_V2/",
  SSRS_CRIANCA_V2: "https://integradaneuropsicologia.github.io/SSRS_CRIANCA_V2/",
  SSRS_PAIS_V2: "https://integradaneuropsicologia.github.io/SSRS_PAIS_V2/",
  SSRS_PROFESSORES_V2: "https://integradaneuropsicologia.github.io/SSRS_PROFESSORES_V2/",
  REGISTRO_DIARIO_HUMOR_V2: "https://integradaneuropsicologia.github.io/REGISTRO_DIARIO_HUMOR_V2/"
};

const FORM_CACHE_VERSIONS = {
  SRS2_AUTORRELATO_V2: "706e75c",
  SRS2_HETERORRELATO_V2: "c18c33e",
  SRS2_IDADE_ESCOLAR_PAIS_V2: "e26f37c",
  SRS2_IDADE_ESCOLAR_PROF_V2: "0c29685",
  SRSS_CRIANCA_V2: "c58562d",
  SRSS_PAIS_V2: "980bc0e",
  SRSS_PROFESSORES_V2: "145c69b",
  SSRS_CRIANCA_V2: "c58562d",
  SSRS_PAIS_V2: "980bc0e",
  SSRS_PROFESSORES_V2: "145c69b",
  SRBCSS_PROFESSORES_V2: "adf42f9",
  BFP_V2: "8a78d73",
  EBADEP_A_V2: "431d701",
  BAI_V2: "3a467fb",
  BDI_V2: "474ff6f",
  BHS_V2: "9e882fb",
  GAD7_V2: "7b07421",
  GAI_V2: "850a8b4",
  IDATE_V2: "839367c",
  TORRE_DE_LONDRES_V2: "06fab5e",
  IDADI_V2: "a81eda5",
  PFISTER_V2: "0ade0bc",
  IFP2_V2: "bb423f3",
  REGISTRO_DIARIO_HUMOR_V2: "402d676"
};

const REPEATABLE_TEST_LIMITS = {
  REGISTRO_DIARIO_HUMOR_V2: 30
};

const SHARE_URLS = {
  // "SRS2": "..."
};

const APPEND_CPF_PARAM = false;
const APPEND_TOKEN_PARAM = true;
const ALLOW_LEGACY_CPF_LINKS = false;
const PATIENT_LINK_RPC = "get_patient_by_link_token";
const VETOR_LINKS_RPC = "get_public_patient_vetor_links_by_token";
const DEFAULT_TARGETS = ["pais", "professores", "segunda_fonte", "heterorrelato"];
const TEST_PREFIX = "";
const DONE_SUFFIX = "_FEITO";
const IDADE_MINIMA_RESPONDER_COMO_PACIENTE = 12; // 12 anos ou mais: formulário de Profissional aparece como Paciente; abaixo de 12 permanece como Profissional

/* Respondentes disponíveis */
const RESPONDENTS = [
  { cls: "paciente",     label: "Paciente",          desc: "Paciente quem deve responder." },
  { cls: "pais",         label: "Pais/Cuidadores",   desc: "Pais/responsáveis é quem devem responder." },
  { cls: "professores",  label: "Professores",       desc: "Professores/pedagogos quem devem responder." },
  { cls: "familiares",   label: "Familiares/Amigos", desc: "Familiares/amigos que o paciente escolher." },
  { cls: "profissional", label: "Profissional",      desc: "Preenchimento reservado ao profissional que está avaliando." }
];

/* ===========================
 * HELPERS
 * =========================== */

const $ = (s) => document.querySelector(s);
const el = (tag, opts = {}) => Object.assign(document.createElement(tag), opts);
const onlyDigits = (s) => (s || "").replace(/\D+/g, "");
const qs = (k) => new URLSearchParams(location.search).get(k) || "";

function setMsg(text = "", type = "ok") {
  const b = $("#msg");
  if (!b) return;
  if (!text) {
    b.className = "msg hidden";
    b.textContent = "";
    return;
  }
  const cls =
    type === "ok"
      ? "msg okbox"
      : type === "warn"
      ? "msg warnbox"
      : "msg errbox";
  b.className = cls;
  b.textContent = text;
}

function maskCPF(cpf) {
  const d = onlyDigits(cpf || "");
  if (d.length !== 11) return cpf || "";
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function fmtDateISO(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

/** Converte valores de idade em número, quando houver coluna de idade pronta. */
function parseAgeYears(raw) {
  const s = String(raw ?? "").trim().replace(",", ".");
  if (!s) return null;
  const match = s.match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const age = Number(match[0]);
  return Number.isFinite(age) ? age : null;
}

/** Aceita data ISO, data brasileira e datas com horário vindas do banco. */
function parseBirthDateValue(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;

  // ISO/Supabase: 2015-05-10 ou 2015-05-10T00:00:00
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  // Brasileiro: 10/05/2015, 10-05-2015 ou 10.05.2015
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (m) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    let year = Number(m[3]);
    if (year < 100) year += year > 30 ? 1900 : 2000;
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  const fallback = new Date(s);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function calcAgeYears(rawBirthDate) {
  const birthDate = parseBirthDateValue(rawBirthDate);
  if (!birthDate) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return Number.isFinite(age) ? age : null;
}

function getPatientAgeYears() {
  // Se houver coluna de idade no retorno do paciente, usa primeiro.
  const directAge = parseAgeYears(patient?.idade ?? patient?.age ?? patient?.anos ?? "");
  if (directAge !== null) return directAge;

  // Depois calcula pela data de nascimento.
  return calcAgeYears(
    patient?.data_nascimento ||
      patient?.dataNascimento ||
      patient?.nascimento ||
      patient?.dt_nascimento ||
      patient?.data_nasc ||
      patient?.dn ||
      patient?.dob ||
      ""
  );
}

function boolLike(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "sim" || s === "s" || s === "true" || s === "1" || s === "yes";
}

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

// Aceita JSONB como: ["BAI"], {"BAI": true}, [{code:"BAI"}], etc.
function jsonbToCodeSet(jsonb) {
  const out = new Set();
  if (!jsonb) return out;

  const push = (c) => {
    const cc = normalizeCode(c);
    if (cc) out.add(cc);
  };

  if (Array.isArray(jsonb)) {
    for (const it of jsonb) {
      if (typeof it === "string") push(it);
      else if (it && typeof it === "object") {
        push(it.code || it.test || it.teste || it.form || it.formulario);
      }
    }
    return out;
  }

  if (typeof jsonb === "object") {
    for (const [k, v] of Object.entries(jsonb)) {
      // {"BAI": true} ou {"BAI": {..}}
      if (boolLike(v) || (v && typeof v === "object")) push(k);
    }
    return out;
  }

  // fallback: string "BAI,SRS2"...
  const s = String(jsonb);
  s.split(/[;,\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach(push);
  return out;
}

function inAgeRange(t) {
  const age = getPatientAgeYears();
  if (age === null) return true; // sem idade válida -> não trava a lista
  const min = t.age_min === null || t.age_min === undefined || t.age_min === "" ? null : Number(t.age_min);
  const max = t.age_max === null || t.age_max === undefined || t.age_max === "" ? null : Number(t.age_max);
  if (Number.isFinite(min) && age < min) return false;
  if (Number.isFinite(max) && age > max) return false;
  return true;
}

function buildUrl(base, params) {
  try {
    const u = new URL(base, location.href);
    Object.entries(params || {}).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
  } catch {
    const q = Object.entries(params || {})
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    return base + (base.includes("?") ? "&" : "?") + q;
  }
}

/* ===========================
 * TEMA (CLARO/ESCURO)
 * =========================== */

(function initTheme() {
  const body = document.body;
  const btn = $("#themeToggle");

  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("integrada-area-paciente-theme", theme);
    } catch (e) {}
    if (btn) {
      btn.textContent = theme === "dark" ? "Tema escuro" : "Tema claro";
    }
  }

  let saved = null;
  try {
    saved = localStorage.getItem("integrada-area-paciente-theme");
  } catch (e) {}

  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    applyTheme("light"); // padrão inicial pedido
  }

  if (btn) {
    btn.addEventListener("click", () => {
      const current = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(current);
    });
  }
})();

/* ===========================
 * ESTADO
 * =========================== */

let CPF = "";
let ACCESS_TOKEN = "";
let patient = null;
let testsCatalog = []; // {code,label,order,shareable,targets,form_url,share_url,source,age_min,age_max}
let currentSource = null;
let currentSourceLabel = "—";

// Supabase client + JSONB (tests_liberados / tests_feitos)
let sb = null;
let testsLiberadosSet = new Set();
let testsFeitosSet = new Set();
let repeatCountsByCode = new Map();

function metaValue(meta, key) {
  if (Array.isArray(meta)) {
    return meta.find((item) => item && item.key === key)?.value;
  }
  if (meta && typeof meta === "object") return meta[key];
  return undefined;
}

function repeatCountFromResultsMeta(meta) {
  const storedTotal = Number(metaValue(meta, "registros_total"));
  if (Number.isFinite(storedTotal) && storedTotal > 0) return storedTotal;

  const registros = metaValue(meta, "registros");
  if (Array.isArray(registros)) return registros.length;

  const registroNumero = Number(metaValue(meta, "registro_numero"));
  if (Number.isFinite(registroNumero) && registroNumero > 0) return registroNumero;

  return 1;
}

function isRepeatResponseCode(responseCode, baseCode) {
  const cleanResponse = normalizeCode(responseCode);
  const cleanBase = normalizeCode(baseCode);
  return cleanResponse === cleanBase || cleanResponse.startsWith(`${cleanBase}__`);
}

/* ===========================
 * CATÁLOGO LOCAL (fallback)
 * - Se você não tiver uma tabela de "tests" no Supabase, a UI
 *   precisa de um catálogo mínimo aqui para conseguir renderizar.
 * - Se o JSONB (tests_liberados) vier com objetos (label/source/etc),
 *   ele sobrescreve esse fallback.
 * =========================== */

const FALLBACK_TEST_META = {
  BAI: {
    label: "Ansiedade (BAI)",
    source: "paciente",
    shareable: false,
    order: 10,
    form_url: TEST_URLS.BAI
  },
  BAI_V2: {
    label: "Ansiedade (BAI)",
    source: "paciente",
    shareable: false,
    order: 10,
    form_url: TEST_URLS.BAI_V2
  },
  BDI_V2: {
    label: "Depressão (BDI)",
    source: "paciente",
    shareable: false,
    order: 11,
    form_url: TEST_URLS.BDI_V2
  },
  BHS_V2: {
    label: "Desesperança (BHS)",
    source: "paciente",
    shareable: false,
    order: 12,
    form_url: TEST_URLS.BHS_V2
  },
  GAD7_V2: {
    label: "Ansiedade generalizada (GAD-7)",
    source: "paciente",
    shareable: false,
    order: 15,
    form_url: TEST_URLS.GAD7_V2
  },
  GAI_V2: {
    label: "Ansiedade geriátrica (GAI)",
    source: "paciente",
    shareable: false,
    order: 16,
    form_url: TEST_URLS.GAI_V2
  },
  IDATE_V2: {
    label: "Ansiedade-traço (IDATE)",
    source: "paciente",
    shareable: false,
    order: 17,
    form_url: TEST_URLS.IDATE_V2
  },
  TORRE_DE_LONDRES_V2: {
    label: "Torre de Londres",
    source: "paciente",
    shareable: false,
    order: 13,
    form_url: TEST_URLS.TORRE_DE_LONDRES_V2
  },
  IDADI_V2: {
    label: "IDADI - Desenvolvimento infantil",
    source: "Pais/Cuidadores",
    shareable: false,
    order: 14,
    form_url: TEST_URLS.IDADI_V2
  },
  SRS2_AUTORRELATO: {
    label: "SRS-2 (Autorrelato)",
    source: "paciente",
    shareable: false,
    order: 20,
    form_url: TEST_URLS.SRS2_AUTORRELATO
  },
  SRS2_HETERORRELATO: {
    label: "SRS-2 (Heterorrelato)",
    source: "pais",
    shareable: true,
    order: 30,
    form_url: TEST_URLS.SRS2_HETERORRELATO
    // share_url: "..." // opcional
  },
  SRS2_AUTORRELATO_V2: {
    label: "SRS-2 - Autorrelato",
    source: "paciente",
    shareable: false,
    order: 300,
    form_url: TEST_URLS.SRS2_AUTORRELATO_V2
  },
  SRS2_HETERORRELATO_V2: {
    label: "SRS-2 - Heterorrelato",
    source: "familiares/amigos",
    shareable: false,
    order: 301,
    form_url: TEST_URLS.SRS2_HETERORRELATO_V2
  },
  SRS2_IDADE_ESCOLAR_PAIS_V2: {
    label: "SRS-2 - Idade Escolar - Pais",
    source: "pais/cuidadores",
    shareable: false,
    order: 302,
    form_url: TEST_URLS.SRS2_IDADE_ESCOLAR_PAIS_V2
  },
  SRS2_IDADE_ESCOLAR_PROF_V2: {
    label: "SRS-2 - Idade Escolar - Professores",
    source: "professores",
    shareable: false,
    order: 303,
    form_url: TEST_URLS.SRS2_IDADE_ESCOLAR_PROF_V2
  },
  SRBCSS_PAIS_V2: {
    label: "SRBCSS - Pais/Cuidadores",
    source: "pais/cuidadores",
    shareable: false,
    order: 310,
    form_url: TEST_URLS.SRBCSS_PAIS_V2
  },
  SRBCSS_PROFESSORES_V2: {
    label: "SRBCSS - Professores",
    source: "professores",
    shareable: false,
    order: 311,
    form_url: TEST_URLS.SRBCSS_PROFESSORES_V2
  },
  SRSS_CRIANCA_V2: {
    label: "SRSS - Criança",
    source: "paciente",
    shareable: false,
    order: 320,
    form_url: TEST_URLS.SRSS_CRIANCA_V2
  },
  SRSS_PAIS_V2: {
    label: "SRSS - Pais/Cuidadores",
    source: "pais/cuidadores",
    shareable: false,
    order: 321,
    form_url: TEST_URLS.SRSS_PAIS_V2
  },
  SRSS_PROFESSORES_V2: {
    label: "SRSS - Professores",
    source: "professores",
    shareable: false,
    order: 322,
    form_url: TEST_URLS.SRSS_PROFESSORES_V2
  },
  SSRS_CRIANCA_V2: {
    label: "SSRS - Criança",
    source: "profissional",
    shareable: false,
    order: 323,
    form_url: TEST_URLS.SSRS_CRIANCA_V2
  },
  SSRS_PAIS_V2: {
    label: "SSRS - Pais/Cuidadores",
    source: "pais/cuidadores",
    shareable: false,
    order: 324,
    form_url: TEST_URLS.SSRS_PAIS_V2
  },
  SSRS_PROFESSORES_V2: {
    label: "SSRS - Professores",
    source: "professores",
    shareable: false,
    order: 325,
    form_url: TEST_URLS.SSRS_PROFESSORES_V2
  },
  REGISTRO_DIARIO_HUMOR_V2: {
    label: "Registro diário de humor e comportamento",
    source: "paciente",
    shareable: false,
    repeatable: true,
    repeat_limit: 30,
    order: 40,
    form_url: TEST_URLS.REGISTRO_DIARIO_HUMOR_V2
  }
};

function defaultMetaFor(code) {
  const c = normalizeCode(code);
  const meta = FALLBACK_TEST_META[c] || {};
  return {
    code: c,
    label: meta.label || c,
    order: Number.isFinite(Number(meta.order)) ? Number(meta.order) : 9999,
    shareable: boolLike(meta.shareable),
    targets: boolLike(meta.shareable) ? (meta.targets || DEFAULT_TARGETS) : [],
    form_url: String(meta.form_url || "").trim(),
    share_url: String(meta.share_url || "").trim(),
    source: String(meta.source || "paciente").trim(),
    age_min: meta.age_min ?? null,
    age_max: meta.age_max ?? null,
    repeatable: boolLike(meta.repeatable),
    repeat_limit: Number.isFinite(Number(meta.repeat_limit)) ? Number(meta.repeat_limit) : null
  };
}

function normalizeTargets(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  return String(v)
    .split(/[;,]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Converte tests_liberados (jsonb/jsonb[]) em um catálogo renderizável.
 * Suporta:
 *  - ["BAI", "SRS2_AUTORRELATO"]
 *  - [{code:"BAI", label:"...", source:"pais", shareable:true, targets:[...], form_url:"..."}]
 *  - {"BAI": true, "SRS2_AUTORRELATO": {label:"..."}}
 */
function jsonbToCatalog(jsonb) {
  const out = [];
  const seen = new Set();

  const push = (obj) => {
    if (!obj) return;
    const code = normalizeCode(obj.code || obj.test || obj.teste || obj.form || obj.formulario);
    if (!code || seen.has(code)) return;
    seen.add(code);

    const base = defaultMetaFor(code);
    const shareable = obj.shareable !== undefined ? boolLike(obj.shareable) : base.shareable;
    const targets = shareable
      ? normalizeTargets(obj.targets).length
        ? normalizeTargets(obj.targets)
        : base.targets
      : [];

    out.push({
      ...base,
      code,
      label: String(obj.label || obj.nome || obj.name || base.label).trim() || code,
      order: Number.isFinite(Number(obj.order)) ? Number(obj.order) : base.order,
      shareable,
      targets,
      form_url: String(obj.form_url || obj.url || base.form_url || "").trim(),
      share_url: String(obj.share_url || base.share_url || "").trim(),
      source: String(obj.source || obj.origem || base.source || "paciente").trim(),
      age_min: obj.age_min ?? base.age_min,
      age_max: obj.age_max ?? base.age_max,
      repeatable: obj.repeatable !== undefined ? boolLike(obj.repeatable) : base.repeatable,
      repeat_limit: Number.isFinite(Number(obj.repeat_limit)) ? Number(obj.repeat_limit) : base.repeat_limit
    });
  };

  if (!jsonb) return out;

  if (Array.isArray(jsonb)) {
    for (const it of jsonb) {
      if (typeof it === "string") push({ code: it });
      else if (it && typeof it === "object") push(it);
    }
    return out;
  }

  if (typeof jsonb === "object") {
    for (const [k, v] of Object.entries(jsonb)) {
      if (!boolLike(v) && !(v && typeof v === "object")) continue;
      if (v && typeof v === "object") push({ code: k, ...v });
      else push({ code: k });
    }
    return out;
  }

  // fallback: string "BAI,SRS2"...
  String(jsonb)
    .split(/[;,\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((c) => push({ code: c }));
  return out;
}

/* ===========================
 * NORMALIZAÇÃO DE SOURCE
 * =========================== */

function normalizeSource(raw) {
  const s = (raw || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  // Paciente
  if (/\b(pac(iente)?|autorrelato)\b/.test(s)) return { cls: "paciente", label: "Paciente" };

  // Pais / Cuidadores
  if (/\b(pais|pai|mae|cuidador(a)?|responsavel)\b/.test(s)) return { cls: "pais", label: "Pais/Cuidadores" };

  // Profissional (checar antes de professores)
  if (/\b(profiss(ional)?|avaliador(a)?|psico(logo|loga)?|neuropsico(logo|loga)?|terapeuta)\b/.test(s))
    return { cls: "profissional", label: "Profissional" };

  // Professores / Escola
  if (/\b(professor(es)?|docente(s)?|escola)\b/.test(s)) return { cls: "professores", label: "Professores" };

  // Familiares / Amigos
  if (/\b(familia(res)?|amig(o|a|os|as))\b/.test(s)) return { cls: "familiares", label: "Familiares/Amigos" };

  // Fallback
  return { cls: "profissional", label: raw || "Profissional" };
}

/**
 * REGRA DE ROTEAMENTO POR IDADE:
 * - Formulário cadastrado como "Profissional" + paciente menor de 12 anos:
 *   continua aparecendo como "Profissional", para o profissional conduzir com a criança.
 * - Formulário cadastrado como "Profissional" + paciente com 12 anos ou mais:
 *   aparece como "Paciente", pois o adolescente já pode responder por conta própria.
 * - Se a idade não puder ser identificada, mantém como "Profissional" por segurança.
 * - As demais fontes (Pais/Cuidadores, Professores, Familiares/Amigos e Paciente) não mudam.
 */
function effectiveSource(raw) {
  const norm = normalizeSource(raw);
  const age = getPatientAgeYears();

  if (
    norm.cls === "profissional" &&
    age !== null &&
    age >= IDADE_MINIMA_RESPONDER_COMO_PACIENTE
  ) {
    return { cls: "paciente", label: "Paciente" };
  }

  return norm;
}

function isVisibleInPatientArea(t) {
  return Boolean(t);
}

/* ===========================
 * URLS TESTES
 * =========================== */

function colFor(t) {
  return TEST_PREFIX ? TEST_PREFIX + t.code : t.code;
}

function doneColFor(t) {
  return colFor(t) + DONE_SUFFIX;
}

function isRepeatable(t) {
  const code = normalizeCode(t?.code);
  return Boolean(t?.repeatable) || Object.prototype.hasOwnProperty.call(REPEATABLE_TEST_LIMITS, code);
}

function repeatLimit(t) {
  const code = normalizeCode(t?.code);
  const fromMeta = Number(t?.repeat_limit);
  if (Number.isFinite(fromMeta) && fromMeta > 0) return fromMeta;
  return REPEATABLE_TEST_LIMITS[code] || null;
}

function getTestFeitoEntry(jsonb, code) {
  const cleanCode = normalizeCode(code);
  if (!jsonb || !cleanCode) return null;
  if (typeof jsonb === "string") return normalizeCode(jsonb) === cleanCode ? true : null;
  if (Array.isArray(jsonb)) {
    return jsonb.find((item) => {
      if (typeof item === "string") return normalizeCode(item) === cleanCode;
      if (item && typeof item === "object") {
        return [item.code, item.test_code, item.id, item.form, item.formulario]
          .map(normalizeCode)
          .includes(cleanCode);
      }
      return false;
    }) || null;
  }
  if (typeof jsonb === "object") {
    if (Object.prototype.hasOwnProperty.call(jsonb, cleanCode)) return jsonb[cleanCode];
    return Object.entries(jsonb).find(([key]) => normalizeCode(key) === cleanCode)?.[1] || null;
  }
  return null;
}

function repeatProgress(t) {
  const code = normalizeCode(t?.code);
  const limit = repeatLimit(t);
  const entry = getTestFeitoEntry(patient?.tests_feitos, code);
  const responseCount = repeatCountsByCode.get(code) || 0;
  if (entry === true) return { count: limit || responseCount || 1, limit, complete: true };
  if (entry && typeof entry === "object") {
    const count = Number(entry.count ?? entry.registros ?? entry.total ?? 0);
    const cleanCount = Math.max(Number.isFinite(count) ? Math.max(0, count) : 0, responseCount);
    const complete = Boolean(entry.feito) || (limit !== null && cleanCount >= limit);
    return { count: limit ? Math.min(cleanCount, limit) : cleanCount, limit, complete };
  }
  return {
    count: limit ? Math.min(responseCount, limit) : responseCount,
    limit,
    complete: limit !== null && responseCount >= limit
  };
}

function isAllowed(t) {
  if (!patient) return false;
  const code = normalizeCode(t.code);

  // NOVO: tests_liberados (jsonb)
  if (patient.tests_liberados !== null && patient.tests_liberados !== undefined) {
    return testsLiberadosSet.has(code) && inAgeRange(t);
  }

  // LEGADO (se ainda existir na tabela)
  return String(patient[colFor(t)] || "").toLowerCase() === "sim" && inAgeRange(t);
}

function statusOf(t) {
  if (!isAllowed(t)) return "oculto";

  const code = normalizeCode(t.code);
  if (isRepeatable(t)) {
    return repeatProgress(t).complete ? "preenchido" : "ja";
  }

  // NOVO: tests_feitos (jsonb)
  if (patient.tests_feitos !== null && patient.tests_feitos !== undefined) {
    return testsFeitosSet.has(code) ? "preenchido" : "ja";
  }

  // LEGADO
  const done = String(patient[doneColFor(t)] || "").toLowerCase() === "sim";
  return done ? "preenchido" : "ja";
}

/* URL principal (preencher) */
function normalizeTestUrl(rawUrl, code) {
  const root = BASE_TEST_URL.replace(/\/+$/, "");
  const cleanCode = String(code || "").trim();

  let url = String(rawUrl || "").trim();

  // Se não veio URL, monta no formato de pasta: /CODIGO/
  if (!url) {
    url = `${root}/${encodeURIComponent(cleanCode)}/`;
  } else {
    // Se vier caminho relativo (ex.: /EBADEP_A_V2.html), transforma em absoluto
    if (!/^https?:\/\//i.test(url)) {
      url = `${root}/${url.replace(/^\/+/, "")}`;
    }

    // Remove barras duplicadas (sem quebrar https://)
    url = url.replace(/([^:]\/)\/+/g, "$1");

    // Converte /EBADEP_A_V2.html para /EBADEP_A_V2/
    url = url.replace(/\/([^/?#]+)\.html(?=($|\?|\#))/, "/$1/");
  }

  return url;
}

function isVetorCode(code) {
  return normalizeCode(code).startsWith("VETOR_");
}

function resolveFillUrl(t) {
  const rawBase = t.form_url || TEST_URLS[t.code] || ""; // se tiver salvo no JSONB, usa
  const base = normalizeTestUrl(rawBase, t.code);

  const token = String(ACCESS_TOKEN || "").trim();
  const formCode = String(t.code || "").trim();

  if (isVetorCode(formCode) && rawBase) {
    return base;
  }

  const params = {};

  if (APPEND_TOKEN_PARAM && token) params.token = token;
  if (formCode) params.form = formCode;
  if (FORM_CACHE_VERSIONS[formCode]) params.v = FORM_CACHE_VERSIONS[formCode];

  return Object.keys(params).length ? buildUrl(base, params) : base;
}

/* URL de segunda fonte (se usar) */
function resolveShareUrl(t, target) {
  const base =
    t.share_url ||
    SHARE_URLS[t.code] ||
    `${BASE_FORM_URL}/${encodeURIComponent(String(t.code || "").toLowerCase())}.html`;

  return buildUrl(base, {
    token: String(ACCESS_TOKEN || "").trim(),
    form: String(t.code || "").trim(),
    source: target
  });
}

/* ===========================
 * BOOT VIA TOKEN
 * =========================== */

(async function boot() {
  try {
    sb = getSupabaseClient();

    ACCESS_TOKEN = getTokenFromUrl();
    CPF = getCpfFromUrl();

    const tokenIsLegacyCpf =
      ALLOW_LEGACY_CPF_LINKS && onlyDigits(ACCESS_TOKEN).length === 11;

    if (ACCESS_TOKEN && !tokenIsLegacyCpf) {
      patient = await fetchPatientByToken(ACCESS_TOKEN);
    } else if (ALLOW_LEGACY_CPF_LINKS && CPF) {
      // Compatibilidade temporaria para links antigos em formato ?12345678901, ?cpf=... ou ?token=CPF.
      patient = await fetchPatientByCpf(CPF);
    } else {
      setMsg("Link inválido ou expirado. Solicite um novo link ao consultório.", "err");
      return;
    }

    if (!patient) throw new Error("Paciente não encontrado.");

    CPF = onlyDigits(patient.cpf || CPF);

    // JSONB: liberados/feitos
    testsLiberadosSet = jsonbToCodeSet(patient.tests_liberados);
    testsFeitosSet = jsonbToCodeSet(patient.tests_feitos);

    // Catálogo de testes
    await loadTests();

    // Render inicial
    $("#pacNomeSpan").textContent = patient.nome || "Paciente";
    renderPatientInfo();
    renderRespondentCards();
    toggleSections(false);

    $("#viewApp").classList.remove("hidden");
    $("#btnSair").classList.remove("hidden");
    setMsg("");
  } catch (e) {
    console.error(e);
    setMsg(e.message || "Falha ao abrir sua área. Tente novamente mais tarde.", "err");
  }
})();

async function fetchPatientByToken(token) {
  const cleanToken = String(token || "").trim();
  if (!cleanToken) return null;

  const { data, error } = await sb.rpc(PATIENT_LINK_RPC, {
    p_token: cleanToken
  });

  if (error) {
    console.error("Erro ao validar link do paciente:", error);
    throw new Error("Link inválido ou expirado. Solicite um novo link ao consultório.");
  }

  if (Array.isArray(data)) return data[0] || null;
  return data || null;
}

async function fetchPatientByCpf(cpfDigits) {
  const cpf1 = onlyDigits(cpfDigits || "");
  const cpf2 = maskCPF(cpf1);

  // tenta cpf só dígitos
  {
    const { data, error } = await sb.from("patients").select("*").eq("cpf", cpf1).limit(1);
    if (!error && data && data.length) return data[0];
  }

  // tenta cpf mascarado
  {
    const { data, error } = await sb.from("patients").select("*").eq("cpf", cpf2).limit(1);
    if (!error && data && data.length) return data[0];
  }

  return null;
}

function getTokenFromUrl() {
  return String(qs("token") || qs("t") || "").trim();
}

function getCpfFromUrl() {
  if (!ALLOW_LEGACY_CPF_LINKS) return "";

  // 1) formato novo: ?12345678901
  const raw = String(location.search || "").replace(/^\?/, "");
  if (raw && !raw.includes("=")) {
    const first = raw.split("&")[0];
    const d = onlyDigits(first);
    if (d.length === 11) return d;
  }

  // 2) compat: ?cpf=... ou ?token=CPF (se ALLOW_LEGACY_CPF_LINKS estiver ativo)
  const byCpf = qs("cpf");
  if (byCpf) return onlyDigits(byCpf);

  const legacyTokenCpf = onlyDigits(qs("token") || qs("t"));
  if (legacyTokenCpf.length === 11) return legacyTokenCpf;

  return "";
}

/* ===========================
 * LOGOUT
 * =========================== */

$("#btnSair")?.addEventListener("click", () => {
  history.replaceState({}, "", location.pathname);
  location.reload();
});

/* ===========================
 * INFO PACIENTE
 * =========================== */

function renderPatientInfo() {
  const g = $("#pacInfo");
  if (!g || !patient) return;
  g.innerHTML = "";

  const info = [
    ["Nome", patient.nome || "-"],
    ["Nascimento", fmtDateISO(patient.data_nascimento || "")]
  ];

  for (const [k, v] of info) {
    const it = el("div", { className: "info" });
    it.innerHTML = `<b>${k}</b><div>${v || "-"}</div>`;
    g.appendChild(it);
  }
}

/* ===========================
 * LOAD TESTS
 * =========================== */

async function fetchTestsMetaByCodes(codes) {
  const cleanCodes = Array.from(new Set((codes || []).map(normalizeCode).filter(Boolean)));
  if (!sb || !cleanCodes.length) return [];

  const { data, error } = await sb
    .from("tests")
    .select("*");

  if (error) {
    console.error("Erro ao buscar tabela tests:", error);
    return [];
  }

  return (Array.isArray(data) ? data : []).filter((row) =>
    cleanCodes.includes(normalizeCode(row.code))
  );
}

async function fetchVetorLinksByToken(token) {
  const cleanToken = String(token || "").trim();
  if (!sb || !cleanToken) return [];

  const { data, error } = await sb.rpc(VETOR_LINKS_RPC, {
    p_token: cleanToken
  });

  if (error) {
    console.error("Erro ao buscar links Vetor:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

async function fetchRepeatableCounts(codes) {
  const cleanCodes = Array.from(new Set((codes || []).map(normalizeCode).filter(Boolean)));
  const cpf = onlyDigits(patient?.cpf || "");
  const evaluationId = String(patient?.evaluation_id || "").trim();
  const out = new Map();
  cleanCodes.forEach((code) => out.set(code, 0));
  if (!sb || !cpf || !cleanCodes.length) return out;

  let query = sb
    .from("respostas")
    .select("code, results_meta")
    .eq("cpf", cpf);

  if (evaluationId) {
    query = query.eq("evaluation_id", evaluationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao contar registros repetíveis:", error);
    return out;
  }

  (Array.isArray(data) ? data : []).forEach((row) => {
    cleanCodes.forEach((code) => {
      if (!isRepeatResponseCode(row.code, code)) return;
      const value = normalizeCode(row.code) === code ? repeatCountFromResultsMeta(row.results_meta) : 1;
      out.set(code, (out.get(code) || 0) + value);
    });
  });
  return out;
}

async function loadTests(skipFetch) {
  const hasJsonLiberados = patient && patient.tests_liberados !== null && patient.tests_liberados !== undefined;

  if (hasJsonLiberados) {
    const liberadosCatalog = jsonbToCatalog(patient.tests_liberados);
    const liberadosCodes = liberadosCatalog.map((t) => t.code);
    const [testsMeta, vetorLinks] = await Promise.all([
      fetchTestsMetaByCodes(liberadosCodes),
      fetchVetorLinksByToken(ACCESS_TOKEN)
    ]);

    const metaByCode = new Map(
      testsMeta.map((row) => [normalizeCode(row.code), row])
    );
    const vetorByCode = new Map(
      vetorLinks.map((row) => [normalizeCode(row.form_code), row])
    );

    testsCatalog = liberadosCatalog.map((t) => {
      const dbRow = metaByCode.get(normalizeCode(t.code));
      const vetorRow = vetorByCode.get(normalizeCode(t.code));

      if (!dbRow && !vetorRow) return t;

      return {
        ...t,
        code: String(dbRow?.code || vetorRow?.form_code || t.code).trim() || t.code,
        label:
          String(dbRow?.label || vetorRow?.label || t.label || t.code).trim() ||
          t.code,
        order:
          Number.isFinite(Number(dbRow?.order))
            ? Number(dbRow.order)
            : t.order,
        source: String(dbRow?.source || t.source || "paciente").trim(),
        shareable:
          dbRow?.shareable !== undefined
            ? boolLike(dbRow.shareable)
            : t.shareable,
        targets:
          normalizeTargets(dbRow?.targets).length
            ? normalizeTargets(dbRow.targets)
            : t.targets,
        form_url: String(
          vetorRow?.form_url || dbRow?.form_url || dbRow?.url || t.form_url || ""
        ).trim(),
        share_url: String(dbRow?.share_url || t.share_url || "").trim(),
        age_min: dbRow?.age_min ?? t.age_min,
        age_max: dbRow?.age_max ?? t.age_max,
        repeatable:
          dbRow?.repeatable !== undefined
            ? boolLike(dbRow.repeatable)
            : t.repeatable,
        repeat_limit:
          Number.isFinite(Number(dbRow?.repeat_limit))
            ? Number(dbRow.repeat_limit)
            : t.repeat_limit
      };
    });
  } else {
    // LEGADO: tenta encontrar testes marcados como "sim" em colunas antigas.
    const knownCodes = Array.from(new Set([...Object.keys(FALLBACK_TEST_META), ...Object.keys(TEST_URLS)]));
    testsCatalog = knownCodes
      .map((c) => defaultMetaFor(c))
      .filter((t) => String(patient[colFor(t)] || "").toLowerCase() === "sim");
  }

  // Ordena sempre
  testsCatalog = (testsCatalog || []).sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  const repeatCodes = testsCatalog.filter((t) => isRepeatable(t)).map((t) => t.code);
  repeatCountsByCode = await fetchRepeatableCounts(repeatCodes);

  const allowed = testsCatalog.filter((t) => isAllowed(t) && isVisibleInPatientArea(t));
  const cJa = allowed.filter((t) => statusOf(t) === "ja").length;
  const cOk = allowed.filter((t) => statusOf(t) === "preenchido").length;

  const resume = $("#resume");
  if (resume) {
    resume.textContent = `Liberados: ${allowed.length} • Em aberto: ${cJa} • Preenchidos: ${cOk}`;
  }
}

/* ===========================
 * ATUALIZAR
 * =========================== */

$("#btnAtualizar")?.addEventListener("click", async () => {
  if (!patient) return;

  try {
    const refreshed = ACCESS_TOKEN
      ? await fetchPatientByToken(ACCESS_TOKEN)
      : await fetchPatientByCpf(patient.cpf);
    if (refreshed) patient = refreshed;

    testsLiberadosSet = jsonbToCodeSet(patient.tests_liberados);
    testsFeitosSet = jsonbToCodeSet(patient.tests_feitos);

    await loadTests(true);
    renderRespondentCards();
    renderTests();

    setMsg("Atualizado.", "ok");
    setTimeout(() => setMsg(""), 900);
  } catch (e) {
    console.error(e);
    setMsg("Falha ao atualizar.", "err");
  }
});

/* ===========================
 * SEÇÕES RESPONDENTES / TESTES
 * =========================== */

function toggleSections(showTests) {
  const secResp = $("#respondentsSection");
  const secTests = $("#testsSection");
  if (!secResp || !secTests) return;

  if (showTests) {
    secResp.classList.add("hidden");
    secTests.classList.remove("hidden");
  } else {
    secResp.classList.remove("hidden");
    secTests.classList.add("hidden");
  }
}

function openForSource(cls, label) {
  currentSource = cls;
  currentSourceLabel = label;
  $("#selResp").textContent = label;
  toggleSections(true);
  renderTests();
}

function backToRespondents() {
  currentSource = null;
  currentSourceLabel = "—";
  toggleSections(false);
}

$("#btnTrocarResp")?.addEventListener("click", backToRespondents);

/* ===========================
 * CARDS DE RESPONDENTES
 * =========================== */

function renderRespondentCards() {
  const grid = $("#sourcesGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const allowed = testsCatalog.filter((t) => isAllowed(t) && isVisibleInPatientArea(t));

  if (!allowed.length) {
    grid.innerHTML =
      "<p class='muted'>Nenhum formulário liberado para este CPF ainda. Se você esperava ver testes aqui, confira se o campo <b>tests_liberados</b> (na tabela <b>patients</b>) está preenchido com os códigos dos testes (ex.: <code>[\"BAI\", \"SRS2_AUTORRELATO\"]</code>).</p>";
    const resume = $("#resume");
    if (resume) resume.textContent = "Liberados: 0 • Em aberto: 0 • Preenchidos: 0";
    return;
  }

  const counts = {
    paciente: { total: 0, done: 0 },
    pais: { total: 0, done: 0 },
    professores: { total: 0, done: 0 },
    familiares: { total: 0, done: 0 },
    profissional: { total: 0, done: 0 }
  };

  for (const t of allowed) {
    const normCls = effectiveSource(t.source).cls;
    if (!counts[normCls]) continue;
    counts[normCls].total += 1;
    if (statusOf(t) === "preenchido") counts[normCls].done += 1;
  }

  for (const r of RESPONDENTS) {
    const data = counts[r.cls] || { total: 0, done: 0 };
    if (data.total === 0) continue;

    const finishedAll = data.total > 0 && data.done === data.total;

    const card = el("div", { className: `resp-card src-${r.cls}` });
    const title = el("div", { className: "title", textContent: r.label });
    const desc = el("div", { className: "desc", textContent: r.desc });
    const count = el("div", {
      className: "count",
      textContent: `Disponíveis: ${data.total} • Respondidos: ${data.done}`
    });

    const btn = el("button", {
      className: `resp-btn ${r.cls}`,
      textContent: finishedAll ? "Formulários preenchidos" : "Abrir formulários",
      disabled: finishedAll
    });

    if (!finishedAll) {
      btn.addEventListener("click", () => openForSource(r.cls, r.label));
    }

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(count);
    card.appendChild(btn);
    grid.appendChild(card);
  }
}

/* ===========================
 * LISTA DE TESTES POR RESPONDENTE
 * =========================== */

function renderTests() {
  const grid = $("#testsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!patient) {
    grid.innerHTML = "<p class='muted'>Nenhum dado carregado.</p>";
    return;
  }

  if (!currentSource) return;

  const list = testsCatalog.filter((t) => {
    if (!isAllowed(t) || !isVisibleInPatientArea(t)) return false;
    const src = effectiveSource(t.source).cls;
    return src === currentSource;
  });

  if (!list.length) {
    grid.innerHTML = "<p class='muted'>Não há formulários para este respondente.</p>";
    return;
  }

  for (const t of list) {
    const st = statusOf(t);
    const src = effectiveSource(t.source);
    const repeat = isRepeatable(t);
    const progress = repeat ? repeatProgress(t) : null;

    const card = el("div", { className: `test src-${src.cls}` });

    const head = el("div", { className: "test-head" });
    const titleWrap = el("div", { style: "min-width:0" });

    const code = el("div", { className: "test-title", textContent: t.code });
    const title = el("div", { className: "test-code", textContent: t.label || t.code });

    titleWrap.appendChild(code);
    titleWrap.appendChild(title);

    const srcChip = el("span", { className: `srcchip ${src.cls}`, textContent: src.label });

    const tag = el("span", {
      className: "tag " + (st === "preenchido" ? "preenchido" : "ja"),
      textContent:
        st === "preenchido"
          ? repeat && progress?.limit
            ? `Concluído ${progress.limit}/${progress.limit}`
            : "Preenchido"
          : repeat && progress?.limit
          ? `Registro ${progress.count}/${progress.limit}`
          : t.shareable
          ? "Aguardando envio"
          : "Pendente!"
    });

    head.appendChild(titleWrap);
    head.appendChild(srcChip);
    head.appendChild(tag);
    card.appendChild(head);

    const actions = el("div", { className: "toolbar" });

    if (t.shareable) {
      if (st === "preenchido") {
        actions.appendChild(el("button", { className: "btn sec", textContent: "Preenchido", disabled: true }));
      } else {
        const btnShare = el("button", { className: `btn btn-src-${src.cls}`, textContent: "Enviar link" });
        btnShare.addEventListener("click", async () => {
          const shareUrl = resolveShareUrl(t, currentSource);
          try {
            await navigator.clipboard.writeText(shareUrl);
            setMsg(`Link copiado. Aguardando preenchimento de "${t.label}".`, "warn");
            tag.textContent = "Aguardando preenchimento";
            tag.className = "tag aguardando";
            setTimeout(() => setMsg(""), 3500);
          } catch (e) {
            alert(shareUrl);
          }
        });
        actions.appendChild(btnShare);
      }
    } else {
      if (st === "preenchido") {
        actions.appendChild(el("button", { className: "btn sec", textContent: repeat ? "Ciclo concluído" : "Preenchido", disabled: true }));
      } else {
        const btnPre = el("button", { className: `btn btn-src-${src.cls}`, textContent: repeat ? "Registrar hoje" : "Preencher" });
        btnPre.addEventListener("click", () => {window.location.href = resolveFillUrl(t);});
        actions.appendChild(btnPre);
      }
    }

    card.appendChild(actions);
    grid.appendChild(card);
  }
}

/* ===========================
 * OPCIONAL: ESCOLHER TARGET
 * (mantido se quiser customizar depois)
 * =========================== */
async function chooseTarget(targets) {
  if (!targets || !targets.length) return null;
  const label =
    "Para quem é esse link?\n" +
    targets.map((t, i) => `${i + 1}) ${t}`).join("\n") +
    "\n\nDigite o número:";
  const ans = prompt(label);
  if (!ans) return null;
  const idx = parseInt(ans, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= targets.length) return null;
  return targets[idx];
}
