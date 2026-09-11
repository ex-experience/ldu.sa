(() => {
  const data=window.LDU_CASES?.[document.body.dataset.case];
  if(!data) return;
  const langs=['en','ar','fr','es']; let lang=localStorage.getItem('ldu-lang'); if(!langs.includes(lang)) lang='en';
  const ui={
    en:{back:'← LDU / PROOF',context:'CONTEXT / 01',intake:'PROJECT INTAKE ↗',suffix:'Founder-led Case'},
    ar:{back:'← LDU / الإثبات',context:'السياق / 01',intake:'استقبال المشاريع ↗',suffix:'دراسة حالة بقيادة المؤسس'},
    fr:{back:'← LDU / PREUVES',context:'CONTEXTE / 01',intake:'PRISE DE BRIEF ↗',suffix:'Cas mené par le fondateur'},
    es:{back:'← LDU / PRUEBAS',context:'CONTEXTO / 01',intake:'ENTRADA DE PROYECTOS ↗',suffix:'Caso liderado por el fundador'}
  };
  const set=(sel,val)=>{const el=document.querySelector(sel); if(el) el.textContent=val;};
  function apply(next){
    if(!langs.includes(next))return;
    lang=next;localStorage.setItem('ldu-lang',lang);
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    const c=data[lang]||data.en, labels=ui[lang];
    set('#caseEyebrow',data.eyebrow);set('#caseName',data.name);set('#caseTitle',c.title);set('#caseContext',c.context);
    set('#challengeTitle',c.challenge);set('#challengeBody',c.challengeBody);set('#interventionTitle',c.intervention);set('#interventionBody',c.interventionBody);
    set('#proofTitle',c.proof);set('#proofBody',c.proofBody);set('#attributionTitle',c.attribution);set('#attributionBody',c.attributionBody);
    set('#caseBack',labels.back);set('#contextLabel',labels.context);set('#caseIntake',labels.intake);
    document.querySelectorAll('[data-case-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.caseLang===lang)));
    document.title=`${data.name} — LDU · ${labels.suffix}`;
  }
  const image=document.querySelector('#caseImage'); if(image) image.src=data.image;
  document.querySelectorAll('[data-case-lang]').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.caseLang)));apply(lang);
})();
