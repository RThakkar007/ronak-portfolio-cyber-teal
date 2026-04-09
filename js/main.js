/* Cyber Teal — main.js */

// ===== CANVAS BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '#00f5d4' : '#39ff14';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.15;
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}
animate();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== TYPING EFFECT =====
const roles = [
  'Sr. QA Test Engineer',
  'Test Automation Specialist',
  'Agile QA Lead',
  'ISTQB Certified Tester',
  'Quality Assurance Expert',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-role');

function type() {
  const current = roles[roleIdx];
  if (!deleting && charIdx < current.length) {
    typedEl.textContent = current.slice(0, ++charIdx);
    setTimeout(type, 80);
  } else if (!deleting && charIdx === current.length) {
    setTimeout(() => { deleting = true; type(); }, 2000);
  } else if (deleting && charIdx > 0) {
    typedEl.textContent = current.slice(0, --charIdx);
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== SKILL BAR ANIMATION =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== CONTACT FORM — with Visitor Data Capture =====
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Mobile';
  return 'Desktop';
}
function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) return 'Microsoft Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome')) return 'Google Chrome';
  if (ua.includes('Firefox')) return 'Mozilla Firefox';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown Browser';
}
function getOSName() {
  const ua = navigator.userAgent;
  if (ua.includes('Windows NT 10')) return 'Windows 10/11';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown OS';
}

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const name = document.getElementById('cf-name').value;
  const email = document.getElementById('cf-email').value;
  const subject = document.getElementById('cf-subject').value || '(No subject)';
  const message = document.getElementById('cf-message').value;

  // Show loading state
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;

  // Collect visitor backend data
  const visitorData = {
    browser: getBrowserName(),
    os: getOSName(),
    device: getDeviceType(),
    screenRes: `${screen.width}x${screen.height}`,
    language: navigator.language || 'N/A',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'N/A',
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    referrer: document.referrer || 'Direct',
    sourceSite: window.location.href,
    ip: 'Fetching...',
    city: 'Fetching...',
    country: 'Fetching...',
    isp: 'Fetching...'
  };

  // Fetch IP + geo data from ipapi
  try {
    const geo = await fetch('https://ipapi.co/json/').then(r => r.json());
    visitorData.ip = geo.ip || 'N/A';
    visitorData.city = geo.city || 'N/A';
    visitorData.country = `${geo.country_name || 'N/A'} (${geo.country_code || ''})` ;
    visitorData.isp = geo.org || 'N/A';
  } catch (_) {
    visitorData.ip = 'Unavailable';
    visitorData.city = 'Unavailable';
    visitorData.country = 'Unavailable';
    visitorData.isp = 'Unavailable';
  }

  // Payload ready for EmailJS / backend (logged for now)
  const payload = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    visitor_ip: visitorData.ip,
    visitor_city: visitorData.city,
    visitor_country: visitorData.country,
    visitor_isp: visitorData.isp,
    visitor_browser: visitorData.browser,
    visitor_os: visitorData.os,
    visitor_device: visitorData.device,
    visitor_screen: visitorData.screenRes,
    visitor_language: visitorData.language,
    visitor_timezone: visitorData.timezone,
    visitor_time: visitorData.timestamp,
    visitor_referrer: visitorData.referrer,
    source_site: visitorData.sourceSite
  };
  console.log('[Portfolio Contact] Submission payload (ready for EmailJS):', payload);

  // Show success state with visitor info panel
  btn.innerHTML = '✓ Message Sent!';
  btn.style.background = 'rgba(57,255,20,0.15)';
  btn.style.borderColor = '#39ff14';
  btn.style.color = '#39ff14';

  const panel = document.getElementById('cf-visitor-data');
  panel.style.display = 'block';
  panel.innerHTML = `
    <div style="margin-top:20px;padding:16px;border:1px solid rgba(0,245,212,0.3);border-radius:8px;background:rgba(0,245,212,0.04);font-family:var(--font-mono);font-size:12px;color:var(--text-dim);">
      <div style="color:var(--teal);font-weight:700;margin-bottom:10px;font-size:13px;">// VISITOR SESSION DATA</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;">
        <span style="color:var(--text-dim);">IP Address:</span><span style="color:var(--teal);">${visitorData.ip}</span>
        <span style="color:var(--text-dim);">Location:</span><span style="color:var(--teal);">${visitorData.city}, ${visitorData.country}</span>
        <span style="color:var(--text-dim);">ISP:</span><span style="color:var(--teal);">${visitorData.isp}</span>
        <span style="color:var(--text-dim);">Browser:</span><span style="color:var(--teal);">${visitorData.browser}</span>
        <span style="color:var(--text-dim);">OS:</span><span style="color:var(--teal);">${visitorData.os}</span>
        <span style="color:var(--text-dim);">Device:</span><span style="color:var(--teal);">${visitorData.device}</span>
        <span style="color:var(--text-dim);">Screen:</span><span style="color:var(--teal);">${visitorData.screenRes}</span>
        <span style="color:var(--text-dim);">Timezone:</span><span style="color:var(--teal);">${visitorData.timezone}</span>
        <span style="color:var(--text-dim);">Language:</span><span style="color:var(--teal);">${visitorData.language}</span>
        <span style="color:var(--text-dim);">Time:</span><span style="color:var(--teal);">${visitorData.timestamp}</span>
        <span style="color:var(--text-dim);">Referrer:</span><span style="color:var(--teal);">${visitorData.referrer}</span>
      </div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(0,245,212,0.15);color:rgba(0,245,212,0.5);font-size:11px;">📧 Email delivery: wire up EmailJS to send this payload to ronakenterprise0@gmail.com</div>
    </div>`;

  setTimeout(() => {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
    btn.disabled = false;
    e.target.reset();
    setTimeout(() => { panel.style.display = 'none'; }, 500);
  }, 8000);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--teal)' : '';
  });
});

// ===== DARK / LIGHT MODE TOGGLE =====
(function() {
  const STORAGE_KEY = 'rt-theme';
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  // Apply saved or system preference on load
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  // Update particle colors based on theme
  function updateParticleColors(theme) {
    particles.forEach(p => {
      if (theme === 'light') {
        p.color = Math.random() > 0.5 ? '#007a6a' : '#1a8c00';
      } else {
        p.color = Math.random() > 0.5 ? '#00f5d4' : '#39ff14';
      }
    });
  }
  updateParticleColors(initial);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    updateParticleColors(next);
  });
})();
