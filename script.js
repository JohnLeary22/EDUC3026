const sectionLinks = [...document.querySelectorAll('.section-nav a')];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  sectionLinks.forEach((link) => {
    if (link.getAttribute('href') === `#${visible.target.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}, { rootMargin: '-18% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] });

sections.forEach((section) => sectionObserver.observe(section));

const participationButton = document.getElementById('check-participation');
document.querySelectorAll('.response-option > button').forEach((button) => {
  button.setAttribute('aria-expanded', 'false');

  button.addEventListener('click', () => {
    const feedback = button.nextElementSibling;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', String(!isExpanded));
    feedback.hidden = isExpanded;
  });
});

document.getElementById('print-voice')?.addEventListener('click', () => window.print());

const createTabs = [...document.querySelectorAll('.create-resource-tabs [role="tab"]')];

function activateCreateTab(tab, moveFocus = false) {
  createTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;

    const panel = document.getElementById(item.getAttribute('aria-controls'));
    if (panel) panel.hidden = !selected;
  });

  if (moveFocus) tab.focus();
}

createTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateCreateTab(tab));

  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % createTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + createTabs.length) % createTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = createTabs.length - 1;

    if (nextIndex !== undefined) {
      event.preventDefault();
      activateCreateTab(createTabs[nextIndex], true);
    }
  });
});
