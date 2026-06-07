async function loadGallery() {
  const app = document.getElementById('app');
  if (!app) {
    return;
  }

  try {
    const projectSlug = document.body.dataset.project || 'clinic';
    const componentsBase = document.body.dataset.componentsBase || 'components';
    const response = await fetch(`${componentsBase}/project-${projectSlug}.html`);
    if (!response.ok) {
      throw new Error(`Failed to load project component: ${response.status}`);
    }
    app.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
    app.innerHTML = '<main style="padding:2rem;color:#e6e6fa;font-family:sans-serif">Project page could not be loaded. Please run this site from a local web server.</main>';
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
