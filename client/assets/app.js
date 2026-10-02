const b=document.querySelector('.menu'),n=document.querySelector('.navlinks');if(b)b.onclick=()=>n.classList.toggle('open');document.querySelectorAll('.navlinks a').forEach(a=>a.onclick=()=>n?.classList.remove('open'));const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());const f=document.querySelector('#contactForm');if(f)f.onsubmit=async e=>{e.preventDefault();const msg=document.querySelector('#formMsg');if(!f.checkValidity()){f.reportValidity();return;}const data=Object.fromEntries(new FormData(f).entries());data.stage='Quick homepage inquiry';data.features='';data.company='';data.website='';data.timeline=data.budget||'';try{if(msg)msg.textContent='Sending…';const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const out=await r.json();if(!r.ok)throw new Error(out.message||'Could not send your message.');if(msg)msg.textContent=`Sent successfully. Reference: ${out.ticketId}`;f.reset();}catch(err){if(msg)msg.textContent=`${err.message} You can also contact us at teamfordeveloper@gmail.com.`;}}

// Contact page: submit the inquiry directly to the backend.
const projectContactForm = document.querySelector('#projectContactForm');
if (projectContactForm) {
  projectContactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!projectContactForm.checkValidity()) { projectContactForm.reportValidity(); return; }
    const msg = document.querySelector('#projectFormMsg');
    const payload = Object.fromEntries(new FormData(projectContactForm).entries());
    try {
      if (msg) msg.textContent = 'Sending your message…';
      const response = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not send your message.');
      if (msg) msg.textContent = `Message sent successfully. Reference: ${result.ticketId}`;
      projectContactForm.reset();
    } catch (error) {
      if (msg) msg.textContent = `${error.message} You can also contact us directly by email or WhatsApp.`;
    }
  });
}

document.querySelectorAll('[data-copy-email]').forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.getAttribute('data-copy-email');
    try {
      await navigator.clipboard.writeText(email);
      const original = button.textContent;
      button.textContent = 'Email copied';
      setTimeout(() => button.textContent = original, 1600);
    } catch (error) {
      button.textContent = email;
    }
  });
});


// Full Start a Project wizard.
(() => {
  const form = document.querySelector('#fullProjectForm');
  if (!form) return;
  const panels = [...form.querySelectorAll('.start-step-panel')];
  const tabs = [...document.querySelectorAll('.start-step-tab')];
  const back = document.querySelector('#startBack');
  const next = document.querySelector('#startNext');
  const bar = document.querySelector('#startProgressBar');
  const review = document.querySelector('#startReview');
  const sidebar = document.querySelector('#startSidebarSummary');
  const saveStatus = document.querySelector('#startSaveStatus');
  const msg = document.querySelector('#startProjectMsg');
  const consent = document.querySelector('#startConsent');
  const key = 'teamFullProjectBriefV1';
  let step = 1;

  const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const getValues = () => {
    const fd = new FormData(form);
    const data = {};
    for (const [k,v] of fd.entries()) {
      if (data[k]) data[k] = Array.isArray(data[k]) ? [...data[k], v] : [data[k], v]; else data[k] = v;
    }
    return data;
  };
  const arr = v => !v ? [] : Array.isArray(v) ? v : [v];
  const save = () => {
    const data = getValues();
    try { localStorage.setItem(key, JSON.stringify(data)); if (saveStatus) saveStatus.textContent = 'Draft saved automatically in this browser.'; } catch(e) {}
    updateSidebar(data);
  };
  const restore = () => {
    let data={}; try { data=JSON.parse(localStorage.getItem(key)||'{}'); } catch(e) {}
    Object.entries(data).forEach(([name,value]) => {
      const fields = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      fields.forEach(field => {
        if (field.type === 'checkbox') field.checked = arr(value).includes(field.value);
        else if (!Array.isArray(value)) field.value = value;
      });
    });
    updateSidebar(getValues());
  };
  const updateSidebar = (d) => {
    if (!sidebar) return;
    const name=d.projectName||'Untitled project', service=d.service||'Service not selected', budget=d.budget||'Budget not selected', timeline=d.timeline||'Timeline not selected';
    sidebar.innerHTML = `<strong>${esc(name)}</strong><p>${esc(service)}</p><div class="start-summary-list"><div><span>Budget</span><b>${esc(budget)}</b></div><div><span>Timeline</span><b>${esc(timeline)}</b></div><div><span>Selected features</span><b>${arr(d.features).length} selected</b></div></div>`;
  };
  const renderReview = () => {
    if (!review) return; const d=getValues();
    const pills = vals => arr(vals).length ? `<div class="review-pills">${arr(vals).map(x=>`<span>${esc(x)}</span>`).join('')}</div>` : '<p>None selected.</p>';
    review.innerHTML = `
      <div class="review-group"><span>Project</span><h4>${esc(d.projectName||'Not provided')}</h4><p>${esc(d.problem||'Problem not provided')}</p></div>
      <div class="review-group"><span>Client / Audience</span><h4>${esc(d.name||'Not provided')} · ${esc(d.email||'No email')}</h4><p>${esc(d.audience||'Audience not provided')}</p></div>
      <div class="review-group"><span>Service & Scope</span><h4>${esc(d.service||'Not selected')}</h4>${pills(d.scope)}<p>${esc(d.modules||'No module list provided')}</p></div>
      <div class="review-group"><span>Features</span>${pills(d.features)}<p>${esc(d.featureNotes||'No additional feature notes')}</p></div>
      <div class="review-group"><span>Design</span><h4>${esc(d.visualStyle||'Not selected')}</h4><p>${esc(d.designStatus||'')}\n${esc(d.references||'No references provided')}\n${esc(d.brandNotes||'')}</p></div>
      <div class="review-group"><span>Budget & Timeline</span><h4>${esc(d.budget||'Not selected')} · ${esc(d.timeline||'Not selected')}</h4><p>Target launch: ${esc(d.launchDate||'Not provided')}\n${esc(d.constraints||'No additional constraints')}</p></div>`;
  };
  const validStep = () => {
    const panel = panels[step-1];
    const required = [...panel.querySelectorAll('[required]')].filter(el => el !== consent);
    for (const el of required) { if (!el.checkValidity()) { el.reportValidity(); el.focus(); return false; } }
    if (step===2 && !form.querySelector('input[name="scope"]:checked')) { alert('Please select at least one project scope item.'); return false; }
    return true;
  };
  const show = (n, shouldScroll=true) => {
    step=Math.max(1,Math.min(6,n));
    panels.forEach(p=>p.classList.toggle('active', Number(p.dataset.step)===step));
    tabs.forEach(t=>t.classList.toggle('active', Number(t.dataset.stepTarget)===step));
    if (bar) bar.style.width=`${step/6*100}%`;
    back.disabled=step===1; next.style.display=step===6?'none':'';
    if (step===6) renderReview();
    if (shouldScroll) document.querySelector('#project-builder')?.scrollIntoView({behavior:'smooth',block:'start'});
  };
  back?.addEventListener('click',()=>show(step-1));
  next?.addEventListener('click',()=>{ if(validStep()){save();show(step+1);} });
  tabs.forEach(t=>t.addEventListener('click',()=>{ const target=Number(t.dataset.stepTarget); if(target<=step){save();show(target);} else if(target===step+1 && validStep()){save();show(target);} }));
  form.addEventListener('input',save); form.addEventListener('change',save);
  form.addEventListener('submit', e => {
    e.preventDefault(); if(step!==6){show(6);return;} if(!consent.checked){consent.reportValidity();return;}
    const d=getValues(), value=k=>(d[k]||'Not provided').toString(), list=k=>arr(d[k]).join(', ')||'None selected';
    const subject=`Detailed Project Brief — ${value('projectName')} — ${value('name')}`;
    const body=[
      'Hello @TEAM,','', 'I would like to start a project. Here is my detailed brief:','',
      '=== CONTACT ===', `Name: ${value('name')}`, `Email: ${value('email')}`, `Company / Brand: ${value('company')}`, `Existing Website: ${value('website')}`,'',
      '=== PROJECT BASICS ===', `Project Name: ${value('projectName')}`, `Problem / Goal: ${value('problem')}`, `Main Users: ${value('audience')}`,'',
      '=== SERVICE & SCOPE ===', `Primary Service: ${value('service')}`, `Current Stage: ${value('stage')}`, `Scope: ${list('scope')}`, `Pages / Screens / Modules: ${value('modules')}`,'',
      '=== FEATURES ===', `Selected Features: ${list('features')}`, `Other Requirements: ${value('featureNotes')}`,'',
      '=== DESIGN ===', `Design Status: ${value('designStatus')}`, `Visual Direction: ${value('visualStyle')}`, `References: ${value('references')}`, `Brand / Visual Notes: ${value('brandNotes')}`,'',
      '=== BUDGET & TIMELINE ===', `Budget: ${value('budget')}`, `Timeline: ${value('timeline')}`, `Target Launch: ${value('launchDate')}`, `Approval Setup: ${value('approval')}`, `Constraints / Notes: ${value('constraints')}`,'',
      'I understand that the final quote will be confirmed after the complete scope is reviewed.','', 'Thank you.'
    ].join('\n');
    if(msg) msg.textContent='Your email app should open with the complete project brief prepared.';
    window.location.href=`mailto:teamfordeveloper@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  restore(); show(1, false);
})();

// Website Project Booking — detailed order intake, separate from Contact.
(() => {
  const form = document.querySelector('#websiteBookingForm');
  if (!form) return;

  const panels = [...form.querySelectorAll('.booking-panel')];
  const tabs = [...document.querySelectorAll('.booking-tab')];
  const back = document.querySelector('#bookingBack');
  const next = document.querySelector('#bookingNext');
  const bar = document.querySelector('#bookingProgressBar');
  const stepLabel = document.querySelector('#bookingStepLabel');
  const stepName = document.querySelector('#bookingStepName');
  const percent = document.querySelector('#bookingPercent');
  const saveStatus = document.querySelector('#bookingSaveStatus');
  const summary = document.querySelector('#bookingSidebarSummary');
  const review = document.querySelector('#bookingReview');
  const consent = document.querySelector('#bookingConsent');
  const directBtn = document.querySelector('#bookDirect');
  const whatsappBtn = document.querySelector('#bookWhatsapp');
  const emailBtn = document.querySelector('#bookEmail');
  const successBox = document.querySelector('#bookingSuccess');
  const message = document.querySelector('#bookingMessage');
  const storageKey = 'teamWebsiteBookingV2';
  const names = ['Client','Website','Pages','Features','Design','Technical','Budget','Review'];
  let step = 1;

  const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const toArray = value => !value ? [] : Array.isArray(value) ? value : [value];

  const values = () => {
    const fd = new FormData(form);
    const data = {};
    for (const [key, value] of fd.entries()) {
      if (data[key] !== undefined) data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
      else data[key] = value;
    }
    return data;
  };

  const save = () => {
    const data = values();
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      if (saveStatus) saveStatus.textContent = 'Draft saved automatically in this browser.';
    } catch (e) {}
    updateSummary(data);
  };

  const restore = () => {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (e) {}
    Object.entries(data).forEach(([name, value]) => {
      const fields = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      fields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') field.checked = toArray(value).includes(field.value);
        else if (!Array.isArray(value)) field.value = value;
      });
    });
    updateSummary(values());
  };

  const updateSummary = d => {
    if (!summary) return;
    const websiteType = d.websiteType || 'Website type not selected';
    const company = d.company || d.clientName || 'Untitled project';
    const budget = d.budget || 'Not selected';
    const timeline = d.timeline || 'Not selected';
    const pages = toArray(d.pages).length;
    const features = toArray(d.features).length;
    summary.innerHTML = `<strong>${esc(company)}</strong><p>${esc(websiteType)}</p><div class="booking-summary-meta"><div><span>Pages / screens</span><b>${pages ? `${pages} selected` : 'Not selected'}</b></div><div><span>Features</span><b>${features ? `${features} selected` : 'Not selected'}</b></div><div><span>Budget</span><b>${esc(budget)}</b></div><div><span>Timeline</span><b>${esc(timeline)}</b></div></div>`;
  };

  const pills = vals => toArray(vals).length ? `<div class="booking-review-pills">${toArray(vals).map(v => `<i>${esc(v)}</i>`).join('')}</div>` : '<p>None selected.</p>';

  const renderReview = () => {
    if (!review) return;
    const d = values();
    review.innerHTML = `
      <div class="booking-review-group"><span>Client</span><h4>${esc(d.clientName || 'Not provided')} · ${esc(d.company || 'No company')}</h4><p>${esc(d.clientEmail || '')}\n${esc(d.clientWhatsapp || '')}\n${esc(d.location || '')}\nPreferred contact: ${esc(d.contactMethod || 'Not selected')}</p></div>
      <div class="booking-review-group"><span>Website</span><h4>${esc(d.websiteType || 'Not selected')} · ${esc(d.projectStatus || '')}</h4><p>Goal: ${esc(d.mainGoal || 'Not provided')}\nVisitor action: ${esc(d.primaryActions || 'Not provided')}\nExisting URL: ${esc(d.existingUrl || 'Not provided')}</p></div>
      <div class="booking-review-group"><span>Pages & Content</span>${pills(d.pages)}<p>Page count: ${esc(d.pageCount || 'Not selected')}\nLanguage: ${esc(d.language || '')}\nCopy: ${esc(d.copyStatus || '')}\nMedia: ${esc(d.mediaStatus || '')}\n${esc(d.customPages || '')}</p></div>
      <div class="booking-review-group"><span>Features</span>${pills(d.features)}<p>${esc(d.featureNotes || 'No additional feature notes')}</p></div>
      <div class="booking-review-group"><span>Design</span><h4>${esc(d.visualStyle || 'Not selected')}</h4><p>Design: ${esc(d.designStatus || '')}\nLogo: ${esc(d.logoStatus || '')}\nColors: ${esc(d.brandColors || 'Not provided')}\nReferences: ${esc(d.references || 'Not provided')}\n${esc(d.designNotes || '')}</p></div>
      <div class="booking-review-group"><span>Domain / Hosting</span><h4>${esc(d.domainStatus || '')} · ${esc(d.hostingStatus || '')}</h4><p>Domain: ${esc(d.domainName || 'Not provided')}\nHosting: ${esc(d.hostingProvider || 'Not provided')}\nBusiness email: ${esc(d.businessEmail || '')}\nMaintenance: ${esc(d.maintenance || '')}\n${esc(d.technicalNotes || '')}</p></div>
      <div class="booking-review-group"><span>Budget / Timeline</span><h4>${esc(d.budget || 'Not selected')} · ${esc(d.timeline || 'Not selected')}</h4><p>Launch date: ${esc(d.launchDate || 'Not provided')}\nStart readiness: ${esc(d.startReadiness || '')}\nApproval: ${esc(d.approval || '')}\nBest contact time: ${esc(d.bestTime || 'Not provided')}\n${esc(d.finalNotes || '')}</p></div>`;
  };

  const validateCurrent = () => {
    const panel = panels[step - 1];
    const required = [...panel.querySelectorAll('[required]')].filter(el => el !== consent);
    for (const field of required) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    if (step === 3 && !form.querySelector('input[name="pages"]:checked')) {
      alert('Please select at least one required page / screen.');
      return false;
    }
    return true;
  };

  const show = (target, scroll = true) => {
    step = Math.max(1, Math.min(8, target));
    panels.forEach(p => p.classList.toggle('active', Number(p.dataset.bookPanel) === step));
    tabs.forEach(t => {
      const n = Number(t.dataset.bookStep);
      t.classList.toggle('active', n === step);
      t.classList.toggle('done', n < step);
    });
    const pct = Math.round(step / 8 * 100);
    if (bar) bar.style.width = `${pct}%`;
    if (stepLabel) stepLabel.textContent = `Step ${step} of 8`;
    if (stepName) stepName.textContent = names[step - 1];
    if (percent) percent.textContent = `${pct}%`;
    if (back) back.disabled = step === 1;
    if (next) next.style.display = step === 8 ? 'none' : '';
    if (step === 8) renderReview();
    if (scroll) document.querySelector('#booking-form')?.scrollIntoView({behavior:'smooth', block:'start'});
  };

  const makeText = () => {
    const d = values();
    const v = key => (d[key] || 'Not provided').toString();
    const list = key => toArray(d[key]).join(', ') || 'None selected';
    return [
      'WEBSITE PROJECT BOOKING — @TEAM',
      '',
      '=== CLIENT DETAILS ===',
      `Name: ${v('clientName')}`,
      `Email: ${v('clientEmail')}`,
      `WhatsApp: ${v('clientWhatsapp')}`,
      `Company / Brand: ${v('company')}`,
      `Location: ${v('location')}`,
      `Preferred Contact: ${v('contactMethod')}`,
      `Business / Project: ${v('businessDescription')}`,
      `Target Audience: ${v('targetAudience')}`,
      '',
      '=== WEBSITE ===',
      `Type: ${v('websiteType')}`,
      `Status: ${v('projectStatus')}`,
      `Existing URL: ${v('existingUrl')}`,
      `Main Goal: ${v('mainGoal')}`,
      `Visitor Actions: ${v('primaryActions')}`,
      '',
      '=== PAGES & CONTENT ===',
      `Pages / Screens: ${list('pages')}`,
      `Estimated Count: ${v('pageCount')}`,
      `Language: ${v('language')}`,
      `Copy Status: ${v('copyStatus')}`,
      `Media Status: ${v('mediaStatus')}`,
      `Custom Pages: ${v('customPages')}`,
      '',
      '=== FEATURES ===',
      `Selected Features: ${list('features')}`,
      `Other Features / Workflows: ${v('featureNotes')}`,
      '',
      '=== DESIGN & BRAND ===',
      `Design Status: ${v('designStatus')}`,
      `Logo Status: ${v('logoStatus')}`,
      `Brand Colors: ${v('brandColors')}`,
      `Visual Style: ${v('visualStyle')}`,
      `References: ${v('references')}`,
      `Design Notes: ${v('designNotes')}`,
      '',
      '=== DOMAIN / HOSTING / TECHNICAL ===',
      `Domain Status: ${v('domainStatus')}`,
      `Hosting Status: ${v('hostingStatus')}`,
      `Domain: ${v('domainName')}`,
      `Hosting / Platform: ${v('hostingProvider')}`,
      `Business Email: ${v('businessEmail')}`,
      `Maintenance: ${v('maintenance')}`,
      `Technical Notes: ${v('technicalNotes')}`,
      '',
      '=== BUDGET & TIMELINE ===',
      `Budget: ${v('budget')}`,
      `Timeline: ${v('timeline')}`,
      `Target Launch: ${v('launchDate')}`,
      `Ready to Start: ${v('startReadiness')}`,
      `Approver: ${v('approval')}`,
      `Best Contact Time: ${v('bestTime')}`,
      `Additional Notes: ${v('finalNotes')}`,
      '',
      'I understand the final scope, price and delivery plan are confirmed after review.'
    ].join('\n');
  };

  const ensureConsent = () => {
    if (!consent?.checked) {
      if (message) message.textContent = 'Please confirm the review checkbox before submitting the booking request.';
      consent?.focus();
      return false;
    }
    return true;
  };

  back?.addEventListener('click', () => show(step - 1));
  next?.addEventListener('click', () => {
    if (validateCurrent()) { save(); show(step + 1); }
  });
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const target = Number(tab.dataset.bookStep);
    if (target <= step) { save(); show(target); }
    else if (target === step + 1 && validateCurrent()) { save(); show(target); }
  }));

  form.addEventListener('input', save);
  form.addEventListener('change', save);
  form.addEventListener('submit', event => event.preventDefault());

  directBtn?.addEventListener('click', async () => {
    if (!ensureConsent()) return;
    const payload = values();
    try {
      directBtn.disabled = true;
      directBtn.classList.add('is-loading');
      directBtn.innerHTML = 'Booking…';
      if (message) message.textContent = 'Submitting your order securely…';
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not submit your booking.');
      if (message) message.textContent = `Order booked successfully. Your booking ID is ${result.bookingId}.`;
      if (successBox) {
        successBox.hidden = false;
        successBox.innerHTML = `<strong>Order booked successfully.</strong><p>Booking ID: <b>${esc(result.bookingId)}</b></p><p>Keep this ID for follow-up. @TEAM will review your scope before confirming the final quote and delivery plan.</p>`;
      }
      try { localStorage.removeItem(storageKey); } catch(e) {}
      directBtn.innerHTML = 'Order Booked ✓';
    } catch (error) {
      directBtn.disabled = false;
      directBtn.classList.remove('is-loading');
      directBtn.innerHTML = 'Book Order Now <span>→</span>';
      if (message) message.textContent = `${error.message} If the server is offline, use WhatsApp or email as a fallback.`;
    }
  });

  whatsappBtn?.addEventListener('click', () => {
    if (!ensureConsent()) return;
    const text = makeText();
    if (message) message.textContent = 'Opening WhatsApp with your complete project booking request.';
    window.open(`https://wa.me/923322905725?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  emailBtn?.addEventListener('click', () => {
    if (!ensureConsent()) return;
    const d = values();
    const subject = `Website Project Booking — ${(d.company || d.clientName || 'New Client').toString()}`;
    const body = makeText();
    if (message) message.textContent = 'Opening your email app with the complete project booking request.';
    window.location.href = `mailto:teamfordeveloper@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  restore();
  show(1, false);
})();


// Responsive navigation hardening.
(() => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.navlinks');
  if (!menu || !nav) return;
  menu.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  const sync = () => {
    const open = nav.classList.contains('open');
    menu.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open && window.innerWidth <= 980);
  };
  menu.addEventListener('click', () => setTimeout(sync, 0));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); sync();
  }));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) nav.classList.remove('open');
    sync();
  });
})();

// Installable PWA support for Chrome / Android / desktop.
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
