/* Mobile nav toggle */
const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.querySelector('#site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  siteNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Smooth-scroll & active link */
const links = document.querySelectorAll('a.nav-link[href^="#"]');
const sections = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
links.forEach(link => link.addEventListener('click', e => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.pushState(null, '', link.getAttribute('href')); }
}));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = `#${entry.target.id}`;
    const active = document.querySelector(`.site-nav a[href="${id}"]`);
    if (active && entry.isIntersecting) { document.querySelectorAll('.site-nav a').forEach(a => a.classList.remove('active')); active.classList.add('active'); }
  });
}, { threshold: 0.6 });
sections.forEach(s => s && observer.observe(s));

/* Reveal on scroll */
const toReveal = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } });
}, { threshold: 0.2 });
toReveal.forEach(el => revealObserver.observe(el));

/* Footer year */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===========================
   Ambient background effects
   =========================== */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Particles
(function particles(){
  const canvas = document.getElementById('bgParticles');
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h, particles, animId, paused = false;
  function resize(){ w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); }
  function init(){ resize(); const count = Math.floor((w*h)/24000); particles = new Array(count).fill(0).map(()=>({ x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.4+0.4, a:Math.random()*Math.PI*2, s:Math.random()*0.25+0.05 })); }
  function step(){ if (paused) return; ctx.clearRect(0,0,w,h); ctx.fillStyle='rgba(255,255,255,0.45)'; for (const p of particles){ p.x+=Math.cos(p.a)*p.s; p.y+=Math.sin(p.a)*p.s; p.a+=(Math.random()-0.5)*0.02; if (p.x<-10) p.x=w+10; if (p.x>w+10) p.x=-10; if (p.y<-10) p.y=h+10; if (p.y>h+10) p.y=-10; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); } animId=requestAnimationFrame(step); }
  window.addEventListener('resize', ()=>{ init(); });
  init(); animId=requestAnimationFrame(step);
  window.__bgParticles = { pause(){ paused=true; if(animId) cancelAnimationFrame(animId); }, resume(){ if(!prefersReduced){ paused=false; animId=requestAnimationFrame(step);} } };
})();
// Parallax
(function parallax(){ if (prefersReduced) return; const grad=document.querySelector('.bg__gradient'); if(!grad) return; let tx=0, ty=0, cx=0, cy=0; function loop(){ tx+=(cx-tx)*0.06; ty+=(cy-ty)*0.06; grad.style.transform=`translate(${tx}px, ${ty}px)`; requestAnimationFrame(loop);} window.addEventListener('pointermove', (e)=>{ cx=(e.clientX/window.innerWidth-0.5)*12; cy=(e.clientY/window.innerHeight-0.5)*12; }, {passive:true}); loop(); })();
// Theme shifts per section
(function themedBackground(){ const THEMES = { home:{h1:210,h2:165}, about:{h1:285,h2:210}, skills:{h1:190,h2:160}, setup:{h1:120,h2:170}, projects:{h1:20,h2:350}, tips:{h1:260,h2:200}, contact:{h1:120,h2:170} }; const ids=Object.keys(THEMES); const rootStyle=document.documentElement.style; const obs=new IntersectionObserver((entries)=>{ entries.forEach(entry=>{ if(!entry.isIntersecting) return; const id=entry.target.id; const t=THEMES[id]; if(t){ rootStyle.setProperty('--h1', t.h1); rootStyle.setProperty('--h2', t.h2); const angle=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grad-angle'))||0; rootStyle.setProperty('--grad-angle', (angle+30)+'deg'); } }); }, {threshold:0.6}); ids.map(id=>document.getElementById(id)).filter(Boolean).forEach(s=>obs.observe(s)); })();
// FX toggle
(function fxToggle(){ const btn=document.getElementById('fxToggle'); if(!btn) return; let enabled=true; function setState(on){ enabled=on; btn.setAttribute('aria-pressed', String(on)); const bg=document.querySelector('.bg'); if(bg) bg.style.opacity = on ? '1' : '0'; if(window.__bgParticles){ on?window.__bgParticles.resume():window.__bgParticles.pause(); } } btn.addEventListener('click', ()=>setState(!enabled)); })();

/* ===== Resume menu (View Online removed) ===== */
const resumeBtnWrap = document.querySelector('.menu-btn');
const resumeBtn = document.getElementById('resumeBtn');
const downloadResume = document.getElementById('downloadResume');
if (resumeBtnWrap && resumeBtn && downloadResume) {
  downloadResume.href = 'assets/resume/Chrisden_Cristobal_Resume.docx';
  const toggleMenu = (open) => { resumeBtnWrap.classList.toggle('open', open); resumeBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); };
  resumeBtn.addEventListener('click', (e)=>{ e.preventDefault(); toggleMenu(!resumeBtnWrap.classList.contains('open')); });
  document.addEventListener('click', (e)=>{ if(!resumeBtnWrap.contains(e.target)) toggleMenu(false); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') toggleMenu(false); });
}

/* ===== Support Tip of the Day (>40, witty) ===== */
(function supportTips(){
  const TIPS = [
    "Windows: Press Win + Shift + S to snip your screen—because a picture is worth a thousand Slack messages.",
    "Windows: Ctrl + Shift + Esc opens Task Manager faster than you can say ‘Why is Chrome like this?’.",
    "Windows: Win + X is the secret admin door—Device Manager, Terminal, and more, no spelunking required.",
    "Windows: Storage Sense auto-cleans temp files; let it spring‑clean so you don’t have to Marie Kondo your C: drive.",
    "Windows: Copy/paste misbehaving? Restart Windows Explorer—no, not Edge—the other Explorer.",
    "Windows: Win + V turns on clipboard history. Past you saved it for future you. You’re welcome, future you.",
    "Windows: Night Light saves eyes after 9 PM. Your retinas will send a thank‑you note.",
    "macOS: Cmd + Shift + 4 for precision screenshots. Add Spacebar to capture the whole window—bonus shadow included.",
    "macOS: Option‑click the Wi‑Fi icon for nerdy signal stats. It’s like x‑ray vision for routers.",
    "macOS: If Spotlight forgets things, reindex it. Think of it as coffee for search.",
    "Chrome/Edge: Ctrl/Cmd + Shift + N for Incognito to rule out extensions. Sometimes the culprit is your ‘productivity’ plug‑in.",
    "Chrome: Shift + Esc opens Chrome’s Task Manager. Find the tab gobbling RAM like it’s at an all‑you‑can‑eat buffet.",
    "Browser: Hard reload (Ctrl/Cmd + Shift + R) whacks stubborn cache. Because yesterday’s CSS shouldn’t ruin today.",
    "Network: Quick reset in Windows Settings can beat the ‘Have you tried turning it off and on again?’ meme.",
    "Wi‑Fi: Try 5 GHz for speed, 2.4 GHz for range. Pick your fighter.",
    "DNS: ipconfig /flushdns — because stale DNS is like bad directions from 2012.",
    "Outlook: outlook.exe /safe starts without add‑ins. It’s Outlook, but chill.",
    "Outlook Search: Rebuild Index. When Outlook forgets, teach it to remember.",
    "Teams (classic): Clear the cache folders. It’s like a spa day for presence and notifications.",
    "OneDrive: /reset the client, then relaunch. Sometimes sync just needs a pep talk.",
    "Excel: Ctrl + ; for today’s date, Ctrl + Shift + : for time—because typing 2026 is so last year.",
    "Troubleshooting: Ask ‘What changed last?’ Your culprit loves dramatic entrances.",
    "Isolation: New user profile = clean slate. If it works there, the plot thickens.",
    "Security: MFA everywhere. Hackers hate multi‑step plans.",
    "Passwords: Use a manager. Your brain has better things to memorize—like coffee orders.",
    "Meetings: Wired headsets > Bluetooth drama. Fewer dropouts, more ‘You’re on mute’ moments avoided.",
    "Files: Paths >260 chars make apps grumpy. Shorten like you’re editing a tweet.",
    "USB: A cheap USB‑C hub + Ethernet dongle solves 80% of mystery connectivity woes.",
    "Printers: If it won’t print, try printing to PDF first. If that fails… it’s not you, it’s drivers.",
    "Windows Update: Pause/retry after a reboot. Love is patient; Windows Update is… persistent.",
    "Audio: Crackling on Bluetooth? Disable Hands‑Free Telephony in device properties. Your music will stop sounding like cereal.",
    "Display: Win + Ctrl + Shift + B resets graphics drivers. Screen flickers once—like a magic trick.",
    "Edge: ‘Reset settings’ can exorcise haunted homepages.",
    "Wi‑Fi: Don’t hide the router in a cabinet. It’s a radio, not a houseplant.",
    "Latency: Test with a wired cable before blaming the universe.",
    "VPN: Split‑tunneling can speed up non‑work sites. Or… stop streaming during deployments. 😉",
    "Backups: If it doesn’t exist in two places, it doesn’t exist. Future you will buy past you a coffee.",
    "Keyboard: Sticky keys? Compressed air + isopropyl. Breadcrumbs go in you, not under keys.",
    "Email: Delay send by 2 minutes as a safety net. Catch oops before they catch you.",
    "Tabs: 100+ tabs isn’t multitasking—it’s archaeology. Use bookmarks.",
    "Logs: Timestamp your repro steps. Logs love a good timeline.",
    "Cables: Label both ends. Future desk‑crawling avoided.",
    "Power: Random shutdowns? Check the outlet and strip before blaming the motherboard.",
    "Thermals: Dust bunnies are not pets. Clean fans = quiet PC.",
    "Shortcuts: Win + L to lock. Protects data and your snack stash.",
    "Support Zen: Reboot the device and your expectations. One of them will fix it. 😄"
  ];
  const tipEl = document.getElementById('tipText');
  const nextBtn = document.getElementById('nextTip');
  const prevBtn = document.getElementById('prevTip');
  const counterEl = document.getElementById('tipCounter');
  if (!tipEl || !nextBtn || !prevBtn || !counterEl) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const dayIndex = Math.floor(today.getTime()/86400000) % TIPS.length;
  const KEY = 'tipIndex-' + today.toISOString().slice(0,10);
  let index = Number(localStorage.getItem(KEY));
  if (Number.isNaN(index)) index = dayIndex;
  function render(){ tipEl.textContent = TIPS[index]; counterEl.textContent = `Tip ${index+1} of ${TIPS.length}`; }
  function setIndex(i){ index = (i + TIPS.length) % TIPS.length; localStorage.setItem(KEY, String(index)); render(); }
  nextBtn.addEventListener('click', ()=> setIndex(index+1));
  prevBtn.addEventListener('click', ()=> setIndex(index-1));
  tipEl.parentElement.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight') setIndex(index+1); if(e.key==='ArrowLeft') setIndex(index-1); });
  render();
})();

/* ===== Philippines local time with 12/24h toggle ===== */
(function showPHTimeToggle(){
  const timeEl = document.getElementById('phTime');
  const toggleEl = document.getElementById('tzToggle');
  if (!timeEl || !toggleEl || !('Intl' in window)) return;
  const KEY = 'phTimeFormat';
  let is24h = (localStorage.getItem(KEY) === '24');
  function formatTime(date){
    const opts = { minute: '2-digit', timeZone: 'Asia/Manila', hour12: !is24h };
    opts.hour = is24h ? '2-digit' : 'numeric';
    return new Intl.DateTimeFormat(undefined, opts).format(date);
  }
  function render(){
    const now = new Date();
    const modeLabel = is24h ? '24‑hour' : '12‑hour';
    timeEl.textContent = `— Local time now: ${formatTime(now)} (${modeLabel})`;
    toggleEl.setAttribute('aria-pressed', String(is24h));
    toggleEl.title = `Click to switch to ${is24h ? '12‑hour' : '24‑hour'} format`;
  }
  toggleEl.addEventListener('click', (e)=>{ e.preventDefault(); is24h = !is24h; localStorage.setItem(KEY, is24h ? '24' : '12'); render(); });
  render();
  setInterval(render, 60*1000);
})();

/* ===== Flip behavior for Work Project cards ===== */
const cards=[...document.querySelectorAll('.project-card')];
cards.forEach(card=>{
  card.addEventListener('click',e=>{e.stopPropagation();card.classList.toggle('is-flipped');});
});

document.addEventListener('click',()=>cards.forEach(c=>c.classList.remove('is-flipped')));

/* ===== Tilt (3D look-at) for .tilt and .project-card ===== */
(function tiltCards(){
  const supportsHover = window.matchMedia('(hover:hover)').matches;
  if (!supportsHover) return; // skip on touch-only devices
  const MAX = 10; // degrees
  const els = document.querySelectorAll('.tilt, .project-card');
  els.forEach(el => {
    el.addEventListener('mousemove', (e)=>{
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / (rect.width/2);
      const dy = (e.clientY - cy) / (rect.height/2);
      const rx = (+dy * MAX).toFixed(2);
      const ry = (-dx * MAX).toFixed(2);
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
  });
})();

/* ===== Typewriter effect for main headline (once per load) ===== */
(function typeHeadline(){
  const h1 = document.querySelector('#home h1');
  if (!h1) return;
  const full = h1.textContent.trim();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { h1.textContent = full; return; }
  h1.setAttribute('aria-label', full);
  h1.textContent = '';
  let i = 0;
  const speed = 75; // ms per character
  const timer = setInterval(() => {
    h1.textContent += full.charAt(i++);
    if (i >= full.length) clearInterval(timer);
  }, speed);
})();
