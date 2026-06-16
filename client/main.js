"use strict";

/* ═══════════════════════════════════════════════════
   CompanionMatch — main.js  v0.4.0
   Auth · Geolocation filter · Bios · Dynamic user id
   ═══════════════════════════════════════════════════ */

const API_BASE    = "";
const LS_KEY      = "companionmatch_user";

// ── Auth state ────────────────────────────────────
/**
 * @typedef {{ id: number, nome: string, type: 'cliente'|'ator' }} AppUser
 * @type {AppUser|null}
 */
let loggedUser  = null;

// Auth UI
let loginType = "cliente";   // selected in Login tab
let regType   = "cliente";   // selected in Register tab

// ── Swipe state ───────────────────────────────────
/** @type {import('./main.js').Actor[]} */
let actorQueue   = [];
let currentIdx   = 0;
let activeMode   = "customer";
let customerView = "swipe";

// ═══════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════

async function apiFetch(path, opts = {}) {
  const r = await fetch(API_BASE + path, opts);
  if (!r.ok) throw new Error(`${opts.method || "GET"} ${path} → ${r.status}`);
  return r.json();
}

const apiGetClientes  = () => apiFetch("/api/clientes");
const apiGetAtores    = () => apiFetch("/api/atores");

function apiGetActors(raio_km) {
  const params = new URLSearchParams({ id_cliente: _clienteId() });
  if (raio_km != null) params.set("raio_km", raio_km);
  return apiFetch(`/api/swipes/actors?${params}`);
}

function _clienteId() {
  // Actors get a linked cliente_id on registration; seed actors fall back to 1 (demo)
  if (loggedUser.type === "ator") return loggedUser.cliente_id ?? 1;
  return loggedUser.id;
}

const apiPostSwipe = (id_ator, direcao) =>
  apiFetch("/api/swipes", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ id_cliente: _clienteId(), id_ator, direcao }),
  });

const apiGetMatches = () =>
  apiFetch(`/api/swipes/matches?id_cliente=${_clienteId()}`);

function apiGetRequests() {
  const params = new URLSearchParams();
  if (loggedUser.type === "ator")    params.set("id_ator",    loggedUser.id);
  else                               params.set("id_cliente", loggedUser.id);
  return apiFetch(`/api/pedidos/requests?${params}`);
}

const apiConfirmPedido = (id) =>
  apiFetch(`/api/pedidos/${id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ status: "Confirmed" }),
  });

const apiCreateCliente = (body) =>
  apiFetch("/api/clientes", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

const apiCreateAtor = (body) =>
  apiFetch("/api/atores", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

// ═══════════════════════════════════════════════════
// Toast
// ═══════════════════════════════════════════════════

function showToast(msg, ms = 1800) {
  let t = document.getElementById("global-toast");
  if (!t) {
    t = Object.assign(document.createElement("div"), { id: "global-toast", className: "toast" });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("visible");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("visible"), ms);
}

// ═══════════════════════════════════════════════════
// Auth Screen
// ═══════════════════════════════════════════════════

function switchAuthTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("tab-login").classList.toggle("auth-tab-active",    isLogin);
  document.getElementById("tab-register").classList.toggle("auth-tab-active", !isLogin);
  document.getElementById("auth-login").classList.toggle("hidden",    !isLogin);
  document.getElementById("auth-register").classList.toggle("hidden",  isLogin);
}

// ── Login tab ─────────────────────────────────────

function setLoginType(type) {
  loginType = type;
  document.getElementById("login-type-cliente").classList.toggle("type-active", type === "cliente");
  document.getElementById("login-type-ator").classList.toggle("type-active",    type === "ator");
  populateLoginSelect();
}

let _allClientes = [];
let _allAtores   = [];

async function populateLoginSelect() {
  const select = document.getElementById("login-select");
  select.innerHTML = `<option value="">Loading…</option>`;
  try {
    if (!_allClientes.length) _allClientes = await apiGetClientes();
    if (!_allAtores.length)   _allAtores   = await apiGetAtores();

    const list = loginType === "cliente" ? _allClientes : _allAtores;
    const idField = loginType === "cliente" ? "id_cliente" : "id_ator";

    select.innerHTML = list
      .map(u => `<option value="${u[idField]}">${u.nome}</option>`)
      .join("");
  } catch {
    select.innerHTML = `<option value="">— could not load —</option>`;
  }
}

function doLogin() {
  const select = document.getElementById("login-select");
  const id = parseInt(select.value);
  if (!id) { showToast("Please select an account"); return; }
  const nome = select.options[select.selectedIndex].text;
  _saveUser({ id, nome, type: loginType });
}

// ── Register tab ──────────────────────────────────

function setRegType(type) {
  regType = type;
  document.getElementById("reg-type-cliente").classList.toggle("type-active", type === "cliente");
  document.getElementById("reg-type-ator").classList.toggle("type-active",    type === "ator");
  document.getElementById("reg-ator-fields").classList.toggle("hidden",    type !== "ator");
  document.getElementById("reg-cliente-fields").classList.toggle("hidden", type !== "cliente");
}

async function doRegister() {
  const nome     = document.getElementById("reg-nome").value.trim();
  const cidade   = document.getElementById("reg-cidade").value.trim();
  const telefone = document.getElementById("reg-telefone").value.trim();
  const lat      = parseFloat(document.getElementById("reg-lat").value) || null;
  const lon      = parseFloat(document.getElementById("reg-lon").value) || null;
  const telegram = document.getElementById("reg-telegram").value.trim().replace(/^@/, "") || null;

  if (!nome || !cidade || !telefone) {
    showToast("Name, city and phone are required");
    return;
  }

  try {
    let created;
    if (regType === "cliente") {
      const bio = document.getElementById("reg-bio-cliente").value.trim() || null;
      created = await apiCreateCliente({ nome, cidade, telefone, bio, latitude: lat, longitude: lon, telegram });
      _allClientes = [];
      _saveUser({ id: created.id_cliente, nome: created.nome, type: "cliente" });
    } else {
      const idade         = parseInt(document.getElementById("reg-idade").value);
      const nacionalidade = document.getElementById("reg-nacionalidade").value.trim();
      const genero        = document.getElementById("reg-genero").value;
      const bio           = document.getElementById("reg-bio-ator").value.trim() || null;
      if (!idade || !nacionalidade) { showToast("Age and nationality are required for Providers"); return; }
      created = await apiCreateAtor({ nome, idade, nacionalidade, genero, bio, latitude: lat, longitude: lon, telegram });
      _allAtores   = [];
      _allClientes = [];
      _saveUser({ id: created.id_ator, nome: created.nome, type: "ator" });
    }
  } catch (err) {
    console.error("[Register]", err);
    showToast("Registration failed — try again");
  }
}

// ── Shared helpers ────────────────────────────────

function _saveUser(user) {
  loggedUser = user;
  localStorage.setItem(LS_KEY, JSON.stringify(user));
  enterApp();
}

function doLogout() {
  localStorage.removeItem(LS_KEY);
  loggedUser   = null;
  actorQueue   = [];
  currentIdx   = 0;
  _allClientes = [];
  _allAtores   = [];
  document.getElementById("app-shell").classList.add("hidden");
  document.getElementById("auth-screen").classList.remove("hidden");
  populateLoginSelect();
}

// ═══════════════════════════════════════════════════
// Enter App
// ═══════════════════════════════════════════════════

async function enterApp() {
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  document.getElementById("user-chip").textContent = loggedUser.nome;

  const isAtor = loggedUser.type === "ator";

  // Each role gets only its own tab; the other is locked
  const segCustomer = document.getElementById("seg-customer");
  const segProvider = document.getElementById("seg-provider");
  segCustomer.disabled = isAtor;
  segProvider.disabled = !isAtor;
  segCustomer.title = isAtor  ? "Customer mode is for Client accounts" : "";
  segProvider.title = !isAtor ? "Provider mode is for Provider accounts" : "";

  const defaultMode = isAtor ? "provider" : "customer";
  setSegment(defaultMode);
  if (defaultMode === "customer") await reloadActors();
}

// ═══════════════════════════════════════════════════
// Segment Control
// ═══════════════════════════════════════════════════

function setSegment(mode) {
  activeMode = mode;
  document.getElementById("seg-customer").classList.toggle("seg-active", mode === "customer");
  document.getElementById("seg-provider").classList.toggle("seg-active", mode === "provider");

  const swipeStage    = document.getElementById("swipe-stage");
  const matchesPanel  = document.getElementById("matches-panel");
  const providerPanel = document.getElementById("provider-panel");
  const bottomNav     = document.getElementById("bottom-nav");
  const radiusCtrl    = document.getElementById("radius-control");

  if (mode === "customer") {
    providerPanel.classList.add("hidden");
    bottomNav.classList.remove("hidden");
    swipeStage.classList.toggle("hidden",   customerView !== "swipe");
    matchesPanel.classList.toggle("hidden", customerView !== "matches");
    radiusCtrl.classList.toggle("hidden",   customerView !== "swipe");
    document.getElementById("nav-swipe").classList.toggle("nav-active",   customerView === "swipe");
    document.getElementById("nav-matches").classList.toggle("nav-active", customerView === "matches");
  } else {
    swipeStage.classList.add("hidden");
    matchesPanel.classList.add("hidden");
    radiusCtrl.classList.add("hidden");
    bottomNav.classList.add("hidden");
    providerPanel.classList.remove("hidden");
    loadProviderRequests();
  }
}

function showCustomerView(view) {
  if (activeMode !== "customer") return;
  customerView = view;
  document.getElementById("swipe-stage").classList.toggle("hidden",    view !== "swipe");
  document.getElementById("matches-panel").classList.toggle("hidden",  view !== "matches");
  document.getElementById("radius-control").classList.toggle("hidden", view !== "swipe");
  document.getElementById("nav-swipe").classList.toggle("nav-active",   view === "swipe");
  document.getElementById("nav-matches").classList.toggle("nav-active", view === "matches");
  if (view === "matches") loadMatches();
}

// ═══════════════════════════════════════════════════
// Radius Slider
// ═══════════════════════════════════════════════════

function onRadiusChange() {
  document.getElementById("radius-value").textContent =
    document.getElementById("radius-slider").value;
  clearTimeout(window._radiusDebounce);
  window._radiusDebounce = setTimeout(reloadActors, 600);
}

async function reloadActors() {
  try {
    const raio = parseInt(document.getElementById("radius-slider").value);
    actorQueue = await apiGetActors(raio);
    currentIdx = 0;
    document.getElementById("btn-dislike").disabled = false;
    document.getElementById("btn-like").disabled    = false;
    renderCurrentCard();
  } catch (err) {
    console.error("[Reload]", err);
    showToast("Could not reload actors");
  }
}

// ═══════════════════════════════════════════════════
// Swipe Card
// ═══════════════════════════════════════════════════

function renderCurrentCard() {
  const card     = document.getElementById("swipe-card");
  const endState = document.getElementById("end-state");
  const eyes     = document.getElementById("avatar-eyes");

  if (currentIdx >= actorQueue.length) {
    card.classList.add("hidden");
    endState.classList.remove("hidden");
    document.getElementById("btn-dislike").disabled = true;
    document.getElementById("btn-like").disabled    = true;
    return;
  }

  card.classList.remove("hidden", "exit-left", "exit-right");
  endState.classList.add("hidden");
  document.getElementById("btn-dislike").disabled = false;
  document.getElementById("btn-like").disabled    = false;

  const actor = actorQueue[currentIdx];

  document.getElementById("actor-name").textContent = actor.nome ?? "—";
  document.getElementById("actor-meta").textContent =
    `${actor.idade ?? "?"}yrs · ${actor.nacionalidade ?? "—"}`;
  document.getElementById("actor-bio").textContent  = actor.bio || "";

  // Distance badge
  const distEl = document.getElementById("actor-distance");
  if (actor.distancia_km != null) {
    distEl.textContent = `📍 ${actor.distancia_km} km away`;
    distEl.classList.remove("hidden");
  } else {
    distEl.classList.add("hidden");
  }

  // Avatar
  const ring = document.getElementById("avatar-ring");
  if (actor.avatar_url) {
    ring.style.backgroundImage = `url('${actor.avatar_url}')`;
    ring.classList.add("has-image");
    eyes.classList.add("hidden");
  } else {
    ring.style.backgroundImage = "";
    ring.classList.remove("has-image");
    eyes.classList.remove("hidden");
  }
}

// ═══════════════════════════════════════════════════
// Swipe Handler
// ═══════════════════════════════════════════════════

async function handleSwipe(direction) {
  if (currentIdx >= actorQueue.length) return;
  const actor = actorQueue[currentIdx];
  const card  = document.getElementById("swipe-card");

  card.classList.add(direction === "like" ? "exit-right" : "exit-left");

  try {
    const result = await apiPostSwipe(actor.id_ator, direction);
    if (result.matched) showMatchOverlay(actor, result.id_pedido);
    else showToast(direction === "like" ? "Liked ✓" : "Passed ✕", 900);
  } catch (err) {
    console.error("[Swipe]", err);
    showToast("Could not save swipe");
  }

  await new Promise(r => setTimeout(r, 300));
  currentIdx++;
  renderCurrentCard();
}

// ═══════════════════════════════════════════════════
// Match Overlay
// ═══════════════════════════════════════════════════

function showMatchOverlay(actor, id_pedido) {
  const overlay  = document.getElementById("match-overlay");
  const avatarEl = document.getElementById("match-avatar-lg");
  const subText  = document.getElementById("match-sub-text");

  avatarEl.style.backgroundImage = actor.avatar_url ? `url('${actor.avatar_url}')` : "";
  avatarEl.classList.toggle("has-image", !!actor.avatar_url);
  subText.textContent = `${actor.nome} is ready to meet you!`
    + (id_pedido ? ` · Order #${id_pedido}` : "");
  overlay.classList.remove("hidden");
}

function closeMatchOverlay() {
  document.getElementById("match-overlay").classList.add("hidden");
}

// ═══════════════════════════════════════════════════
// Matches Panel (Customer)
// ═══════════════════════════════════════════════════

async function loadMatches() {
  const list = document.getElementById("matches-list");
  list.innerHTML = `<li class="list-placeholder">Loading…</li>`;
  try {
    const matches = await apiGetMatches();
    if (!matches.length) {
      list.innerHTML = `<li class="list-placeholder">No matches yet — keep swiping!</li>`;
      return;
    }
    list.innerHTML = matches.map(m => {
      const avatarStyle = m.avatar_url ? `background-image:url('${m.avatar_url}')` : "";
      const tgHtml = m.telegram
        ? `<a class="telegram-link" href="https://t.me/${m.telegram}" target="_blank" rel="noopener">
             <span class="tg-icon">✈</span>@${m.telegram}
           </a>`
        : `<span class="no-telegram">No Telegram set</span>`;
      return `
        <li class="match-item">
          <div class="match-avatar ${m.avatar_url ? "has-image" : ""}" style="${avatarStyle}"></div>
          <div class="match-info">
            <span class="match-name">${m.nome ?? "—"}</span>
            <span class="match-meta">${m.idade ?? "?"}yrs · ${m.nacionalidade ?? "—"}</span>
            ${tgHtml}
          </div>
        </li>`;
    }).join("");
  } catch (err) {
    list.innerHTML = `<li class="list-placeholder list-error">Failed to load matches.</li>`;
  }
}

// ═══════════════════════════════════════════════════
// Provider Panel
// ═══════════════════════════════════════════════════

async function loadProviderRequests() {
  const list = document.getElementById("requests-list");
  list.innerHTML = `<li class="list-placeholder">Loading requests…</li>`;
  try {
    const requests = await apiGetRequests();
    if (!requests.length) {
      list.innerHTML = `<li class="list-placeholder">No requests yet.<br>Requests appear here when a Customer matches with you.<br>Ask someone to log in as a Customer and swipe right on you!</li>`;
      return;
    }
    list.innerHTML = requests.map(req => {
      const c = req.cliente;
      const statusClass  = req.status === "Confirmed" ? "badge-confirmed" : "badge-matched";
      const isConfirmed  = req.status === "Confirmed";
      const clienteBio   = c?.bio
        ? `<p class="request-bio"><em>Wants:</em> ${c.bio}</p>` : "";
      const contactHtml  = isConfirmed
        ? (c?.telegram
            ? `<a class="telegram-link" href="https://t.me/${c.telegram}" target="_blank" rel="noopener">
                 <span class="tg-icon">✈</span>@${c.telegram}
               </a>`
            : `<span class="no-telegram">No Telegram set</span>`)
        : `<span class="contact-locked">🔒 Confirm to unlock contact</span>`;
      return `
        <li class="request-item" id="req-${req.id_pedido}">
          <div class="request-info">
            <div class="request-header">
              <span class="request-name">${c?.nome ?? "—"}</span>
              <span class="status-badge ${statusClass}">${req.status}</span>
            </div>
            ${clienteBio}
            ${contactHtml}
          </div>
          <button class="confirm-btn" ${isConfirmed ? "disabled" : ""} onclick="confirmService(${req.id_pedido})">
            ${isConfirmed ? "Done ✓" : "Confirm"}
          </button>
        </li>`;
    }).join("");
  } catch (err) {
    console.error("[Provider]", err);
    list.innerHTML = `<li class="list-placeholder list-error">Failed to load requests.</li>`;
  }
}

async function confirmService(id_pedido) {
  try {
    await apiConfirmPedido(id_pedido);
    showToast("Service confirmed! ✓", 1600);
    loadProviderRequests();
  } catch (err) {
    showToast("Could not confirm — try again");
  }
}

// ═══════════════════════════════════════════════════
// Reset swipes
// ═══════════════════════════════════════════════════

async function resetSwipes() {
  try {
    await apiFetch(`/api/swipes/reset?id_cliente=${_clienteId()}`, { method: "DELETE" });
    showToast("Swipes reset — enjoy! ♻", 1600);
    await reloadActors();
  } catch (err) {
    console.error("[Reset]", err);
    showToast("Could not reset swipes");
  }
}

// ═══════════════════════════════════════════════════
// Browser Geolocation helper
// ═══════════════════════════════════════════════════

function fillBrowserLocation() {
  if (!navigator.geolocation) {
    showToast("Geolocation not supported by this browser");
    return;
  }
  const btn = document.getElementById("geo-btn");
  if (btn) { btn.textContent = "Locating…"; btn.disabled = true; }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      document.getElementById("reg-lat").value = pos.coords.latitude.toFixed(6);
      document.getElementById("reg-lon").value = pos.coords.longitude.toFixed(6);
      if (btn) { btn.textContent = "📍 Got it!"; btn.disabled = false; }
      showToast("Location filled ✓", 1400);
    },
    (err) => {
      if (btn) { btn.textContent = "📍 My location"; btn.disabled = false; }
      showToast("Could not get location: " + err.message, 2500);
    },
    { enableHighAccuracy: true, timeout: 8000 },
  );
}

// ═══════════════════════════════════════════════════
// Bootstrap
// ═══════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem(LS_KEY);
  if (stored) {
    try {
      loggedUser = JSON.parse(stored);
      enterApp();
      return;
    } catch { localStorage.removeItem(LS_KEY); }
  }
  // Show auth screen
  document.getElementById("auth-screen").classList.remove("hidden");
  populateLoginSelect();
});
