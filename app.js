/* ═══════════════════════════════════════════════
   AZB ATTENDANCE SYSTEM — APPLICATION LOGIC
   Loyola College, Chennai
   Uses localStorage as demo DB (replace with
   Firebase/Supabase in production)
═══════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   DATA STORE (localStorage wrapper)
   In production: swap these functions to call
   your Firebase / Supabase API instead.
────────────────────────────────────────────── */
const DB = {
  get:  (k)    => JSON.parse(localStorage.getItem('azb_' + k) || 'null'),
  set:  (k, v) => localStorage.setItem('azb_' + k, JSON.stringify(v)),
  push: (k, item) => {
    const arr = DB.get(k) || [];
    arr.push(item);
    DB.set(k, arr);
    return item;
  },
  update: (k, id, patch) => {
    const arr = DB.get(k) || [];
    const idx = arr.findIndex(x => x.id === id);
    if (idx >= 0) { arr[idx] = { ...arr[idx], ...patch }; DB.set(k, arr); }
  },
  remove: (k, id) => {
    const arr = (DB.get(k) || []).filter(x => x.id !== id);
    DB.set(k, arr);
  }
};

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

/* ──────────────────────────────────────────────
   SEED DEFAULT DATA (first run only)
────────────────────────────────────────────── */
function seedData() {
  if (DB.get('seeded')) return;

  // Default users
  DB.set('users', [
    { id: 'u1', username: 'admin',  password: 'loyola@admin2025', role: 'admin', fullName: 'Dr. Admin HOD', active: true },
    { id: 'u2', username: 'staff1', password: 'staff@azb1',       role: 'staff', fullName: 'Mr. Staff One',  active: true },
    { id: 'u3', username: 'staff2', password: 'staff@azb2',       role: 'staff', fullName: 'Ms. Staff Two',  active: true }
  ]);

  // Default academic year
  const ay1 = { id: 'ay1', label: '2025–2026', start: '2025-06-15', end: '2026-04-15', active: false };
  const ay2 = { id: 'ay2', label: '2026–2027', start: '2026-06-15', end: '2027-04-15', active: true  };
  DB.set('academic_years', [ay1, ay2]);

  // Sample students
  const students = [
    { id: uid(), deptNo: 'AZB-001', rollNo: '23AZB001', name: 'Aarthi Murugan',      dob: '2004-03-12', classSection: 'I B.Sc. Zoology',        batch: '23-UBZ', ayId: 'ay2', contact: '9876543210', email: 'aarthi@mail.com', father: 'Murugan K',    mother: 'Selvi M',   parentContact: '9876543200' },
    { id: uid(), deptNo: 'AZB-002', rollNo: '23AZB002', name: 'Bharath Raj S',        dob: '2003-07-22', classSection: 'I B.Sc. Zoology',        batch: '23-UBZ', ayId: 'ay2', contact: '9865432109', email: 'bharath@mail.com', father: 'Selvam S',     mother: 'Valli S',   parentContact: '9865432100' },
    { id: uid(), deptNo: 'AZB-003', rollNo: '23AZB003', name: 'Chitra Devi R',        dob: '2004-01-09', classSection: 'I B.Sc. Zoology',        batch: '23-UBZ', ayId: 'ay2', contact: '9754321098', email: 'chitra@mail.com',  father: 'Rajan R',      mother: 'Meena R',   parentContact: '9754321000' },
    { id: uid(), deptNo: 'AZB-004', rollNo: '23AZB004', name: 'Deepan Kumar P',       dob: '2003-11-30', classSection: 'I B.Sc. Zoology',        batch: '23-UBZ', ayId: 'ay2', contact: '9643210987', email: 'deepan@mail.com',  father: 'Pandian P',    mother: 'Sumathi P', parentContact: '9643210900' },
    { id: uid(), deptNo: 'AZB-005', rollNo: '23AZB005', name: 'Eswari Devi T',        dob: '2004-05-14', classSection: 'I B.Sc. Zoology',        batch: '23-UBZ', ayId: 'ay2', contact: '9532109876', email: 'eswari@mail.com',  father: 'Thangavel T',  mother: 'Kamala T',  parentContact: '9532109800' },
    { id: uid(), deptNo: 'AZB-011', rollNo: '22AZB001', name: 'Fathima Nisha M',      dob: '2003-02-18', classSection: 'II B.Sc. Zoology',       batch: '22-UBZ', ayId: 'ay2', contact: '9421098765', email: 'fathima@mail.com', father: 'Mohamed M',    mother: 'Rabia M',   parentContact: '9421098700' },
    { id: uid(), deptNo: 'AZB-012', rollNo: '22AZB002', name: 'Ganesh Babu V',        dob: '2002-09-27', classSection: 'II B.Sc. Zoology',       batch: '22-UBZ', ayId: 'ay2', contact: '9310987654', email: 'ganesh@mail.com',  father: 'Venkat V',     mother: 'Priya V',   parentContact: '9310987600' },
    { id: uid(), deptNo: 'AZB-021', rollNo: '24BT001',  name: 'Harini Priya K',       dob: '2005-04-03', classSection: 'I B.Sc. Biotechnology',  batch: '24-UBT', ayId: 'ay2', contact: '9209876543', email: 'harini@mail.com',  father: 'Karthik K',    mother: 'Geetha K',  parentContact: '9209876500' },
    { id: uid(), deptNo: 'AZB-022', rollNo: '24BT002',  name: 'Imran Ali S',          dob: '2005-08-15', classSection: 'I B.Sc. Biotechnology',  batch: '24-UBT', ayId: 'ay2', contact: '9198765432', email: 'imran@mail.com',   father: 'Saleem S',     mother: 'Zainab S',  parentContact: '9198765400' },
    { id: uid(), deptNo: 'AZB-031', rollNo: '24MSZ001', name: 'Jayalakshmi C',        dob: '2001-12-20', classSection: 'I M.Sc. Zoology',        batch: '24-PGZ', ayId: 'ay2', contact: '9087654321', email: 'jaya@mail.com',    father: 'Chandran C',   mother: 'Lakshmi C', parentContact: '9087654300' },
    { id: uid(), deptNo: 'AZB-032', rollNo: '24MSZ002', name: 'Karthikeyan P',        dob: '2000-06-08', classSection: 'I M.Sc. Zoology',        batch: '24-PGZ', ayId: 'ay2', contact: '8976543210', email: 'karthi@mail.com',  father: 'Perumal P',    mother: 'Vasantha P', parentContact: '8976543200' },
    { id: uid(), deptNo: 'AZB-041', rollNo: '24MSB001', name: 'Lavanya Devi N',       dob: '2001-03-25', classSection: 'I M.Sc. Biotechnology',  batch: '24-PGB', ayId: 'ay2', contact: '8865432109', email: 'lavanya@mail.com', father: 'Natarajan N',  mother: 'Parvathi N', parentContact: '8865432100' },
  ];
  DB.set('students', students);

  DB.set('sheets_generated', 0);
  DB.set('activity_log', []);
  DB.set('seeded', true);
}

/* ──────────────────────────────────────────────
   STATE
────────────────────────────────────────────── */
let currentUser = null;
let currentRole = 'admin';
let sessionInterval = null;
let sessionSeconds = 45 * 60;
let orientation = 'portrait';
let editingStudentId = null;
let pendingImportData = [];

/* ──────────────────────────────────────────────
   AUTH
────────────────────────────────────────────── */
function selectRole(role, el) {
  currentRole = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function togglePw() {
  const inp = document.getElementById('inp-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function doLogin() {
  const username = document.getElementById('inp-user').value.trim();
  const password = document.getElementById('inp-pass').value;
  const alert    = document.getElementById('login-alert');
  const users    = DB.get('users') || [];
  const user     = users.find(u => u.username === username && u.password === password && u.role === currentRole && u.active);

  if (!user) {
    alert.classList.remove('hidden');
    document.getElementById('inp-pass').value = '';
    return;
  }

  alert.classList.add('hidden');
  currentUser = user;
  showApp();
}

function doLogout() {
  clearInterval(sessionInterval);
  currentUser = null;
  document.getElementById('page-app').classList.add('hidden');
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('page-login').classList.remove('hidden');
  document.getElementById('page-login').classList.add('active');
  document.getElementById('inp-user').value = '';
  document.getElementById('inp-pass').value = '';
}

/* ──────────────────────────────────────────────
   APP INIT
────────────────────────────────────────────── */
function showApp() {
  document.getElementById('page-login').classList.add('hidden');
  document.getElementById('page-app').classList.remove('hidden');
  document.getElementById('page-app').style.display = 'grid';

  document.getElementById('sb-name').textContent = currentUser.fullName;
  document.getElementById('sb-role').textContent = currentUser.role === 'admin' ? 'Administrator / HOD' : 'Staff';
  document.getElementById('sb-avatar').textContent = currentUser.fullName[0].toUpperCase();

  // Show/hide admin-only items
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = currentUser.role === 'admin' ? '' : 'none';
  });

  startSessionTimer();
  loadDashboard();
  loadActiveAY();
  populateClassSelector();
  populateAYDropdowns();
  renderAYGrid();
  renderStudentsTable();
  renderUsersTable();
}

/* ──────────────────────────────────────────────
   SESSION TIMER
────────────────────────────────────────────── */
function startSessionTimer() {
  clearInterval(sessionInterval);
  sessionSeconds = 45 * 60;
  sessionInterval = setInterval(() => {
    sessionSeconds--;
    const m = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
    const s = String(sessionSeconds % 60).padStart(2, '0');
    const el = document.getElementById('session-timer');
    if (el) el.textContent = `⏱ ${m}:${s}`;
    if (sessionSeconds <= 0) { alert('Session expired. Please log in again.'); doLogout(); }
  }, 1000);

  ['mousedown','keydown','touchstart'].forEach(e =>
    document.addEventListener(e, resetSessionTimer, { passive: true })
  );
}

function resetSessionTimer() { sessionSeconds = 45 * 60; }

/* ──────────────────────────────────────────────
   NAVIGATION
────────────────────────────────────────────── */
function navTo(page, el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('sec-' + page);
  if (sec) sec.classList.add('active');
  const titles = { dashboard: 'Dashboard', generate: 'Generate Attendance Sheet', students: 'Student Database', academic: 'Academic Years', users: 'User Management' };
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = titles[page] || page;
  closeSidebar();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

/* ──────────────────────────────────────────────
   ACTIVE ACADEMIC YEAR HELPERS
────────────────────────────────────────────── */
function getActiveAY() {
  const ays = DB.get('academic_years') || [];
  return ays.find(a => a.active) || null;
}

function loadActiveAY() {
  const ay = getActiveAY();
  const badge = document.getElementById('active-ay-badge');
  if (badge) badge.textContent = ay ? ay.label : 'No Active Year';
}

/* ──────────────────────────────────────────────
   DASHBOARD
────────────────────────────────────────────── */
function loadDashboard() {
  const ay = getActiveAY();
  const students = DB.get('students') || [];
  const ayStudents = ay ? students.filter(s => s.ayId === ay.id) : [];
  const classes = [...new Set(ayStudents.map(s => s.classSection))];

  document.getElementById('stat-students').textContent = ayStudents.length;
  document.getElementById('stat-sheets').textContent = DB.get('sheets_generated') || 0;
  document.getElementById('stat-classes').textContent = classes.length;
  document.getElementById('stat-year').textContent = ay ? ay.label : '—';

  const log = DB.get('activity_log') || [];
  const listEl = document.getElementById('activity-list');
  if (log.length === 0) {
    listEl.innerHTML = '<div class="activity-empty">No activity yet. Generate your first sheet.</div>';
  } else {
    listEl.innerHTML = log.slice(-10).reverse().map(a => `
      <div class="activity-item">
        <div class="activity-dot"></div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>`).join('');
  }
}

function logActivity(text) {
  const log = DB.get('activity_log') || [];
  log.push({ text, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) });
  DB.set('activity_log', log);
}

/* ──────────────────────────────────────────────
   DATE AUTO-FILL
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const dateEl = document.getElementById('ev-date');
  if (dateEl) {
    dateEl.addEventListener('change', function() {
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      if (this.value) {
        const d = new Date(this.value + 'T00:00:00');
        document.getElementById('ev-day').value = days[d.getDay()];
      }
    });
  }
});

/* ──────────────────────────────────────────────
   CLASS SELECTOR (GENERATE SHEET)
────────────────────────────────────────────── */
function populateClassSelector() {
  const ay = getActiveAY();
  if (!ay) {
    document.getElementById('class-selector-wrap').innerHTML =
      '<p style="color:var(--text-muted);font-size:13px">No active academic year. Please set one in Academic Years.</p>';
    return;
  }
  const students = DB.get('students') || [];
  const ayStudents = students.filter(s => s.ayId === ay.id);
  const classMap = {};
  ayStudents.forEach(s => { classMap[s.classSection] = (classMap[s.classSection] || 0) + 1; });

  const wrap = document.getElementById('class-selector-wrap');
  if (Object.keys(classMap).length === 0) {
    wrap.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No students in the active academic year. Add students first.</p>';
    return;
  }

  wrap.innerHTML = Object.entries(classMap).map(([cls, cnt]) => `
    <label class="class-chip" onclick="toggleClass(this)">
      <input type="checkbox" value="${cls}" onchange="updateClassPreview()">
      <span class="class-chip-name">${cls}</span>
      <span class="class-chip-count">${cnt}</span>
    </label>`).join('');
}

function toggleClass(chip) {
  chip.classList.toggle('selected', chip.querySelector('input').checked);
  updateClassPreview();
}

function updateClassPreview() {
  const selected = [...document.querySelectorAll('#class-selector-wrap input:checked')].map(i => i.value);
  const prev = document.getElementById('selected-classes-preview');
  if (selected.length === 0) { prev.innerHTML = ''; return; }
  prev.innerHTML = selected.map(c => `<span class="preview-pill">${c}</span>`).join('');
}

/* ──────────────────────────────────────────────
   SIGNATURE COLUMNS
────────────────────────────────────────────── */
function addSigCol() {
  const row = document.createElement('div');
  row.className = 'sig-col-row';
  row.innerHTML = `<input type="text" placeholder="e.g. Sign 2 / Attendance">
    <button class="btn-icon-remove" onclick="removeSigCol(this)" title="Remove">✕</button>`;
  document.getElementById('sig-cols-list').appendChild(row);
}

function removeSigCol(btn) {
  const rows = document.querySelectorAll('#sig-cols-list .sig-col-row');
  if (rows.length <= 1) return;
  btn.closest('.sig-col-row').remove();
}

function getSigCols() {
  return [...document.querySelectorAll('#sig-cols-list .sig-col-row input')]
    .map(i => i.value.trim() || 'Signature');
}

/* ──────────────────────────────────────────────
   ORIENTATION
────────────────────────────────────────────── */
function setOrientation(mode, el) {
  orientation = mode;
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

/* ──────────────────────────────────────────────
   OPTIONAL SIGNATORIES
────────────────────────────────────────────── */
let optSigCount = 0;

function addOptionalSig() {
  optSigCount++;
  const id = 'osig_' + optSigCount;
  const div = document.createElement('div');
  div.className = 'signatory-block';
  div.id = id;
  div.innerHTML = `
    <div class="optional-sig-header">
      <span class="sig-block-label">Signatory ${optSigCount + 1}</span>
      <button class="btn-icon-remove" onclick="document.getElementById('${id}').remove()" title="Remove">✕</button>
    </div>
    <div class="fields-grid-3">
      <div class="field-wrap"><label>Name</label><input type="text" class="osig-name" placeholder="Dr. / Mr. / Ms."></div>
      <div class="field-wrap"><label>Designation</label><input type="text" class="osig-desig" placeholder="e.g. Organiser"></div>
      <div class="field-wrap"><label>Show Department?</label>
        <select class="osig-show-dept">
          <option value="yes">Yes — include dept.</option>
          <option value="no">No — name &amp; designation only</option>
        </select>
      </div>
    </div>`;
  document.getElementById('optional-sigs').appendChild(div);
}

function getSignatories() {
  const sigs = [];
  // HOD
  const hodName  = document.getElementById('hod-name').value.trim();
  const hodDesig = document.getElementById('hod-desig').value.trim() || 'Head of the Department';
  const hodDept  = document.getElementById('hod-show-dept').value === 'yes';
  if (hodName || hodDesig) sigs.push({ name: hodName, desig: hodDesig, showDept: hodDept, role: 'hod' });
  // Optional
  document.querySelectorAll('#optional-sigs .signatory-block').forEach(block => {
    const name  = block.querySelector('.osig-name').value.trim();
    const desig = block.querySelector('.osig-desig').value.trim();
    const dept  = block.querySelector('.osig-show-dept').value === 'yes';
    if (name || desig) sigs.push({ name, desig, showDept: dept });
  });
  return sigs;
}

/* ──────────────────────────────────────────────
   PREVIEW & PRINT
────────────────────────────────────────────── */
function openPreview() {
  const selectedClasses = [...document.querySelectorAll('#class-selector-wrap input:checked')].map(i => i.value);
  if (selectedClasses.length === 0) { alert('Please select at least one class.'); return; }
  if (!document.getElementById('ev-name').value.trim()) { alert('Please enter the Event name.'); return; }

  const container = document.getElementById('print-pages-container');
  container.innerHTML = '';
  const sheets = selectedClasses.map(cls => buildSheet(cls));
  sheets.forEach(s => container.insertAdjacentHTML('beforeend', s));

  const countEl = document.getElementById('print-sheet-count');
  if (countEl) countEl.textContent = `${sheets.length} sheet${sheets.length > 1 ? 's' : ''}`;

  document.getElementById('print-overlay').classList.remove('hidden');

  // Log activity
  const count = DB.get('sheets_generated') || 0;
  DB.set('sheets_generated', count + sheets.length);
  logActivity(`Sheet generated: "${document.getElementById('ev-name').value.trim()}" — ${selectedClasses.join(', ')} by ${currentUser.fullName}`);
  loadDashboard();
}

function closePrintOverlay() {
  document.getElementById('print-overlay').classList.add('hidden');
}

function buildSheet(className) {
  const ay  = getActiveAY();
  const all = DB.get('students') || [];
  const classStudents = all.filter(s => s.ayId === ay?.id && s.classSection === className)
    .sort((a, b) => a.deptNo.localeCompare(b.deptNo));

  const lang = document.getElementById('sheet-lang').value;
  const labels = lang === 'ta' ? {
    event: 'நிகழ்வு', date: 'தேதி', venue: 'இடம்', time: 'நேரம்',
    class: 'வகுப்பு', dept: 'துறை', attendance: 'வருகைப் பட்டியல்',
    total: 'மொத்தம்', attended: 'கலந்துகொண்டவர்கள்',
    slno: 'வ.எண்', deptno: 'துறை எண்', name: 'பெயர்',
    college: 'லயோலா கல்லூரி (தன்னாட்சி), சென்னை – 600 034',
    collegeSub: '1925ல் நிறுவப்பட்டது · சென்னை பல்கலைக்கழகத்துடன் இணைந்தது',
    deptName: 'மேம்பட்ட விலங்கியல் மற்றும் உயிரி தொழில்நுட்பத் துறை'
  } : {
    event: 'Event', date: 'Date', venue: 'Venue', time: 'Time',
    class: 'Class', dept: 'Department', attendance: 'ATTENDANCE SHEET',
    total: 'Total Enrolled', attended: 'Total Present',
    slno: 'Sl. No.', deptno: 'Dept. No.', name: 'Student Name',
    college: 'Loyola College (Autonomous), Chennai – 600 034',
    collegeSub: 'Established 1925 · Affiliated to University of Madras',
    deptName: 'Department of Advanced Zoology &amp; Biotechnology'
  };

  // Columns to include
  const cols = [
    { key: 'rollNo', label: 'Roll No.', show: document.getElementById('col-rollno').checked },
    { key: 'dob',    label: 'Date of Birth', show: document.getElementById('col-dob').checked },
    { key: 'contact',label: 'Contact No.',   show: document.getElementById('col-contact').checked },
    { key: 'email',  label: 'Email',          show: document.getElementById('col-email').checked },
    { key: 'father', label: "Father's Name",  show: document.getElementById('col-father').checked },
    { key: 'mother', label: "Mother's Name",  show: document.getElementById('col-mother').checked },
    { key: 'parentContact', label: 'Parent Contact', show: document.getElementById('col-parent-contact').checked },
  ].filter(c => c.show);

  const sigCols = getSigCols();
  const signatories = getSignatories();
  const evName  = document.getElementById('ev-name').value.trim();
  const evVenue = document.getElementById('ev-venue').value.trim();
  const evDate  = formatDate(document.getElementById('ev-date').value);
  const evDay   = document.getElementById('ev-day').value;
  const evFrom  = formatTime(document.getElementById('ev-time-from').value);
  const evTo    = formatTime(document.getElementById('ev-time-to').value);
  const timeStr = evFrom && evTo ? `${evFrom} – ${evTo}` : evFrom || evTo || '—';

  const orient = orientation;

  // Table head
  const thead = `
    <tr>
      <th class="td-num">${labels.slno}</th>
      <th class="td-deptno">${labels.deptno}</th>
      <th>${labels.name}</th>
      ${cols.map(c => `<th>${c.label}</th>`).join('')}
      ${sigCols.map(s => `<th class="td-sig">${s}</th>`).join('')}
    </tr>`;

  // Table body
  const tbody = classStudents.map((st, i) => `
    <tr>
      <td class="td-num">${i + 1}</td>
      <td class="td-deptno">${st.deptNo}</td>
      <td>${st.name}</td>
      ${cols.map(c => {
        let val = st[c.key] || '';
        if (c.key === 'dob' && val) val = formatDate(val);
        return `<td>${val}</td>`;
      }).join('')}
      ${sigCols.map(() => `<td class="td-sig"></td>`).join('')}
    </tr>`).join('');

  // Footer signatories
  const footerSigs = signatories.map(sig => `
    <div class="sh-sig-block">
      <div class="sh-sign-area"></div>
      <div class="sh-sig-name">${sig.name || '___________________'}</div>
      <div class="sh-sig-desig">${sig.desig}</div>
      ${sig.showDept ? `<div class="sh-sig-dept">Dept. of Advanced Zoology &amp; Biotechnology</div><div class="sh-sig-dept">Loyola College, Chennai – 600 034</div>` : `<div class="sh-sig-dept">Loyola College, Chennai – 600 034</div>`}
    </div>`).join('');

  return `
  <div class="a4-sheet ${orient}">
    <div class="sh-header">
      <img src="https://static.wixstatic.com/media/81ba89_81dcdb9d1e384b618fdc78760c61c426~mv2.png"
           alt="Loyola" class="sh-logo" onerror="this.style.display='none'">
      <div class="sh-college-block">
        <div class="sh-college-name">${labels.college}</div>
        <div class="sh-college-sub">${labels.collegeSub}</div>
        <div class="sh-dept-name">${labels.deptName}</div>
      </div>
    </div>

    <div class="sh-title-bar">
      <div class="sh-title-text">${labels.attendance} — ${evName.toUpperCase()}</div>
    </div>

    <div class="sh-meta-box">
      <div class="sh-meta-grid">
        <div class="sh-meta-cell"><span class="sh-meta-label">${labels.event}:</span><span class="sh-meta-value">${evName}</span></div>
        <div class="sh-meta-cell"><span class="sh-meta-label">${labels.date}:</span><span class="sh-meta-value">${evDate}${evDay ? ' (' + evDay + ')' : ''}</span></div>
        <div class="sh-meta-cell"><span class="sh-meta-label">${labels.venue}:</span><span class="sh-meta-value">${evVenue || '—'}</span></div>
        <div class="sh-meta-cell"><span class="sh-meta-label">${labels.time}:</span><span class="sh-meta-value">${timeStr}</span></div>
        <div class="sh-meta-cell"><span class="sh-meta-label">${labels.class}:</span><span class="sh-meta-value">${className}</span></div>
        <div class="sh-meta-cell"><span class="sh-meta-label">${labels.dept}:</span><span class="sh-meta-value">Advanced Zoology &amp; Biotechnology</span></div>
      </div>
    </div>

    <table class="sh-table">
      <thead>${thead}</thead>
      <tbody>${tbody}</tbody>
    </table>

    <div class="sh-totals">
      <div class="sh-total-box">
        <div class="sh-total-label">${labels.total}</div>
        <div class="sh-total-value">${classStudents.length}</div>
      </div>
      <div class="sh-total-box">
        <div class="sh-total-label">${labels.attended}</div>
        <div class="sh-total-value attended">&nbsp;</div>
      </div>
    </div>

    <div class="sh-footer">
      <div class="sh-footer-sigs">${footerSigs || '<div class="sh-sig-block"><div class="sh-sign-area"></div><div class="sh-sig-name">___________________</div><div class="sh-sig-desig">Head of the Department</div><div class="sh-sig-dept">Dept. of Advanced Zoology &amp; Biotechnology</div><div class="sh-sig-dept">Loyola College, Chennai – 600 034</div></div>'}</div>
    </div>
  </div>`;
}

/* ──────────────────────────────────────────────
   STUDENT MANAGEMENT
────────────────────────────────────────────── */
function renderStudentsTable() {
  filterStudents();
  populateFilterDropdowns();
}

function populateFilterDropdowns() {
  const students = DB.get('students') || [];
  const classes = [...new Set(students.map(s => s.classSection))].sort();
  const ays = DB.get('academic_years') || [];

  const fc = document.getElementById('filter-class');
  const fa = document.getElementById('filter-ay');
  if (!fc || !fa) return;

  const prevClass = fc.value;
  const prevAY    = fa.value;

  fc.innerHTML = '<option value="">All Classes</option>' + classes.map(c => `<option value="${c}" ${c===prevClass?'selected':''}>${c}</option>`).join('');
  fa.innerHTML = '<option value="">All Academic Years</option>' + ays.map(a => `<option value="${a.id}" ${a.id===prevAY?'selected':''}>${a.label}</option>`).join('');
}

function filterStudents() {
  const query  = (document.getElementById('student-search')?.value || '').toLowerCase();
  const clsF   = document.getElementById('filter-class')?.value || '';
  const ayF    = document.getElementById('filter-ay')?.value || '';
  let students = DB.get('students') || [];

  if (query) students = students.filter(s =>
    s.name.toLowerCase().includes(query) || s.deptNo.toLowerCase().includes(query) || (s.rollNo||'').toLowerCase().includes(query));
  if (clsF) students = students.filter(s => s.classSection === clsF);
  if (ayF)  students = students.filter(s => s.ayId === ayF);

  const tbody = document.getElementById('students-tbody');
  const empty = document.getElementById('students-empty');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';
  const ays = DB.get('academic_years') || [];

  tbody.innerHTML = students.map(s => {
    const ayLabel = ays.find(a => a.id === s.ayId)?.label || s.ayId;
    return `<tr>
      <td>${s.deptNo}</td>
      <td>${s.rollNo || '—'}</td>
      <td>${s.name}</td>
      <td>${s.classSection}</td>
      <td>${ayLabel}</td>
      <td>${s.contact || '—'}</td>
      <td>
        <button class="btn-tbl btn-tbl-edit" onclick="editStudent('${s.id}')">Edit</button>
        <button class="btn-tbl btn-tbl-del" onclick="deleteStudent('${s.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

function openAddStudent() {
  editingStudentId = null;
  document.getElementById('modal-student-title').textContent = 'Add Student';
  ['s-deptno','s-rollno','s-name','s-dob','s-contact','s-email','s-father','s-mother','s-parent-contact','s-batch'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('s-class').value = '';
  openModal('modal-student');
}

function editStudent(id) {
  const students = DB.get('students') || [];
  const s = students.find(x => x.id === id);
  if (!s) return;
  editingStudentId = id;
  document.getElementById('modal-student-title').textContent = 'Edit Student';
  document.getElementById('s-deptno').value = s.deptNo || '';
  document.getElementById('s-rollno').value = s.rollNo || '';
  document.getElementById('s-name').value = s.name || '';
  document.getElementById('s-dob').value = s.dob || '';
  document.getElementById('s-contact').value = s.contact || '';
  document.getElementById('s-email').value = s.email || '';
  document.getElementById('s-father').value = s.father || '';
  document.getElementById('s-mother').value = s.mother || '';
  document.getElementById('s-parent-contact').value = s.parentContact || '';
  document.getElementById('s-class').value = s.classSection || '';
  document.getElementById('s-batch').value = s.batch || '';
  document.getElementById('s-ay').value = s.ayId || '';
  openModal('modal-student');
}

function saveStudent() {
  const deptNo = document.getElementById('s-deptno').value.trim();
  const name   = document.getElementById('s-name').value.trim();
  const cls    = document.getElementById('s-class').value;
  const ayId   = document.getElementById('s-ay').value;
  if (!deptNo || !name || !cls || !ayId) { alert('Please fill all required fields.'); return; }

  const data = {
    deptNo, rollNo: document.getElementById('s-rollno').value.trim(),
    name, dob: document.getElementById('s-dob').value,
    classSection: cls, batch: document.getElementById('s-batch').value.trim(),
    ayId, contact: document.getElementById('s-contact').value.trim(),
    email: document.getElementById('s-email').value.trim(),
    father: document.getElementById('s-father').value.trim(),
    mother: document.getElementById('s-mother').value.trim(),
    parentContact: document.getElementById('s-parent-contact').value.trim()
  };

  if (editingStudentId) {
    DB.update('students', editingStudentId, data);
  } else {
    DB.push('students', { ...data, id: uid() });
  }

  closeModal('modal-student');
  renderStudentsTable();
  populateClassSelector();
  loadDashboard();
}

function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  DB.remove('students', id);
  renderStudentsTable();
  populateClassSelector();
  loadDashboard();
}

/* ──────────────────────────────────────────────
   ACADEMIC YEAR MANAGEMENT
────────────────────────────────────────────── */
function openAddAY() { openModal('modal-ay'); }

function saveAY() {
  const label  = document.getElementById('ay-label').value.trim();
  const start  = document.getElementById('ay-start').value;
  const end    = document.getElementById('ay-end').value;
  const active = document.getElementById('ay-active').value === 'yes';
  if (!label || !start || !end) { alert('Please fill all fields.'); return; }

  const ays = DB.get('academic_years') || [];
  if (active) ays.forEach(a => a.active = false);
  ays.push({ id: uid(), label, start, end, active });
  DB.set('academic_years', ays);

  closeModal('modal-ay');
  renderAYGrid();
  populateAYDropdowns();
  loadActiveAY();
  populateClassSelector();
  loadDashboard();
}

function renderAYGrid() {
  const ays = DB.get('academic_years') || [];
  const grid = document.getElementById('ay-grid');
  if (!grid) return;
  if (ays.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);padding:20px">No academic years defined.</p>';
    return;
  }
  grid.innerHTML = ays.map(ay => `
    <div class="ay-card ${ay.active ? 'active-year' : ''}">
      <div class="ay-card-label">${ay.label}</div>
      <div class="ay-card-dates">${formatDate(ay.start)} → ${formatDate(ay.end)}</div>
      <div>${ay.active ? '<span class="ay-status-active">● Active</span>' : '<span class="ay-status-inactive">Inactive</span>'}</div>
      <div class="ay-card-actions">
        ${!ay.active ? `<button class="btn-ay-activate" onclick="activateAY('${ay.id}')">Set Active</button>` : ''}
        <button class="btn-ay-delete" onclick="deleteAY('${ay.id}')">Delete</button>
      </div>
    </div>`).join('');
}

function activateAY(id) {
  const ays = DB.get('academic_years') || [];
  ays.forEach(a => a.active = a.id === id);
  DB.set('academic_years', ays);
  renderAYGrid(); loadActiveAY(); populateClassSelector(); loadDashboard();
}

function deleteAY(id) {
  if (!confirm('Delete this academic year? Students linked to it will remain but without an active year.')) return;
  DB.remove('academic_years', id);
  renderAYGrid(); loadActiveAY(); populateClassSelector(); loadDashboard();
}

/* ──────────────────────────────────────────────
   AY DROPDOWNS FOR MODALS
────────────────────────────────────────────── */
function populateAYDropdowns() {
  const ays = DB.get('academic_years') || [];
  const activeAY = getActiveAY();
  ['s-ay','import-ay'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '<option value="">Select Academic Year</option>' +
      ays.map(a => `<option value="${a.id}" ${a.active?'selected':''}>${a.label}</option>`).join('');
  });
}

/* ──────────────────────────────────────────────
   USER MANAGEMENT
────────────────────────────────────────────── */
function renderUsersTable() {
  const users = DB.get('users') || [];
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.username}</td>
      <td>${u.fullName}</td>
      <td><span style="text-transform:capitalize">${u.role}</span></td>
      <td>${u.active ? '<span style="color:#5FD999">Active</span>' : '<span style="color:#FF9090">Inactive</span>'}</td>
      <td>
        <button class="btn-tbl btn-tbl-edit" onclick="toggleUserActive('${u.id}')">${u.active ? 'Deactivate' : 'Activate'}</button>
        ${u.role !== 'admin' ? `<button class="btn-tbl btn-tbl-del" onclick="deleteUser('${u.id}')">Delete</button>` : ''}
      </td>
    </tr>`).join('');
}

function openAddUser() { openModal('modal-user'); }

function saveUser() {
  const name = document.getElementById('u-name').value.trim();
  const user = document.getElementById('u-username').value.trim();
  const pass = document.getElementById('u-pass').value;
  const role = document.getElementById('u-role').value;
  if (!name || !user || !pass) { alert('Please fill all required fields.'); return; }
  if (pass.length < 8) { alert('Password must be at least 8 characters.'); return; }
  const users = DB.get('users') || [];
  if (users.find(u => u.username === user)) { alert('Username already exists.'); return; }
  DB.push('users', { id: uid(), fullName: name, username: user, password: pass, role, active: true });
  closeModal('modal-user');
  renderUsersTable();
}

function toggleUserActive(id) {
  const users = DB.get('users') || [];
  const u = users.find(x => x.id === id);
  if (u) u.active = !u.active;
  DB.set('users', users);
  renderUsersTable();
}

function deleteUser(id) {
  if (!confirm('Delete this account?')) return;
  DB.remove('users', id);
  renderUsersTable();
}

/* ──────────────────────────────────────────────
   CSV IMPORT
────────────────────────────────────────────── */
function openImportModal() {
  pendingImportData = [];
  document.getElementById('import-preview').innerHTML = '';
  document.getElementById('btn-confirm-import').disabled = true;
  document.getElementById('csv-file-input').value = '';
  openModal('modal-import');
}

function downloadTemplate() {
  const header = 'DeptNo,RollNo,FullName,DOB,Class,Batch,Contact,Email,FatherName,MotherName,ParentContact,AcademicYear';
  const example = 'AZB-001,23AZB001,Student Name,2004-03-12,I B.Sc. Zoology,23-UBZ,9876543210,student@mail.com,Father Name,Mother Name,9876543200,2026–2027';
  const blob = new Blob([header + '\n' + example], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'azb_students_template.csv'; a.click();
}

function handleCSV(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const lines = e.target.result.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    pendingImportData = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g,''));
      const obj = {};
      headers.forEach((h, i) => obj[h] = vals[i] || '');
      return {
        id: uid(), deptNo: obj.DeptNo, rollNo: obj.RollNo, name: obj.FullName,
        dob: obj.DOB, classSection: obj.Class, batch: obj.Batch,
        contact: obj.Contact, email: obj.Email, father: obj.FatherName,
        mother: obj.MotherName, parentContact: obj.ParentContact, ayId: ''
      };
    }).filter(s => s.name && s.deptNo);

    document.getElementById('import-preview').innerHTML = `
      <div style="margin-top:14px;padding:12px 16px;background:rgba(31,122,74,0.1);border:1px solid rgba(31,122,74,0.3);border-radius:6px;font-size:13px;color:#5FD999">
        ✓ Found <strong>${pendingImportData.length}</strong> valid student records. Select academic year below and click Import.
      </div>`;
    document.getElementById('btn-confirm-import').disabled = false;
  };
  reader.readAsText(file);
}

function confirmImport() {
  const ayId = document.getElementById('import-ay').value;
  if (!ayId) { alert('Please select an academic year for this import.'); return; }
  const students = DB.get('students') || [];
  const updated = pendingImportData.map(s => ({ ...s, ayId }));
  DB.set('students', [...students, ...updated]);
  closeModal('modal-import');
  renderStudentsTable();
  populateClassSelector();
  loadDashboard();
  logActivity(`Imported ${updated.length} students by ${currentUser.fullName}`);
  alert(`Successfully imported ${updated.length} students.`);
}

/* ──────────────────────────────────────────────
   MODAL HELPERS
────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
});

/* ──────────────────────────────────────────────
   GENERATE SHEET RESET
────────────────────────────────────────────── */
function resetGen() {
  if (!confirm('Reset all fields?')) return;
  ['ev-name','ev-venue','ev-date','ev-day','ev-time-from','ev-time-to','hod-name'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('hod-desig').value = 'Head of the Department';
  document.getElementById('hod-show-dept').value = 'yes';
  document.getElementById('optional-sigs').innerHTML = '';
  document.getElementById('sig-cols-list').innerHTML = `
    <div class="sig-col-row">
      <input type="text" value="Signature" placeholder="Column heading">
      <button class="btn-icon-remove" onclick="removeSigCol(this)" title="Remove">✕</button>
    </div>`;
  ['col-rollno','col-dob','col-contact','col-email','col-father','col-mother','col-parent-contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  document.querySelectorAll('#class-selector-wrap input[type="checkbox"]').forEach(c => {
    c.checked = false;
    c.closest('.class-chip')?.classList.remove('selected');
  });
  document.getElementById('selected-classes-preview').innerHTML = '';
  orientation = 'portrait';
  document.getElementById('orient-portrait').classList.add('active');
  document.getElementById('orient-landscape').classList.remove('active');
  document.getElementById('sheet-lang').value = 'en';
  optSigCount = 0;
}

/* ──────────────────────────────────────────────
   FORMAT HELPERS
────────────────────────────────────────────── */
function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return d; }
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2,'0')} ${ampm}`;
}

/* ──────────────────────────────────────────────
   DRAG & DROP ON IMPORT MODAL
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const dz = document.getElementById('drop-zone');
  if (dz) {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.style.borderColor = 'var(--gold)'; });
    dz.addEventListener('dragleave', () => { dz.style.borderColor = ''; });
    dz.addEventListener('drop', e => {
      e.preventDefault();
      dz.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file) {
        const inp = document.getElementById('csv-file-input');
        const dt = new DataTransfer();
        dt.items.add(file);
        inp.files = dt.files;
        handleCSV(inp);
      }
    });
  }
});

/* ──────────────────────────────────────────────
   BOOT
────────────────────────────────────────────── */
seedData();
