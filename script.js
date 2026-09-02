const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior = prefersReducedMotion ? 'auto' : 'smooth';

      if (href === '#home') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior });
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior, block: 'start' });
    });
  });
};

const initActiveNavigation = () => {
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.toggleAttribute('aria-current', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
};

const initRevealOnScroll = () => {
  const revealItems = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window) || revealItems.length === 0) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
};

const initImageDialog = () => {
  document.querySelectorAll('[data-dialog-target]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.dialogTarget);
    if (!dialog) return;

    trigger.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });
  });

  document.querySelectorAll('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('dialog')?.close();
    });
  });
};

const initCopyButtons = () => {
  document.querySelectorAll('[data-copy-value]').forEach((button) => {
    button.dataset.copyLabel = button.textContent;
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy-value');
      const originalLabel = button.dataset.copyLabel || 'Copy';
      if (!value) return;
      try {
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(value);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1600);
    });
  });
};

document.documentElement.classList.add('js-ready');
initSmoothScroll();
initActiveNavigation();
initRevealOnScroll();
initImageDialog();
initCopyButtons();
