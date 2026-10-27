// Navigation test variants for concept.pravdukhin.com/nav/{a,b,c}/
// A: the stage rail grows into 10 dashes (5 ring stages + 5 sections), fixed bottom left on every page
// B: A + the label next to the rail opens a contents sheet drawn like the day scale
// C: the ring untouched; after the ring a top bar with a compact pill that opens the same sheet
(() => {
const S = document.currentScript, V = S.dataset.v, PAGE = S.dataset.page, V6 = (S.dataset.v6 || 'a').toLowerCase();
document.documentElement.classList.add('v6', 'v6' + V6); // 'main' | 'scan'
const MAIN = S.dataset.main || '/nav/' + V.toLowerCase() + '.html', SCAN = S.dataset.scan || '/nav/' + V.toLowerCase() + '-scan.html';
const TXT = {
  en: { items: ['Brief', 'Digital copy', '3D model', 'Render', 'Show day', 'Portfolio', 'About', 'Stages and pricing', 'Scanning', 'Contact'],
        name: 'Yuriy Pravdukhin', kick: 'One project, 60 days', cta: 'Discuss your project', page: 'Full scanning page', allp: 'All projects', all: 'All sections', menu: 'Contents', close: 'Close' },
  ru: { items: ['Бриф', 'Цифровая копия', '3D-модель', 'Рендер', 'Мероприятие', 'Портфолио', 'Обо мне', 'Этапы и стоимость', 'Сканирование', 'Контакты'],
        name: 'Юрий Правдухин', kick: 'Один проект, 60 дней', cta: 'Обсудить проект', page: 'Отдельная страница', allp: 'Все проекты', all: 'Все разделы', menu: 'Содержание', close: 'Закрыть' }
};
const DAYS = ['−60', '−45', '−30', '−20', '0'];
// portfolio in the site map: the landing's PROJECTS when present, else this copy (update it when projects change)
const PROJ_COPY = [["tuscany-2026", "Italy Event", 2026], ["istanbul-2026", "Istanbul Event", 2026], ["amway-kuala-lumpur-2026", "Amway LTS Malaysia", 2026], ["iba-dubai-2025", "IBA Dubai", 2025], ["amway-shanghai-2025", "Amway LTS Shanghai", 2025], ["belgrade-2024", "Belgrade Conference", 2024], ["bvlgari-dubai-2024", "Bvlgari Dubai", 2024], ["istanbul-cistern-2024", "Istanbul Conference", 2024], ["amway-abu-dhabi-2024", "Amway Conference", 2024], ["emirates-palace-2024", "Amway Gala Dinner", 2024], ["villette-2024", "France Wedding", 2024], ["challain-2023", "France Wedding", 2023], ["amway-thailand-2023", "Amway Conference", 2023], ["tiktok-cyprus-2022", "TikTok", 2022]];
const projs = () => (typeof PROJECTS !== 'undefined' ? PROJECTS.map(p => [p.slug, p.title, p.year]) : PROJ_COPY);
const dlg = document.getElementById('dlg');
const dlgOpen = () => !!(dlg && dlg.open);
const dlgSlug = () => (dlgOpen() && location.hash.length > 1 ? location.hash.slice(1) : '');
const SEC = ['work', 'about', 'how', 'scanning', 'contact'];
const SEC_ORDER = [6, 5, 7, 8, 9];   // as on the page: About, Portfolio, Stages and pricing, Scanning, Contact // 8 = scanning section on the landing (the page itself is a sub-row in the sheet)
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
.nb .l{display:flex;align-items:center;gap:10px;min-width:0}
/* back to where the visitor left the first block: the same amber arrow as on the first screen, pointing up,
   above the heading of the section the visitor landed on; only after one of the first-block buttons was used */
.retA{appearance:none;background:none;border:0;padding:6px 14px 6px 0;margin:0;color:var(--amber);font:inherit;font-size:clamp(24px,2.2vw,30px);line-height:1;cursor:pointer;display:flex;align-items:center;gap:10px;-webkit-tap-highlight-color:transparent}
.retA[hidden]{display:none}
.retA span{display:block;animation:retUp 1.6s ease-in-out infinite}
.retA small{font-size:clamp(13px,1.1vw,15px);color:var(--dim);letter-spacing:.02em}
.retA:hover small{color:var(--ink)}
@keyframes retUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@media (prefers-reduced-motion:reduce){.retA span{animation:none}}
section.s.hasRetA{position:relative}
section.s > .retA{position:absolute;left:var(--pad);top:40px}
.hero .retA{margin:0 0 10px}
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
.sh li.sub a{font-size:16px;padding:2px 0 10px;color:var(--dim)}
.sh li.sub a .t{padding-left:44px;position:relative}
.sh li.sub a .t::before{content:"";position:absolute;left:28px;top:-6px;width:8px;height:12px;border-left:1px solid rgba(232,236,241,.35);border-bottom:1px solid rgba(232,236,241,.35)}
.sh li.sub a i{font-style:normal;color:var(--amber);margin-left:6px}
.sh li.pj a{font-size:15px;padding:3px 0 5px}
.sh li.pj a em{font-style:normal;color:rgba(141,154,174,.7);font-size:13px;font-variant-numeric:tabular-nums;margin-left:4px}
.sh li.sub a::before{display:none}
.sh li.sub.on a{color:var(--ink)}
.sh li.sub a:hover{color:var(--ink)}
.sh .ft{margin-top:auto;padding-top:26px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.sh .ft .btn{margin:0}
.scale .sc-read{cursor:pointer}
body.navpad{padding-bottom:64px}
/* ===== v6 test ===== */
.burg{position:fixed;z-index:32;top:calc(12px + env(safe-area-inset-top,0px));right:max(12px,calc(var(--pad) - 10px));width:46px;height:46px;border-radius:50%;appearance:none;border:0;background:rgba(8,20,36,.35);color:var(--ink);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:0;-webkit-tap-highlight-color:transparent;transition:background .2s}
.burg:hover{background:rgba(242,166,72,.14)}
.burg .bl{display:block;width:24px;height:2px;border-radius:1px;background:currentColor}
.burg.burg-in{position:static;background:none;width:40px;height:40px}
.nb .r{padding-right:52px}
.nb{padding-top:calc(17px + env(safe-area-inset-top,0px));padding-bottom:17px}
/* the day scale sits under the burger */
.scale{margin-top:0}
.scale .sc-read{margin-right:56px;margin-left:-56px;transition:opacity .45s ease}
.at0 .scale .sc-read{opacity:0}
.scale .dp{transition:opacity .45s ease}
.st0 .scale .dp{opacity:0;pointer-events:none}
.dp button.r0{display:none}
/* phones: the name needs the top row; the counter (and the percent) go right under the burger */
@media (max-width:560px){.scale .sc-read{margin:38px 0 10px 0}.v6 .pct{right:var(--pad);top:calc(60px + env(safe-area-inset-top,0px))}}
.dp .ln2{display:none}
/* loading percent on the first screen, where the day counter will be */
.pct{position:absolute;z-index:3;right:calc(var(--pad) + 56px);top:calc(22px + env(safe-area-inset-top,0px));pointer-events:none;font-variant-numeric:tabular-nums;color:var(--amber);font-size:clamp(26px,2.6vw,34px);font-weight:300;letter-spacing:-.02em;line-height:1.08;opacity:0;transition:opacity .45s ease;text-shadow:0 1px 10px rgba(8,20,36,.85)}
.pct small{font-size:.5em;margin-left:.08em;color:var(--dim)}
.at0 .pct{opacity:1}
/* variants */
.v6c #rail, .v6d #rail{display:none}
.v6b .dp, .v6d .dp{display:none}
.v6b .scale .sc-read, .v6d .scale .sc-read{margin-bottom:0}
.v6c .dp button span{opacity:0;transition:opacity .3s}
.v6c .dp button.on span{opacity:1}
.v6b #rail{margin-top:10px}
.v6b #rail button{position:relative;padding-bottom:20px}
.v6b #rail button::after{content:attr(data-d);position:absolute;left:0;top:20px;font-size:11px;color:#b9c3cf;font-variant-numeric:tabular-nums;letter-spacing:.02em;text-shadow:0 1px 8px rgba(8,20,36,.9)}
.v6b #rail button.on::after{color:var(--ink)}

/* D: the day scale becomes the path: rows in scroll order, the dot only goes down */
.dp{position:relative;margin-left:auto;width:max-content;padding-right:6px}
.dp .ln{position:absolute;right:6px;top:0;bottom:0;width:1px;background:rgba(232,236,241,.42)}
.dp .ln2{position:absolute;right:6px;width:1px;background:repeating-linear-gradient(to bottom,rgba(232,236,241,.42) 0 3px,transparent 3px 6px)}
.dp .fill{position:absolute;right:6px;top:0;width:1px;background:var(--amber)}
.dp .dot{position:absolute;right:2.5px;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:var(--amber);box-shadow:0 0 0 3px rgba(8,20,36,.45),0 0 14px rgba(242,166,72,.55)}
.dp button{position:relative;display:flex;justify-content:flex-end;align-items:baseline;gap:9px;width:100%;height:var(--dph);padding:0 16px 0 0;border:0;background:none;color:var(--sdim,#b9c3cf);font:inherit;font-size:12px;letter-spacing:.02em;white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:color .3s;align-items:center}
.dp button::before{content:"";position:absolute;right:-4px;top:50%;width:9px;height:1px;background:rgba(232,236,241,.6)}
.dp button b{font-weight:400;min-width:2.3em;text-align:left;color:inherit;order:2}
.dp button span{order:1}
.dp button.on{color:var(--ink)}
.dp button.pas{color:rgba(185,195,207,.75)}
.dp button:hover span{text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(232,236,241,.4)}
.dp button.all{margin-top:10px;color:var(--ink)}
@media (max-width:560px){.dp button.all{margin-top:4px}.scale:has(.dp) .sc-read{margin-bottom:12px}}
.dp button.all .ic{display:inline-block;width:12px;height:8px;border-top:1.2px solid currentColor;border-bottom:1.2px solid currentColor;position:relative;order:2;margin-right:calc(2.3em - 12px)}
.dp button.all .ic::after{content:"";position:absolute;left:0;right:0;top:50%;height:1.2px;margin-top:-.6px;background:currentColor}
.dp button.all::before{display:none}
:root{--dph:26px}@media (max-width:560px){:root{--dph:21px}}

@media (max-width:560px){body.navscan .hero{padding-bottom:96px}}
`;
document.head.appendChild(css);

// ---------- state: which of the 10 items is current ----------
const ring = document.getElementById('ring');
function onRing() { if (PAGE !== 'main' || !ring) return false; return ring.getBoundingClientRect().bottom >= innerHeight * .5; }
function current() {
  if (PAGE === 'scan') return 8;
  if (dlgOpen()) return 5;
  if (onRing()) return (typeof stageOf === 'function' && typeof step !== 'undefined') ? stageOf(step) : 0;
  let k = SEC_ORDER[0], best = -1e9;   // the lowest section whose top has passed the upper part of the screen
  SEC.forEach((id, j) => { if (!id) return; const e = document.getElementById(id); if (!e) return; const t = e.getBoundingClientRect().top; if (t < innerHeight * .45 && t > best) { best = t; k = 5 + j; } });
  return k;
}
// progress: passed items dim amber, current bright
const ORD = i => i < 5 ? i : 5 + SEC_ORDER.indexOf(i);
const cls = (i, a) => (i === a ? 'on' : (ORD(i) < ORD(a) ? 'p' : '')) + (i >= 5 ? ' sec' : '');

// ---------- going places ----------
function go(i) {
  closeSheet();
  if (dlgOpen()) dlg.close();
  if (PAGE === 'scan') { location.href = MAIN + (i < 5 ? '#s' + i : '#' + SEC[i - 5]); return; }
  if (i === 8 && !document.getElementById('scanning')) { location.href = SCAN; return; }
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

// projects in the map: only while in the portfolio (or on a project page); the same ones the landing shows (3 on phones, 6 wider),
// all of them once "All projects" is open there
function pjRows(a) {
  if (PAGE !== 'main' || a !== 5) return '';
  const g = document.getElementById('wgrid'), cut = !!(g && g.classList.contains('cut'));
  const vis = new Set(g ? [...g.children].filter(c => c.offsetParent !== null).map(c => c.dataset.slug) : []);
  const list = projs().filter(([sl]) => !cut || vis.has(sl) || sl === dlgSlug());
  return list.map(([sl, t, y]) => `<li class="sub pj${sl === dlgSlug() ? ' on' : ''}"><a href="#${sl}" data-pj="${sl}"><span class="d"></span><span class="t">${t} <em>${y}</em></span></a></li>`).join('')
    + (cut ? `<li class="sub pj pjall"><a href="#work" data-pjall="1"><span class="d"></span><span class="t">${X().allp} <em>${projs().length}</em><i>↓</i></span></a></li>` : '');
}
function goProject(slug) {
  closeSheet();
  if (PAGE === 'scan' || typeof openProject !== 'function') { location.href = MAIN + '#' + slug; return; }
  if (!dlgOpen()) { // behind the project page the landing waits at the portfolio, so "Back" lands there
    const w = document.getElementById('work');
    if (w) { if (typeof freeScroll === 'function') freeScroll(); scrollTo({ top: w.getBoundingClientRect().top + scrollY - 56, behavior: 'instant' }); }
  }
  openProject(slug);
}
// ---------- build ----------
const items = () => X().items;
function dashes(a) {
  return items().map((t, i) => `${i === 5 ? '<span class="gap"></span>' : ''}<button type="button" data-go="${i}" class="${cls(i, a)}" aria-label="${t}"></button>`).join('');
}
function labelHtml(a) { return `${a < 5 && DAYS[a] !== '0' ? `<b>${DAYS[a]}</b>` : ''}<span>${items()[a]}</span>`; }

let bar = null, nr = null, sheet = null, pill = null;
// unified bar (all variants)
bar = $(`<header class="nb" aria-label="Site"><div class="l"><a class="me" href="${PAGE === 'scan' ? MAIN : '#top'}"></a></div><div class="r"><div class="lang" data-lang></div></div></header>`);
// ---------- the way back up: first-block buttons remember the stage they were pressed on ----------
const RET_KEY = 'navRet';
let retSetAt = -1e9;   // just pressed: the page may still be on the ring for a moment (e.g. before leaving for the scanning page)
const getRet = () => { try { const v = JSON.parse(sessionStorage.getItem(RET_KEY)); return v && typeof v.j === 'number' ? v : null; } catch (e) { return null; } };
const setRet = v => { try { if (v === null) sessionStorage.removeItem(RET_KEY); else sessionStorage.setItem(RET_KEY, JSON.stringify(v)); } catch (e) {} };
const RET_T = { pfBtn: 'work', costBtn: 'how', scanBtn: 'scan' };
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('#pfBtn, #scanBtn, #costBtn');
  if (b && typeof stageOf === 'function' && typeof step !== 'undefined') { setRet({ j: stageOf(step), t: RET_T[b.id] }); retSetAt = performance.now(); }
}, true);
function returnTo(j) {
  if (typeof freeScroll === 'function') freeScroll();
  const y = j > 0 && typeof yOf === 'function' ? yOf(STOPS()[j - 1]) : (typeof ringTop === 'function' ? ringTop() : 0);
  scrollTo({ top: y, behavior: 'instant' });
  if (typeof AUTO !== 'undefined') { AUTO.armed = true; AUTO.idx = j - 1; }
}
// one arrow per page, moved into the section the visitor landed on
const retA = $(`<button type="button" class="retA" hidden><span>↑</span><small></small></button>`);
retA.addEventListener('click', () => {
  const r = getRet(); setRet(null); syncRet();
  if (!r) return;
  if (PAGE === 'scan') { location.href = MAIN + '#s' + r.j; return; }
  if (dlgOpen()) dlg.close();
  closeSheet(); returnTo(r.j);
});
function retHost(t) {
  if (PAGE === 'scan') return document.querySelector('main .hero .txt') || document.querySelector('main');
  return t ? document.getElementById(t) : null;
}
function syncRet() {
  if (PAGE === 'main' && onRing() && getRet() !== null && performance.now() - retSetAt > 3000) setRet(null);   // back in the first block by any way: nothing to return to
  const r = getRet(), show = !!r && (PAGE === 'scan' || !onRing());
  if (show) {
    const host = retHost(r.t);
    if (host && retA.parentNode !== host) { if (retA.parentNode && retA.parentNode.classList) retA.parentNode.classList.remove('hasRetA'); host.prepend(retA); host.classList.add('hasRetA'); }
    const L = lang() === 'ru';
    retA.querySelector('small').textContent = L ? 'Вернуться' : 'Back up';
    retA.setAttribute('aria-label', L ? 'Вернуться туда, откуда пришли' : 'Back up to where you were');
  }
  if (retA.hidden === show) retA.hidden = !show;
}

document.body.appendChild(bar);
const BURG = '<span class="bl"></span><span class="bl"></span><span class="bl"></span>';
const burg = $(`<button type="button" class="burg" aria-haspopup="dialog">${BURG}</button>`);
document.body.appendChild(burg); burg.addEventListener('click', openSheet);
let pill2 = null, lang2 = null;
const dlgN = document.getElementById('dlgn');
if (dlgN) {
  pill2 = $(`<button type="button" class="burg burg-in" aria-haspopup="dialog">${BURG}</button>`); lang2 = $(`<div class="lang" data-lang></div>`);
  dlgN.append(lang2, pill2); pill2.addEventListener('click', openSheet);
  // language switch inside a project page: draw the page again in the new language
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-l]') && dlgOpen()) { const sl = dlgSlug(); setTimeout(() => { if (sl && typeof openProject === 'function') { const y = dlg.querySelector('.dlg').scrollTop; openProject(sl); dlg.querySelector('.dlg').scrollTop = y; } }, 0); } });
}

if (V === 'A' || V === 'B') {
  nr = $(`<div class="nr" role="navigation" aria-label="Site"><span class="tip"></span><div class="nd"></div><button type="button" class="nl ${V === 'B' ? 'btn2' : 'plain'}"></button></div>`);
  document.body.appendChild(nr); document.body.classList.add('navpad'); if (PAGE === 'scan') document.body.classList.add('navscan');
  const old = document.getElementById('rail'); if (old) old.style.visibility = 'hidden';
  nr.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); else if (V === 'B' && e.target.closest('.nl')) openSheet(); });
  // hover names (desktop)
  nr.addEventListener('mouseover', e => { const b = e.target.closest('[data-go]'); const tip = nr.querySelector('.tip'); if (!b) return; tip.textContent = items()[+b.dataset.go]; tip.style.left = (b.offsetLeft + nr.querySelector('.nd').offsetLeft) + 'px'; tip.classList.add('on'); });
  nr.addEventListener('mouseleave', () => nr.querySelector('.tip').classList.remove('on'));
}
if (V === 'B' || V === 'C' || V === 'D') {
  sheet = $(`<div class="sh" role="dialog" aria-modal="true"><div class="bg"></div><div class="pn"></div></div>`);
  document.body.appendChild(sheet);
  sheet.querySelector('.bg').addEventListener('click', closeSheet);
  sheet.addEventListener('click', e => {
    const pj = e.target.closest('[data-pj]'); if (pj) { e.preventDefault(); goProject(pj.dataset.pj); return; }
    const pa = e.target.closest('[data-pjall]'); if (pa) { e.preventDefault(); const b = document.querySelector('#wmore button'); if (b) b.click(); renderSheet(); return; }
    const a = e.target.closest('[data-go]'); if (a) { e.preventDefault(); go(+a.dataset.go); } if (e.target.closest('.x')) closeSheet();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  if (dlg) {
    dlg.addEventListener('cancel', e => { if (sheet.classList.contains('open')) { e.preventDefault(); closeSheet(); } });
    dlg.addEventListener('close', () => { if (sheet.classList.contains('open')) closeSheet(); if (sheet.parentNode === dlg) document.body.appendChild(sheet); });
  }
  const rd = document.querySelector('.scale .sc-read'); if (rd) rd.addEventListener('click', openSheet);
}
function renderSheet() {
  if (!sheet) return;
  const a = current(), it = items();
  const row = i => `<li class="${(PAGE === 'scan' && i === 8) || (i === 5 && dlgSlug()) ? 'p sec' : cls(i, a)}"><a href="#" data-go="${i}"><span class="d">${i < 5 ? DAYS[i] : ''}</span><span class="t">${it[i]}</span></a></li>`
    + (i === 8 ? `<li class="sub${PAGE === 'scan' ? ' on' : ''}"><a href="${SCAN}"><span class="d"></span><span class="t">${X().page}<i>↗</i></span></a></li>` : '')
    + (i === 5 ? pjRows(a) : '');
  sheet.querySelector('.pn').innerHTML = `<div class="hd"><a class="me" href="${PAGE === 'scan' ? MAIN : '#top'}">${X().name}</a><button type="button" class="x" aria-label="${X().close}">×</button></div>
    <p class="k">${X().kick}</p><ol>${[0, 1, 2, 3, 4].map(row).join('')}</ol><div class="sp"></div><ol>${SEC_ORDER.map(row).join('')}</ol>
    <div class="ft"><a class="btn wa" href="https://wa.me/393498929736" target="_blank" rel="noopener">${X().cta}</a><div class="lang" data-lang>${langBtns()}</div></div>`;
}
const langBtns = () => ['en', 'ru'].map(l => `<button type="button" data-l="${l}" aria-pressed="${l === lang()}">${l.toUpperCase()}</button>`).join('');
function openSheet() { if (!sheet) return; const host = dlgOpen() ? dlg : document.body; if (sheet.parentNode !== host) host.appendChild(sheet); renderSheet(); sheet.classList.add('open'); document.documentElement.style.overflow = 'hidden'; }
function closeSheet() { if (!sheet || !sheet.classList.contains('open')) return; sheet.classList.remove('open'); document.documentElement.style.overflow = ''; }


// ---------- D: the scale as the path ----------
let dp = null, dpRows = [];
if (V === 'D') {
  const sc = document.getElementById('scale'), tr = document.getElementById('sct');
  if (sc && tr) {
    tr.style.display = 'none';
    dp = $(`<div class="dp"><span class="ln"></span><span class="ln2"></span><span class="fill"></span><span class="dot"></span></div>`);
    sc.appendChild(dp);
    dp.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.classList.contains('all')) openSheet(); else go(+b.dataset.go); });
  }
}
function renderDp() {
  if (!dp) return;
  dp.querySelectorAll('button').forEach(b => b.remove());
  const it = items();
  [0, 1, 2, 3, 4].forEach(i => { const b = document.createElement('button'); b.type = 'button'; b.dataset.go = i; b.innerHTML = `<span>${it[i]}</span><b>${DAYS[i]}</b>`; dp.appendChild(b); });
  dpRows = [...dp.querySelectorAll('button[data-go]')]; dpSt = -1;
  const y = b => b.offsetTop + b.offsetHeight / 2;
  dpRows[0].classList.add('r0');   // the Brief row stays out of the scale (it is the first screen)
  dp.querySelector('.ln').style.cssText = `top:${y(dpRows[1])}px;height:${y(dpRows[4]) - y(dpRows[1])}px;bottom:auto`;
  dp.querySelector('.ln2').style.display = 'none';
}
let dpLang = '', dpYs = null;
function dpLayout() { // row centres inside .dp: they only change with language or size
  if (!dp) return; dpYs = dpRows.map(b => b.offsetTop + b.offsetHeight / 2);
  // the loader on the first screen is placed under the scale: the scale got taller, so place it again
  if (typeof placeLoader === 'function' && typeof LKEY !== 'undefined') { try { LKEY = ''; placeLoader(); } catch (e) {} }
}
// ---------- after the last stage: the same bobbing arrow as on the first screen, under the rail ----------
let more = null;
if (PAGE === 'main' && document.getElementById('rail')) {
  const st = document.createElement('style');
  st.textContent = `.more{position:fixed;z-index:24;left:50%;bottom:calc(3px + env(safe-area-inset-bottom,0px));appearance:none;border:0;background:none;padding:2px 14px;margin:0;color:var(--amber);font:inherit;font-size:22px;line-height:1;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .5s;transform:translateX(-50%);-webkit-tap-highlight-color:transparent}
.more.on{opacity:1;pointer-events:auto}
.more span{display:block;animation:bob 1.6s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.more span{animation:none}}`;
  document.head.appendChild(st);
  more = $(`<button type="button" class="more" aria-label="Portfolio"><span>↓</span></button>`);
  document.body.appendChild(more);
  more.addEventListener('click', () => { if (stageOf(step) === 0) jumpStage(1); else go(SEC_ORDER[0]); });
}
let railX = null;
function moreLayout() { if (!more) return; const rl = document.getElementById('rail'), f = rl.firstElementChild.getBoundingClientRect(), l = rl.lastElementChild.getBoundingClientRect(); railX = [(f.left + l.right) / 2, rl.getBoundingClientRect().bottom]; }
addEventListener('resize', () => { dpYs = null; railX = null; });
// one loop for the scale dot and the arrow; it does nothing when nothing moved
let fKey = '';
const pct = PAGE === 'main' && document.getElementById('stage') ? $(`<div class="pct" aria-live="polite"><b>0</b><small>%</small></div>`) : null;
if (pct) document.getElementById('stage').appendChild(pct);
let at0 = null, st0 = null;
function frame() {
  if (pct && typeof step !== 'undefined') {
    const pn = document.getElementById('pcn'); if (pn) pct.firstChild.textContent = pn.textContent;
    const z = onRing() && step === 0 && !(typeof AUTO !== 'undefined' && AUTO.run);
    if (z !== at0) { at0 = z; document.documentElement.classList.toggle('at0', z); }
    const z0 = onRing() && typeof stageOf === 'function' && stageOf(step) === 0;
    if (z0 !== st0) { st0 = z0; document.documentElement.classList.toggle('st0', z0); }
  }
  if (typeof step !== 'undefined' && typeof STOPS === 'function') {
    if (dp && dpLang !== lang()) { dpLang = lang(); renderDp(); dpYs = null; }
    const run = typeof AUTO !== 'undefined' && AUTO.run;
    const key = scrollY + '|' + innerHeight + '|' + step + '|' + run + '|' + dpLang + '|' + (dpYs ? 1 : 0) + '|' + (typeof LREADY === 'undefined' || LREADY);
    if (key !== fKey) {
      fKey = key;
      const r = ring.getBoundingClientRect(), span = r.height - innerHeight;
      if (dp) {
        if (!dpYs) dpLayout();
        const S = [0, ...STOPS()], ys = dpYs;
        const f = Math.min(1, Math.max(0, -r.top / span)) * (N - 1);   // smooth, from the real scroll
        let k = 0; while (k < 3 && f > S[k + 1]) k++;
        const t = Math.min(1, Math.max(0, (f - S[k]) / (S[k + 1] - S[k])));
        const yy = Math.max(ys[1], ys[k] + t * (ys[k + 1] - ys[k]));
        dpDot.style.transform = `translateY(${yy}px)`;
        dpFill.style.top = ys[1] + 'px'; dpFill.style.height = Math.max(0, yy - ys[1]) + 'px';
        const st = Math.round(k + t);
        if (dpSt !== st) { dpSt = st; dpRows.forEach((b, j) => { b.classList.toggle('on', j === st); b.classList.toggle('pas', j < st); }); }
      }
      if (more) {
        const onR = r.bottom >= innerHeight * .5;
        const ready = typeof LREADY === 'undefined' || LREADY;
        const show = onR && !run && r.bottom >= innerHeight - 1 && ((stageOf(step) === 4 && step >= N - 3) || (step === 0 && ready));
        if (more.classList.contains('on') !== show) more.classList.toggle('on', show);
      }
    }
  }
  requestAnimationFrame(frame);
}
let dpDot = null, dpFill = null, dpSt = -1;
if (dp) { dpDot = dp.querySelector('.dot'); dpFill = dp.querySelector('.fill'); dpDot.style.top = '0'; }
if (dp || more) requestAnimationFrame(frame);

if (V6 === 'b') { const rl = document.getElementById('rail'); if (rl) [...rl.children].forEach((b, j) => b.dataset.d = DAYS[j]); }
// ---------- keep in sync ----------
let last = '';
function sync() {
  const a = current(), r = onRing(), L = lang();
  let on = PAGE === 'scan' || !r;
  bar.classList.toggle('on', on);
  syncRet();
  bar.querySelector('.me').textContent = X().name;
  const lb = bar.querySelector('.lang'); if (!lb.children.length || lb.dataset.k !== L) { lb.innerHTML = langBtns(); lb.dataset.k = L; }
  const key = a + '|' + r + '|' + L + '|' + dlgSlug();
  if (key === last) return; last = key;
  if (nr) {
    nr.querySelector('.nd').innerHTML = dashes(a);
    nr.querySelector('.nl').innerHTML = (V === 'B' ? '<span class="ic"></span>' : '') + labelHtml(a);
    nr.classList.toggle('ring', r); nr.classList.toggle('solid', !r);
    // on the ring the B label hides on phones (frame button lives there); the day scale opens the sheet instead
    nr.querySelector('.nl').style.display = r ? 'none' : '';
  }
  if (lang2 && (!lang2.children.length || lang2.dataset.k !== L)) { lang2.innerHTML = langBtns(); lang2.dataset.k = L; }
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
    // a project link (#slug): the page already opened it; put the landing at the portfolio behind it
    if (projs().some(p => p[0] === h)) { const w = document.getElementById('work'); if (w) { if (typeof freeScroll === 'function') freeScroll(); scrollTo({ top: w.getBoundingClientRect().top + scrollY - 56, behavior: 'instant' }); } return; }
    history.replaceState(null, '', location.pathname);
    if (/^s[0-4]$/.test(h)) { const j = +h[1]; if (j > 0) { const t = setInterval(() => { if (typeof LREADY !== 'undefined' && LREADY) { clearInterval(t); returnTo(j); } }, 150); } }
    else if (SEC.includes(h)) setTimeout(() => go(5 + SEC.indexOf(h)), 50);
  };
  if (document.readyState === 'complete') setTimeout(run, 300); else addEventListener('load', () => setTimeout(run, 300));
}
})();
