// script.js
// Particles Background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.5;
    this.speedY = Math.random() * 0.6 + 0.2;
    this.hue = 180 + Math.random() * 30;
  }
  update() {
    this.y += this.speedY;
    if (this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 0.6)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  animationId = requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
animateParticles();

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileNavToggle');
const sidebar = document.getElementById('sidebar');

mobileToggle?.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  mobileToggle.classList.toggle('active', isOpen);
  mobileToggle.setAttribute('aria-expanded', isOpen);

  // Add/remove body class for overlay
  if (isOpen) {
    document.body.classList.add('sidebar-open');
  } else {
    document.body.classList.remove('sidebar-open');
  }
});

document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sidebar-open');
  }
});

// Intersection Observer
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => observer.observe(el));

// Data
const challenges = [
  { title: "Graph grief", file: "CTF/Nite2025/GraphGrief", flag: "nite{Th3_Qu4ntum_****}", type: "web" },
  { title: "Database Reincursion", file: "CTF/Nite2025/DatabaseReincursion", flag: "nite{neVeR_9Onn4_****}", type: "web" },
  { title: "Connection Tester", file: "CTF/PatriotCTF2025/Web/ConnectionTester", flag: "PCTF{C0nnection_****}", type: "web" },
  { title: "Feedback Fallout", file: "CTF/PatriotCTF2025/Web/FeedbackFallout", flag: "PCTF{SQLI_****}", type: "web" },
  { title: "Secure Auth", file: "CTF/PatriotCTF2025/Web/SecureAuth", flag: "PCTF{cant_****}", type: "web" },
  { title: "Trust Fall", file: "CTF/PatriotCTF2025/Web/TrustFall", flag: "PCTF{auth_****}", type: "web" },
  { title: "Trust Vault", file: "CTF/PatriotCTF2025/Web/TrustVault", flag: "FLAG{py7h0n_****}", type: "web" },
  { title: "Reverse Metadata Part 1", file: "CTF/PatriotCTF2025/Misc/ReverseMetaData1", flag: "MASONCC{images_****}", type: "misc" },
  { title: "Reverse Metadata Part 2", file: "CTF/PatriotCTF2025/Misc/ReverseMetaData2", flag: "PCTF{hidden_****}", type: "misc" },
];

const myCTFs = [
  { name: "PatriotCTF 2025", solves: "7+ solves", status: "Ended", link: "CTF/PatriotCTF2025/patriotctf2025.html" },
  { name: "NiteCTF 2025", solves: "2 solves", status: "Ended", link: "CTF/Nite2025/Nite2025.html" }
];
const labPlatforms = [
  { platform: "Hack The Box", username: "", status: "InActive", link: "" },
  { platform: "TryHackMe", username: "aycoo", status: "Active", link: "CTF/TryHackMe/Tryhackme.html" }
];

// DOM Elements
const challengeCards = document.getElementById('challengeCards');
const categoryBadges = document.getElementById('category-badges');
const recentSolvesList = document.getElementById('recentSolvesList');
const ctfGrid = document.getElementById('ctfGrid');
const labsPlatformsGrid = document.getElementById('labsPlatformsGrid');
const searchBar = document.getElementById('searchBar');

function populateMyCTFs() {
  ctfGrid.innerHTML = myCTFs.map(ctf => `
    <div class="ctf-card" role="listitem" tabindex="0" onclick="location.href='${ctf.link}'" onkeydown="if(event.key==='Enter') location.href='${ctf.link}'">
      <h3>${ctf.name}</h3>
      <p>${ctf.solves}</p>
      <p class="status">${ctf.status}</p>
    </div>
  `).join('');
}

function populateLabs() {
  // Platforms
  if (labsPlatformsGrid) {
    labsPlatformsGrid.innerHTML = labPlatforms.map(p => {
      const clickable = p.link && p.link.trim().length > 0;
      const attrs = clickable
        ? `class="ctf-card is-link" role="listitem" tabindex="0"
           onclick="location.href='${p.link}'"
           onkeydown="if(event.key==='Enter') location.href='${p.link}'"`
        : `class="ctf-card" role="listitem" tabindex="0"`;

      return `
        <div ${attrs}>
          <h3>${p.platform}</h3>
          <p class="lab-sub">Username: <strong>${p.username}</strong></p>
          <p class="status">${p.status || "Active"}</p>
        </div>
      `;
    }).join('');
  }
  }


// Category Badges
function updateCategoryStats() {
  const solved = { web: 0, misc: 0, crypto: 0, pwn: 0, forensics: 0 };
  challenges.forEach(c => solved[c.type]++);

  categoryBadges.innerHTML = '';
  const categories = [
    { type: 'web', label: 'WEB' },
    { type: 'misc', label: 'MISC' },
    { type: 'crypto', label: 'CRYPTO' },
    { type: 'pwn', label: 'PWN' },
    { type: 'forensics', label: 'FORENSICS' }
  ];

  categories.forEach((cat, i) => {
    if (solved[cat.type] > 0) {
      setTimeout(() => {
        const badge = document.createElement('div');
        badge.className = `category-badge ${cat.type} visible`;
        badge.textContent = `${cat.label} • ${solved[cat.type]}`;
        badge.style.setProperty('--index', i);
        categoryBadges.appendChild(badge);
      }, i * 150);
    }
  });
}

// Recent Solves
function populateRecentSolves() {
  recentSolvesList.innerHTML = '';
  challenges.reverse().slice(-4).reverse().forEach(c => {
    const li = document.createElement('li');
    li.textContent = c.title;
    li.tabIndex = 0;
    li.onclick = () => location.href = c.file;
    li.onkeydown = (e) => { if (e.key === 'Enter') location.href = c.file; };
    recentSolvesList.appendChild(li);
  });
}

// Render Challenges
function renderChallenges(filter = 'all', searchTerm = '') {
  const filtered = challenges
    .filter(c => (filter === 'all' || c.type === filter))
    .filter(c => c.title.toLowerCase().includes(searchTerm) || c.flag.toLowerCase().includes(searchTerm));

  challengeCards.innerHTML = filtered.length === 0
    ? '<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7; padding: 2rem;">No challenges found.</p>'
    : filtered.map(c => `
      <div class="card reveal" tabindex="0" onclick="location.href='${c.file}'" onkeydown="if(event.key==='Enter') location.href='${c.file}'">
        <div class="category-tag tag-${c.type}">${c.type.toUpperCase()}</div>
        <h3>${c.title}</h3>
        <p class="flag">Flag: <code>${c.flag}</code></p>
        <span style="opacity:0.7; font-size:0.9rem;">Click or press Enter for writeup →</span>
      </div>
    `).join('');

  document.querySelectorAll('.card.reveal:not(.observed)').forEach(el => {
    observer.observe(el);
    el.classList.add('observed');
  });
}

// Tabs & Search
document.querySelectorAll('#challengeTabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#challengeTabs .tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    renderChallenges(tab.dataset.cat, searchBar.value.toLowerCase().trim());
  });
});

searchBar?.addEventListener('input', (e) => {
  const activeTab = document.querySelector('#challengeTabs .tab.active');
  const filter = activeTab?.dataset.cat || 'all';
  renderChallenges(filter, e.target.value.toLowerCase().trim());
});

// Theme
document.getElementById('themeToggle')?.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
});

if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.add('light');
}

// Clock
function updateClock() {
  const time = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('liveClock').textContent = time;
}
updateClock();
setInterval(updateClock, 1000);

// Modal
const openModal = (id) => document.getElementById(id)?.classList.add('open');
const closeModal = (id) => document.getElementById(id)?.classList.remove('open');

document.getElementById('ctfToggle')?.addEventListener('click', () => openModal('ctfModal'));
document.getElementById('labsToggle')?.addEventListener('click', () => openModal('labsModal'));

// Close buttons
document.querySelectorAll('.close-modal[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

// Click outside modal-content closes
['ctfModal', 'labsModal'].forEach(id => {
  const modal = document.getElementById(id);
  modal?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal(id);
  });
});

// ESC closes any open modal
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeModal('ctfModal');
  closeModal('labsModal');
});


// Feedback Form
document.getElementById('feedbackForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const messageEl = document.getElementById('formMessage');
  const submitBtn = form.querySelector('button[type="submit"]');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  messageEl.style.display = 'none';

  const formData = new FormData(form);
  const json = JSON.stringify(Object.fromEntries(formData));

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: json
    });

    const result = await response.json();

    if (response.ok) {
      form.reset();
      messageEl.style.color = '#00ffff';
      messageEl.innerHTML = '<strong>Thank you! ❤️</strong><br>Your message was sent successfully.';
    } else {
      messageEl.style.color = '#ff6b6b';
      messageEl.textContent = result.message || 'Failed to send. Try again.';
    }
  } catch (err) {
    messageEl.style.color = '#ff6b6b';
    messageEl.textContent = 'Network error. Check your connection.';
  } finally {
    messageEl.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Feedback';
    setTimeout(() => { messageEl.style.display = 'none'; }, 6000);
  }
});

// Init
window.addEventListener('load', () => {
  renderChallenges();
  updateCategoryStats();
  populateRecentSolves();
  populateMyCTFs();
  populateLabs();
});
