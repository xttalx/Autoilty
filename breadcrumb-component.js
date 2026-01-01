/**
 * Breadcrumb Component
 * Generates breadcrumb navigation for all pages
 */

function generateBreadcrumbs() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const searchParams = new URLSearchParams(window.location.search);
  
  let breadcrumbs = [
    { text: 'Home', href: 'index.html' }
  ];

  // Determine current page breadcrumb
  switch(page) {
    case 'index.html':
    case '':
      breadcrumbs = [{ text: 'Home', href: 'index.html', active: true }];
      break;
      
    case 'marketplace.html':
      breadcrumbs.push({ text: 'Marketplace', href: 'marketplace.html', active: true });
      break;
      
    case 'resources.html':
      breadcrumbs.push({ text: 'Resources', href: 'resources.html', active: true });
      break;
      
    case 'posting-detail.html':
      const postingId = searchParams.get('id');
      breadcrumbs.push({ text: 'Marketplace', href: 'marketplace.html' });
      breadcrumbs.push({ text: postingId ? `Listing #${postingId}` : 'Listing Details', href: window.location.href, active: true });
      break;
      
    case 'my-postings.html':
      breadcrumbs.push({ text: 'My Postings', href: 'my-postings.html', active: true });
      break;
      
    case 'messages.html':
      breadcrumbs.push({ text: 'Messages', href: 'messages.html', active: true });
      break;
      
    case 'profile.html':
      breadcrumbs.push({ text: 'Profile', href: 'profile.html', active: true });
      break;
      
    case 'login.html':
      breadcrumbs.push({ text: 'Login', href: 'login.html', active: true });
      break;
      
    case 'register.html':
      breadcrumbs.push({ text: 'Register', href: 'register.html', active: true });
      break;
      
    default:
      breadcrumbs.push({ text: 'Page', href: page, active: true });
  }

  return breadcrumbs;
}

function renderBreadcrumbs() {
  const breadcrumbs = generateBreadcrumbs();
  const breadcrumbContainer = document.getElementById('breadcrumbs');
  
  if (!breadcrumbContainer) return;
  
  breadcrumbContainer.innerHTML = `
    <nav aria-label="Breadcrumb" style="padding: var(--spacing-md) 0; border-bottom: 1px solid var(--color-border);">
      <ol style="display: flex; align-items: center; flex-wrap: wrap; list-style: none; padding: 0; margin: 0; gap: 0.5rem; font-size: 0.875rem;">
        ${breadcrumbs.map((crumb, index) => `
          <li style="display: flex; align-items: center;">
            ${index > 0 ? '<span style="margin: 0 0.5rem; color: var(--color-text-light);">/</span>' : ''}
            ${crumb.active 
              ? `<span style="color: var(--color-text); font-weight: 500;">${crumb.text}</span>`
              : `<a href="${crumb.href}" style="color: var(--color-text-light); text-decoration: none; transition: var(--transition);" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--color-text-light)'">${crumb.text}</a>`
            }
          </li>
        `).join('')}
      </ol>
    </nav>
  `;
}

// Auto-render on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderBreadcrumbs);
} else {
  renderBreadcrumbs();
}

