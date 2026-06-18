"use strict";

const API_BASE    = "";
const LS_KEY      = "aquarium_user";
const LANG_KEY    = "preferred_lang";

let currentLang = localStorage.getItem(LANG_KEY) || "en";
if (!["en", "pt", "ht", "by"].includes(currentLang)) currentLang = "en";

const translations = {
  en: {
    page_title: "The Aquarium Gazette",
    gazette_masthead: "THE AQUARIUM GAZETTE",
    gazette_vol: "VOL. I NO. 1",
    gazette_price: "PRICE: 10.00$",
    gazette_meta: "Daily Classifieds for Fishes & Coral Opportunists",
    classifieds_heading: "TODAY'S CLASSIFIEDS",
    auth_tagline: "<strong>Fish</strong> are looking for someone to spend time with.<br><strong>Coral Opportunists</strong> offer their companionship &amp; skills.",
    tab_login: "Log In",
    tab_register: "Register",
    fish: "Fish",
    coral_opportunist: "Coral Opportunist",
    select_account: "Select account",
    enter_aquarium: "Enter Aquarium",
    name: "Name",
    city: "City",
    phone: "Phone",
    age: "Age",
    nationality: "Nationality",
    gender: "Gender",
    gender_neutral: "Neutral / Prefer not to say",
    gender_female: "Female",
    gender_male: "Male",
    bio_ator_label: "My fish job skills (bio)",
    bio_cliente_label: "My fish job request (bio)",
    bio_ator_placeholder: "Describe what fish jobs you can handle",
    bio_cliente_placeholder: "Describe the fish job you need done",
    telegram_label: "Telegram username",
    telegram_hint: "(without @)",
    telegram_placeholder: "your_username",
    geo_btn: "Use my location",
    latitude: "Latitude",
    lat_hint: "(e.g. 38.7169)",
    longitude: "Longitude",
    lon_hint: "(e.g. -9.1399)",
    name_placeholder: "Full name",
    city_placeholder: "e.g. Lisbon",
    phone_placeholder: "+351 900 000 000",
    age_placeholder: "Age",
    nationality_placeholder: "e.g. Portuguese",
    create_account: "Create Account",
    logout: "Log out",
    role_fish: "You are a <strong>Fish</strong> — swipe to find a Coral Opportunist for your fish job.",
    role_ator: "You are a <strong>Coral Opportunist</strong> — accept fish jobs from Fish below.",
    seg_fish_title: "Fish mode is for Fish accounts only",
    seg_ator_title: "Coral Opportunist mode is for Coral Opportunist accounts only",
    search_radius: "Search Radius",
    km_unit: "km",
    km_away: "{n} km away",
    yrs: "yrs",
    pass: "Pass",
    like: "Like",
    no_ator_nearby: "No Coral Opportunists nearby",
    end_sub: "Try expanding the radius or reset your swipes",
    reset_swipes: "Reset swipes",
    your_fish_jobs: "Your Fish Jobs",
    incoming_fish_jobs: "Incoming Fish Jobs",
    discover: "Discover",
    nav_matches: "My Fish Jobs",
    match_title: "Fish Job Matched!",
    continue_btn: "Continue",
    location: "LOCATION",
    location_km: "{n} km away",
    location_unavailable: "unavailable",
    label_age: "AGE",
    label_nationality: "NATIONALITY",
    label_what_i_can_do: "WHAT I CAN DO",
    no_description: "No description provided.",
    available: "Available",
    loading_classifieds: "LOADING CLASSIFIEDS...",
    no_companions: "NO COMPANIONS LISTED TODAY.",
    could_not_load_classifieds: "COULD NOT LOAD CLASSIFIEDS.",
    loading: "Loading…",
    could_not_load: "— could not load —",
    please_select_account: "Please select an account",
    name_city_phone_required: "Name, city and phone are required",
    age_nat_required: "Age and nationality are required for Coral Opportunists",
    registration_failed: "Registration failed — try again",
    liked: "Liked ✓",
    passed: "Passed ✕",
    could_not_save_swipe: "Could not save swipe",
    match_sub: "{name} accepted your fish job!",
    order_num: "Order #{n}",
    no_fish_jobs_swipe: "No fish jobs yet — keep swiping!",
    no_telegram: "No Telegram set",
    failed_load_matches: "Failed to load matches.",
    loading_requests: "Loading requests…",
    no_fish_jobs_provider: "No fish jobs yet.<br>Fish jobs appear here when a Fish matches with you.<br>Ask someone to log in as a Fish and swipe right on you!",
    wants: "Wants:",
    confirm_unlock: "🔒 Confirm to unlock contact",
    confirm: "Confirm",
    confirm_service: "Confirm Service",
    done: "Done ✓",
    failed_load_requests: "Failed to load requests.",
    service_confirmed: "Service confirmed! ✓",
    could_not_confirm: "Could not confirm — try again",
    swipes_reset: "Swipes reset — enjoy! ♻",
    could_not_reset: "Could not reset swipes",
    geolocation_unsupported: "Geolocation not supported by this browser",
    locating: "Locating…",
    got_it: "Got it",
    location_filled: "Location filled",
    could_not_get_location: "Could not get location: {msg}",
    could_not_reload: "Could not reload actors",
    status_matched: "Matched",
    status_confirmed: "Confirmed",
  },
  pt: {
    page_title: "O Gazeta do Aquário",
    gazette_masthead: "O GAZETA DO AQUÁRIO",
    gazette_vol: "VOL. I N.º 1",
    gazette_price: "PREÇO: 10,00$",
    gazette_meta: "Classificados Diários para Peixes e Oportunistas de Coral",
    classifieds_heading: "CLASSIFICADOS DE HOJE",
    auth_tagline: "<strong>Peixes</strong> procuram alguém para passar tempo.<br><strong>Oportunistas de Coral</strong> oferecem companhia e habilidades.",
    tab_login: "ENTRAR",
    tab_register: "REGISTRAR",
    fish: "Peixe",
    coral_opportunist: "Oportunista de Coral",
    select_account: "SELECIONAR CONTA",
    enter_aquarium: "ENTRAR NO AQUÁRIO",
    name: "Nome",
    city: "Cidade",
    phone: "Telefone",
    age: "Idade",
    nationality: "Nacionalidade",
    gender: "Género",
    gender_neutral: "Neutro / Prefiro não dizer",
    gender_female: "Feminino",
    gender_male: "Masculino",
    bio_ator_label: "As minhas competências (bio)",
    bio_cliente_label: "O meu pedido de fish job (bio)",
    bio_ator_placeholder: "Descreva que fish jobs pode fazer",
    bio_cliente_placeholder: "Descreva o fish job que precisa",
    telegram_label: "Utilizador Telegram",
    telegram_hint: "(sem @)",
    telegram_placeholder: "seu_utilizador",
    geo_btn: "Usar a minha localização",
    latitude: "Latitude",
    lat_hint: "(ex. 38.7169)",
    longitude: "Longitude",
    lon_hint: "(ex. -9.1399)",
    name_placeholder: "Nome completo",
    city_placeholder: "ex. Lisboa",
    phone_placeholder: "+351 900 000 000",
    age_placeholder: "Idade",
    nationality_placeholder: "ex. Português",
    create_account: "CRIAR CONTA",
    logout: "Sair",
    role_fish: "É um <strong>Peixe</strong> — deslize para encontrar um Oportunista de Coral.",
    role_ator: "É um <strong>Oportunista de Coral</strong> — aceite fish jobs dos Peixes abaixo.",
    seg_fish_title: "Modo Peixe apenas para contas Peixe",
    seg_ator_title: "Modo Oportunista apenas para contas Oportunista",
    search_radius: "Raio de Busca",
    km_unit: "km",
    km_away: "{n} km de distância",
    yrs: "anos",
    pass: "Passar",
    like: "Gostar",
    no_ator_nearby: "Nenhum Oportunista de Coral por perto",
    end_sub: "Tente aumentar o raio ou redefinir os swipes",
    reset_swipes: "Redefinir swipes",
    your_fish_jobs: "Os Seus Fish Jobs",
    incoming_fish_jobs: "Fish Jobs Recebidos",
    discover: "Descobrir",
    nav_matches: "Os Meus Fish Jobs",
    match_title: "Fish Job Correspondido!",
    continue_btn: "Continuar",
    location: "LOCALIZAÇÃO",
    location_km: "{n} km de distância",
    location_unavailable: "indisponível",
    label_age: "IDADE",
    label_nationality: "NACIONALIDADE",
    label_what_i_can_do: "O QUE POSSO FAZER",
    no_description: "Sem descrição.",
    available: "Disponível",
    loading_classifieds: "A CARREGAR CLASSIFICADOS...",
    no_companions: "NENHUM COMPANHEIRO LISTADO HOJE.",
    could_not_load_classifieds: "NÃO FOI POSSÍVEL CARREGAR CLASSIFICADOS.",
    loading: "A carregar…",
    could_not_load: "— não foi possível carregar —",
    please_select_account: "Selecione uma conta",
    name_city_phone_required: "Nome, cidade e telefone são obrigatórios",
    age_nat_required: "Idade e nacionalidade são obrigatórios para Oportunistas",
    registration_failed: "Registo falhou — tente novamente",
    liked: "Gostou ✓",
    passed: "Passou ✕",
    could_not_save_swipe: "Não foi possível guardar o swipe",
    match_sub: "{name} aceitou o seu fish job!",
    order_num: "Pedido #{n}",
    no_fish_jobs_swipe: "Ainda sem fish jobs — continue a deslizar!",
    no_telegram: "Telegram não definido",
    failed_load_matches: "Falha ao carregar correspondências.",
    loading_requests: "A carregar pedidos…",
    no_fish_jobs_provider: "Ainda sem fish jobs.<br>Aparecem aqui quando um Peixe faz match consigo.<br>Peça a alguém para entrar como Peixe e deslizar para a direita!",
    wants: "Quer:",
    confirm_unlock: "🔒 Confirme para desbloquear contacto",
    confirm: "Confirmar",
    confirm_service: "Confirmar Serviço",
    done: "Feito ✓",
    failed_load_requests: "Falha ao carregar pedidos.",
    service_confirmed: "Serviço confirmado! ✓",
    could_not_confirm: "Não foi possível confirmar — tente novamente",
    swipes_reset: "Swipes redefinidos — divirta-se! ♻",
    could_not_reset: "Não foi possível redefinir swipes",
    geolocation_unsupported: "Geolocalização não suportada neste navegador",
    locating: "A localizar…",
    got_it: "Obtido",
    location_filled: "Localização preenchida",
    could_not_get_location: "Não foi possível obter localização: {msg}",
    could_not_reload: "Não foi possível recarregar atores",
    status_matched: "Correspondido",
    status_confirmed: "Confirmado",
  },
  ht: {
    page_title: "Gazèt Aquarium la",
    gazette_masthead: "GAZÈT AKWARYÒM LA",
    gazette_vol: "VOL. I NIMERO 1",
    gazette_price: "PRI: 10.00$",
    gazette_meta: "Anons Chak Jou pou Pwason ak Opòtinis Koray",
    classifieds_heading: "ANONS POU JODI A",
    auth_tagline: "<strong>Pwason</strong> ap chèche yon moun pou pase tan avèk.<br><strong>Opòtinis Koray</strong> ofri konpayi ak konpetans yo.",
    tab_login: "KONEKTE",
    tab_register: "ENSKRI",
    fish: "Pwason",
    coral_opportunist: "Opòtinis Koray",
    select_account: "Chwazi kont",
    enter_aquarium: "ANTRE NAN AKWARIÒM LAN",
    name: "Non",
    city: "Vil",
    phone: "Telefòn",
    age: "Laj",
    nationality: "Nasyonalite",
    gender: "Sèks",
    gender_neutral: "Net / Mwen pa vle di",
    gender_female: "Fi",
    gender_male: "Gason",
    bio_ator_label: "Konpetans mwen (bio)",
    bio_cliente_label: "Demann fish job mwen (bio)",
    bio_ator_placeholder: "Dekri fish jobs ou ka fè",
    bio_cliente_placeholder: "Dekri fish job ou bezwen",
    telegram_label: "Non itilizatè Telegram",
    telegram_hint: "(san @)",
    telegram_placeholder: "non_itilizatè",
    geo_btn: "Itilize kote mwen ye",
    latitude: "Latitid",
    lat_hint: "(eg. 38.7169)",
    longitude: "Lonjitid",
    lon_hint: "(eg. -9.1399)",
    name_placeholder: "Non konplè",
    city_placeholder: "eg. Lisbon",
    phone_placeholder: "+351 900 000 000",
    age_placeholder: "Laj",
    nationality_placeholder: "eg. Pòtigè",
    create_account: "KREYE KONT",
    logout: "Dekonekte",
    role_fish: "Ou se yon <strong>Pwason</strong> — glise pou jwenn yon Opòtinis Koray.",
    role_ator: "Ou se yon <strong>Opòtinis Koray</strong> — aksepte fish jobs ki anba a.",
    seg_fish_title: "Mòd Pwason sèlman pou kont Pwason",
    seg_ator_title: "Mòd Opòtinis sèlman pou kont Opòtinis",
    search_radius: "Reyon Chèche",
    km_unit: "km",
    km_away: "{n} km lwen",
    yrs: "ane",
    pass: "Pase",
    like: "Renmen",
    no_ator_nearby: "Pa gen Opòtinis Koray tou pre",
    end_sub: "Eseye agrandi reyon an oswa resete swipe yo",
    reset_swipes: "Resete swipe yo",
    your_fish_jobs: "Fish Jobs Ou Yo",
    incoming_fish_jobs: "Fish Jobs K ap Vini",
    discover: "Dekouvri",
    nav_matches: "Fish Jobs Mwen",
    match_title: "Fish Job Matche!",
    continue_btn: "Kontinye",
    location: "KOTE",
    location_km: "{n} km lwen",
    location_unavailable: "pa disponib",
    label_age: "LAJ",
    label_nationality: "NASYONALITE",
    label_what_i_can_do: "SA M KAPAB FÈ",
    no_description: "Pa gen deskripsyon.",
    available: "Disponib",
    loading_classifieds: "AP CHAJE ANONS...",
    no_companions: "PA GEN KONPANYON JODI A.",
    could_not_load_classifieds: "PA T KAPAB CHAJE ANONS.",
    loading: "Ap chaje…",
    could_not_load: "— pa t kapab chaje —",
    please_select_account: "Tanpri chwazi yon kont",
    name_city_phone_required: "Non, vil ak telefòn obligatwa",
    age_nat_required: "Laj ak nasyonalite obligatwa pou Opòtinis",
    registration_failed: "Enskripsyon echwe — eseye ankò",
    liked: "Renmen ✓",
    passed: "Pase ✕",
    could_not_save_swipe: "Pa t kapab sove swipe",
    match_sub: "{name} aksepte fish job ou!",
    order_num: "Lòd #{n}",
    no_fish_jobs_swipe: "Poko gen fish jobs — kontinye glise!",
    no_telegram: "Pa gen Telegram",
    failed_load_matches: "Echwe pou chaje match yo.",
    loading_requests: "Ap chaje demann…",
    no_fish_jobs_provider: "Poko gen fish jobs.<br>Yo parèt isit lè yon Pwason matche avèk ou.<br>Mande yon moun konekte kòm Pwason epi glise adwat!",
    wants: "Vle:",
    confirm_unlock: "🔒 Konfime pou debloke kontak",
    confirm: "Konfime",
    confirm_service: "Konfime Sèvis",
    done: "Fini ✓",
    failed_load_requests: "Echwe pou chaje demann.",
    service_confirmed: "Sèvis konfime! ✓",
    could_not_confirm: "Pa t kapab konfime — eseye ankò",
    swipes_reset: "Swipe resete — bon amizman! ♻",
    could_not_reset: "Pa t kapab resete swipe",
    geolocation_unsupported: "Geolokalizasyon pa sipòte nan navigatè sa a",
    locating: "Ap lokalize…",
    got_it: "Jwenn li",
    location_filled: "Kote ranpli",
    could_not_get_location: "Pa t kapab jwenn kote: {msg}",
    could_not_reload: "Pa t kapab rechaje atè yo",
    status_matched: "Matche",
    status_confirmed: "Konfime",
  },
  by: {
    page_title: "Akvaryumnaja Hazeta",
    gazette_masthead: "AKVARYUMNAJA HAZETA",
    gazette_vol: "TOM I № 1",
    gazette_price: "KOSZT: 10.00$",
    gazette_meta: "Štodzionnyja Ab'javy dla Ryb i Karalavych Apurtunistaŭ",
    classifieds_heading: "SIONNIAŠNIJA SVEŽYJA AB'JAVY",
    auth_tagline: "<strong>Ryby</strong> šukajuć kahoś na čas razam.<br><strong>Karalavyja Apurtunisty</strong> prapanujuć supolnaść i navyki.",
    tab_login: "UVAJSCI",
    tab_register: "REHISTRACOJA",
    fish: "Ryba",
    coral_opportunist: "Karalavy Apurtunist",
    select_account: "VIBARYCE AKAŬNT",
    enter_aquarium: "UVAJSCI ŭ AKVARYUM",
    name: "Imia",
    city: "Horad",
    phone: "Telefon",
    age: "Uzrost",
    nationality: "Nacyjanalnaść",
    gender: "Pol",
    gender_neutral: "Niejtralny / Nie žadaju kazać",
    gender_female: "Žanočaja",
    gender_male: "Mužčynskaja",
    bio_ator_label: "Mai navyki fish job (bio)",
    bio_cliente_label: "Maja zapyt fish job (bio)",
    bio_ator_placeholder: "Apišy, jakija fish jobs možaš",
    bio_cliente_placeholder: "Apišy fish job, jakija treba",
    telegram_label: "Telegram karystaŭnik",
    telegram_hint: "(bez @)",
    telegram_placeholder: "vash_karystaŭnik",
    geo_btn: "Vykarystać mału lakacyju",
    latitude: "Šyrata",
    lat_hint: "(napr. 38.7169)",
    longitude: "Daŭža",
    lon_hint: "(napr. -9.1399)",
    name_placeholder: "Poŭnae imia",
    city_placeholder: "napr. Lisabon",
    phone_placeholder: "+351 900 000 000",
    age_placeholder: "Uzrost",
    nationality_placeholder: "napr. Partugalski",
    create_account: "STVARYCI AKAŬNT",
    logout: "Vyjści",
    role_fish: "Ty <strong>Ryba</strong> — prahładaj, kab znajści Karalavaha Apurtunistu.",
    role_ator: "Ty <strong>Karalavy Apurtunist</strong> — prymalaj fish jobs ad Ryb nižej.",
    seg_fish_title: "Režym Ryba tolki dla akaŭntaŭ Ryba",
    seg_ator_title: "Režym Apurtunist tolki dla akaŭntaŭ Apurtunist",
    search_radius: "Radius Pošuku",
    km_unit: "km",
    km_away: "{n} km dalek",
    yrs: "hod",
    pass: "Praści",
    like: "Padruch",
    no_ator_nearby: "Nema Karalavych Apurtunistaŭ pablizu",
    end_sub: "Pasiaruj radius abo skini svajy swipy",
    reset_swipes: "Skinuć swipy",
    your_fish_jobs: "Tvai Fish Jobs",
    incoming_fish_jobs: "Uchodnyja Fish Jobs",
    discover: "Adkryć",
    nav_matches: "Mai Fish Jobs",
    match_title: "Fish Job Supaŭ!",
    continue_btn: "Dalej",
    location: "LAKACIOJA",
    location_km: "{n} km dalek",
    location_unavailable: "nie dastupna",
    label_age: "UZROST",
    label_nationality: "NACYJANALNAŚĆ",
    label_what_i_can_do: "ŠTO MOŽU",
    no_description: "Niama apisu.",
    available: "Dastupny",
    loading_classifieds: "ZAŬANTAŽVANNE AB'JAV...",
    no_companions: "SIONNIA NIAMA SUPOLNIKAŬ.",
    could_not_load_classifieds: "NEMOŽNA ZAŬANTAŽIĆ AB'JAVY.",
    loading: "Zaŭantazvannie…",
    could_not_load: "— nemožna zaŭantazić —",
    please_select_account: "Kali łaska, vybiery akaŭnt",
    name_city_phone_required: "Imia, horad i telefon abaviazkovyja",
    age_nat_required: "Uzrost i nacyjanalnaść abaviazkovyja dla Apurtunistaŭ",
    registration_failed: "Rehistracyja nie ŭdalaś — pasprabuj znoŭ",
    liked: "Padruch ✓",
    passed: "Praščana ✕",
    could_not_save_swipe: "Nemožna zachavać swipe",
    match_sub: "{name} prymiaŭ tvoj fish job!",
    order_num: "Zamova #{n}",
    no_fish_jobs_swipe: "Paki što niama fish jobs — pracuładaj dalej!",
    no_telegram: "Telegram nie ustalyavany",
    failed_load_matches: "Nie ŭdalosia zaŭantazić supaŭnienni.",
    loading_requests: "Zaŭantazvannie zapitaŭ…",
    no_fish_jobs_provider: "Paki što niama fish jobs.<br>Zjavljajucca, kali Ryba supaŭaje z taboj.<br>Papraš kahoś uvajsci jak Ryba i prahladzie naprava!",
    wants: "Chače:",
    confirm_unlock: "🔒 Paćvierdzi, kab adkryć kontakt",
    confirm: "Paćvierdzić",
    confirm_service: "Paćvierdzić Słužbu",
    done: "Hota ✓",
    failed_load_requests: "Nie ŭdalosia zaŭantazić zapity.",
    service_confirmed: "Słužba paćvierdžana! ✓",
    could_not_confirm: "Nemožna paćvierdzić — pasprabuj znoŭ",
    swipes_reset: "Swipy skinutyja — pasipraj! ♻",
    could_not_reset: "Nemožna skinuć swipy",
    geolocation_unsupported: "Gealakacyja nie padtrymvajecca",
    locating: "Vyznačannie…",
    got_it: "Atrymana",
    location_filled: "Lakacyja zapoŭnienaja",
    could_not_get_location: "Nemožna atrymać lakacyju: {msg}",
    could_not_reload: "Nemožna pierazahruzić ataraŭ",
    status_matched: "Supaŭ",
    status_confirmed: "Paćvierdžana",
  },
};

function t(key, vars = {}) {
  let str = translations[currentLang]?.[key] ?? translations.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replaceAll(`{${k}}`, String(v));
  }
  return str;
}

function syncLangSwitchers() {
  document.querySelectorAll(".lang-switcher .lang-btn").forEach((btn) => {
    btn.classList.toggle("lang-active", btn.dataset.lang === currentLang);
  });
}

function updateRoleBanner() {
  if (!loggedUser) return;
  const banner = document.getElementById("role-info-text");
  if (!banner) return;
  banner.innerHTML = loggedUser.type === "ator" ? t("role_ator") : t("role_fish");
  const segCustomer = document.getElementById("seg-customer");
  const segProvider = document.getElementById("seg-provider");
  if (segCustomer) segCustomer.title = loggedUser.type === "ator" ? t("seg_fish_title") : "";
  if (segProvider) segProvider.title = loggedUser.type !== "ator" ? t("seg_ator_title") : "";
}

function updateLanguageUI() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
    if (el.hasAttribute("aria-label")) el.setAttribute("aria-label", t(el.dataset.i18nTitle));
  });
  document.querySelectorAll("select option[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.title = t("page_title");
  updateRoleBanner();
}

function refreshClassifiedsFeed() {
  const feed = document.getElementById("classifieds-feed");
  if (!feed) return;
  const items = [...feed.querySelectorAll(".classified-item")];
  if (!items.length) return;
  feed.innerHTML = "";
  items.forEach((item) => {
    const id = parseInt(item.dataset.atorId, 10);
    const actor = gazetteActors.find((a) => a.id_ator === id);
    if (actor) feed.appendChild(buildFeedItem(actor));
  });
}

function refreshDynamicContent() {
  refreshClassifiedsFeed();
  if (!loggedUser) return;
  const card = document.getElementById("swipe-card");
  if (card && !card.classList.contains("hidden") && currentIdx < actorQueue.length) {
    renderCurrentCard();
  }
  if (activeMode === "customer" && customerView === "matches") loadMatches();
  if (activeMode === "provider") loadProviderRequests();
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === "by" ? "be-Latn" : lang;
  syncLangSwitchers();
  updateLanguageUI();
  refreshDynamicContent();
}

function initI18n() {
  syncLangSwitchers();
  updateLanguageUI();
}

let loggedUser  = null;

let loginType = "cliente";   
let regType   = "cliente";   

let actorQueue   = [];
let currentIdx   = 0;
let activeMode   = "customer";
let customerView = "swipe";

async function apiFetch(path, opts = {}) {
  const r = await fetch(API_BASE + path, opts);
  const ct = r.headers.get("content-type") || "";
  if (!r.ok) throw new Error(`${opts.method || "GET"} ${path} → ${r.status}`);
  if (!ct.includes("application/json")) {
    throw new Error(`Expected JSON from ${path}`);
  }
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

function switchAuthTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("tab-login").classList.toggle("auth-tab-active",    isLogin);
  document.getElementById("tab-register").classList.toggle("auth-tab-active", !isLogin);
  document.getElementById("auth-login").classList.toggle("hidden",    !isLogin);
  document.getElementById("auth-register").classList.toggle("hidden",  isLogin);
}

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
  select.innerHTML = `<option value="">${t("loading")}</option>`;
  try {
    if (!_allClientes.length) _allClientes = await apiGetClientes();
    if (!_allAtores.length)   _allAtores   = await apiGetAtores();

    const list = loginType === "cliente" ? _allClientes : _allAtores;
    const idField = loginType === "cliente" ? "id_cliente" : "id_ator";

    select.innerHTML = list
      .map(u => `<option value="${u[idField]}">${u.nome}</option>`)
      .join("");
  } catch {
    select.innerHTML = `<option value="">${t("could_not_load")}</option>`;
  }
}

function doLogin() {
  const select = document.getElementById("login-select");
  const id = parseInt(select.value);
  if (!id) { showToast(t("please_select_account")); return; }
  const nome = select.options[select.selectedIndex].text;
  _saveUser({ id, nome, type: loginType });
}

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
    showToast(t("name_city_phone_required"));
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
      if (!idade || !nacionalidade) { showToast(t("age_nat_required")); return; }
      created = await apiCreateAtor({ nome, idade, nacionalidade, genero, bio, latitude: lat, longitude: lon, telegram });
      _allAtores   = [];
      _allClientes = [];
      _saveUser({ id: created.id_ator, nome: created.nome, type: "ator" });
    }
  } catch (err) {
    console.error("[Register]", err);
    showToast(t("registration_failed"));
  }
}

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
  if (ambientTimer) {
    clearInterval(ambientTimer);
    ambientTimer = null;
  }
  const layer = document.getElementById("ambient-bg");
  if (layer) layer.innerHTML = "";
  feedCycleIdx = 0;
  feedScrollBound = false;
  const feed = document.getElementById("classifieds-feed");
  if (feed) feed.innerHTML = "";
  window.location.href = "/";
}

async function enterApp() {
  document.getElementById("landing-view")?.classList.add("hidden");
  document.getElementById("ambient-bg")?.classList.remove("hidden");
  document.getElementById("app-view").classList.remove("hidden");
  document.body.classList.remove("landing-mode");
  document.body.classList.add("app-mode");
  if (history.replaceState) history.replaceState(null, "", "/aquarium");
  document.getElementById("user-chip").textContent = loggedUser.nome;

  await ensureActorsLoaded();
  startAmbientStream();

  const isAtor = loggedUser.type === "ator";

  
  const segCustomer = document.getElementById("seg-customer");
  const segProvider = document.getElementById("seg-provider");
  segCustomer.disabled = isAtor;
  segProvider.disabled = !isAtor;
  updateRoleBanner();

  const defaultMode = isAtor ? "provider" : "customer";
  setSegment(defaultMode);
  if (defaultMode === "customer") await reloadActors();
}

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
    showToast(t("could_not_reload"));
  }
}

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
    `${actor.idade ?? "?"} ${t("yrs")} · ${actor.nacionalidade ?? "—"}`;
  document.getElementById("actor-bio").textContent  = actor.bio || "";

  
  const distEl = document.getElementById("actor-distance");
  if (actor.distancia_km != null) {
    distEl.textContent = t("km_away", { n: actor.distancia_km });
    distEl.classList.remove("hidden");
  } else {
    distEl.classList.add("hidden");
  }

  
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

async function handleSwipe(direction) {
  if (currentIdx >= actorQueue.length) return;
  const actor = actorQueue[currentIdx];
  const card  = document.getElementById("swipe-card");

  card.classList.add(direction === "like" ? "exit-right" : "exit-left");

  try {
    const result = await apiPostSwipe(actor.id_ator, direction);
    if (result.matched) showMatchOverlay(actor, result.id_pedido);
    else showToast(direction === "like" ? t("liked") : t("passed"), 900);
  } catch (err) {
    console.error("[Swipe]", err);
    showToast(t("could_not_save_swipe"));
  }

  await new Promise(r => setTimeout(r, 300));
  currentIdx++;
  renderCurrentCard();
}

function showMatchOverlay(actor, id_pedido) {
  const overlay  = document.getElementById("match-overlay");
  const avatarEl = document.getElementById("match-avatar-lg");
  const subText  = document.getElementById("match-sub-text");

  avatarEl.style.backgroundImage = actor.avatar_url ? `url('${actor.avatar_url}')` : "";
  avatarEl.classList.toggle("has-image", !!actor.avatar_url);
  subText.textContent = t("match_sub", { name: actor.nome })
    + (id_pedido ? ` · ${t("order_num", { n: id_pedido })}` : "");
  overlay.classList.remove("hidden");
}

function closeMatchOverlay() {
  document.getElementById("match-overlay").classList.add("hidden");
}

async function loadMatches() {
  const list = document.getElementById("matches-list");
  list.innerHTML = `<li class="list-placeholder">${t("loading")}</li>`;
  try {
    const matches = await apiGetMatches();
    if (!matches.length) {
      list.innerHTML = `<li class="list-placeholder">${t("no_fish_jobs_swipe")}</li>`;
      return;
    }
    list.innerHTML = matches.map(m => {
      const avatarStyle = m.avatar_url ? `background-image:url('${m.avatar_url}')` : "";
      const tgHtml = m.telegram
        ? `<a class="telegram-link" href="https://t.me/${m.telegram}" target="_blank" rel="noopener">
             <span class="tg-icon">✈</span>@${m.telegram}
           </a>`
        : `<span class="no-telegram">${t("no_telegram")}</span>`;
      return `
        <li class="match-item">
          <div class="match-avatar ${m.avatar_url ? "has-image" : ""}" style="${avatarStyle}"></div>
          <div class="match-info">
            <span class="match-name">${m.nome ?? "—"}</span>
            <span class="match-meta">${m.idade ?? "?"} ${t("yrs")} · ${m.nacionalidade ?? "—"}</span>
            ${tgHtml}
          </div>
        </li>`;
    }).join("");
  } catch (err) {
    list.innerHTML = `<li class="list-placeholder list-error">${t("failed_load_matches")}</li>`;
  }
}

async function loadProviderRequests() {
  const list = document.getElementById("requests-list");
  list.innerHTML = `<li class="list-placeholder">${t("loading_requests")}</li>`;
  try {
    const requests = await apiGetRequests();
    if (!requests.length) {
      list.innerHTML = `<li class="list-placeholder">${t("no_fish_jobs_provider")}</li>`;
      return;
    }
    list.innerHTML = requests.map(req => {
      const c = req.cliente;
      const statusClass  = req.status === "Confirmed" ? "badge-confirmed" : "badge-matched";
      const isConfirmed  = req.status === "Confirmed";
      const statusLabel = req.status === "Confirmed" ? t("status_confirmed") : t("status_matched");
      const clienteBio   = c?.bio
        ? `<p class="request-bio"><em>${t("wants")}</em> ${c.bio}</p>` : "";
      const contactHtml  = isConfirmed
        ? (c?.telegram
            ? `<a class="telegram-link" href="https://t.me/${c.telegram}" target="_blank" rel="noopener">
                 <span class="tg-icon">✈</span>@${c.telegram}
               </a>`
            : `<span class="no-telegram">${t("no_telegram")}</span>`)
        : `<span class="contact-locked">${t("confirm_unlock")}</span>`;
      return `
        <li class="request-item" id="req-${req.id_pedido}">
          <div class="request-info">
            <div class="request-header">
              <span class="request-name">${c?.nome ?? "—"}</span>
              <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            ${clienteBio}
            ${contactHtml}
          </div>
          <button class="confirm-btn" ${isConfirmed ? "disabled" : ""} onclick="confirmService(${req.id_pedido})">
            ${isConfirmed ? t("done") : t("confirm")}
          </button>
        </li>`;
    }).join("");
  } catch (err) {
    console.error("[Provider]", err);
    list.innerHTML = `<li class="list-placeholder list-error">${t("failed_load_requests")}</li>`;
  }
}

async function confirmService(id_pedido) {
  try {
    await apiConfirmPedido(id_pedido);
    showToast(t("service_confirmed"), 1600);
    loadProviderRequests();
  } catch (err) {
    showToast(t("could_not_confirm"));
  }
}

async function resetSwipes() {
  try {
    await apiFetch(`/api/swipes/reset?id_cliente=${_clienteId()}`, { method: "DELETE" });
    showToast(t("swipes_reset"), 1600);
    await reloadActors();
  } catch (err) {
    console.error("[Reset]", err);
    showToast(t("could_not_reset"));
  }
}

function fillBrowserLocation() {
  if (!navigator.geolocation) {
    showToast(t("geolocation_unsupported"));
    return;
  }
  const btn = document.getElementById("geo-btn");
  if (btn) { btn.textContent = t("locating"); btn.disabled = true; }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      document.getElementById("reg-lat").value = pos.coords.latitude.toFixed(6);
      document.getElementById("reg-lon").value = pos.coords.longitude.toFixed(6);
      if (btn) { btn.textContent = t("got_it"); btn.disabled = false; }
      showToast(t("location_filled"), 1400);
    },
    (err) => {
      if (btn) { btn.textContent = t("geo_btn"); btn.disabled = false; }
      showToast(t("could_not_get_location", { msg: err.message }), 2500);
    },
    { enableHighAccuracy: true, timeout: 8000 },
  );
}

const GAZETTE_REF_LAT = 38.7169;
const GAZETTE_REF_LON = -9.1399;

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function gazetteHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const p1 = toRad(lat1);
  const p2 = toRad(lat2);
  const dp = toRad(lat2 - lat1);
  const dl = toRad(lon2 - lon1);
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatGazetteLocation(actor) {
  if (actor.distancia_km != null) {
    return `${t("location")}: ${t("location_km", { n: actor.distancia_km })}`;
  }
  if (actor.latitude != null && actor.longitude != null) {
    const km = gazetteHaversineKm(GAZETTE_REF_LAT, GAZETTE_REF_LON, actor.latitude, actor.longitude);
    return `${t("location")}: ${t("location_km", { n: km.toFixed(1) })}`;
  }
  return `${t("location")}: ${t("location_unavailable")}`;
}

function showLandingView() {
  document.getElementById("landing-view")?.classList.remove("hidden");
  document.getElementById("ambient-bg")?.classList.remove("hidden");
  document.getElementById("app-view")?.classList.add("hidden");
  document.body.classList.remove("app-mode");
  document.body.classList.add("landing-mode");
  if (history.replaceState) history.replaceState(null, "", "/");

  const feed = document.getElementById("classifieds-feed");
  if (!gazetteActors.length) {
    initLandingPage();
  } else {
    startAmbientStream();
    if (feed && !feed.querySelector(".classified-item")) {
      feedCycleIdx = 0;
      appendFeedBatch(gazetteActors.length);
      setupFeedInfiniteScroll();
    }
  }
}

function focusAuthForm() {
  const authCard = document.getElementById("auth-card");
  if (authCard) {
    authCard.scrollIntoView({ behavior: "smooth", block: "center" });
    authCard.classList.remove("auth-flash");
    void authCard.offsetWidth;
    authCard.classList.add("auth-flash");
  }
}

function buildAmbientCard(actor) {
  const card = document.createElement("div");
  card.className = "ambient-card";
  card.style.top = `${Math.random() * 88}%`;
  card.style.left = `${Math.random() * 82}%`;
  card.style.animationDuration = `${12 + Math.random() * 16}s`;
  card.style.animationDelay = `${-(Math.random() * 12)}s`;
  card.style.setProperty("--dx", `${(Math.random() * 50 - 25).toFixed(0)}px`);
  card.style.setProperty("--dy", `${(Math.random() * 40 - 20).toFixed(0)}px`);
  card.innerHTML = `
    <p class="ambient-name">${escapeHtml(actor.nome)}</p>
    <p>${escapeHtml((actor.bio || t("available")).slice(0, 48))}</p>
  `;
  if (document.body.classList.contains("landing-mode")) {
    card.addEventListener("click", focusAuthForm);
  }
  return card;
}

function buildFeedItem(actor) {
  const item = document.createElement("article");
  item.className = "classified-item";
  item.dataset.atorId = actor.id_ator;
  item.innerHTML = `
    <p class="classified-line classified-name">${escapeHtml(actor.nome)}</p>
    <p class="classified-line">${t("label_age")}: ${escapeHtml(actor.idade)} · ${t("label_nationality")}: ${escapeHtml(actor.nacionalidade)}</p>
    <p class="classified-line">${t("label_what_i_can_do")}: ${escapeHtml(actor.bio || t("no_description"))}</p>
    <p class="classified-line classified-loc">${formatGazetteLocation(actor)}</p>
  `;
  item.addEventListener("click", focusAuthForm);
  return item;
}

let gazetteActors = [];
let feedCycleIdx = 0;
let feedLoading = false;
let feedScrollBound = false;
let ambientTimer = null;

async function ensureActorsLoaded() {
  if (gazetteActors.length) return;
  gazetteActors = await apiGetAtores();
}

function appendFeedBatch(count) {
  const feed = document.getElementById("classifieds-feed");
  if (!feed || !gazetteActors.length) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const actor = gazetteActors[feedCycleIdx % gazetteActors.length];
    feedCycleIdx += 1;
    frag.appendChild(buildFeedItem(actor));
  }
  feed.appendChild(frag);
}

function setupFeedInfiniteScroll() {
  if (feedScrollBound) return;
  feedScrollBound = true;
  const sentinel = document.getElementById("classifieds-sentinel");
  const loadMore = () => {
    if (feedLoading || !gazetteActors.length) return;
    feedLoading = true;
    appendFeedBatch(gazetteActors.length);
    requestAnimationFrame(() => { feedLoading = false; });
  };
  if (sentinel) {
    new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { root: null, rootMargin: "200px", threshold: 0 },
    ).observe(sentinel);
  }
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) loadMore();
  }, { passive: true });
}

function populateAmbientCards(count) {
  const layer = document.getElementById("ambient-bg");
  if (!layer || !gazetteActors.length) return;
  const maxCards = 36;
  while (layer.children.length >= maxCards) {
    layer.removeChild(layer.firstElementChild);
  }
  for (let i = 0; i < count; i++) {
    const actor = gazetteActors[Math.floor(Math.random() * gazetteActors.length)];
    layer.appendChild(buildAmbientCard(actor));
  }
}

function startAmbientStream() {
  if (ambientTimer) return;
  populateAmbientCards(Math.min(gazetteActors.length, 16));
  ambientTimer = setInterval(() => populateAmbientCards(3), 3500);
}

async function initLandingPage() {
  const feed = document.getElementById("classifieds-feed");
  if (!feed) return;
  feed.innerHTML = `<p class="classified-status">${t("loading_classifieds")}</p>`;

  try {
    await ensureActorsLoaded();
    feed.innerHTML = "";
    if (!gazetteActors.length) {
      feed.innerHTML = `<p class="classified-status">${t("no_companions")}</p>`;
      return;
    }
    feedCycleIdx = 0;
    appendFeedBatch(gazetteActors.length);
    setupFeedInfiniteScroll();
    startAmbientStream();
  } catch (err) {
    console.error("[Landing]", err);
    feed.innerHTML = `<p class="classified-status">${t("could_not_load_classifieds")}</p>`;
  }
}

function bootstrapApp() {
  initI18n();

  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const stored = localStorage.getItem(LS_KEY);
  let user = null;

  if (stored) {
    try {
      user = JSON.parse(stored);
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  }

  if (path === "/aquarium") {
    if (user) {
      loggedUser = user;
      enterApp();
    } else {
      window.location.replace("/");
    }
    return;
  }

  if (user) {
    loggedUser = user;
    window.location.replace("/aquarium");
    return;
  }

  showLandingView();
  populateLoginSelect();
}

document.addEventListener("DOMContentLoaded", bootstrapApp);
