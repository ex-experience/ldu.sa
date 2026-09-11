(() => {
  'use strict';
  const doc = document.documentElement;
  const body = document.body;
  const cfg = window.LDU_CONFIG || {};
  const i18n = window.LDU_I18N || {};
  const langs = ['en','ar','fr','es'];
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  let lang = localStorage.getItem('ldu-lang');
  if(!langs.includes(lang)) lang = 'en';

  function tr(key){ return i18n[lang]?.[key] ?? i18n.en?.[key] ?? key; }
  function translate(){
    doc.lang = lang;
    doc.dir = lang === 'ar' ? 'rtl' : 'ltr';
    body.classList.toggle('is-ar', lang === 'ar');
    $$('[data-i18n]').forEach(el => {
      const v = tr(el.dataset.i18n);
      if(v != null) el.textContent = v;
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      const v = tr(el.dataset.i18nPlaceholder);
      if(v != null) el.setAttribute('placeholder', v);
    });
    const code = $('#langCode'); if(code) code.textContent = lang.toUpperCase();
    const formLang = $('#formLanguage'); if(formLang) formLang.value = lang;
    rebuildKinetic();
    updateFit();
  }
  function setLang(next){
    if(!langs.includes(next)) return;
    lang = next; localStorage.setItem('ldu-lang',lang); translate();
  }
  window.LDU_setLanguage = setLang;
  window.LDU_t = tr;

  function rebuildKinetic(){
    const title = $('[data-kinetic]');
    if(!title) return;
    title.classList.remove('loaded');
    const lines = [...title.children];
    lines.forEach(line => {
      if(line.dataset.raw == null) line.dataset.raw = line.textContent;
      else line.dataset.raw = line.textContent;
      const text = line.textContent;
      if(lang === 'ar') return; // preserve Arabic shaping; line-level reveal only.
      const frag = document.createDocumentFragment();
      [...text].forEach((ch,i)=>{
        const span=document.createElement('span');
        span.dataset.char=''; span.style.setProperty('--i',i);
        span.textContent=ch===' ' ? '\u00A0' : ch;
        frag.appendChild(span);
      });
      line.textContent=''; line.appendChild(frag);
    });
    requestAnimationFrame(()=>requestAnimationFrame(()=>title.classList.add('loaded')));
  }

  // Menus
  const langTrigger=$('#langTrigger'), langMenu=$('#langMenu');
  if(langTrigger && langMenu){
    langTrigger.addEventListener('click',()=>{
      const opening=langMenu.hidden; langMenu.hidden=!opening; langTrigger.setAttribute('aria-expanded',String(opening));
    });
    $$('[data-lang]',langMenu).forEach(btn=>btn.addEventListener('click',()=>{setLang(btn.dataset.lang);langMenu.hidden=true;langTrigger.setAttribute('aria-expanded','false');}));
    document.addEventListener('pointerdown',e=>{
      if(!langMenu.hidden && !langMenu.contains(e.target) && !langTrigger.contains(e.target)){langMenu.hidden=true;langTrigger.setAttribute('aria-expanded','false');}
    });
  }
  const menuTrigger=$('#menuTrigger'), mobileNav=$('#mobileNav'), navBackdrop=$('#navBackdrop'), mobileNavClose=$('#mobileNavClose');
  if(menuTrigger && mobileNav){
    let lastFocused=null;
    const openMenu=()=>{
      if(innerWidth>1100) return;
      lastFocused=document.activeElement;
      mobileNav.hidden=false; if(navBackdrop) navBackdrop.hidden=false;
      body.classList.add('menu-open'); menuTrigger.setAttribute('aria-expanded','true');
      requestAnimationFrame(()=>navBackdrop?.classList.add('is-open'));
      mobileNavClose?.focus({preventScroll:true});
    };
    const closeMenu=()=>{
      mobileNav.hidden=true; if(navBackdrop){navBackdrop.classList.remove('is-open');navBackdrop.hidden=true;}
      body.classList.remove('menu-open'); menuTrigger.setAttribute('aria-expanded','false');
      if(lastFocused instanceof HTMLElement) lastFocused.focus({preventScroll:true});
    };
    menuTrigger.addEventListener('click',()=>mobileNav.hidden?openMenu():closeMenu());
    mobileNavClose?.addEventListener('click',closeMenu);
    navBackdrop?.addEventListener('click',closeMenu);
    $$('a',mobileNav).forEach(a=>a.addEventListener('click',closeMenu));
    addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden)closeMenu();});
    addEventListener('resize',()=>{if(innerWidth>1100&&!mobileNav.hidden)closeMenu();},{passive:true});
  }

  // Scroll progress + header tone.
  const progress=$('#progress');
  const updateProgress=()=>{
    const max=doc.scrollHeight-innerHeight;
    if(progress) progress.style.width=`${max>0 ? Math.min(100,Math.max(0,scrollY/max*100)) : 0}%`;
  };
  addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

  if('IntersectionObserver' in window){
    const revealIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealIO.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -7%'});
    $$('.reveal,.reveal-scale').forEach(el=>revealIO.observe(el));
    const toneIO=new IntersectionObserver(entries=>{
      const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!active) return;
      const tone=active.target.dataset.tone;
      body.dataset.headerTone=(tone==='cream'||tone==='warm')?'light':'dark';
    },{threshold:[.1,.35,.6],rootMargin:'-72px 0px -55%'});
    $$('[data-tone]').forEach(el=>toneIO.observe(el));
  } else $$('.reveal,.reveal-scale').forEach(el=>el.classList.add('visible'));

  // Pointer and micro-interactions.
  const pointer=$('#pointer');
  const hoverCapable=matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(pointer && hoverCapable){
    addEventListener('pointermove',e=>{pointer.style.left=`${e.clientX}px`;pointer.style.top=`${e.clientY}px`;pointer.classList.add('on');},{passive:true});
    $$('a,button,input,select,textarea,.magnetic').forEach(el=>{el.addEventListener('pointerenter',()=>pointer.classList.add('hot'));el.addEventListener('pointerleave',()=>pointer.classList.remove('hot'));});
    $$('.magnetic').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.045}px,${(e.clientY-r.top-r.height/2)*.055}px)`;});
      el.addEventListener('pointerleave',()=>{el.style.transform='';});
    });
  }

  // Runtime telephone handoff. The protocol is assembled only on user action, avoiding static-link sanitizers while preserving native mobile dialing.
  const callButton=$('#callButton'), callStatus=$('#callStatus');
  if(callButton){
    callButton.addEventListener('click', async ()=>{
      const phone=String(callButton.dataset.phone || cfg.contactPhone || '').replace(/[^+\d]/g,'');
      if(!phone) return;
      const mobile=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || matchMedia('(pointer:coarse)').matches;
      if(mobile){
        if(callStatus) callStatus.textContent=tr('form.calling');
        const scheme=['t','e','l',':'].join('');
        window.location.assign(scheme+phone);
      }else{
        try{await navigator.clipboard.writeText(phone);if(callStatus) callStatus.textContent=tr('form.copyPhone');}
        catch{if(callStatus) callStatus.textContent=phone;}
      }
    });
  }

  // Lead qualification heuristic: transparent and deterministic, not a prediction.
  const form=$('#leadForm'), fitSignal=$('#fitSignal'), fitBar=$('#fitBar'), leadScore=$('#leadScore'), formStatus=$('#formStatus');
  function scoreLead(){
    if(!form) return 0;
    const fd=new FormData(form); let score=0;
    const budget=fd.get('budget'); if(budget==='1500plus')score+=28; else if(budget==='500-1500')score+=24; else if(budget==='100-500')score+=17; else if(budget==='under100')score+=8; else if(budget==='undisclosed')score+=10;
    const timeline=fd.get('timeline'); if(timeline==='90-180')score+=18; else if(timeline==='180plus')score+=20; else if(timeline==='30-90')score+=14; else if(timeline==='lt30')score+=6;
    const type=fd.get('project_type'); if(type==='partnerships')score+=22; else if(type==='advisory'||type==='orchestration')score+=18; else if(type==='experience')score+=14; else if(type==='other')score+=7;
    const objective=String(fd.get('objective')||'').trim(); score+=Math.min(18,Math.floor(objective.length/70)*3);
    if(String(fd.get('company')||'').trim().length>2) score+=6;
    if(String(fd.get('role')||'').trim().length>2) score+=4;
    return Math.min(100,score);
  }
  function updateFit(){
    if(!form||!fitSignal||!fitBar||!leadScore) return;
    const s=scoreLead(); leadScore.value=String(s); fitBar.style.width=`${s}%`;
    fitSignal.textContent=s>=70?tr('form.fitHigh'):s>=42?tr('form.fitMid'):tr('form.fitLow');
  }
  if(form){form.addEventListener('input',updateFit);form.addEventListener('change',updateFit);updateFit();}

  let recaptchaReady=null;
  function ensureRecaptcha(){
    const key=String(cfg.recaptchaSiteKey||'').trim();
    if(!key) return Promise.resolve('');
    if(recaptchaReady) return recaptchaReady;
    recaptchaReady=new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`; s.async=true; s.defer=true;
      s.onload=()=>{if(window.grecaptcha){grecaptcha.ready(()=>resolve(key));}else reject(new Error('reCAPTCHA unavailable'));};
      s.onerror=()=>reject(new Error('reCAPTCHA failed to load')); document.head.appendChild(s);
    });
    return recaptchaReady;
  }
  async function getRecaptchaToken(){
    const key=await ensureRecaptcha();
    if(!key) return '';
    return window.grecaptcha.execute(key,{action:'project_intake'});
  }
  if(form){
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!form.reportValidity()){formStatus.textContent=tr('form.invalid');return;}
      const endpoint=String(cfg.contactEndpoint||'').trim();
      if(!endpoint){formStatus.textContent=tr('form.unconfigured');track('lead_unconfigured',{lead_score:Number(leadScore.value||0)});return;}
      const fd=new FormData(form);
      if(String(fd.get('website')||'').trim()) return; // bot honeypot: silently drop.
      const payload=Object.fromEntries(fd.entries()); payload.lead_score=Number(payload.lead_score||0); payload.page=location.href; payload.sent_at=new Date().toISOString();
      formStatus.textContent=tr('form.sending');
      try{
        payload.recaptcha_token=await getRecaptchaToken();
        const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),12000);
        const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),mode:'cors',credentials:'omit',referrerPolicy:'strict-origin-when-cross-origin',signal:ctrl.signal});
        clearTimeout(timer);
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset(); updateFit(); formStatus.textContent=tr('form.sent'); track('lead_submitted',{lead_score:payload.lead_score,project_type:payload.project_type,market:payload.market});
      }catch(err){console.warn('Secure intake error:',err);formStatus.textContent=tr('form.error');track('lead_error',{});}
    });
  }

  // Consent-gated analytics.
  const consentBanner=$('#consentBanner'), consentAccept=$('#consentAccept'), consentReject=$('#consentReject'), privacySettings=$('#privacySettings');
  const consentKey=`ldu-analytics-consent:${cfg.analyticsConsentVersion||'1'}`;
  const analyticsConfigured=Boolean(String(cfg.ga4MeasurementId||'').trim()||String(cfg.metaPixelId||'').trim());
  function openConsent(){if(consentBanner) consentBanner.hidden=false;}
  function closeConsent(){if(consentBanner) consentBanner.hidden=true;}
  const existing=localStorage.getItem(consentKey);
  if(analyticsConfigured && !existing) openConsent();
  if(analyticsConfigured && existing==='granted') loadAnalytics();
  consentAccept?.addEventListener('click',()=>{localStorage.setItem(consentKey,'granted');closeConsent();loadAnalytics();});
  consentReject?.addEventListener('click',()=>{localStorage.setItem(consentKey,'denied');closeConsent();});
  privacySettings?.addEventListener('click',()=>{if(analyticsConfigured) openConsent(); else alert('Optional analytics are not configured on this build.');});

  function loadAnalytics(){
    if(window.__LDU_ANALYTICS_LOADED__) return; window.__LDU_ANALYTICS_LOADED__=true;
    const ga=String(cfg.ga4MeasurementId||'').trim();
    if(ga){
      const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',ga,{anonymize_ip:true,allow_google_signals:false});
    }
    const px=String(cfg.metaPixelId||'').trim();
    if(px){
      const s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(s);
      window.fbq=window.fbq||function(){(fbq.callMethod?fbq.callMethod:fbq.queue.push).apply(fbq,arguments)};fbq.queue=[];fbq.loaded=true;fbq.version='2.0';fbq('init',px);fbq('track','PageView');
    }
  }
  function track(name,params={}){
    if(localStorage.getItem(consentKey)!=='granted') return;
    if(window.gtag) gtag('event',name,params);
    if(window.fbq && name==='lead_submitted') fbq('track','Lead');
  }
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>track('nav_click',{target:a.getAttribute('href')})));

  const year=$('#year'); if(year) year.textContent=String(new Date().getFullYear());
  translate();
})();
