const RANKS = {
  'A': 'Administrator (5 max)',
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

const TYPE_CODES = {
  'G': 'Ground',
  'A': 'Aerial',
  'U': 'Water',
  'XU': 'Experimental'
};

const ITEM_CLASSES = {
  'SAFE': { disruption: '1 // DARK', risk: '1 // NOTICE', cls: 'acs-safe' },
  'EUCLID': { disruption: '2 // VLAM', risk: '2 // CAUTION', cls: 'acs-euclid' },
  'KETER': { disruption: '4 // EKHI', risk: '4 // DANGER', cls: 'acs-keter' },
  'THAUMIEL': { disruption: '3 // KENEQ', risk: '2 // CAUTION', cls: 'acs-thaumiel' },
  'APOLLYON': { disruption: '5 // AMIDA', risk: '5 // CRITICAL', cls: 'acs-apollyon' },
  'DECOMMISSIONED': { disruption: '0 // NONE', risk: '0 // NEUTRALIZED', cls: 'acs-decommissioned' }
};

const ADMINS = {
  'A-R-C-108-0980-4769': 'Pratesh (Chief Administrator)'
};

const INITIAL_PROJECTS = [
  {
    code: 'R-G-001',
    name: 'Victorious ROV (V-ROV)',
    type: 'Ground ROV',
    status: 'ACTIVE',
    itemClass: 'EUCLID',
    desc: 'Ground rover with ultrasonic obstacle avoidance, I2C LCD telemetry, IR control, and river water-level monitoring (N/A until deployed).'
  },
  {
    code: 'R-A-002',
    name: 'Dual-Drone Payload Carrier',
    type: 'Aerial System',
    status: 'FIELD TESTING',
    itemClass: 'SAFE',
    desc: 'Two 100g carrier drones lifting a 70g payload module.'
  },
  {
    code: 'R-XU-003',
    name: 'Pneumatic Glider Launcher',
    type: 'Experimental',
    status: 'RESEARCH ACS',
    itemClass: 'EUCLID',
    desc: 'Water-pressurized launch system with gliding telemetry payload.'
  },
  {
    code: 'W-S-004',
    name: 'Omnihouse Solar Lighting',
    type: 'Society Welfare',
    status: 'ACTIVE',
    itemClass: 'SAFE',
    desc: 'Microcontroller-free LDR solar lighting for Shri Krishna Heights.'
  }
];

let projects = JSON.parse(localStorage.getItem('rdia_projects_clean')) || [...INITIAL_PROJECTS];

const RESEARCH_OBJECTS = [
  { id: 'OBJ-001', name: 'HC-SR04 Ultrasonic Sensor', cat: 'SENSORS', status: 'READY', desc: 'Measures obstacle distance for V-ROV [R-G-001].' },
  { id: 'OBJ-002', name: 'I2C 1602 LCD Module', cat: 'MODULES', status: 'ONLINE', desc: 'Displays live V-ROV status and N/A river feed.' },
  { id: 'OBJ-003', name: 'L298N Motor Driver', cat: 'MODULES', status: 'VERIFIED', desc: 'Controls differential drive motors on V-ROV.' },
  { id: 'OBJ-004', name: 'LDR Solar Switch Board', cat: 'PROTOTYPES', status: 'ACTIVE', desc: 'Pure-hardware dusk-to-dawn society light circuit.' }
];

function renderProjects(filter = 'ALL') {
  const grid = document.getElementById('projects-grid');
  const list = filter === 'ALL' ? projects : projects.filter(p => p.status === filter);
  grid.innerHTML = list.map(p => {
    const ic = ITEM_CLASSES[p.itemClass] || ITEM_CLASSES['SAFE'];
    return `
      <div class="glass-card rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="font-mono text-xs font-bold text-cyan-400">${p.code}</span>
            <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded ${ic.cls}">${p.itemClass}</span>
          </div>
          <h3 class="text-xl font-bold text-white">${p.name}</h3>
          <p class="font-mono text-xs text-slate-400 mt-1 mb-3">${p.type} • ${p.status}</p>
          <p class="text-sm text-slate-300 leading-relaxed mb-5">${p.desc}</p>
        </div>
        <button onclick="openDossier('${p.code}')" class="font-mono text-xs text-cyan-400 hover:underline text-left">
          OPEN ACS DOSSIER &rarr;
        </button>
      </div>
    `;
  }).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.className = 'filter-btn font-mono text-xs px-3 py-2 rounded-lg bg-slatepanel border border-slateborder text-slate-300';
    });
    btn.className = 'filter-btn font-mono text-xs px-3 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold';
    renderProjects(btn.dataset.filter);
  });
});

window.openDossier = function(code) {
  const p = projects.find(x => x.code === code);
  if (!p) return;
  const ic = ITEM_CLASSES[p.itemClass] || ITEM_CLASSES['SAFE'];
  document.getElementById('dossier-body').innerHTML = `
    <div class="font-mono text-xs text-cyan-400 mb-1">${p.code} • ${p.status}</div>
    <h3 class="text-2xl font-bold text-white mb-4">${p.name}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs mb-4">
      <div class="p-2.5 rounded font-bold ${ic.cls}">ITEM CLASS: ${p.itemClass}</div>
      <div class="p-2.5 rounded bg-obsidian border border-slateborder">DISRUPTION: ${ic.disruption}</div>
      <div class="p-2.5 rounded bg-obsidian border border-slateborder">RISK: ${ic.risk}</div>
    </div>
    <p class="text-xs font-mono text-slate-400 mb-2">TYPE: ${p.type}</p>
    <p class="text-sm text-slate-300 leading-relaxed">${p.desc}</p>
  `;
  const m = document.getElementById('dossier-modal');
  m.classList.remove('hidden');
  m.classList.add('flex');
};

window.closeDossier = function() {
  const m = document.getElementById('dossier-modal');
  m.classList.add('hidden');
  m.classList.remove('flex');
};

// ID Formatting & Parsing
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
  const flat = rest.slice(2, 5);
  const phone = rest.slice(5, 9);
  const uin = rest.slice(9, 13);
  return [rank, branch, wing, flat, phone, uin].filter(Boolean).join('-');
}

idInput.addEventListener('input', e => {
  e.target.value = formatId(e.target.value);
  document.getElementById('login-error').classList.add('hidden');
});

function parseId(val) {
  const m = val.match(/^(A|MX|C|M|m)-([RDILCW])-([A-F])-(\d{3})-(\d{4})-(\d{4})$/);
  if (!m) return null;
  return {
    full: val,
    rank: m[1],
    rankName: RANKS[m[1]],
    branch: m[2],
    branchName: BRANCHES[m[2]],
    wing: m[3],
    flat: m[4],
    phone: m[5],
    uin: m[6]
  };
}

document.getElementById('staff-login-form').addEventListener('submit', e => {
  e.preventDefault();
  const val = idInput.value.trim();
  const parsed = parseId(val);
  const errBox = document.getElementById('login-error');
  const errText = document.getElementById('login-error-text');

  if (!parsed) {
    errText.textContent = 'INVALID ID FORMAT: Use Rank-Branch-Wing(A-F)-Flat(3)-Phone(4)-UIN(4).';
    errBox.classList.remove('hidden');
    return;
  }

  if (parsed.rank === 'A' && !ADMINS[val]) {
    errText.textContent = 'ADMIN CAP (5 MAX): Unregistered Rank [A] ID.';
    errBox.classList.remove('hidden');
    return;
  }

  document.getElementById('dash-id').textContent = parsed.full;
  document.getElementById('dash-name').textContent = ADMINS[val] || `Operative (${parsed.rankName})`;
  document.getElementById('dash-decoded').textContent =
    `Rank: ${parsed.rank} (${parsed.rankName}) • Branch: ${parsed.branch} (${parsed.branchName}) • Wing ${parsed.wing}, Flat ${parsed.flat} • UIN ${parsed.uin}`;

  const addBtn = document.getElementById('btn-open-acs');
  if (parsed.branch === 'R' || parsed.rank === 'A') {
    addBtn.classList.remove('hidden');
  } else {
    addBtn.classList.add('hidden');
  }

  document.getElementById('portal-login-view').classList.add('hidden');
  document.getElementById('portal-dashboard-view').classList.remove('hidden');
  document.getElementById('nav-badge').textContent = `${parsed.rank}-${parsed.branch}-${parsed.wing}-${parsed.flat}`;
  renderObjects('ALL');
});

document.getElementById('logout-btn').addEventListener('click', () => {
  document.getElementById('portal-dashboard-view').classList.add('hidden');
  document.getElementById('portal-login-view').classList.remove('hidden');
  idInput.value = '';
  document.getElementById('nav-badge').textContent = 'STAFF ACCESS';
});

// Research Objects
function renderObjects(cat) {
  const list = cat === 'ALL' ? RESEARCH_OBJECTS : RESEARCH_OBJECTS.filter(o => o.cat === cat);
  document.getElementById('objects-grid').innerHTML = list.map(o => `
    <button type="button" onclick="selectObj('${o.id}')" class="text-left p-3.5 rounded-xl bg-obsidian border border-slateborder hover:border-cyan-400/50 transition">
      <div class="font-mono text-[10px] text-cyan-400">${o.id} • ${o.cat}</div>
      <div class="text-xs font-bold text-white mt-0.5">${o.name}</div>
      <div class="font-mono text-[10px] text-emerald-400 mt-1">${o.status}</div>
    </button>
  `).join('');
}

window.selectObj = function(id) {
  const o = RESEARCH_OBJECTS.find(x => x.id === id);
  if (!o) return;
  document.getElementById('insp-id').textContent = o.id;
  document.getElementById('insp-name').textContent = o.name;
  document.getElementById('insp-status').textContent = o.status;
  document.getElementById('insp-desc').textContent = o.desc;
};

document.querySelectorAll('.obj-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.obj-btn').forEach(b => {
      b.className = 'obj-btn font-mono text-[11px] px-2.5 py-1 rounded bg-obsidian border border-slateborder text-slate-300';
    });
    btn.className = 'obj-btn font-mono text-[11px] px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-bold';
    renderObjects(btn.dataset.obj);
  });
});

// ACS Add Project Modal
const fBranch = document.getElementById('f-branch');
const fType = document.getElementById('f-typecode');
const fSerial = document.getElementById('f-serial');
const fItemClass = document.getElementById('f-itemclass');

function syncPreview() {
  const ser = (fSerial.value.replace(/\D/g, '').slice(0, 3) || '012').padStart(3, '0');
  const code = `${fBranch.value}-${fType.value}-${ser}`;
  const icName = fItemClass.value;
  const ic = ITEM_CLASSES[icName] || ITEM_CLASSES['SAFE'];
  document.getElementById('prev-designation').textContent = code;
  document.getElementById('prev-meta').textContent = `${TYPE_CODES[fType.value]} (${fType.value})`;
  document.getElementById('prev-itemclass').textContent = icName;
  document.getElementById('prev-disruption').textContent = ic.disruption;
  document.getElementById('prev-risk').textContent = ic.risk;
  document.getElementById('prev-itemclass-box').className = `p-2 rounded font-bold ${ic.cls}`;
}

[fBranch, fType, fSerial, fItemClass].forEach(el => {
  el.addEventListener('input', syncPreview);
  el.addEventListener('change', syncPreview);
});

window.openAcsModal = function() {
  fSerial.value = String(projects.length + 1).padStart(3, '0');
  syncPreview();
  const m = document.getElementById('acs-modal');
  m.classList.remove('hidden');
  m.classList.add('flex');
};

window.closeAcsModal = function() {
  const m = document.getElementById('acs-modal');
  m.classList.add('hidden');
  m.classList.remove('flex');
};

document.getElementById('acs-form').addEventListener('submit', e => {
  e.preventDefault();
  const ser = (fSerial.value.replace(/\D/g, '').slice(0, 3) || '012').padStart(3, '0');
  const code = `${fBranch.value}-${fType.value}-${ser}`;
  projects.unshift({
    code,
    name: document.getElementById('f-name').value.trim(),
    type: document.getElementById('f-domain').value.trim(),
    status: 'RESEARCH ACS',
    itemClass: fItemClass.value,
    desc: document.getElementById('f-desc').value.trim()
  });
  localStorage.setItem('rdia_projects_clean', JSON.stringify(projects));
  renderProjects('ALL');
  closeAcsModal();
  e.target.reset();
});

// V-ROV Slider
const slider = document.getElementById('dist-slider');
slider.addEventListener('input', () => {
  const d = slider.value;
  document.getElementById('dist-label').textContent = `${d} cm`;
  document.getElementById('lcd-1').textContent = d < 25 ? `DIST: ${d}cm STOP!` : `DIST: ${d}cm  OK`;
  document.getElementById('lcd-2').textContent = 'RIVER: N/A';
});

renderProjects('ALL');
