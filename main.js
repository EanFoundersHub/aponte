(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const smoothstep = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const range = (value, start, end) => smoothstep((value - start) / (end - start));

  const loader = document.getElementById('loader');
  window.addEventListener('load', () => setTimeout(() => loader?.classList.add('is-hidden'), 320), { once:true });
  setTimeout(() => loader?.classList.add('is-hidden'), 1600);

  const header = document.getElementById('siteHeader');
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileNav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin:'0px 0px -12% 0px', threshold:0.02 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const hero = document.querySelector('[data-scroll-scene="hero"]');
  const heroCopy = hero?.querySelector('[data-hero-copy]');
  const heroPortrait = hero?.querySelector('[data-hero-portrait]');
  const approach = document.querySelector('[data-scroll-scene="approach"]');
  const approachIntro = approach?.querySelector('.approach-intro');
  const approachStage = approach?.querySelector('.approach-stage');
  const storyPanels = [...(approach?.querySelectorAll('[data-story-panel]') || [])];
  const storyIndex = approach?.querySelector('[data-story-index]');

  let ticking = false;
  function progressFor(section) {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - window.innerHeight);
    return clamp(-rect.top / distance);
  }
  function renderScroll() {
    ticking = false;
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    if (reduced) return;

    const hp = progressFor(hero);
    const heroIn = range(hp, .045, .17);
    const heroOut = 1 - range(hp, .77, .98);
    const heroOpacity = heroIn * heroOut;
    if (heroCopy) {
      heroCopy.style.opacity = heroOpacity.toFixed(3);
      heroCopy.style.transform = `translate3d(0, ${(1 - heroIn) * 12 - (1 - heroOut) * 7}px, 0)`;
    }
    if (heroPortrait) {
      const portraitIn = range(hp, .09, .24);
      heroPortrait.style.opacity = (portraitIn * heroOut).toFixed(3);
      heroPortrait.style.transform = `translate3d(0, ${(1 - portraitIn) * 16 - (1 - heroOut) * 5}px, 0)`;
    }

    const ap = progressFor(approach);
    const introIn = range(ap, .055, .12);
    const introOut = 1 - range(ap, .19, .26);
    if (approachIntro) {
      approachIntro.style.opacity = (introIn * introOut).toFixed(3);
      approachIntro.style.transform = `translate3d(0, ${(1 - introIn) * 10 - (1 - introOut) * 8}px,0)`;
    }
    const stageIn = range(ap, .245, .32);
    const stageOut = 1 - range(ap, .93, .985);
    if (approachStage) approachStage.style.opacity = (stageIn * stageOut).toFixed(3);

    const panelProgress = clamp((ap - .30) / .62);
    const segment = 1 / storyPanels.length;
    let active = 0;
    storyPanels.forEach((panel, index) => {
      const local = (panelProgress - index * segment) / segment;
      const enter = range(local, .06, .28);
      const exit = 1 - range(local, .72, .94);
      const opacity = enter * exit;
      if (opacity > .3) active = index;
      panel.style.opacity = opacity.toFixed(3);
      panel.style.transform = `translate3d(0, ${(1 - enter) * 10 - (1 - exit) * 8}px,0)`;
    });
    if (storyIndex) storyIndex.textContent = String(active + 1).padStart(2,'0');
    approachStage?.style.setProperty('--story-line', `${panelProgress * 100}%`);
  }
  function requestRender(){ if (!ticking) { ticking = true; requestAnimationFrame(renderScroll); } }
  window.addEventListener('scroll', requestRender, { passive:true });
  window.addEventListener('resize', requestRender, { passive:true });
  renderScroll();

  const serviceVisual = document.getElementById('serviceVisual');
  const serviceImage = serviceVisual?.querySelector('img');
  const serviceCaption = serviceVisual?.querySelector('figcaption strong');
  document.querySelectorAll('[data-service]').forEach(row => {
    const activate = () => {
      document.querySelectorAll('[data-service]').forEach(item => item.classList.remove('is-active'));
      row.classList.add('is-active');
      if (!serviceVisual || !serviceImage) return;
      const next = row.dataset.image;
      if (serviceImage.getAttribute('src') === next) return;
      serviceVisual.classList.add('is-changing');
      const preload = new Image();
      preload.onload = () => {
        serviceImage.src = next;
        serviceImage.alt = row.dataset.alt || '';
        if (serviceCaption) serviceCaption.textContent = row.querySelector('h3')?.textContent || '';
        requestAnimationFrame(() => serviceVisual.classList.remove('is-changing'));
      };
      preload.src = next;
    };
    row.addEventListener('mouseenter', activate);
    row.addEventListener('focusin', activate);
    row.addEventListener('click', activate);
  });

  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Consulta web: ${data.get('tipo')}`);
    const body = encodeURIComponent([
      `Nombre: ${data.get('nombre')} ${data.get('apellido')}`,
      `Teléfono: ${data.get('telefono')}`,
      `Correo: ${data.get('correo')}`,
      `Tipo de consulta: ${data.get('tipo')}`,
      '',
      `${data.get('mensaje')}`
    ].join('\n'));
    if (formNote) formNote.textContent = 'Abriendo tu aplicación de correo…';
    window.location.href = `mailto:finanzaspersonales@financial-lab.com?subject=${subject}&body=${body}`;
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
