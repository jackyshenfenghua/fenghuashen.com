const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      if (!value || !navigator.clipboard) return;
      await navigator.clipboard.writeText(value);
      button.textContent = '已复制';
      window.setTimeout(() => {
        button.textContent = button.dataset.copyLabel || '复制';
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
