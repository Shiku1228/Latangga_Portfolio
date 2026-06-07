const componentFiles = [
  'components/nav.html',
  'components/home.html',
  'components/about.html',
  'components/projects.html',
  'components/gallery.html',
  'components/skills.html',
  'components/resume.html',
  'components/contact.html',
  'components/footer.html',
];

async function loadComponent(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.text();
}

function initFadeInObserver() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((element) => observer.observe(element));
}

function initImageLightbox() {
  if (document.getElementById('portfolio-lightbox')) {
    return;
  }

  const lightbox = document.createElement('div');
  lightbox.id = 'portfolio-lightbox';
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Image preview">
      <div class="lightbox-top">
        <div>
          <div class="lightbox-kicker">Image Preview</div>
          <div class="lightbox-title" data-lightbox-title></div>
          <div class="lightbox-caption" data-lightbox-caption></div>
        </div>
        <button class="lightbox-close" type="button" aria-label="Close preview" data-lightbox-close>&times;</button>
      </div>
      <div class="lightbox-stage">
        <img class="lightbox-image" data-lightbox-image alt="">
      </div>
      <div class="lightbox-footer">Tap outside or press Esc to close</div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const image = lightbox.querySelector('[data-lightbox-image]');
  const title = lightbox.querySelector('[data-lightbox-title]');
  const caption = lightbox.querySelector('[data-lightbox-caption]');

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    image.removeAttribute('src');
    image.alt = '';
  };

  const openLightbox = ({ src, titleText, captionText, alt }) => {
    image.src = src;
    image.alt = alt || titleText || 'Preview image';
    title.textContent = titleText || 'Preview';
    caption.textContent = captionText || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-lightbox-src]');
    if (trigger) {
      event.preventDefault();
      openLightbox({
        src: trigger.getAttribute('data-lightbox-src'),
        titleText: trigger.getAttribute('data-lightbox-title'),
        captionText: trigger.getAttribute('data-lightbox-caption'),
        alt: trigger.querySelector('img')?.alt || trigger.getAttribute('data-lightbox-title') || 'Preview image',
      });
      return;
    }

    if (event.target === lightbox || event.target.closest('[data-lightbox-close]')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

async function bootstrapPortfolio() {
  const app = document.getElementById('app');
  if (!app) {
    return;
  }

  try {
    const components = await Promise.all(componentFiles.map(loadComponent));
    app.innerHTML = components.join('\n');
    initFadeInObserver();
    initImageLightbox();
  } catch (error) {
    console.error(error);
    app.innerHTML = '<main style="padding:2rem;color:#e6e6fa;font-family:sans-serif">Portfolio content could not be loaded. Please run this site from a local web server so the component files can be fetched.</main>';
  }
}

document.addEventListener('DOMContentLoaded', bootstrapPortfolio);
