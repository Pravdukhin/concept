// Navigation test variants for concept.pravdukhin.com/nav/{a,b,c}/
// A: the stage rail grows into 10 dashes (5 ring stages + 5 sections), fixed bottom left on every page
// B: A + the label next to the rail opens a contents sheet drawn like the day scale
// C: the ring untouched; after the ring a top bar with a compact pill that opens the same sheet
(() => {
const HASH0 = location.hash;   // v8.2: the address as it came, before the page cleans it
const S = document.currentScript, V = S.dataset.v, PAGE = S.dataset.page, V6 = (S.dataset.v6 || 'a').toLowerCase();
document.documentElement.classList.add('v6', 'v6' + V6); // 'main' | 'scan'
const MAIN = S.dataset.main || '/nav/' + V.toLowerCase() + '.html', SCAN = S.dataset.scan || '/nav/' + V.toLowerCase() + '-scan.html';
const TXT = {
  en: { items: ['Start', 'Digital copy', '3D model', 'Render', 'Show day', 'Portfolio', 'About', 'Work stages and pricing', 'Scanning', 'Contact', 'Interactive presentation'],
        name: 'Yuriy Pravdukhin', kick: 'One project, 60 days', cta: 'Discuss your project', page: 'Scanning in detail', allp: 'All projects', all: 'All sections', menu: 'Contents', close: 'Close' },
  ru: { items: ['Начало', 'Цифровая копия', '3D-модель', 'Рендер', 'Мероприятие', 'Портфолио', 'Обо мне', 'Этапы работы и стоимость', 'Сканирование', 'Контакты', 'Интерактивная презентация'],
        name: 'Юрий Правдухин', kick: 'Один проект, 60 дней', cta: 'Обсудить проект', page: 'Подробно о сканировании', allp: 'Все проекты', all: 'Все разделы', menu: 'Содержание', close: 'Закрыть' }
};
const DAYS = ['−60', '−45', '−30', '−20', '0'];
// portfolio in the site map: the landing's PROJECTS when present, else this copy (update it when projects change)
const PROJ_COPY = [["tuscany-2026", "Private event in Italy", 2026, "Частное мероприятие в Италии"], ["istanbul-2026", "Private event in Istanbul", 2026, "Частное мероприятие в Стамбуле"], ["kuala-lumpur-2026", "Conference in Kuala Lumpur", 2026, "Конференция в Куала-Лумпуре"], ["dubai-2025", "Sports event in Dubai", 2025, "Спортивное мероприятие в Дубае"], ["belgrade-2024", "Conference in Belgrade", 2024, "Конференция в Белграде"], ["dubai-2024", "Private event in Dubai", 2024, "Частное мероприятие в Дубае"], ["amway-shanghai-2025", "Conference in Shanghai", 2025, "Конференция в Шанхае"], ["istanbul-cistern-2024", "Conference in Istanbul", 2024, "Конференция в Стамбуле"], ["amway-abu-dhabi-2024", "Conference in Abu Dhabi", 2024, "Конференция в Абу-Даби"], ["emirates-palace-2024", "Gala dinner in Abu Dhabi", 2024, "Гала-ужин в Абу-Даби"], ["villette-2024", "Private event near Paris", 2024, "Частное мероприятие под Парижем"], ["challain-2023", "Private event in the Loire Valley", 2023, "Частное мероприятие в долине Луары"], ["amway-thailand-2023", "Conference in Thailand", 2023, "Конференция в Таиланде"], ["tiktok-cyprus-2022", "Corporate event in Limassol", 2022, "Корпоративное мероприятие в Лимасоле"]];
const projs = () => (typeof PROJECTS !== 'undefined' ? PROJECTS.map(p => [p.slug, (lang() === 'ru' && p.title_ru) || p.title, p.year])
  : PROJ_COPY.map(p => [p[0], (lang() === 'ru' && p[3]) || p[1], p[2]]));
// v8.1: interactive presentations: the landing's PRES when present, else this copy (update it when presentations change)
const PRES_COPY = [['https://demo.pravdukhin.com/private-event-164/', 'Private event · 164 guests', 'Частное мероприятие · 164 гостя'], ['https://demo.pravdukhin.com/private-event-63/', 'Private event · 63 guests', 'Частное мероприятие · 63 гостя']];
const pres = () => (typeof PRES !== 'undefined' ? PRES.map(p => [p.url, (lang() === 'ru' && p.t_ru) || p.t]) : PRES_COPY.map(p => [p[0], (lang() === 'ru' && p[2]) || p[1]]));
const dlg = document.getElementById('dlg');
const dlgOpen = () => !!(dlg && dlg.open);
const dlgSlug = () => (dlgOpen() && location.hash.length > 1 ? location.hash.slice(1) : '');
const SEC = ['work', 'about', 'how', 'scanning', 'contact', 'interactive'];
const SEC_ORDER = [6, 5, 7, 8, 10, 9];   // as on the page: About, Portfolio, Stages and pricing, Scanning, Contact // 8 = scanning section on the landing (the page itself is a sub-row in the sheet)
const lang = () => (document.documentElement.lang === 'ru' ? 'ru' : 'en');
const X = () => TXT[lang()];
const $ = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };

// ---------- v8.1: mode "pres" for the presentations on demo.pravdukhin.com ----------
// Only the ≡ button and the site map. The page keeps its logo, its own language switch and its popup.
// The button goes into [data-site-nav] if the page has one, else it is fixed top right.
// v8.1.1: every class here starts with pvn- and tags inside are reset: the host page has its own .cta, .k, .x…
if (PAGE === 'pres') {
  const MAINP = S.dataset.main || 'https://pravdukhin.com/', SCANP = S.dataset.scan || MAINP + '3d-venue-scanning/';
  const WA = { en: 'Hello Yuriy, I’d like to discuss a project. Please send me the 8 questions for a preliminary budget.',
               ru: 'Здравствуйте, Юрий! Хочу обсудить проект. Пришлите, пожалуйста, 8 вопросов для предварительного бюджета.' };
  const q = u => { const [b, h] = u.split('#'); return b + (b.includes('?') ? '&' : '?') + 'lang=' + lang() + (h ? '#' + h : ''); };
  const here = location.pathname.replace(/index\.html$/, '');
  const st = document.createElement('style');
  st.textContent = `
.pvn-burg,.pvn-sh{--pv-ink:#e8ecf1;--pv-dim:#8d9aae;--pv-line:#22324a;--pv-amber:#f2a648;--pv-bg:#081424;font-family:Geist,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.pvn-burg{all:unset;box-sizing:border-box;width:46px;height:46px;border-radius:50%;background:rgba(8,20,36,.45);color:var(--pv-ink);cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;-webkit-tap-highlight-color:transparent;transition:background .2s;flex:none}
.pvn-burg:hover{background:rgba(242,166,72,.16)}
.pvn-burg i{all:unset;display:block;width:22px;height:2px;border-radius:1px;background:currentColor}
.pvn-burg.pvn-fx{position:fixed;z-index:70;top:calc(12px + env(safe-area-inset-top,0px));right:12px}
.pvn-sh ol,.pvn-sh li,.pvn-sh p,.pvn-sh a,.pvn-sh span,.pvn-sh i,.pvn-sh button,.pvn-sh div{all:unset;box-sizing:border-box}
.pvn-sh{position:fixed;inset:0;z-index:2147483000;display:flex;justify-content:flex-end;visibility:hidden;transition:visibility 0s .35s}
.pvn-sh.pvn-open{visibility:visible;transition:none}
.pvn-sh .pvn-bg{display:block;position:absolute;inset:0;background:rgba(4,10,20,.55);opacity:0;transition:opacity .35s}
.pvn-sh.pvn-open .pvn-bg{opacity:1}
.pvn-sh .pvn-pn{position:relative;width:min(100%,420px);height:100%;overflow:auto;background:var(--pv-bg);border-left:1px solid var(--pv-line);color:var(--pv-ink);
  padding:calc(22px + env(safe-area-inset-top,0px)) 28px calc(28px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;
  transform:translateX(24px);opacity:0;transition:transform .35s cubic-bezier(.2,.7,.2,1),opacity .35s;text-align:left}
.pvn-sh.pvn-open .pvn-pn{transform:none;opacity:1}
@media (max-width:560px){.pvn-sh .pvn-pn{width:100%;border-left:0}}
.pvn-sh .pvn-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:26px}
.pvn-sh .pvn-me{display:inline;font-weight:400;font-size:15px;color:var(--pv-ink);cursor:pointer}
.pvn-sh .pvn-x{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1px solid var(--pv-line);color:var(--pv-ink);font-size:20px;line-height:1;cursor:pointer}
.pvn-sh .pvn-k{display:block;color:var(--pv-amber);font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 14px}
.pvn-sh ol{display:block;position:relative}
.pvn-sh ol::before{content:"";position:absolute;left:44px;top:6px;bottom:6px;width:1px;background:rgba(232,236,241,.3)}
.pvn-sh li{display:block}
.pvn-sh li a{position:relative;display:flex;align-items:baseline;padding:9px 0;color:#c3ccd7;font-size:21px;font-weight:300;letter-spacing:-.005em;line-height:1.25;cursor:pointer}
.pvn-sh li a:hover{color:var(--pv-ink)}
.pvn-sh li a .pvn-d{display:block;width:36px;flex:none;text-align:right;font-size:12px;line-height:1;align-self:center;position:relative;top:1px;color:var(--pv-dim);font-variant-numeric:tabular-nums}
.pvn-sh li a .pvn-t{display:block;padding-left:28px}
.pvn-sh li a::before{content:"";position:absolute;left:40px;top:50%;width:9px;height:1px;background:rgba(232,236,241,.6)}
.pvn-sh li.pvn-on > a{color:var(--pv-ink)}
.pvn-sh li.pvn-on > a::after{content:"";position:absolute;left:40.5px;top:50%;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:var(--pv-amber);box-shadow:0 0 0 3px rgba(8,20,36,.6),0 0 14px rgba(242,166,72,.55)}
.pvn-sh .pvn-sp{display:block;height:20px}
.pvn-sh li.pvn-sub a{font-size:16px;padding:2px 0 10px;color:var(--pv-dim)}
.pvn-sh li.pvn-sub a::before{display:none}
.pvn-sh li.pvn-sub a .pvn-t{padding-left:44px;position:relative}
.pvn-sh li.pvn-sub a .pvn-t::before{content:"";position:absolute;left:28px;top:-6px;width:8px;height:12px;border-left:1px solid rgba(232,236,241,.35);border-bottom:1px solid rgba(232,236,241,.35)}
.pvn-sh li.pvn-sub a i{display:inline;color:var(--pv-amber);margin-left:6px}
.pvn-sh li.pvn-sub.pvn-on a{color:var(--pv-ink)}
.pvn-sh li.pvn-sub.pvn-on > a::after{display:none}
.pvn-sh li.pvn-sub.pvn-on a i{display:none}
.pvn-sh li.pvn-sub a:hover{color:var(--pv-ink)}
.pvn-sh .pvn-ft{display:block;margin-top:auto;padding-top:26px}
.pvn-sh .pvn-cta{display:inline-block;padding:11px 18px;border:1px solid var(--pv-amber);border-radius:999px;color:var(--pv-ink);font-size:15px;background:rgba(8,20,36,.35);cursor:pointer}
.pvn-sh .pvn-cta:hover{background:var(--pv-amber);color:var(--pv-bg)}`;
  document.head.appendChild(st);
  const burg = $(`<button type="button" class="pvn-burg" aria-haspopup="dialog"></button>`); burg.innerHTML = `<i></i><i></i><i></i>`;
  const slot = document.querySelector('[data-site-nav]');
  if (slot) slot.appendChild(burg); else { burg.classList.add('pvn-fx'); document.body.appendChild(burg); }
  const sh = $(`<div class="pvn-sh" role="dialog" aria-modal="true"><div class="pvn-bg"></div><div class="pvn-pn"></div></div>`);
  document.body.appendChild(sh);
  const SUBS = { 8: () => `<li class="pvn-sub"><a href="${q(SCANP)}"><span class="pvn-d"></span><span class="pvn-t">${X().page}<i>↗</i></span></a></li>`,
    10: () => PRES_COPY.map(c => [c[0], (lang() === 'ru' && c[2]) || c[1]]).map(p => { const on = new URL(p[0]).pathname === here; return `<li class="pvn-sub${on ? ' pvn-on' : ''}"><a href="${q(p[0])}"${on ? ' aria-current="page"' : ''}><span class="pvn-d"></span><span class="pvn-t">${p[1]}<i>↗</i></span></a></li>`; }).join('') };
  const href = i => q(MAINP + '#' + (i < 5 ? 's' + i : SEC[i - 5]));
  const row = i => `<li class="${i === 10 ? 'pvn-on' : ''}"><a href="${href(i)}"><span class="pvn-d">${i > 0 && i < 5 ? DAYS[i] : ''}</span><span class="pvn-t">${X().items[i]}</span></a></li>` + (SUBS[i] ? SUBS[i]() : '');
  const render = () => {
    sh.querySelector('.pvn-pn').innerHTML = `<div class="pvn-hd"><a class="pvn-me" href="${q(MAINP)}">${X().name}</a><button type="button" class="pvn-x" aria-label="${X().close}">×</button></div>
      <p class="pvn-k">${X().kick}</p><ol>${[0, 1, 2, 3, 4].map(row).join('')}</ol><div class="pvn-sp"></div><ol>${SEC_ORDER.map(row).join('')}</ol>
      <div class="pvn-ft"><a class="pvn-cta" href="https://wa.me/393498929736?text=${encodeURIComponent(WA[lang()])}" target="_blank" rel="noopener">${X().cta}</a></div>`;
    burg.setAttribute('aria-label', X().menu);
  };
  const open = () => { render(); sh.classList.add('pvn-open'); document.documentElement.style.overflow = 'hidden'; };
  const close = () => { if (!sh.classList.contains('pvn-open')) return; sh.classList.remove('pvn-open'); document.documentElement.style.overflow = ''; };
  burg.addEventListener('click', open);
  sh.addEventListener('click', e => { if (e.target.closest('.pvn-bg') || e.target.closest('.pvn-x')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('sitelang', () => { if (sh.classList.contains('pvn-open')) render(); else burg.setAttribute('aria-label', X().menu); });
  render();
  return;
}

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
.sh li a .d{width:36px;flex:none;text-align:right;font-size:12px;line-height:1;align-self:center;position:relative;top:1px;color:var(--dim);font-variant-numeric:tabular-nums}
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
.st0 .scale .sc-read{opacity:0}
.scale .dp{transition:opacity .45s ease}
.st0 .scale .dp{opacity:0;pointer-events:none}
.dp button.r0{display:none}
/* phones: the name needs the top row; the counter (and the percent) go right under the burger */
@media (max-width:560px){.scale .sc-read{margin:38px 0 10px 0}.v6 .pct{right:var(--pad);top:calc(60px + env(safe-area-inset-top,0px))}}
.dp .ln2{display:none}
/* loading percent on the first screen, where the day counter will be */
.pct{position:absolute;z-index:3;right:calc(var(--pad) + 56px);top:calc(22px + env(safe-area-inset-top,0px));pointer-events:none;font-variant-numeric:tabular-nums;color:var(--amber);font-size:clamp(26px,2.6vw,34px);font-weight:300;letter-spacing:-.02em;line-height:1.08;opacity:0;transition:opacity .45s ease;text-shadow:0 1px 10px rgba(8,20,36,.85)}
.pct small{font-size:.5em;margin-left:.08em;color:var(--dim)}
.pct{text-align:right}
.pct .pl,.pct .ph{display:block;font-size:13px;line-height:1.35;letter-spacing:0;font-weight:400;white-space:nowrap;text-shadow:0 0 4px rgba(8,20,36,.9),0 1px 12px rgba(8,20,36,.85)}
.pct .pl{margin-top:2px;color:var(--ink)}
.pct .ph{margin-top:2px;color:rgba(232,236,241,.78);opacity:0;transition:opacity .45s ease}
.pct.pc-h .ph{opacity:1}
@media (max-width:560px){.pct .pl,.pct .ph{font-size:12px}}
.st0 .pct{opacity:1}
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

// v6.7: the name top left → the very start of the site
function goHome() {
  closeSheet();
  if (dlgOpen()) dlg.close();
  if (PAGE !== 'main' || !ring) { location.href = MAIN; return; }
  if (onRing() && typeof jumpStage === 'function') { jumpStage(0); return; }
  if (typeof freeScroll === 'function') freeScroll();
  scrollTo({ top: 0, behavior: 'instant' });
}
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('a.me, .hero h1');
  if (!t || PAGE !== 'main' || e.metaKey || e.ctrlKey) return;
  e.preventDefault(); e.stopPropagation(); if (t.blur) t.blur(); goHome();
}, true);
if (PAGE === 'main') document.querySelectorAll('.hero h1').forEach(h => { h.style.cursor = 'pointer'; h.style.pointerEvents = 'auto'; h.setAttribute('role', 'link'); h.tabIndex = 0;
  h.addEventListener('keydown', e => { if (e.key === 'Enter') goHome(); }); });

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
bar = $(`<header class="nb" aria-label="Site"><div class="l"><a class="me" href="${PAGE === 'scan' ? MAIN : '#top'}"></a></div><div class="r"></div></header>`);
// ---------- the way back up: first-block buttons remember the stage they were pressed on ----------
const RET_KEY = 'navRet';
let retSetAt = -1e9;   // just pressed: the page may still be on the ring for a moment (e.g. before leaving for the scanning page)
const getRet = () => { try { const v = JSON.parse(sessionStorage.getItem(RET_KEY)); return v && (typeof v.j === 'number' || v.sec) ? v : null; } catch (e) { return null; } };
const setRet = v => { try { if (v === null) sessionStorage.removeItem(RET_KEY); else sessionStorage.setItem(RET_KEY, JSON.stringify(v)); } catch (e) {} };
const RET_T = { pfBtn: 'work', costBtn: 'how', scanBtn: 'scan', presBtn: 'interactive' };
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('#pfBtn, #scanBtn, #costBtn, #presBtn');
  if (b && typeof stageOf === 'function' && typeof step !== 'undefined') { setRet({ j: stageOf(step), t: RET_T[b.id] }); retSetAt = performance.now(); return; }
  // v8.1.5: buttons inside "Work stages and pricing" come back to the same place there
  const sb = e.target.closest && e.target.closest('#how .steps a.scb');
  if (sb) { const to = sb.getAttribute('href') || ''; setRet({ sec: 'how', sel: sb.dataset.i ? `[data-i="${sb.dataset.i}"]` : '', t: to.includes('3d-venue-scanning') ? 'scan' : to.replace(/^#/, '') }); retSetAt = performance.now(); }
}, true);
const LAND_KEY = 'navLand';
// v8.1.7: after landing by link, pictures and in-app browser bars may still move the page: put it back a few times,
// until the visitor touches the screen, scrolls or presses a key
let userMoved = false;
['touchstart', 'wheel', 'keydown', 'mousedown'].forEach(t => addEventListener(t, () => { userMoved = true; }, { passive: true, capture: true }));
function holdLanding(fn) { userMoved = false; [250, 600, 1100, 1800, 2800].forEach(ms => setTimeout(() => { if (!userMoved) fn(); }, ms)); }
function toBtn(el, smooth) {
  if (typeof freeScroll === 'function') freeScroll();
  const vh = (window.visualViewport && visualViewport.height) || innerHeight, m = Math.max(32, Math.round(vh * .06));
  const y = Math.max(0, Math.round(el.getBoundingClientRect().bottom + scrollY - vh + m));
  scrollTo({ top: y, behavior: smooth ? 'smooth' : 'instant' }); return y;
}
function returnTo(j) {
  if (typeof freeScroll === 'function') freeScroll();
  const y = j > 0 && typeof yOf === 'function' ? yOf(STOPS()[j - 1]) : (typeof ringTop === 'function' ? ringTop() : 0);
  scrollTo({ top: y, behavior: 'instant' });
  if (typeof AUTO !== 'undefined') { AUTO.armed = true; AUTO.idx = j - 1; }
}
// one arrow per page, moved into the section the visitor landed on
const retA = $(`<button type="button" class="retA" hidden><span>↑</span><small></small></button>`);
retA.addEventListener('click', () => {
  userMoved = true;   // v8.1.10: stops the landing re-align
  const r = getRet(); setRet(null); syncRet();
  if (!r) return;
  if (PAGE === 'scan') { if (r.sec && r.sel) { try { sessionStorage.setItem(LAND_KEY, JSON.stringify({ sec: r.sec, sel: r.sel })); } catch (e) {} }
    location.href = MAIN + (r.sec ? '#' + r.sec : '#s' + r.j); return; }
  if (dlgOpen()) dlg.close();
  closeSheet();
  if (r.sec) { const b = r.sel && document.querySelector('#' + r.sec + ' ' + r.sel);
    if (b) { toBtn(b, true); return; }
    const el = document.getElementById(r.sec); if (!el) return;
    if (typeof freeScroll === 'function') freeScroll();
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 56, behavior: 'smooth' }); return; }
  returnTo(r.j);
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
    retA.querySelector('small').textContent = r.top ? (L ? 'В начало' : 'To the top') : (L ? 'Вернуться' : 'Back up');
    retA.setAttribute('aria-label', r.top ? (L ? 'В начало сайта' : 'To the start of the site') : (L ? 'Вернуться туда, откуда пришли' : 'Back up to where you were'));
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
  pill2 = $(`<button type="button" class="burg burg-in" aria-haspopup="dialog">${BURG}</button>`); lang2 = $(`<button type="button" class="lsw in" aria-haspopup="listbox"><span class="c">EN</span><span class="cv"></span></button>`);
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
  const row = i => `<li class="${(PAGE === 'scan' && i === 8) || (i === 5 && dlgSlug()) ? 'p sec' : cls(i, a)}"><a href="#" data-go="${i}"><span class="d">${i > 0 && i < 5 ? DAYS[i] : ''}</span><span class="t">${it[i]}</span></a></li>`
    + (i === 8 ? `<li class="sub${PAGE === 'scan' ? ' on' : ''}"><a href="${SCAN}"><span class="d"></span><span class="t">${X().page}<i>↗</i></span></a></li>` : '')
    + (i === 5 ? pjRows(a) : '')
    + (i === 10 ? pres().map(p => `<li class="sub"><a href="${p[0]}?lang=${lang()}"><span class="d"></span><span class="t">${p[1]}<i>↗</i></span></a></li>`).join('') : '');
  sheet.querySelector('.pn').innerHTML = `<div class="hd"><a class="me" href="${PAGE === 'scan' ? MAIN : '#top'}">${X().name}</a><button type="button" class="x" aria-label="${X().close}">×</button></div>
    <p class="k">${X().kick}</p><ol>${[0, 1, 2, 3, 4].map(row).join('')}</ol><div class="sp"></div><ol>${SEC_ORDER.map(row).join('')}</ol>
    <div class="ft"><a class="btn wa" href="https://wa.me/393498929736" target="_blank" rel="noopener">${X().cta}</a></div>`;
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
const pct = PAGE === 'main' && document.getElementById('stage') ? $(`<div class="pct"><b aria-live="polite">0</b><small>%</small><span class="pl"></span><span class="ph"></span></div>`) : null;
const PCT_TXT = { ru: ['Готовность мероприятия', 'Листайте, чтобы разобрать его ↓'], en: ['Event readiness', 'Scroll to take it apart ↓'] };
let pctLang = '', pctF = 0;
if (pct) document.getElementById('stage').appendChild(pct);
let at0 = null, st0 = null;
function frame() {
  if (pct && typeof step !== 'undefined') {
    const pn = document.getElementById('pcn');
    if (typeof LREADY !== 'undefined' && LREADY && typeof R_END !== 'undefined') {
      const rr = ring.getBoundingClientRect(), f = Math.min(1, Math.max(0, -rr.top / (rr.height - innerHeight))) * (N - 1);
      const H = typeof HOLD !== 'undefined' ? HOLD : 0;
      pctF = f; pct.firstChild.textContent = String(f <= H ? 100 : Math.max(0, Math.min(100, Math.ceil(100 * (1 - (f - H) / (R_END - H)) - 0.001))));
    } else if (pn) pct.firstChild.textContent = pn.textContent;
    const z = onRing() && step === 0 && !(typeof AUTO !== 'undefined' && AUTO.run);
    if (z !== at0) { at0 = z; document.documentElement.classList.toggle('at0', z); }
    if (pctLang !== lang()) { pctLang = lang(); const t = PCT_TXT[pctLang] || PCT_TXT.en; pct.children[2].textContent = t[0]; pct.children[3].textContent = t[1]; }
    pct.classList.toggle('pc-h', onRing() && pctF < (typeof HOLD !== 'undefined' ? HOLD : 1) && !(typeof AUTO !== 'undefined' && AUTO.run) && typeof LREADY !== 'undefined' && LREADY);
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
  const key = a + '|' + r + '|' + L + '|' + dlgSlug();
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
  const h = location.hash.slice(1) === 'presentation' ? 'interactive' : location.hash.slice(1);
  const run = () => {
    // a project link (#slug): the page already opened it; put the landing at the portfolio behind it
    if (projs().some(p => p[0] === h)) { const w = document.getElementById('work'); if (w) { if (typeof freeScroll === 'function') freeScroll(); scrollTo({ top: w.getBoundingClientRect().top + scrollY - 56, behavior: 'instant' }); } return; }
    history.replaceState(null, '', location.pathname);
    if (/^s[0-4]$/.test(h)) { const j = +h[1]; if (j > 0) { const t = setInterval(() => { if (typeof LREADY !== 'undefined' && LREADY) { clearInterval(t); returnTo(j); } }, 150); } }
    else if (SEC.includes(h)) {
      // back from the scanning page to the button pressed in that section: the button near the bottom of the screen
      let land = null; try { land = JSON.parse(sessionStorage.getItem(LAND_KEY)); sessionStorage.removeItem(LAND_KEY); } catch (e) {}
      const b = land && land.sec === h && land.sel && document.querySelector('#' + h + ' ' + land.sel);
      if (b) { toBtn(b); holdLanding(() => toBtn(b)); landF.f = () => toBtn(b); }
      else {
        const toSec = () => { const e = document.getElementById(h); if (!e) return; const y = Math.round(e.getBoundingClientRect().top + scrollY - 56); if (Math.abs(scrollY - y) > 2) { if (typeof freeScroll === 'function') freeScroll(); scrollTo({ top: y, behavior: 'instant' }); } };
        if (typeof freeScroll === 'function') freeScroll(); toSec(); holdLanding(toSec); landF.f = toSec;
        setRet({ j: 0, t: h, top: 1 }); retSetAt = performance.now(); syncRet();   // v8.1.10: arrow to the start of the site
      }
    }
  };
  // v8.1.9: right away (the page is parsed when nav.js runs), then show the page once it stands at the section
  const landF = { f: null };
  const show = () => { const d = document.documentElement; if (!d.classList.contains('landing')) return; if (landF.f) landF.f(); d.classList.remove('landing'); };
  run();
  if (document.documentElement.classList.contains('landing')) {
    let done = false; const once = () => { if (!done) { done = true; requestAnimationFrame(() => requestAnimationFrame(show)); } };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(once); setTimeout(once, 500);
  }
}

// ---------- language switch, variant A (v7.1, 28.10) ----------
(() => {
const LS = [['en', 'EN', 'English'], ['ru', 'RU', 'Русский']];  // v8.1: EN/RU only; IT/FR/ES/TR later
const base = c => (c === 'ru' ? 'ru' : 'en');
const sel = () => { let v = ''; try { v = localStorage.getItem('langSel') || ''; } catch (e) {} return LS.some(x => x[0] === v) && base(v) === lang() ? v : lang(); };
const st = document.createElement('style');
st.textContent = `
.lsw{position:fixed;z-index:32;top:calc(12px + env(safe-area-inset-top,0px));right:calc(max(12px,calc(var(--pad) - 10px)) + 54px);height:46px;min-width:46px;border:0;border-radius:23px;background:rgba(8,20,36,.35);color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;padding:0 13px 0 15px;font:inherit;font-size:14px;letter-spacing:.05em;-webkit-tap-highlight-color:transparent;transition:background .2s}
.lsw:hover,.lsw[aria-expanded="true"]{background:rgba(8,20,36,.65)}
.lsw .cv{width:8px;height:8px;border-right:1.5px solid var(--dim);border-bottom:1.5px solid var(--dim);transform:translateY(-2px) rotate(45deg)}
.lsw.in{position:static;margin-left:auto}
.lsd{position:fixed;z-index:45;top:calc(64px + env(safe-area-inset-top,0px));right:calc(max(12px,calc(var(--pad) - 10px)) + 54px);min-width:200px;background:rgba(10,24,42,.97);border:1px solid var(--line);border-radius:14px;padding:6px;opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .2s,transform .2s;box-shadow:0 12px 40px rgba(0,0,0,.4)}
.lsd.open{opacity:1;transform:none;pointer-events:auto}
.lsd button{display:flex;width:100%;align-items:center;gap:12px;border:0;background:none;color:var(--ink);font:inherit;padding:10px 12px;border-radius:9px;cursor:pointer;text-align:left;font-size:15px}
.lsd button:hover{background:rgba(255,255,255,.05)}
.lsd .k{width:22px;color:var(--dim);font-size:12px;letter-spacing:.05em}
.lsd button[aria-pressed="true"],.lsd button[aria-pressed="true"] .k{color:var(--amber)}
.lsd .ok{margin-left:auto;color:var(--amber);visibility:hidden}
.lsd button[aria-pressed="true"] .ok{visibility:visible}
/* the percent and the day counter move left of the switch on wide screens */
@media (min-width:561px){.v6 .pct{right:calc(var(--pad) + 128px)}.scale .sc-read{margin-right:128px;margin-left:-128px}}
`;
document.head.appendChild(st);
const btn = $(`<button type="button" class="lsw" aria-haspopup="listbox" aria-expanded="false"><span class="c">EN</span><span class="cv"></span></button>`);
document.body.appendChild(btn);
const dd = $(`<div class="lsd" role="listbox"></div>`);
document.body.appendChild(dd);
const btns = () => [btn, ...(lang2 ? [lang2] : [])];
function draw() {
  const c = sel();
  btns().forEach(b => { b.querySelector('.c').textContent = c.toUpperCase(); });
  dd.innerHTML = LS.map(([k, code, name]) => `<button type="button" data-l="${base(k)}" data-ls="${k}" aria-pressed="${k === c}"><span class="k">${code}</span>${name}<span class="ok">✓</span></button>`).join('');
}
function open(from) {
  const host = dlgOpen() ? dlg : document.body; if (dd.parentNode !== host) host.appendChild(dd);
  const r = from.getBoundingClientRect(); dd.style.right = (innerWidth - r.right) + 'px'; dd.style.top = (r.bottom + 6) + 'px';
  draw(); dd.classList.add('open'); btns().forEach(b => b.setAttribute('aria-expanded', 'true'));
}
function close() { dd.classList.remove('open'); btns().forEach(b => b.setAttribute('aria-expanded', 'false')); }
btns().forEach(b => b.addEventListener('click', e => { e.stopPropagation(); dd.classList.contains('open') ? close() : open(b); }));
document.addEventListener('click', e => {
  const it = e.target.closest && e.target.closest('[data-ls]');
  if (it) { try { localStorage.setItem('langSel', it.dataset.ls); } catch (x) {} setTimeout(() => { draw(); close(); }, 0); return; }
  if (!(e.target.closest && e.target.closest('.lsd, .lsw'))) close();   // the switch itself toggles
}, true);
addEventListener('scroll', close, { passive: true });
// the switch hides with the menu button while the site map is open
const obs = new MutationObserver(() => { const o = sheet && sheet.classList.contains('open'); btn.style.visibility = o ? 'hidden' : ''; if (o) close(); });
if (sheet) obs.observe(sheet, { attributes: true, attributeFilter: ['class'] });
draw();
})();
// ---------- v8.2: visit statistics (GoatCounter, no cookies, nothing stored in the browser) ----------
// Pageviews are counted by count.js itself. Events: how long the first screen took to load (or that the visitor left
// before it loaded), how far the ring was played, which sections were reached, every button and link pressed.
// Names: "<group>/<where>/<what>", e.g. "click/ring/brief", "section/interactive", "ring/loaded 3-8s".
// Outside pravdukhin.com (the working copy) every name starts with "test/".
(() => {
if (PAGE !== 'main' && PAGE !== 'scan') return;
const GC = 'https://pravdukhin.goatcounter.com/count';
// owner's switch: pravdukhin.com/#toggle-goatcounter stops (or restarts) counting this browser. count.js looks at the
// hash itself, but the page has already cleaned the address by then, so the switch is done here (the flag is GoatCounter's own)
if (HASH0 === '#toggle-goatcounter') {
  let off = false; try { off = localStorage.getItem('skipgc') !== 't'; if (off) localStorage.setItem('skipgc', 't'); else localStorage.removeItem('skipgc'); } catch (e) {}
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  const ru = (document.documentElement.lang || '').startsWith('ru'), n = document.createElement('div');
  n.textContent = off ? (ru ? 'Статистика: этот браузер больше не учитывается' : 'Statistics: this browser is no longer counted')
                      : (ru ? 'Статистика: этот браузер снова учитывается' : 'Statistics: this browser is counted again');
  n.style.cssText = 'position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:2147483600;background:#0c1b2f;color:#e8ecf1;border:1px solid #f2a648;border-radius:999px;padding:10px 18px;font:400 14px/1.3 Geist,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4);max-width:calc(100vw - 32px);text-align:center';
  document.body.appendChild(n); setTimeout(() => n.remove(), 6000);
}
// the page address without ?lang=, ?fbclid= and the like, so one page is one row (the query still reaches GoatCounter for sources)
window.goatcounter = Object.assign(window.goatcounter || {}, { path: () => location.pathname });
if (!document.querySelector('script[data-goatcounter]')) {
  const s = document.createElement('script'); s.async = true; s.src = 'https://gc.zgo.at/count.js'; s.dataset.goatcounter = GC;
  s.addEventListener('load', flush); document.head.appendChild(s);
}
const PFX = location.hostname === 'pravdukhin.com' ? '' : 'test/';
const queue = [], seen = new Set();
function flush() { if (!(window.goatcounter && window.goatcounter.count)) return; while (queue.length) { const [p, t] = queue.shift(); try { window.goatcounter.count({ path: p, title: t, event: true }); } catch (e) {} } }
function ev(name, title, once) {
  const p = PFX + name; if (once) { if (seen.has(p)) return; seen.add(p); }
  queue.push([p, title || p]); flush();
  if (window.__statsLog) window.__statsLog.push(p);   // for tests
}
const secs = t => (t < 3000 ? '<3s' : t < 8000 ? '3-8s' : t < 15000 ? '8-15s' : '>15s');
// how the visitor arrived
const UA = navigator.userAgent || '';
if (/Instagram/i.test(UA)) ev('inapp/instagram', 'Opened in the Instagram browser', 1);
else if (/FBAN|FBAV|FB_IAB/i.test(UA)) ev('inapp/facebook', 'Opened in the Facebook browser', 1);
else if (/Telegram/i.test(UA)) ev('inapp/telegram', 'Opened in the Telegram browser', 1);
// paid traffic and tagged links (the page path is counted without the query, so the source is kept here)
{ const q = new URLSearchParams(location.search);
  if (q.get('fbclid')) ev('source/meta-ad', 'Came from a Facebook or Instagram link or ad', 1);
  if (q.get('utm_source')) ev('source/' + q.get('utm_source').toLowerCase().slice(0, 30), 'utm_source', 1); }
if (PAGE === 'main') {
  const h = (HASH0 || '').slice(1);
  if (h && (SEC.includes(h) || h === 'presentation' || projs().some(p => p[0] === h))) ev('landing/' + h, 'Came by a direct link to ' + h, 1);
  // first screen: loaded, and in how long; or left before it loaded
  const t0 = 0;   // performance.now() counts from the start of the page load
  const lt = setInterval(() => { if (typeof LREADY !== 'undefined' && LREADY) { clearInterval(lt); ev('ring/loaded ' + secs(performance.now() - t0), 'First screen loaded', 1); } }, 250);
  const leave = () => { if (typeof LREADY !== 'undefined' && !LREADY && onRing() && !seen.has(PFX + 'ring/left')) { seen.add(PFX + 'ring/left'); ev('ring/left-before-load ' + secs(performance.now() - t0), 'Left before the first screen loaded'); } };
  addEventListener('pagehide', leave); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') leave(); });
  // how far the ring was played: stages 1..4 (−45, −30, −20, show day)
  const STN = ['', 'day-45', 'day-30', 'day-20', 'show-day'];
  addEventListener('scroll', () => { if (typeof stageOf !== 'function' || typeof step === 'undefined' || !onRing() || window.__landing) return; const s = stageOf(step); for (let j = 1; j <= s && j < 5; j++) ev('ring/stage-' + j + ' ' + STN[j], 'Ring played to ' + STN[j], 1); }, { passive: true });
}
// sections reached: the section fills the middle of the screen; the last blocks: as soon as they show
{
  const mids = PAGE === 'main' ? SEC.filter(id => id !== 'contact').map(id => document.getElementById(id)).filter(Boolean) : [];
  const ends = [PAGE === 'main' ? document.getElementById('contact') : null, document.querySelector('footer')].filter(Boolean);
  const name = el => el.id || 'footer';
  let raf = 0;
  const check = () => { raf = 0; const vh = innerHeight, land = window.__landing ? (HASH0 || '').slice(1) : null;
    mids.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < vh * .5 && r.bottom > vh * .3 && (!land || land === el.id)) ev('section/' + name(el), 'Reached ' + name(el), 1); });
    ends.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < vh - 40 && r.bottom > 0 && !land) ev('section/' + name(el), 'Reached ' + name(el), 1); }); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(check); }, { passive: true });
  setTimeout(check, 600);
}
// every button and link
const ID = { pfBtn: 'portfolio', scanBtn: 'about-scanning', briefBtn: 'brief', costBtn: 'what-it-costs', presBtn: 'interactive-visuals', cta: 'discuss', prGo: 'open-presentation', dlgb: 'project-back' };
const GO = ['start', 'day-45', 'day-30', 'day-20', 'show-day'].concat(SEC);
const where = el => {
  if (el.closest('.sh, .pvn-sh')) return 'menu';
  if (el.closest('.lsd, .lsw')) return 'lang';
  if (el.closest('header.bar, .burg')) return 'top';
  if (el.closest('dialog[open]')) return 'project';
  if (PAGE === 'scan') { const s = el.closest('section[id], footer'); return 'scan' + (s ? '-' + (s.id || 'footer') : ''); }
  const s = el.closest('section[id], footer'); return s ? (s.id || 'footer') : 'page';
};
const what = el => {
  const href = el.getAttribute('href') || '';
  if (/wa\.me\//.test(href)) return 'whatsapp' + (el.id && ID[el.id] ? '-' + ID[el.id] : '');
  if (/t\.me\//.test(href)) return 'telegram';
  if (/^mailto:/.test(href)) return 'email';
  if (el.id && ID[el.id]) return ID[el.id];
  if (el.dataset.slug) return 'project-' + el.dataset.slug;
  if (el.dataset.pj) return 'project-' + el.dataset.pj;
  if (el.dataset.go) return GO[+el.dataset.go] || 'item-' + el.dataset.go;
  if (el.dataset.pr) { const p = (typeof PRES !== 'undefined' && PRES[+el.dataset.pr]) || null; return 'pres-tab-' + (p ? p.code.split('-').pop() : el.dataset.pr); }
  if (el.dataset.ls || el.dataset.l) return 'lang-' + (el.dataset.ls || el.dataset.l);
  if (el.classList.contains('burg')) return 'menu-open';
  if (el.classList.contains('lsw')) return 'lang-open';
  if (el.classList.contains('retA')) { const r = (() => { try { return JSON.parse(sessionStorage.getItem('navRet')); } catch (e) { return null; } })(); return r && r.top ? 'to-top' : 'back'; }
  if (el.classList.contains('scb')) return el.dataset.i === 'scanBtn' ? 'about-scanning' : el.dataset.i === 's3b' ? 'see-example' : 'button';
  if (el.closest('#rail')) return 'rail-' + [...el.parentNode.children].indexOf(el);
  if (el.closest('#wmore')) return 'all-projects';
  if (/demo\.pravdukhin\.com/.test(href)) return 'presentation-' + (href.match(/private-event-(\d+)/) || [, 'demo'])[1];
  if (/3d-venue-scanning/.test(href)) return 'scanning-page';
  if (PAGE === 'scan' && (href === '../' || href === MAIN)) return 'main-site';
  if (el.classList.contains('me')) return 'name';
  if (el.classList.contains('x')) return 'close';
  const t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase().slice(0, 32);
  return t || (el.tagName.toLowerCase() + (href ? ' ' + href.slice(0, 40) : ''));
};
document.addEventListener('click', e => {
  const el = e.target.closest && e.target.closest('a, button, [role="tab"], .sc-m'); if (!el) return;
  try { ev('click/' + where(el) + '/' + what(el), (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60)); } catch (x) {}
}, true);
})();
})();
