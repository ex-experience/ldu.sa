(() => {
  const doc = document.documentElement;
  const body = document.body;
  const cfg = window.LDU_CONFIG || {};
  const dict = window.LDU_I18N || {};
  const supported = ['en','ar','fr','es'];
  let lang = localStorage.getItem('ldu-lang');
  if (!supported.includes(lang)) lang = 'en';

  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];

  function t(key){ return dict[lang]?.[key] || dict.en?.[key] || key; }
  function applyLanguage(next){
    if (!supported.includes(next)) return;
    lang = next; localStorage.setItem('ldu-lang', lang);
    doc.lang = lang; doc.dir = lang === 'ar' ? 'rtl' : 'ltr';
    body.classList.toggle('is-ar', lang === 'ar');
    qsa('[data-i18n]').forEach(el => { const key = el.dataset.i18n; const value = t(key); if(value) el.textContent = value; });
    const lbl = qs('#languageLabel'); if(lbl) lbl.textContent = lang.toUpperCase();
    const title = qs('title'); if(title && body.dataset.pageTitleKey) title.textContent = t(body.dataset.pageTitleKey);
  }
  window.LDU_applyLanguage = applyLanguage;
  window.LDU_t = t;
  applyLanguage(lang);

  const langButton = qs('#languageButton');
  const langMenu = qs('#languageMenu');
  if(langButton && langMenu){
    langButton.addEventListener('click', () => { const open = langMenu.hasAttribute('hidden'); if(open) langMenu.removeAttribute('hidden'); else langMenu.setAttribute('hidden',''); langButton.setAttribute('aria-expanded', String(open)); });
    qsa('[data-lang]', langMenu).forEach(btn => btn.addEventListener('click', () => { applyLanguage(btn.dataset.lang); langMenu.setAttribute('hidden',''); langButton.setAttribute('aria-expanded','false'); }));
    document.addEventListener('click', e => { if(!langMenu.hasAttribute('hidden') && !langMenu.contains(e.target) && e.target !== langButton && !langButton.contains(e.target)){ langMenu.setAttribute('hidden',''); langButton.setAttribute('aria-expanded','false'); } });
  }

  const menuButton = qs('#menuButton');
  const mobileMenu = qs('#mobileMenu');
  if(menuButton && mobileMenu){
    menuButton.addEventListener('click', () => { const open = mobileMenu.hasAttribute('hidden'); if(open) mobileMenu.removeAttribute('hidden'); else mobileMenu.setAttribute('hidden',''); menuButton.setAttribute('aria-expanded', String(open)); });
    qsa('a', mobileMenu).forEach(a => a.addEventListener('click', () => { mobileMenu.setAttribute('hidden',''); menuButton.setAttribute('aria-expanded','false'); }));
  }

  const year = qs('#year'); if(year) year.textContent = new Date().getFullYear();
  const phoneLink = qs('#phoneLink'); if(phoneLink && cfg.contactPhone) phoneLink.href = `tel:${cfg.contactPhone}`;

  const progress = qs('#scrollProgress');
  const updateProgress = () => { if(!progress) return; const max = doc.scrollHeight - innerHeight; progress.style.width = `${max > 0 ? (scrollY/max)*100 : 0}%`; };
  addEventListener('scroll', updateProgress, {passive:true}); updateProgress();

  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }}), {threshold:.14, rootMargin:'0px 0px -5% 0px'});
    qsa('.reveal-up,.reveal-scale').forEach(el => io.observe(el));
  } else qsa('.reveal-up,.reveal-scale').forEach(el => el.classList.add('is-visible'));

  const cursor = qs('#cursorOrbit');
  if(cursor && matchMedia('(hover:hover)').matches){
    addEventListener('pointermove', e => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; }, {passive:true});
    qsa('a,button,input,textarea,.magnetic').forEach(el => { el.addEventListener('pointerenter',()=>cursor.classList.add('is-active')); el.addEventListener('pointerleave',()=>cursor.classList.remove('is-active')); });
  }

  qsa('.magnetic').forEach(el => {
    if(!matchMedia('(hover:hover)').matches) return;
    el.addEventListener('pointermove', e => { const r=el.getBoundingClientRect(); const x=(e.clientX-r.left-r.width/2)*.06; const y=(e.clientY-r.top-r.height/2)*.08; el.style.transform=`translate(${x}px,${y}px)`; });
    el.addEventListener('pointerleave',()=>{ el.style.transform=''; });
  });

  function buildContactEmail(){
    const p = cfg.contactEmailParts || [];
    return p.length === 3 ? `${p[0]}@${p[1]}.${p[2]}` : '';
  }
  const form = qs('#contactForm'); const status = qs('#formStatus');
  if(form){
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if(!form.reportValidity()){ if(status) status.textContent = t('form.invalid'); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      const endpoint = String(cfg.contactEndpoint || '').trim();
      if(endpoint){
        try{
          const resp = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),mode:'cors'});
          if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
          if(status) status.textContent = t('form.sent'); form.reset();
        }catch(_){ if(status) status.textContent = t('form.error'); }
      }else{
        const email = buildContactEmail();
        if(!email){ if(status) status.textContent = t('form.error'); return; }
        const subject = encodeURIComponent(`LDU inquiry — ${data.company || data.name}`);
        const message = encodeURIComponent(`Name: ${data.name}\nCompany / Entity: ${data.company || '-'}\nEmail: ${data.email}\n\n${data.message}`);
        if(status) status.textContent = t('form.opening');
        window.location.href = `mailto:${email}?subject=${subject}&body=${message}`;
      }
    });
  }

  const consent = qs('#consent'); const accept = qs('#consentAccept'); const reject = qs('#consentReject');
  const analyticsConfigured = Boolean((cfg.ga4MeasurementId || '').trim() || (cfg.metaPixelId || '').trim());
  const choice = localStorage.getItem('ldu-analytics-consent');
  if(consent && analyticsConfigured && !choice) consent.removeAttribute('hidden');
  if(analyticsConfigured && choice === 'granted') loadAnalytics();
  if(accept) accept.addEventListener('click',()=>{ localStorage.setItem('ldu-analytics-consent','granted'); consent?.setAttribute('hidden',''); loadAnalytics(); });
  if(reject) reject.addEventListener('click',()=>{ localStorage.setItem('ldu-analytics-consent','denied'); consent?.setAttribute('hidden',''); });

  function loadAnalytics(){
    if(window.__LDU_ANALYTICS_LOADED__) return; window.__LDU_ANALYTICS_LOADED__ = true;
    const ga = String(cfg.ga4MeasurementId || '').trim();
    if(ga){
      const s=document.createElement('script'); s.async=true; s.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`; document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments)}; gtag('js',new Date()); gtag('config',ga,{anonymize_ip:true});
    }
    const px=String(cfg.metaPixelId || '').trim();
    if(px){
      const s=document.createElement('script'); s.async=true; s.src='https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(s);
      window.fbq=window.fbq||function(){ if(window.fbq.callMethod){ window.fbq.callMethod.apply(window.fbq,arguments); } else { window.fbq.queue.push(arguments); } }; window.fbq.queue=[]; window.fbq.loaded=true; window.fbq.version='2.0'; fbq('init',px); fbq('track','PageView');
    }
  }
})();
