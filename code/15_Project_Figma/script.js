(() => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const revealEls = document.querySelectorAll('.card, .split, .list__item, .section-heading');
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('reveal--visible');
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  const enhancePicturesToWebP = async () => {
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas');
      if (!canvas.getContext) return false;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();
    if (!supportsWebP) return;

    const pictures = document.querySelectorAll('picture');
    for (const pic of pictures) {
      const img = pic.querySelector('img');
      if (!img) continue;
      await new Promise((res) => {
        if (img.complete && img.naturalWidth) return res();
        img.addEventListener('load', () => res(), { once: true });
        img.addEventListener('error', () => res(), { once: true });
      });
      if (!img.naturalWidth) continue;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/webp');
        const source = document.createElement('source');
        source.type = 'image/webp';
        source.srcset = dataUrl;
        pic.insertBefore(source, img);
      } catch {
        const stale = pic.querySelectorAll('source[type="image/webp"]');
        stale.forEach(s => s.remove());
      }
    }
  };
  enhancePicturesToWebP();
})();
