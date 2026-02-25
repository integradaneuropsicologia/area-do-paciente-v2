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
  BAI: "https://integradaneuropsicologia.github.io/formulariodeansiedade/",
  SRS2_AUTORRELATO: "https://integradaneuropsicologia.github.io/srs2/",
  SRS2_HETERORRELATO: "https://integradaneuropsicologia.github.io/SRS2_HETERORRELATO/"
};

const SHARE_URLS = {
  // "SRS2": "..."
};

const APPEND_CPF_PARAM = true;
const DEFAULT_TARGETS = ["pais", "professores", "segunda_fonte", "heterorrelato"];
const TEST_PREFIX = "";
const DONE_SUFFIX = "_FEITO";

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

/** Idade em anos a partir de YYYY-MM-DD (retorna null se inválido) */
function calcAgeYears(iso) {
  if (!iso || typeof iso !== "string") return null;
  const parts = iso.split("-");
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!y || !m || !d) return null;

  const today = new Date();
  let age = today.getFullYear() - y;

  const monthDiff = today.getMonth() - (m - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d)) {
    age -= 1;
  }
  return Number.isFinite(age) ? age : null;
}

function getPatientAgeYears() {
  return calcAgeYears(patient?.data_nascimento || "");
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
      btn.textContent = theme === "dark" ? "🌙 Modo escuro" : "☀️ Modo claro";
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
let patient = null;
let testsCatalog = []; // {code,label,order,shareable,targets,form_url,share_url,source,age_min,age_max}
let currentSource = null;
let currentSourceLabel = "—";

// Supabase client + JSONB (tests_liberados / tests_feitos)
let sb = null;
let testsLiberadosSet = new Set();
let testsFeitosSet = new Set();

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
    age_max: meta.age_max ?? null
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
      age_max: obj.age_max ?? base.age_max
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
 * REGRA PEDIDA:
 * Se o paciente tiver 12+ anos, qualquer "profissional" vira "paciente" na UI.
 */
function effectiveSource(raw) {
  const norm = normalizeSource(raw);
  const age = getPatientAgeYears();
  if (age !== null && age >= 12 && norm.cls === "profissional") {
    return { cls: "paciente", label: "Paciente" };
  }
  return norm;
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

function resolveFillUrl(t) {
  const rawBase = t.form_url || TEST_URLS[t.code] || ""; // se tiver salvo no JSONB, usa
  const base = normalizeTestUrl(rawBase, t.code);

  const cpf = onlyDigits(patient?.cpf || CPF);
  return APPEND_CPF_PARAM && cpf ? buildUrl(base, { cpf }) : base;
}

/* URL de segunda fonte (se usar) */
function resolveShareUrl(t, target) {
  const base =
    t.share_url ||
    SHARE_URLS[t.code] ||
    `${BASE_FORM_URL}/${encodeURIComponent(String(t.code || "").toLowerCase())}.html`;

  return buildUrl(base, {
    cpf: onlyDigits(patient.cpf || ""),
    source: target
  });
}

/* ===========================
 * BOOT VIA TOKEN
 * =========================== */

(async function boot() {
  try {
    sb = getSupabaseClient();

    CPF = getCpfFromUrl();

    if (!CPF) {
      setMsg("Link inválido (sem CPF). Solicite um novo link ao consultório.", "err");
      return;
    }

    // Paciente (busca no Supabase; tenta CPF só dígitos e depois mascarado)
    patient = await fetchPatientByCpf(CPF);
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

function getCpfFromUrl() {
  // 1) formato novo: ?12345678901
  const raw = String(location.search || "").replace(/^\?/, "");
  if (raw && !raw.includes("=")) {
    const first = raw.split("&")[0];
    const d = onlyDigits(first);
    if (d.length === 11) return d;
  }

  // 2) compat: ?cpf=... ou ?token=... (pra não quebrar links antigos)
  const byCpf = qs("cpf");
  if (byCpf) return onlyDigits(byCpf);

  const byToken = qs("token");
  if (byToken) return onlyDigits(byToken);

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

async function loadTests(skipFetch) {
  // Não buscamos mais catálogo em tabela errada (patients). O catálogo vem do próprio paciente.
  // - Se tests_liberados estiver preenchido: ele manda.
  // - Se estiver null/undefined: cai no modo legado (colunas "BAI=sim" etc), usando fallback local.

  const hasJsonLiberados = patient && patient.tests_liberados !== null && patient.tests_liberados !== undefined;

  if (hasJsonLiberados) {
    testsCatalog = jsonbToCatalog(patient.tests_liberados);
  } else {
    // LEGADO: tenta encontrar testes marcados como "sim" em colunas antigas.
    const knownCodes = Array.from(new Set([...Object.keys(FALLBACK_TEST_META), ...Object.keys(TEST_URLS)]));
    testsCatalog = knownCodes
      .map((c) => defaultMetaFor(c))
      .filter((t) => String(patient[colFor(t)] || "").toLowerCase() === "sim");
  }

  // Ordena sempre
  testsCatalog = (testsCatalog || []).sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));

  const allowed = testsCatalog.filter((t) => isAllowed(t));
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
    const refreshed = await fetchPatientByCpf(patient.cpf);
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

  const allowed = testsCatalog.filter((t) => isAllowed(t));

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
    if (!isAllowed(t)) return false;
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

    const card = el("div", { className: `test src-${src.cls}` });

    const head = el("div", { className: "test-head" });
    const titleWrap = el("div", { style: "min-width:0" });

    const title = el("div", { className: "test-title", textContent: t.label });
    const code = el("div", { className: "test-code", textContent: t.code });

    titleWrap.appendChild(title);
    titleWrap.appendChild(code);

    const srcChip = el("span", { className: `srcchip ${src.cls}`, textContent: src.label });

    const tag = el("span", {
      className: "tag " + (st === "preenchido" ? "preenchido" : "ja"),
      textContent:
        st === "preenchido"
          ? "Preenchido"
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
        actions.appendChild(el("button", { className: "btn sec", textContent: "Preenchido", disabled: true }));
      } else {
        const btnPre = el("button", { className: `btn btn-src-${src.cls}`, textContent: "Preencher" });
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
