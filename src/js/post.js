import fitvids from 'fitvids';
import * as tocbot from 'tocbot';
import { docReady } from './helpers';

docReady(() => {
  const adjustImageGallery = () => {
    const images = document.querySelectorAll('.kg-gallery-image img');

    images.forEach((image) => {
      const container = image.closest('.kg-gallery-image');
      const width = image.attributes.width.value;
      const height = image.attributes.height.value;
      const ratio = width / height;
      container.style.flex = `${ratio} 1 0%`;
    })
  }

  const makeTOC = () => {
    const $toc = document.querySelector('.js-toc');

    if ($toc) {
      tocbot.init({
        tocSelector: '.js-toc',
        contentSelector: '.js-post-content',
        orderedList: false,
        headingSelector: 'h1[id], h2[id], h3[id]',
        ignoreSelector: '.kg-card h1, .kg-card h2, .kg-card h3',
        hasInnerContainers: true,
        headingsOffset: 40,
        scrollSmoothOffset: -40,
        onClick: () => {
          const event = new Event('toc-link-clicked', { bubbles: true });
          $toc.dispatchEvent(event);
        }
      });
    }
  }

  adjustImageGallery();
  makeTOC();
  fitvids('.js-post-content');
})
