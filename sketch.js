const RANKS = {
  'A': 'Administrator (6 max)',
  'MX': 'Moderator',
  'C': 'Co-ordinator',
  'M': 'Manager',
  'm': 'member'
};

const BRANCHES = {
  'R': 'Research',
  'D': 'Development',
  'I': 'Intelligence (incl. Defence)',
  'L': 'Logistics',
  'C': 'Cultural Committee',
  'W': 'Welfare'
};

const PROJECT_TYPES = {
  'G': 'Ground',
  'A': 'Aerial',
  'U': 'Water',
  'XU': 'Experimental',
  'W': 'Welfare / Society'
};

const PROJECT_STATUSES = [
  'ACTIVE',
  'FIELD TESTING',
  'PENDING',
  'INACTIVE',
  'DECOMMISSIONED'
];

const OBJECT_STATUSES = [
  'CALIBRATED',
  'ONLINE',
  'CONTAINED',
  'DEPLOYED',
  'REGISTERED',
  'PENDING',
  'INACTIVE',
  'DECOMMISSIONED'
];

const ITEM_CLASSES = {
  'SAFE': { disruption: '1 // DARK', risk: '1 // NOTICE', cls: 'cls-safe' },
  'EUCLID': { disruption: '2 // VLAM', risk: '2 // CAUTION', cls: 'cls-euclid' },
  'KETER': { disruption: '4 // EKHI', risk: '4 // DANGER', cls: 'cls-keter' },
  'THAUMIEL': { disruption: '3 // KENEQ', risk: '2 // CAUTION', cls: 'cls-thaumiel' },
  'PENDING': { disruption: '0 // UNVERIFIED', risk: '1 // NOTICE', cls: 'cls-pending' },
  'DECOMMISSIONED': { disruption: '0 // NONE', risk: '0 // NEUTRALIZED', cls: 'cls-decommissioned' }
};

const ADMINS = {
  'A-R-C-108-0980-4769': 'Pratesh (Chief Administrator)',
  'A-R-D-104-2346-6769': 'Shreyash (Administrator - Research)',
  'A-I-C-610-2242-3547': 'Shubh/Ayushman (Administrator - Intelligence)',
  'A-L-A-101-9438-7660': 'Utkarsh (Administrator - Logistics)',
  'A-D-C-610-2242-3056': 'Saksham/Abyuday (Administrator - Development)',
  'A-C-C-308-0000-4293': 'Administrator (Cultural Committee)'
};

const INITIAL_PROJECTS = [
  {
    uid: 'proj-1',
    branch: 'R',
    typeCode: 'G',
    serial: '001',
    name: 'Victorious ROV (V-ROV)',
    domain: 'Ground Rover',
    status: 'ACTIVE',
    desc: 'Ground rover with ultrasonic obstacle avoidance, I2C LCD telemetry, IR control, and river water-level monitoring (N/A until deployed).'
  },
  {
    uid: 'proj-2',
    branch: 'R',
    typeCode: 'A',
    serial: '002',
    name: 'Dual-Drone Payload Carrier',
    domain: 'Aerial System',
    status: 'FIELD TESTING',
    desc: 'Two 100g carrier drones lifting a 70g payload module.'
  },
  {
    uid: 'proj-3',
    branch: 'R',
    typeCode: 'XU',
    serial: '003',
    name: 'Pneumatic Glider Launcher',
    domain: 'Experimental',
    status: 'FIELD TESTING',
    desc: 'Water-pressurized launch system with gliding telemetry payload.'
  },
  {
    uid: 'proj-4',
    branch: 'W',
    typeCode: 'W',
    serial: '004',
    name: 'Omnihouse Solar Lighting',
    domain: 'Society Welfare',
    status: 'ACTIVE',
    desc: 'Microcontroller-free LDR solar lighting for Shri Krishna Heights.'
  }
];

const INITIAL_OBJECTS = [
  {
    uid: 'obj-1',
    serial: '001',
    name: 'HC-SR04 Ultrasonic Array',
    cat: 'TERRESTRIAL',
    itemClass: 'SAFE',
    status: 'CALIBRATED',
    desc: '40kHz acoustic distance sensor array mounted on V-ROV [R-G-001] for autonomous obstacle detection.'
  },
  {
    uid: 'obj-2',
    serial: '002',
    name: 'I2C 1602 LCD Telemetry Unit',
    cat: 'TERRESTRIAL',
    itemClass: 'SAFE',
    status: 'ONLINE',
    desc: 'Backlit 16x2 character telemetry screen displaying live ultrasonic distance and N/A river status.'
  },
  {
    uid: 'obj-3',
    serial: '003',
    name: 'Pressurized Pneumatic Booster Core',
    cat: 'UNEXPLAINED',
    itemClass: 'EUCLID',
    status: 'CONTAINED',
    desc: 'High-pressure water-propelled launch vessel requiring barrier clearance during pressurization trials.'
  },
  {
    uid: 'obj-4',
    serial: '004',
    name: 'Pure-Hardware LDR Solar Switch',
    cat: 'EXTRA TERRESTRIAL',
    itemClass: 'SAFE',
    status: 'DEPLOYED',
    desc: 'Zero-MCU photoresistor comparator circuit governing dusk-to-dawn society illumination.'
  }
];

const BRANCH_CARDS = [
  { code: 'R', colorClass: 'text-cyan-400', customStyle: '', title: 'Research', desc: 'Experimental discovery, telemetry research, and classified Research Objects.' },
  { code: 'D', colorClass: 'text-emerald-400', customStyle: '', title: 'Development', desc: 'Building prototypes, circuits, rovers, gliders, and practical society tools.' },
  { code: 'I', colorClass: 'text-indigo-400', customStyle: '', title: 'Intelligence (incl. Defence)', desc: 'Unified intelligence and defence covering safety, monitoring, and situational awareness.' },
  { code: 'L', colorClass: 'text-pink-400', customStyle: '', title: 'Logistics', desc: 'Materials, parts, field readiness, and deployment coordination.' },
  { code: 'C', colorClass: 'text-amber-400', customStyle: '', title: 'Cultural Committee', desc: 'Society events, exhibitions, and community engagement across Wings A–F.' },
  { code: 'W', colorClass: '', customStyle: 'color: #c4b5fd;', title: 'Welfare', desc: 'Resident welfare, sustainable society upgrades, and community support.' }
];

const memoryStore = {};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}

  if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
    return [...memoryStore[key]];
  }

  try {
    if (window.name && window.name.startsWith('RDIA_STATE:')) {
      const parsedName = JSON.parse(window.name.slice('RDIA_STATE:'.length));
      if (parsedName && Array.isArray(parsedName[key])) {
        return parsedName[key];
      }
    }
  } catch (_) {}

  return fallback.map(item => ({ ...item }));
}

function writeStore(key, value) {
  memoryStore[key] = value.map(item => ({ ...item }));
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}

  try {
    let current = {};
    if (window.name && window.name.startsWith('RDIA_STATE:')) {
      current = JSON.parse(window.name.slice('RDIA_STATE:'.length)) || {};
    }
    current[key] = value;
    window.name = 'RDIA_STATE:' + JSON.stringify(current);
  } catch (_) {}
}

function formatProjectCode(p) {
  const ser = String(p.serial || '001').replace(/\D/g, '').slice(0, 3).padStart(3, '0');
  return `${p.branch}-${p.typeCode}-${ser}`;
}

function formatObjectId(o) {
  const ser = String(o.serial || '001').replace(/\D/g, '').slice(0, 3).padStart(3, '0');
  return `OBJ-${ser}`;
}

function getStatusBadgeStyle(status) {
  if (status === 'ACTIVE' || status === 'ONLINE' || status === 'DEPLOYED' || status === 'CALIBRATED') {
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  }
  if (status === 'FIELD TESTING' || status === 'CONTAINED' || status === 'REGISTERED') {
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }
  if (status === 'PENDING') {
    return 'text-purple-300 bg-purple-500/15 border-purple-500/30';
  }
  if (status === 'INACTIVE') {
    return 'text-slate-300 bg-slate-500/15 border-slate-500/30';
  }
  return 'text-red-400 bg-red-500/15 border-red-500/30';
}

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
        entry.target.classList.add('is-visible');
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05, rootMargin: '0px 0px 40px 0px' }
);

function checkVisibleOnScroll() {
  document.querySelectorAll('.reveal-card:not(.is-visible)').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('is-visible');
      cardObserver.unobserve(el);
    }
  });
}

function observeRevealCards(resetVisibility = false) {
  document.querySelectorAll('.reveal-card').forEach((el, idx) => {
    if (resetVisibility) {
      el.classList.remove('is-visible');
    }
    el.style.transitionDelay = `${Math.min(idx * 60, 240)}ms`;
    cardObserver.unobserve(el);
    cardObserver.observe(el);
  });
  requestAnimationFrame(() => checkVisibleOnScroll());
}

window.addEventListener('scroll', checkVisibleOnScroll, { passive: true });
window.addEventListener('resize', checkVisibleOnScroll, { passive: true });

let projects = readStore('rdia_projects_v8', INITIAL_PROJECTS);
let researchObjects = readStore('rdia_objects_v8', INITIAL_OBJECTS);
let currentOperative = null;
let activeProjectFilter = 'ALL';
let activeObjectFilter = 'ALL';
let selectedObjectUid = researchObjects[0] ? researchObjects[0].uid : null;

const app = document.getElementById('app');
app.className = 'bg-[#06090f] text-slate-200 min-h-screen flex flex-col';

app.innerHTML = `
  <header class="sticky top-0 z-40 border-b border-[#1a253a] bg-[#06090f]/95 backdrop-blur">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <button type="button" onclick="showScreen('home')" class="flex items-center gap-3 text-left">
        <div class="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-400">R</div>
        <div>
          <div class="font-mono font-bold text-white text-sm tracking-wider">RDIA</div>
          <div class="font-mono text-[10px] text-slate-400">SHRI KRISHNA HEIGHTS • 421503</div>
        </div>
      </button>
      <nav class="hidden md:flex items-center gap-6 text-sm text-slate-300">
        <button type="button" onclick="showScreen('home')" class="hover:text-cyan-400 transition">Home</button>
        <button type="button" onclick="showScreen('projects')" class="hover:text-cyan-400 transition">Projects</button>
        <button type="button" onclick="showScreen('objects')" class="hover:text-cyan-400 transition">Research Objects</button>
        <button type="button" onclick="showScreen('portal')" class="hover:text-cyan-400 transition">Staff Portal</button>
      </nav>
      <button type="button" onclick="showScreen('portal')" id="nav-badge" class="font-mono text-xs px-3.5 py-2 rounded-lg bg-[#0c121e] border border-[#1a253a] text-cyan-400 hover:border-cyan-500/50 transition">STAFF ACCESS</button>
    </div>
  </header>

  <main class="flex-grow">
    <section id="screen-home" class="py-14 sm:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c121e] border border-[#1a253a] font-mono text-xs text-emerald-400 mb-6">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SHRI KRISHNA HEIGHTS, HENDREPADA, BADLAPUR 421503</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight max-w-4xl mb-6">
            Innovation &amp; Welfare for <span class="text-cyan-400">Societal Progress.</span>
          </h1>
          <p class="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed bg-[#0c121e]/80 border-l-4 border-cyan-500 p-4 rounded-r-lg mb-8">
            "RDIA is an organization for the welfare of apartment complex Shri Krishna Heights, Hendrepada badlapur 421503 we help prduce projects and discover new things this innovation helps us to progress in the development of society"
          </p>
          <div class="flex flex-wrap gap-4">
            <button type="button" onclick="showScreen('projects')" class="px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition">Projects</button>
          </div>
        </div>

        <div>
          <p class="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">// BRANCHES (WINGS A–F)</p>
          <h2 class="text-3xl font-bold text-white mb-6">RDIA Branches</h2>
          <div id="branches-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
        </div>
      </div>
    </section>

    <section id="screen-projects" class="hidden py-14 sm:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1a253a] pb-6">
          <div>
            <p class="font-mono text-xs text-emerald-400 uppercase tracking-widest mb-1">// PROJECTS SCREEN</p>
            <h2 class="text-3xl font-bold text-white">Active RDIA Projects</h2>
          </div>
          <div class="flex flex-wrap gap-2" id="project-filters"></div>
        </div>

        <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

        <div id="project-detail-screen" class="hidden glass-card rounded-2xl p-6 sm:p-8 space-y-4">
          <div class="flex items-center justify-between border-b border-[#1a253a] pb-3">
            <span class="font-mono text-xs text-cyan-400 uppercase">PROJECT BRIEF SCREEN</span>
            <button type="button" onclick="closeProjectDetail()" class="font-mono text-xs px-3 py-1 rounded bg-slate-800 text-slate-300 hover:text-white">BACK TO ALL PROJECTS</button>
          </div>
          <div id="project-detail-body"></div>
        </div>
      </div>
    </section>

    <section id="screen-objects" class="hidden py-14 sm:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1a253a] pb-6">
          <div>
            <p class="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-1">// RESEARCH OBJECTS SCREEN</p>
            <h2 class="text-3xl font-bold text-white">Research Objects Registry</h2>
          </div>
          <div class="flex flex-wrap gap-2" id="obj-filters"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div id="objects-grid" class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
          <div class="glass-card rounded-2xl p-5 space-y-3 h-fit">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] text-cyan-400 uppercase">OBJECT INSPECTOR</span>
              <span id="insp-id" class="font-mono text-xs text-slate-400">OBJ-001</span>
            </div>
            <div id="insp-name" class="text-lg font-bold text-white">HC-SR04 Ultrasonic Array</div>
            <div id="insp-status-badge" class="inline-block font-mono text-[10px] px-2.5 py-1 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/30">CALIBRATED</div>
            <div class="grid grid-cols-1 gap-1.5 font-mono text-[11px]">
              <div id="insp-itemclass" class="px-2.5 py-1.5 rounded font-bold cls-safe">CLASS: SAFE</div>
              <div class="px-2.5 py-1 rounded bg-[#06090f] border border-[#1a253a] text-slate-300">DISRUPTION: <span id="insp-disruption" class="text-emerald-400 font-bold">1 // DARK</span></div>
              <div class="px-2.5 py-1 rounded bg-[#06090f] border border-[#1a253a] text-slate-300">RISK: <span id="insp-risk" class="text-cyan-400 font-bold">1 // NOTICE</span></div>
            </div>
            <p id="insp-desc" class="text-xs text-slate-300 leading-relaxed pt-1">40kHz acoustic distance sensor array mounted on V-ROV [R-G-001] for autonomous obstacle detection.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="screen-portal" class="hidden py-14 sm:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">// STAFF PORTAL SCREEN</p>
        <h2 class="text-3xl font-bold text-white mb-6">Operative ID Access</h2>

        <div id="portal-login-view" class="max-w-xl mx-auto">
          <div class="glass-card rounded-2xl p-6 sm:p-8">
            <form id="staff-login-form" class="space-y-4" autocomplete="off">
              <div>
                <label for="staff-id-input" class="block font-mono text-xs text-slate-400 uppercase mb-2">Enter Operative ID</label>
                <input type="text" id="staff-id-input" maxlength="20" placeholder="Enter Operative ID" autocomplete="off" spellcheck="false" class="w-full font-mono text-base px-4 py-3 rounded-xl bg-[#06090f] border border-[#1a253a] focus:border-cyan-400 text-white placeholder-slate-600 outline-none" />
              </div>
              <div id="login-error" class="hidden p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 font-mono text-xs">
                <span id="login-error-text"></span>
              </div>
              <button type="submit" class="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition">Authenticate &rarr;</button>
            </form>
          </div>
        </div>

        <div id="portal-dashboard-view" class="hidden space-y-6">
          <div class="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="font-mono text-xs text-emerald-400" id="dash-id"></div>
              <h3 class="text-xl font-bold text-white mt-1" id="dash-name"></h3>
              <p class="font-mono text-xs text-slate-400 mt-1" id="dash-decoded"></p>
            </div>
            <div class="flex flex-wrap gap-3">
              <button id="btn-show-create-proj" type="button" onclick="toggleCreatePanel('project')" class="hidden px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold">+ NEW PROJECT SCREEN</button>
              <button id="btn-show-create-obj" type="button" onclick="toggleCreatePanel('object')" class="hidden px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold">+ NEW OBJECT SCREEN</button>
              <button id="logout-btn" type="button" class="px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 font-mono text-xs">LOCK PORTAL</button>
            </div>
          </div>

          <div id="create-project-panel" class="hidden glass-card rounded-2xl p-6 border-emerald-500/40 space-y-4">
            <div class="flex items-center justify-between border-b border-[#1a253a] pb-3">
              <h4 class="font-mono text-sm font-bold text-emerald-400 uppercase">CREATE PROJECT SCREEN</h4>
              <button type="button" onclick="toggleCreatePanel(null)" class="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300">CLOSE</button>
            </div>
            <div class="rounded-xl p-3 bg-[#06090f] border border-[#1a253a] font-mono flex items-center justify-between">
              <span id="prev-proj-code" class="text-base font-extrabold text-emerald-400">R-G-005</span>
              <span id="prev-proj-meta" class="text-xs text-slate-400">Research • Ground</span>
            </div>
            <form id="project-form" class="space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select id="p-branch" class="font-mono text-xs px-3 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white"></select>
                <select id="p-typecode" class="font-mono text-xs px-3 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white"></select>
                <input id="p-serial" type="text" maxlength="3" placeholder="Serial No." required class="font-mono text-xs px-3 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white placeholder-slate-500" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input id="p-name" type="text" placeholder="Project Name" required class="text-xs px-3.5 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white placeholder-slate-500" />
                <input id="p-domain" type="text" placeholder="Domain / Type" required class="text-xs px-3.5 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white placeholder-slate-500" />
                <select id="p-status" class="font-mono text-xs px-3 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white"></select>
              </div>
              <textarea id="p-desc" rows="2" placeholder="Project Description" required class="w-full text-xs px-3.5 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white placeholder-slate-500"></textarea>
              <button type="submit" class="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase">Save Project</button>
            </form>
          </div>

          <div id="create-object-panel" class="hidden glass-card rounded-2xl p-6 border-cyan-500/40 space-y-4">
            <div class="flex items-center justify-between border-b border-[#1a253a] pb-3">
              <h4 class="font-mono text-sm font-bold text-cyan-400 uppercase">CREATE RESEARCH OBJECT SCREEN</h4>
              <button type="button" onclick="toggleCreatePanel(null)" class="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300">CLOSE</button>
            </div>
            <div class="rounded-xl p-3 bg-[#06090f] border border-[#1a253a] font-mono flex flex-wrap items-center justify-between gap-2 text-xs">
              <span id="prev-obj-code" class="text-base font-extrabold text-white">OBJ-005</span>
              <span id="prev-obj-class" class="px-2 py-0.5 rounded font-bold cls-safe">SAFE</span>
              <span id="prev-obj-dr" class="text-slate-300">1 // DARK • 1 // NOTICE</span>
            </div>
            <form id="object-form" class="space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input id="o-serial" type="text" maxlength="3" placeholder="Serial No." required class="font-mono text-xs px-3 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white placeholder-slate-500" />
                <input id="o-name" type="text" placeholder="Object Name" required class="text-xs px-3.5 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white placeholder-slate-500" />
                <select id="o-cat" class="font-mono text-xs px-3 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">
                  <option value="TERRESTRIAL">TERRESTRIAL</option>
                  <option value="EXTRA TERRESTRIAL">EXTRA TERRESTRIAL</option>
                  <option value="UNEXPLAINED">UNEXPLAINED</option>
                </select>
                <select id="o-status" class="font-mono text-xs px-3 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white"></select>
              </div>
              <select id="o-itemclass" class="w-full font-mono text-xs px-3 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white"></select>
              <textarea id="o-desc" rows="2" placeholder="Object Description" required class="w-full text-xs px-3.5 py-2.5 rounded-lg bg-[#06090f] border border-[#1a253a] text-white placeholder-slate-500"></textarea>
              <button type="submit" class="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase">Save Research Object</button>
            </form>
          </div>

          <div id="edit-screen" class="hidden glass-card rounded-2xl p-6 border-amber-400/50 space-y-4">
            <div class="flex items-center justify-between border-b border-[#1a253a] pb-3">
              <h4 id="edit-screen-title" class="font-mono text-sm font-bold text-amber-400 uppercase">EDIT PROPERTY SCREEN</h4>
              <button type="button" onclick="closeEditScreen()" class="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300">CANCEL</button>
            </div>
            <div id="edit-form-container"></div>
          </div>

          <div class="glass-card rounded-2xl p-6">
            <div class="flex items-center justify-between gap-3 mb-4">
              <h4 class="font-mono text-xs font-bold text-emerald-400 uppercase">// PROJECTS REGISTRY &amp; EDITOR</h4>
              <span id="proj-perm-badge" class="font-mono text-[10px] text-slate-400"></span>
            </div>
            <div id="portal-projects-list" class="space-y-3"></div>
          </div>

          <div class="glass-card rounded-2xl p-6">
            <div class="flex items-center justify-between gap-3 mb-4">
              <h4 class="font-mono text-xs font-bold text-cyan-400 uppercase">// RESEARCH OBJECTS REGISTRY &amp; EDITOR</h4>
              <span id="obj-perm-badge" class="font-mono text-[10px] text-slate-400"></span>
            </div>
            <div id="portal-objects-list" class="space-y-3"></div>
          </div>

          <div class="glass-card rounded-2xl p-6">
            <h4 class="font-mono text-xs font-bold text-emerald-400 uppercase mb-3">// V-ROV [R-G-001] I2C TELEMETRY</h4>
            <div class="lcd-screen rounded-lg p-4 font-mono text-sm mb-4">
              <div id="lcd-1">DIST: 120cm  OK</div>
              <div id="lcd-2" class="mt-1">RIVER: N/A</div>
            </div>
            <label class="block font-mono text-xs text-slate-400 mb-1">Ultrasonic Distance: <span id="dist-label" class="text-cyan-400">120 cm</span></label>
            <input id="dist-slider" type="range" min="5" max="300" value="120" class="w-full accent-cyan-400" />
          </div>
        </div>
      </div>
    </section>
  </main>
`;

window.showScreen = function(name) {
  ['home', 'projects', 'objects', 'portal'].forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.classList.toggle('hidden', s !== name);
  });
  if (name === 'projects') {
    renderProjects(activeProjectFilter);
    observeRevealCards(true);
  }
  if (name === 'objects') {
    renderObjects(activeObjectFilter);
    observeRevealCards(true);
  }
  if (name === 'portal' && currentOperative) {
    renderPortalProjects();
    renderPortalObjects();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.getElementById('branches-grid').innerHTML = BRANCH_CARDS.map(b => `
  <button type="button" onclick="showScreen('projects')" class="glass-card rounded-xl p-5 text-left hover:border-cyan-400/60 transition">
    <span class="font-mono text-xs font-bold ${b.colorClass}" style="${b.customStyle}">BRANCH [${b.code}]</span>
    <h3 class="text-lg font-bold text-white mt-1 mb-2">${escapeHtml(b.title)}</h3>
    <p class="text-sm text-slate-400">${escapeHtml(b.desc)}</p>
  </button>
`).join('');

const PROJECT_FILTERS = ['ALL', 'ACTIVE', 'FIELD TESTING', 'PENDING', 'INACTIVE', 'DECOMMISSIONED'];
document.getElementById('project-filters').innerHTML = PROJECT_FILTERS.map((f, i) => `
  <button type="button" data-filter="${f}" class="filter-btn font-mono text-xs px-3 py-2 rounded-lg ${i === 0 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-[#0c121e] border border-[#1a253a] text-slate-300'}">${f}</button>
`).join('');

const OBJ_FILTERS = ['ALL', 'TERRESTRIAL', 'EXTRA TERRESTRIAL', 'UNEXPLAINED'];
document.getElementById('obj-filters').innerHTML = OBJ_FILTERS.map((f, i) => `
  <button type="button" data-obj="${f}" class="obj-btn font-mono text-[11px] px-2.5 py-1 rounded ${i === 0 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-[#06090f] border border-[#1a253a] text-slate-300'}">${f}</button>
`).join('');

document.getElementById('p-branch').innerHTML = Object.entries(BRANCHES).map(([k, v]) => `<option value="${k}">${k} — ${escapeHtml(v)}</option>`).join('');
document.getElementById('p-typecode').innerHTML = Object.entries(PROJECT_TYPES).map(([k, v]) => `<option value="${k}">${k} — ${escapeHtml(v)}</option>`).join('');
document.getElementById('p-status').innerHTML = PROJECT_STATUSES.map(s => `<option value="${s}">${s}</option>`).join('');
document.getElementById('o-status').innerHTML = OBJECT_STATUSES.map(s => `<option value="${s}">${s}</option>`).join('');
document.getElementById('o-itemclass').innerHTML = Object.entries(ITEM_CLASSES).map(([k, v]) => `<option value="${k}">${k} (${escapeHtml(v.disruption.split(' // ')[1])} / ${escapeHtml(v.risk.split(' // ')[1])})</option>`).join('');

function renderProjects(filter = 'ALL') {
  activeProjectFilter = filter;
  const grid = document.getElementById('projects-grid');
  const list = filter === 'ALL' ? projects : projects.filter(p => p.status === filter);
  grid.innerHTML = list.map(p => {
    const code = formatProjectCode(p);
    return `
      <div class="glass-card reveal-card rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded">${escapeHtml(code)}</span>
            <span class="font-mono text-[10px] px-2 py-0.5 rounded border ${getStatusBadgeStyle(p.status)}">${escapeHtml(p.status)}</span>
          </div>
          <h3 class="text-xl font-bold text-white">${escapeHtml(p.name)}</h3>
          <p class="font-mono text-xs text-slate-400 mt-1 mb-3">${escapeHtml(p.domain)}</p>
          <p class="text-sm text-slate-300 leading-relaxed mb-5">${escapeHtml(p.desc)}</p>
        </div>
        <button type="button" onclick="openProjectDetail('${escapeHtml(p.uid)}')" class="font-mono text-xs text-cyan-400 hover:underline text-left">OPEN PROJECT BRIEF &rarr;</button>
      </div>
    `;
  }).join('');
  observeRevealCards(true);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.className = 'filter-btn font-mono text-xs px-3 py-2 rounded-lg bg-[#0c121e] border border-[#1a253a] text-slate-300';
    });
    btn.className = 'filter-btn font-mono text-xs px-3 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold';
    renderProjects(btn.dataset.filter);
  });
});

window.openProjectDetail = function(uid) {
  const p = projects.find(x => x.uid === uid);
  if (!p) return;
  document.getElementById('project-detail-body').innerHTML = `
    <div class="font-mono text-xs text-cyan-400 mb-1">${escapeHtml(formatProjectCode(p))} • ${escapeHtml(p.status)}</div>
    <h3 class="text-2xl font-bold text-white mb-2">${escapeHtml(p.name)}</h3>
    <p class="text-xs font-mono text-slate-400 mb-4">BRANCH: ${escapeHtml(p.branch)} (${escapeHtml(BRANCHES[p.branch] || p.branch)}) • TYPE: ${escapeHtml(p.typeCode)} (${escapeHtml(PROJECT_TYPES[p.typeCode] || p.typeCode)}) • SERIAL: ${escapeHtml(p.serial)}</p>
    <p class="text-xs font-mono text-slate-400 mb-4">DOMAIN: ${escapeHtml(p.domain)}</p>
    <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(p.desc)}</p>
  `;
  document.getElementById('project-detail-screen').classList.remove('hidden');
};

window.closeProjectDetail = function() {
  document.getElementById('project-detail-screen').classList.add('hidden');
};

function canEditAll() {
  return Boolean(currentOperative && (currentOperative.rank === 'MX' || currentOperative.rank === 'A'));
}

window.toggleCreatePanel = function(which) {
  if (!canEditAll()) return;
  document.getElementById('edit-screen').classList.add('hidden');
  const pPanel = document.getElementById('create-project-panel');
  const oPanel = document.getElementById('create-object-panel');
  pPanel.classList.toggle('hidden', which !== 'project');
  oPanel.classList.toggle('hidden', which !== 'object');
  if (which === 'project') {
    document.getElementById('p-serial').value = String(projects.length + 1).padStart(3, '0');
    syncProjectPreview();
  }
  if (which === 'object') {
    document.getElementById('o-serial').value = String(researchObjects.length + 1).padStart(3, '0');
    syncObjectPreview();
  }
};

window.closeEditScreen = function() {
  document.getElementById('edit-screen').classList.add('hidden');
  document.getElementById('edit-form-container').innerHTML = '';
};

window.openEditProject = function(uid) {
  if (!canEditAll()) return;
  const p = projects.find(x => x.uid === uid);
  if (!p) return;
  document.getElementById('create-project-panel').classList.add('hidden');
  document.getElementById('create-object-panel').classList.add('hidden');
  document.getElementById('edit-screen-title').textContent = `EDIT PROJECT // ${formatProjectCode(p)}`;
  document.getElementById('edit-form-container').innerHTML = `
    <form id="edit-project-form" class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">BRANCH</label>
          <select id="ep-branch" class="w-full font-mono text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">
            ${Object.entries(BRANCHES).map(([k, v]) => `<option value="${k}" ${p.branch === k ? 'selected' : ''}>${k} — ${escapeHtml(v)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">TYPE</label>
          <select id="ep-type" class="w-full font-mono text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">
            ${Object.entries(PROJECT_TYPES).map(([k, v]) => `<option value="${k}" ${p.typeCode === k ? 'selected' : ''}>${k} — ${escapeHtml(v)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">SERIAL NO.</label>
          <input id="ep-serial" type="text" maxlength="3" value="${escapeHtml(p.serial)}" required class="w-full font-mono text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white" />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">NAME</label>
          <input id="ep-name" type="text" value="${escapeHtml(p.name)}" required class="w-full text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white" />
        </div>
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">DOMAIN</label>
          <input id="ep-domain" type="text" value="${escapeHtml(p.domain)}" required class="w-full text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white" />
        </div>
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">STATUS</label>
          <select id="ep-status" class="w-full font-mono text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">
            ${PROJECT_STATUSES.map(s => `<option value="${s}" ${p.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
      <div>
        <label class="block font-mono text-[10px] text-slate-400 mb-1">DESCRIPTION</label>
        <textarea id="ep-desc" rows="3" required class="w-full text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">${escapeHtml(p.desc)}</textarea>
      </div>
      <button type="submit" class="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs uppercase">Save Project Changes</button>
    </form>
  `;
  document.getElementById('edit-screen').classList.remove('hidden');

  document.getElementById('edit-project-form').addEventListener('submit', ev => {
    ev.preventDefault();
    p.branch = document.getElementById('ep-branch').value;
    p.typeCode = document.getElementById('ep-type').value;
    p.serial = (document.getElementById('ep-serial').value.replace(/\D/g, '').slice(0, 3) || '001').padStart(3, '0');
    p.name = document.getElementById('ep-name').value.trim();
    p.domain = document.getElementById('ep-domain').value.trim();
    p.status = document.getElementById('ep-status').value;
    p.desc = document.getElementById('ep-desc').value.trim();
    writeStore('rdia_projects_v8', projects);
    renderProjects(activeProjectFilter);
    renderPortalProjects();
    closeEditScreen();
  });
};

window.openEditObject = function(uid) {
  if (!canEditAll()) return;
  const o = researchObjects.find(x => x.uid === uid);
  if (!o) return;
  document.getElementById('create-project-panel').classList.add('hidden');
  document.getElementById('create-object-panel').classList.add('hidden');
  document.getElementById('edit-screen-title').textContent = `EDIT RESEARCH OBJECT // ${formatObjectId(o)}`;
  document.getElementById('edit-form-container').innerHTML = `
    <form id="edit-object-form" class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">SERIAL NO.</label>
          <input id="eo-serial" type="text" maxlength="3" value="${escapeHtml(o.serial)}" required class="w-full font-mono text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white" />
        </div>
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">NAME</label>
          <input id="eo-name" type="text" value="${escapeHtml(o.name)}" required class="w-full text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white" />
        </div>
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">CATEGORY</label>
          <select id="eo-cat" class="w-full font-mono text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">
            <option value="TERRESTRIAL" ${o.cat === 'TERRESTRIAL' ? 'selected' : ''}>TERRESTRIAL</option>
            <option value="EXTRA TERRESTRIAL" ${o.cat === 'EXTRA TERRESTRIAL' ? 'selected' : ''}>EXTRA TERRESTRIAL</option>
            <option value="UNEXPLAINED" ${o.cat === 'UNEXPLAINED' ? 'selected' : ''}>UNEXPLAINED</option>
          </select>
        </div>
        <div>
          <label class="block font-mono text-[10px] text-slate-400 mb-1">STATUS</label>
          <select id="eo-status" class="w-full font-mono text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">
            ${OBJECT_STATUSES.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
      <div>
        <label class="block font-mono text-[10px] text-slate-400 mb-1">CLASS (COUPLED DISRUPTION &amp; RISK)</label>
        <select id="eo-class" class="w-full font-mono text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">
          ${Object.entries(ITEM_CLASSES).map(([k, v]) => `<option value="${k}" ${o.itemClass === k ? 'selected' : ''}>${k} (${escapeHtml(v.disruption)} / ${escapeHtml(v.risk)})</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block font-mono text-[10px] text-slate-400 mb-1">DESCRIPTION</label>
        <textarea id="eo-desc" rows="3" required class="w-full text-xs px-3 py-2 rounded-lg bg-[#06090f] border border-[#1a253a] text-white">${escapeHtml(o.desc)}</textarea>
      </div>
      <button type="submit" class="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs uppercase">Save Object Changes</button>
    </form>
  `;
  document.getElementById('edit-screen').classList.remove('hidden');

  document.getElementById('edit-object-form').addEventListener('submit', ev => {
    ev.preventDefault();
    o.serial = (document.getElementById('eo-serial').value.replace(/\D/g, '').slice(0, 3) || '001').padStart(3, '0');
    o.name = document.getElementById('eo-name').value.trim();
    o.cat = document.getElementById('eo-cat').value;
    o.status = document.getElementById('eo-status').value;
    o.itemClass = document.getElementById('eo-class').value;
    o.desc = document.getElementById('eo-desc').value.trim();
    selectedObjectUid = o.uid;
    writeStore('rdia_objects_v8', researchObjects);
    renderObjects(activeObjectFilter);
    renderPortalObjects();
    closeEditScreen();
  });
};

function renderPortalProjects() {
  const editor = canEditAll();
  document.getElementById('proj-perm-badge').textContent = editor
    ? `FULL EDIT ACCESS (${currentOperative.rank})`
    : 'VIEW ONLY (MX & A CAN EDIT)';

  document.getElementById('portal-projects-list').innerHTML = projects.map(p => `
    <div class="p-3.5 rounded-xl bg-[#06090f] border border-[#1a253a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs font-bold text-cyan-400">${escapeHtml(formatProjectCode(p))}</span>
          <span class="text-sm font-bold text-white">${escapeHtml(p.name)}</span>
          <span class="font-mono text-[10px] px-2 py-0.5 rounded border ${getStatusBadgeStyle(p.status)}">${escapeHtml(p.status)}</span>
        </div>
        <p class="font-mono text-[11px] text-slate-400 mt-0.5">${escapeHtml(p.domain)} • Serial #${escapeHtml(p.serial)}</p>
      </div>
      ${editor ? `
        <button type="button" onclick="openEditProject('${escapeHtml(p.uid)}')" class="font-mono text-xs px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold">EDIT PROPERTIES</button>
      ` : ''}
    </div>
  `).join('');
}

function renderPortalObjects() {
  const editor = canEditAll();
  document.getElementById('obj-perm-badge').textContent = editor
    ? `FULL EDIT ACCESS (${currentOperative.rank})`
    : 'VIEW ONLY (MX & A CAN EDIT)';

  document.getElementById('portal-objects-list').innerHTML = researchObjects.map(o => {
    const ic = ITEM_CLASSES[o.itemClass] || ITEM_CLASSES['SAFE'];
    return `
      <div class="p-3.5 rounded-xl bg-[#06090f] border border-[#1a253a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono text-xs font-bold text-cyan-400">${escapeHtml(formatObjectId(o))}</span>
            <span class="text-sm font-bold text-white">${escapeHtml(o.name)}</span>
            <span class="font-mono text-[9px] font-bold px-2 py-0.5 rounded ${ic.cls}">${escapeHtml(o.itemClass)}</span>
            <span class="font-mono text-[10px] px-2 py-0.5 rounded border ${getStatusBadgeStyle(o.status)}">${escapeHtml(o.status)}</span>
          </div>
          <p class="font-mono text-[11px] text-slate-400 mt-0.5">${escapeHtml(o.cat)} • ${escapeHtml(ic.disruption)} • ${escapeHtml(ic.risk)}</p>
        </div>
        ${editor ? `
          <button type="button" onclick="openEditObject('${escapeHtml(o.uid)}')" class="font-mono text-xs px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold">EDIT PROPERTIES</button>
        ` : ''}
      </div>
    `;
  }).join('');
}

const idInput = document.getElementById('staff-id-input');
function formatId(raw) {
  const clean = raw.replace(/[^A-Za-z0-9]/g, '');
  if (!clean) return '';
  let rank = '', rest = '';
  if (clean.startsWith('MX')) {
    rank = 'MX';
    rest = clean.slice(2);
  } else {
    rank = clean.charAt(0);
    rest = clean.slice(1);
  }
  const branch = rest.slice(0, 1).toUpperCase();
  const wing = rest.slice(1, 2).toUpperCase();
  if (/[A-F]/.test(wing)) {
    const flat = rest.slice(2, 5);
    const phone = rest.slice(5, 9);
    const uin = rest.slice(9, 13);
    return [rank, branch, wing, flat, phone, uin].filter(Boolean).join('-');
  }
  const codeA = rest.slice(1, 4);
  const codeB = rest.slice(4, 8);
  return [rank, branch, codeA, codeB].filter(Boolean).join('-');
}

idInput.addEventListener('input', e => {
  e.target.value = formatId(e.target.value);
  document.getElementById('login-error').classList.add('hidden');
});

function parseId(val) {
  const standard = val.match(/^(A|MX|C|M|m)-([RDILCW])-([A-F])-(\d{3})-(\d{4})-(\d{4})$/);
  if (standard) {
    return {
      full: val,
      rank: standard[1],
      rankName: RANKS[standard[1]],
      branch: standard[2],
      branchName: BRANCHES[standard[2]],
      wing: standard[3],
      flat: standard[4],
      phone: standard[5],
      uin: standard[6]
    };
  }
  const compact = val.match(/^(A|MX|C|M|m)-([RDILCW])-(\d{3})-(\d{4})$/);
  if (compact) {
    return {
      full: val,
      rank: compact[1],
      rankName: RANKS[compact[1]],
      branch: compact[2],
      branchName: BRANCHES[compact[2]],
      wing: 'N/A',
      flat: compact[3],
      phone: 'N/A',
      uin: compact[4]
    };
  }
  return null;
}

function findAdminLabel(idVal) {
  if (Object.prototype.hasOwnProperty.call(ADMINS, idVal)) {
    return ADMINS[idVal];
  }
  const upperVal = idVal.toUpperCase();
  const matchedKey = Object.keys(ADMINS).find(k => k.toUpperCase() === upperVal);
  return matchedKey ? ADMINS[matchedKey] : null;
}

document.getElementById('staff-login-form').addEventListener('submit', e => {
  e.preventDefault();
  const val = idInput.value.trim().toUpperCase();
  const parsed = parseId(val);
  const errBox = document.getElementById('login-error');
  const errText = document.getElementById('login-error-text');

  if (!parsed) {
    errText.textContent = 'ACCESS DENIED: Invalid ID.';
    errBox.classList.remove('hidden');
    return;
  }

  const adminName = findAdminLabel(val);
  if (parsed.rank === 'A' && !adminName) {
    errText.textContent = 'ACCESS DENIED: Administrator limit reached.';
    errBox.classList.remove('hidden');
    return;
  }

  currentOperative = parsed;
  document.getElementById('dash-id').textContent = parsed.full;
  document.getElementById('dash-name').textContent = adminName || `Operative (${parsed.rankName})`;
  document.getElementById('dash-decoded').textContent =
    `Rank: ${parsed.rank} (${parsed.rankName}) • Branch: ${parsed.branch} (${parsed.branchName}) • Wing ${parsed.wing}, Flat ${parsed.flat} • UIN ${parsed.uin}`;

  const showCreate = canEditAll();
  document.getElementById('btn-show-create-proj').classList.toggle('hidden', !showCreate);
  document.getElementById('btn-show-create-obj').classList.toggle('hidden', !showCreate);

  document.getElementById('portal-login-view').classList.add('hidden');
  document.getElementById('portal-dashboard-view').classList.remove('hidden');
  document.getElementById('nav-badge').textContent = `${parsed.rank}-${parsed.branch}-${parsed.flat}`;
  renderPortalProjects();
  renderPortalObjects();
});

document.getElementById('logout-btn').addEventListener('click', () => {
  currentOperative = null;
  closeEditScreen();
  toggleCreatePanel(null);
  document.getElementById('portal-dashboard-view').classList.add('hidden');
  document.getElementById('portal-login-view').classList.remove('hidden');
  idInput.value = '';
  document.getElementById('nav-badge').textContent = 'STAFF ACCESS';
});

function renderObjects(cat = 'ALL') {
  activeObjectFilter = cat;
  const list = cat === 'ALL' ? researchObjects : researchObjects.filter(o => o.cat === cat);
  document.getElementById('objects-grid').innerHTML = list.map(o => {
    const ic = ITEM_CLASSES[o.itemClass] || ITEM_CLASSES['SAFE'];
    return `
      <button type="button" onclick="selectObj('${escapeHtml(o.uid)}')" class="reveal-card text-left p-4 rounded-xl bg-[#06090f] border border-[#1a253a] hover:border-cyan-400/50 transition">
        <div class="flex items-center justify-between gap-2">
          <span class="font-mono text-[10px] text-cyan-400">${escapeHtml(formatObjectId(o))} • ${escapeHtml(o.cat)}</span>
          <span class="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${ic.cls}">${escapeHtml(o.itemClass)}</span>
        </div>
        <div class="text-sm font-bold text-white mt-1">${escapeHtml(o.name)}</div>
        <div class="font-mono text-[10px] mt-1"><span class="px-1.5 py-0.5 rounded border ${getStatusBadgeStyle(o.status)}">${escapeHtml(o.status)}</span></div>
        <div class="font-mono text-[10px] text-slate-400 mt-1.5">${escapeHtml(ic.disruption)} • ${escapeHtml(ic.risk)}</div>
      </button>
    `;
  }).join('');
  if (list.length) {
    const match = list.find(x => x.uid === selectedObjectUid) || list[0];
    selectObj(match.uid);
  }
  observeRevealCards(true);
}

window.selectObj = function(uid) {
  const o = researchObjects.find(x => x.uid === uid);
  if (!o) return;
  selectedObjectUid = uid;
  const ic = ITEM_CLASSES[o.itemClass] || ITEM_CLASSES['SAFE'];
  document.getElementById('insp-id').textContent = `${formatObjectId(o)} • ${o.cat}`;
  document.getElementById('insp-name').textContent = o.name;
  const badge = document.getElementById('insp-status-badge');
  badge.textContent = o.status;
  badge.className = `inline-block font-mono text-[10px] px-2.5 py-1 rounded border ${getStatusBadgeStyle(o.status)}`;
  const icEl = document.getElementById('insp-itemclass');
  icEl.textContent = `CLASS: ${o.itemClass}`;
  icEl.className = `px-2.5 py-1.5 rounded font-bold ${ic.cls}`;
  document.getElementById('insp-disruption').textContent = ic.disruption;
  document.getElementById('insp-risk').textContent = ic.risk;
  document.getElementById('insp-desc').textContent = o.desc;
};

document.querySelectorAll('.obj-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.obj-btn').forEach(b => {
      b.className = 'obj-btn font-mono text-[11px] px-2.5 py-1 rounded bg-[#06090f] border border-[#1a253a] text-slate-300';
    });
    btn.className = 'obj-btn font-mono text-[11px] px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-bold';
    renderObjects(btn.dataset.obj);
  });
});

const pBranch = document.getElementById('p-branch');
const pType = document.getElementById('p-typecode');
const pSerial = document.getElementById('p-serial');

function syncProjectPreview() {
  const ser = (pSerial.value.replace(/\D/g, '').slice(0, 3) || '005').padStart(3, '0');
  document.getElementById('prev-proj-code').textContent = `${pBranch.value}-${pType.value}-${ser}`;
  document.getElementById('prev-proj-meta').textContent = `${BRANCHES[pBranch.value]} • ${PROJECT_TYPES[pType.value]}`;
}

[pBranch, pType, pSerial].forEach(el => {
  el.addEventListener('input', syncProjectPreview);
  el.addEventListener('change', syncProjectPreview);
});

document.getElementById('project-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!canEditAll()) return;
  const ser = (pSerial.value.replace(/\D/g, '').slice(0, 3) || '005').padStart(3, '0');
  projects.unshift({
    uid: `proj-${Date.now()}`,
    branch: pBranch.value,
    typeCode: pType.value,
    serial: ser,
    name: document.getElementById('p-name').value.trim(),
    domain: document.getElementById('p-domain').value.trim(),
    status: document.getElementById('p-status').value,
    desc: document.getElementById('p-desc').value.trim()
  });
  writeStore('rdia_projects_v8', projects);
  renderProjects(activeProjectFilter);
  renderPortalProjects();
  toggleCreatePanel(null);
  e.target.reset();
  syncProjectPreview();
});

const oSerial = document.getElementById('o-serial');
const oItemClass = document.getElementById('o-itemclass');

function syncObjectPreview() {
  const ser = (oSerial.value.replace(/\D/g, '').slice(0, 3) || String(researchObjects.length + 1).padStart(3, '0')).padStart(3, '0');
  const icName = oItemClass.value;
  const ic = ITEM_CLASSES[icName] || ITEM_CLASSES['SAFE'];
  document.getElementById('prev-obj-code').textContent = `OBJ-${ser}`;
  const badge = document.getElementById('prev-obj-class');
  badge.textContent = icName;
  badge.className = `px-2 py-0.5 rounded font-bold ${ic.cls}`;
  document.getElementById('prev-obj-dr').textContent = `${ic.disruption} • ${ic.risk}`;
}

[oSerial, oItemClass].forEach(el => {
  el.addEventListener('input', syncObjectPreview);
  el.addEventListener('change', syncObjectPreview);
});

document.getElementById('object-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!canEditAll()) return;
  const ser = (oSerial.value.replace(/\D/g, '').slice(0, 3) || String(researchObjects.length + 1).padStart(3, '0')).padStart(3, '0');
  const newObj = {
    uid: `obj-${Date.now()}`,
    serial: ser,
    name: document.getElementById('o-name').value.trim(),
    cat: document.getElementById('o-cat').value,
    itemClass: oItemClass.value,
    status: document.getElementById('o-status').value,
    desc: document.getElementById('o-desc').value.trim()
  };
  researchObjects.unshift(newObj);
  selectedObjectUid = newObj.uid;
  writeStore('rdia_objects_v8', researchObjects);
  renderObjects(activeObjectFilter);
  renderPortalObjects();
  toggleCreatePanel(null);
  e.target.reset();
  syncObjectPreview();
});

const slider = document.getElementById('dist-slider');
slider.addEventListener('input', () => {
  const d = Number(slider.value);
  document.getElementById('dist-label').textContent = `${d} cm`;
  document.getElementById('lcd-1').textContent = d < 25 ? `DIST: ${d}cm STOP!` : `DIST: ${d}cm  OK`;
  document.getElementById('lcd-2').textContent = 'RIVER: N/A';
});

syncProjectPreview();
syncObjectPreview();
renderProjects('ALL');
renderObjects('ALL');
