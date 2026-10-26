// Navigation test variants for concept.pravdukhin.com/nav/{a,b,c}/
// A: the stage rail grows into 10 dashes (5 ring stages + 5 sections), fixed bottom left on every page
// B: A + the label next to the rail opens a contents sheet drawn like the day scale
// C: the ring untouched; after the ring a top bar with a compact pill that opens the same sheet
(() => {
const S = document.currentScript, V = S.dataset.v, PAGE = S.dataset.page; // 'main' | 'scan'
const MAIN = '/nav/' + V.toLowerCase() + '.html', SCAN = '/nav/' + V.toLowerCase() + '-scan.html';
const TXT = {
  en: { items: ['Show day', 'Digital copy', '3D model', 'Render', 'Built', 'Work', 'About', 'How we work', 'Scanning', 'Contact'],
        name: 'Yuriy Pravdukhin', kick: 'One project, 60 days', cta: 'Discuss your project', menu: 'Contents', close: 'Close' },
  ru: { items: ['Мероприятие', 'Цифровая копия', '3D-модель', 'Рендер', 'Построено', 'Проекты', 'Обо мне', 'Как мы работаем', 'Сканирование', 'Контакты'],
        name: 'Юрий Правдухин', kick: 'Один проект, 60 дней', cta: 'Обсудить проект', menu: 'Содержание', close: 'Закрыть' }
};
const DAYS = ['0', '−45', '−30', '−20', '0'];
const SEC = ['work', 'about', 'how', null, 'contact']; // 8 = scanning page
const lang = () => (document.documentElement.lang === 'ru' ? 'ru' : 'en');
const X = () => TXT[lang()];
const $ = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };

const css = document.createElement('style');
css.textContent = `
:root{--nav-dash:32px;--nav-gap:6px}
@media (max-width:560px){:root{--nav-dash:15px;--nav-gap:5px}}
/* old headers off: one bar for both pages */
header.bar{display:none!important}
.nb{position:fixed;inset:0 0 auto 0;z-index:25;display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:calc(10px + env(safe-area-inset-top,0px)) var(--pad) 10px;background:rgba(8,20,36,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(34,50,74,.7);transform:translateY(-100%);transition:transform .35s ease;font-family:var(--font)}
.nb.on{transform:none}
.nb .me{font-weight:400;font-size:15px;text-decoration:none;white-space:nowrap;color:var(--ink)}
.nb .r{display:flex;align-items:center;gap:10px}
.nb .lang{margin:0}
/* the rail */
.nr{position:fixed;z-index:26;top:auto;right:auto;height:auto;left:var(--pad);bottom:calc(26px + env(safe-area-inset-bottom,0px));display:flex;align-items:center;gap:14px;pointer-events:auto;font-family:var(--font);transition:opacity .3s}
.nr.off{opacity:0;pointer-events:none}
.nr.solid{padding:0 14px;margin-left:-14px;border-radius:12px;background:rgba(8,20,36,.78);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(34,50,74,.7)}
.nd{display:flex;align-items:center;gap:var(--nav-gap)}
.nd .gap{width:calc(var(--nav-gap) * 2.4)}
.nd button{appearance:none;border:0;background:none;padding:12px 0;width:var(--nav-dash);cursor:pointer;-webkit-tap-highlight-color:transparent}
.nd button::before{content:"";display:block;height:2px;background:var(--line);border-radius:1px;transition:background .3s,transform .2s}
.nd button.sec::before{background:rgba(232,236,241,.22)}
.nd button.p::before{background:rgba(242,166,72,.5)}
.nd button.on::before{background:var(--amber)}
.nd button:hover::before{transform:scaleY(1.8)}
.nl{font-size:13px;letter-spacing:.02em;color:var(--ink);white-space:nowrap;background:none;border:0;padding:8px 0;font-family:inherit;cursor:default;display:flex;align-items:center;gap:8px}
.nl b{font-weight:400;color:var(--amber);font-variant-numeric:tabular-nums}
.nl.btn2{cursor:pointer}
.nl .ic{display:inline-block;width:14px;height:9px;border-top:1.4px solid currentColor;border-bottom:1.4px solid currentColor;position:relative;opacity:.8}
.nl .ic::after{content:"";position:absolute;left:0;right:0;top:50%;height:1.4px;margin-top:-.7px;background:currentColor}
.nr.ring .nl.plain{display:none}
.nr .tip{position:absolute;left:0;bottom:100%;margin-bottom:2px;font-size:12px;color:var(--ink);white-space:nowrap;opacity:0;transition:opacity .2s;pointer-events:none;text-shadow:0 1px 8px rgba(8,20,36,.9)}
.nr .tip.on{opacity:1}
/* C: pill in the bar */
.pill{appearance:none;display:flex;align-items:center;gap:10px;padding:7px 12px;border:1px solid var(--line);border-radius:999px;background:rgba(8,20,36,.5);color:var(--ink);font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}
.pill .mini{display:flex;gap:2px;align-items:center}
.pill .mini i{display:block;width:6px;height:2px;border-radius:1px;background:rgba(232,236,241,.25)}
.pill .mini i.p{background:rgba(242,166,72,.5)}.pill .mini i.on{background:var(--amber)}
.pill .mini .g{width:4px}
@media (max-width:420px){.pill .mini{display:none}}
/* the sheet: drawn like the day scale */
.sh{position:fixed;inset:0;z-index:60;display:flex;justify-content:flex-end;visibility:hidden;transition:visibility 0s .35s}
.sh.open{visibility:visible;transition:none}
.sh .bg{position:absolute;inset:0;background:rgba(4,10,20,.55);opacity:0;transition:opacity .35s}
.sh.open .bg{opacity:1}
.sh .pn{position:relative;width:min(100%,420px);height:100%;overflow:auto;background:#081424;border-left:1px solid var(--line);
  padding:calc(22px + env(safe-area-inset-top,0px)) 28px calc(28px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;
  transform:translateX(24px);opacity:0;transition:transform .35s cubic-bezier(.2,.7,.2,1),opacity .35s;font-family:var(--font)}
.sh.open .pn{transform:none;opacity:1}
@media (max-width:560px){.sh .pn{width:100%;border-left:0}}
.sh .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:26px}
.sh .hd .me{font-weight:400;font-size:15px;color:var(--ink);text-decoration:none}
.sh .x{appearance:none;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:none;color:var(--ink);font-size:20px;line-height:1;cursor:pointer}
.sh .k{color:var(--amber);font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 14px}
.sh ol{list-style:none;margin:0;padding:0;position:relative}
.sh ol::before{content:"";position:absolute;left:44px;top:6px;bottom:6px;width:1px;background:rgba(232,236,241,.3)}
.sh li a{position:relative;display:flex;align-items:baseline;gap:0;padding:9px 0;text-decoration:none;color:#c3ccd7;font-size:21px;letter-spacing:-.005em}
.sh li a:hover{color:var(--ink)}
.sh li a .d{width:36px;flex:none;text-align:right;font-size:12px;color:var(--dim);font-variant-numeric:tabular-nums}
.sh li a .t{padding-left:28px}
.sh li a::before{content:"";position:absolute;left:40px;top:50%;width:9px;height:1px;background:rgba(232,236,241,.6)}
.sh li.p a::before{background:rgba(242,166,72,.6)}
.sh li.on a{color:var(--ink)}
.sh li.on a::after{content:"";position:absolute;left:40.5px;top:50%;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:var(--amber);box-shadow:0 0 0 3px rgba(8,20,36,.6),0 0 14px rgba(242,166,72,.55)}
.sh .sp{height:20px}
.sh .ft{margin-top:auto;padding-top:26px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.sh .ft .btn{margin:0}
.scale .sc-read{cursor:pointer}
body.navpad{padding-bottom:64px}
@media (max-width:560px){body.navscan .hero{padding-bottom:96px}}
`;
document.head.appendChild(css);

// ---------- state: which of the 10 items is current ----------
const ring = document.getElementById('ring');
function onRing() { if (PAGE !== 'main' || !ring) return false; return ring.getBoundingClientRect().bottom >= innerHeight * .5; }
function current() {
  if (PAGE === 'scan') return 8;
  if (onRing()) return (typeof stageOf === 'function' && typeof step !== 'undefined') ? stageOf(step) : 0;
  let k = 5;
  SEC.forEach((id, j) => { if (!id) return; const e = document.getElementById(id); if (e && e.getBoundingClientRect().top < innerHeight * .45) k = 5 + j; });
  return k;
}
// progress: passed items dim amber, current bright
const cls = (i, a) => (i === a ? 'on' : (i < a ? 'p' : '')) + (i >= 5 ? ' sec' : '');

// ---------- going places ----------
function go(i) {
  closeSheet();
  if (PAGE === 'scan') { location.href = i === 8 ? SCAN : MAIN + (i < 5 ? '#s' + i : '#' + SEC[i - 5]); return; }
  if (i === 8) { location.href = SCAN; return; }
  if (i < 5) {
    if (!onRing()) { if (typeof freeScroll === 'function') freeScroll(); scrollTo({ top: ring.offsetTop + ring.offsetHeight - innerHeight, behavior: 'instant' }); }
    if (typeof jumpStage === 'function') jumpStage(i);
    return;
  }
  const e = document.getElementById(SEC[i - 5]); if (!e) return;
  if (typeof freeScroll === 'function') freeScroll();
  const far = onRing();
  scrollTo({ top: e.getBoundingClientRect().top + scrollY - 56, behavior: far ? 'instant' : 'smooth' });
}

// ---------- build ----------
const items = () => X().items;
function dashes(a) {
  return items().map((t, i) => `${i === 5 ? '<span class="gap"></span>' : ''}<button type="button" data-go="${i}" class="${cls(i, a)}" aria-label="${t}"></button>`).join('');
}
function labelHtml(a) { return `${a < 5 && DAYS[a] !== '0' ? `<b>${DAYS[a]}</b>` : ''}<span>${items()[a]}</span>`; }

let bar = null, nr = null, sheet = null, pill = null;
// unified bar (all variants)
bar = $(`<header class="nb" aria-label="Site"><a class="me" href="${PAGE === 'scan' ? MAIN : '#top'}"></a><div class="r"><div class="lang" data-lang></div></div></header>`);
document.body.appendChild(bar);
if (V === 'C') { pill = $(`<button type="button" class="pill" aria-haspopup="dialog"></button>`); bar.querySelector('.r').prepend(pill); pill.addEventListener('click', openSheet); }

if (V === 'A' || V === 'B') {
  nr = $(`<div class="nr" role="navigation" aria-label="Site"><span class="tip"></span><div class="nd"></div><button type="button" class="nl ${V === 'B' ? 'btn2' : 'plain'}"></button></div>`);
  document.body.appendChild(nr); document.body.classList.add('navpad'); if (PAGE === 'scan') document.body.classList.add('navscan');
  const old = document.getElementById('rail'); if (old) old.style.visibility = 'hidden';
  nr.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); else if (V === 'B' && e.target.closest('.nl')) openSheet(); });
  // hover names (desktop)
  nr.addEventListener('mouseover', e => { const b = e.target.closest('[data-go]'); const tip = nr.querySelector('.tip'); if (!b) return; tip.textContent = items()[+b.dataset.go]; tip.style.left = (b.offsetLeft + nr.querySelector('.nd').offsetLeft) + 'px'; tip.classList.add('on'); });
  nr.addEventListener('mouseleave', () => nr.querySelector('.tip').classList.remove('on'));
}
if (V === 'B' || V === 'C') {
  sheet = $(`<div class="sh" role="dialog" aria-modal="true"><div class="bg"></div><div class="pn"></div></div>`);
  document.body.appendChild(sheet);
  sheet.querySelector('.bg').addEventListener('click', closeSheet);
  sheet.addEventListener('click', e => { const a = e.target.closest('[data-go]'); if (a) { e.preventDefault(); go(+a.dataset.go); } if (e.target.closest('.x')) closeSheet(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  const rd = document.querySelector('.scale .sc-read'); if (rd) rd.addEventListener('click', openSheet);
}
function renderSheet() {
  if (!sheet) return;
  const a = current(), it = items();
  const row = i => `<li class="${cls(i, a)}"><a href="#" data-go="${i}"><span class="d">${i < 5 ? DAYS[i] : ''}</span><span class="t">${it[i]}</span></a></li>`;
  sheet.querySelector('.pn').innerHTML = `<div class="hd"><a class="me" href="${PAGE === 'scan' ? MAIN : '#top'}">${X().name}</a><button type="button" class="x" aria-label="${X().close}">×</button></div>
    <p class="k">${X().kick}</p><ol>${[0, 1, 2, 3, 4].map(row).join('')}</ol><div class="sp"></div><ol>${[5, 6, 7, 8, 9].map(row).join('')}</ol>
    <div class="ft"><a class="btn wa" href="https://wa.me/393498929736" target="_blank" rel="noopener">${X().cta}</a><div class="lang" data-lang>${langBtns()}</div></div>`;
}
const langBtns = () => ['en', 'ru'].map(l => `<button type="button" data-l="${l}" aria-pressed="${l === lang()}">${l.toUpperCase()}</button>`).join('');
function openSheet() { if (!sheet) return; renderSheet(); sheet.classList.add('open'); document.documentElement.style.overflow = 'hidden'; }
function closeSheet() { if (!sheet || !sheet.classList.contains('open')) return; sheet.classList.remove('open'); document.documentElement.style.overflow = ''; }

// ---------- keep in sync ----------
let last = '';
function sync() {
  const a = current(), r = onRing(), L = lang();
  bar.classList.toggle('on', PAGE === 'scan' || !r);
  bar.querySelector('.me').textContent = X().name;
  const lb = bar.querySelector('.lang'); if (!lb.children.length || lb.dataset.k !== L) { lb.innerHTML = langBtns(); lb.dataset.k = L; }
  const key = a + '|' + r + '|' + L;
  if (key === last) return; last = key;
  if (nr) {
    nr.querySelector('.nd').innerHTML = dashes(a);
    nr.querySelector('.nl').innerHTML = (V === 'B' ? '<span class="ic"></span>' : '') + labelHtml(a);
    nr.classList.toggle('ring', r); nr.classList.toggle('solid', !r);
    // on the ring the B label hides on phones (frame button lives there); the day scale opens the sheet instead
    nr.querySelector('.nl').style.display = r ? 'none' : '';
  }
  if (pill) pill.innerHTML = `<span class="mini">${items().map((t, i) => `${i === 5 ? '<span class="g"></span>' : ''}<i class="${cls(i, a)}"></i>`).join('')}</span><span>${labelHtml(a)}</span><span class="ic" style="display:none"></span>`;
  if (sheet && sheet.classList.contains('open')) renderSheet();
}
// the old rail/scale keep working; we only listen
addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync);
new MutationObserver(() => { last = ''; sync(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
setInterval(sync, 250);
sync();

// links inside the copied pages: stay inside the test variant
document.querySelectorAll('a[href="3d-venue-scanning/"], #scanBtn').forEach(a => a.setAttribute('href', SCAN));
if (PAGE === 'scan') document.querySelectorAll('a[href="../"]').forEach(a => a.setAttribute('href', MAIN));
// section links (#work…) work with <base href="/">
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a || a.closest('.sh')) return;
  const id = a.getAttribute('href').slice(1);
  if (id === 'top') { e.preventDefault(); if (typeof freeScroll === 'function') freeScroll(); scrollTo({ top: 0, behavior: 'instant' }); return; }
  const i = SEC.indexOf(id); if (i >= 0) { e.preventDefault(); go(5 + i); }
}, true);
// arriving from the scanning page: #s0..#s4 = ring stage, #work… = section
if (PAGE === 'main' && location.hash) {
  const h = location.hash.slice(1);
  const run = () => {
    history.replaceState(null, '', location.pathname);
    if (/^s[0-4]$/.test(h)) { const j = +h[1]; if (j > 0) { const t = setInterval(() => { if (typeof LREADY !== 'undefined' && LREADY) { clearInterval(t); jumpStage(j); } }, 150); } }
    else if (SEC.includes(h)) setTimeout(() => go(5 + SEC.indexOf(h)), 50);
  };
  if (document.readyState === 'complete') setTimeout(run, 300); else addEventListener('load', () => setTimeout(run, 300));
}
})();
