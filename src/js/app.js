import Alpine from 'alpinejs';
import LazyLoad from 'vanilla-lazyload';
import Headroom from 'headroom.js';
import anime from 'animejs/lib/anime.es.js';
import Fuse from 'fuse.js';
import GhostContentAPI from '@tryghost/content-api';
import vhCheck from 'vh-check';
import { docReady, scrollTo, isRTL } from './helpers';

const $html = document.querySelector('html');

if (isRTL()) {
  $html.setAttribute('dir', 'rtl');
}

window.Alpine = Alpine;
Alpine.start();

vhCheck();

docReady(() => {
  const lazyLoadInstance = new LazyLoad();
  const header = document.querySelector('.js-header');
  const announcementBar = document.getElementById('announcement-bar-root');
  const headroom = new Headroom(header, { tolerance: 5 });
  const fuse = new Fuse([], {
    shouldSort: true,
    ignoreLocation: true,
    findAllMatches: true,
    includeScore: true,
    minMatchCharLength: 3,
    keys: ['title', 'custom_excerpt'],
  });
  const paginationLimit = typeof customPaginationLimit !== 'undefined'
    ? customPaginationLimit
    : 12;
  let ghostApi = null;

  try {
    ghostApi = new GhostContentAPI({
      url: ghostHost,
      key: ghostApiKey,
      version: 'v5.0',
    });
  } catch (error) {
    console.log(error);
  }

  headroom.init();

  const prepareAnnouncementBar = () => {
    if (announcementBar) {
      const barMutationObserver = new MutationObserver((e) => {
        if (e[0].addedNodes.length) {
          header.appendChild(announcementBar);
        }
      })

      barMutationObserver.observe(announcementBar, { childList: true });
    }
  };

  const prepareSearch = () => {
    if (!ghostApi || typeof nativeSearchEnabled !== 'undefined') {
      return;
    }

    const defaultSearchConfig = {
      limit: 'all',
      include: 'tags',
      fields:
        'id, title, url, published_at, custom_excerpt, feature_image, feature_image_alt',
    };

    ghostApi.posts
      .browse({
        ...defaultSearchConfig,
        ...(typeof customSearchConfig !== 'undefined'
          ? customSearchConfig
          : {}),
      })
      .then((posts) => {
        fuse.setCollection(posts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  window.addEventListener('ajax-content-loaded', () => {
    lazyLoadInstance.update();
  });

  window.addEventListener('drawer-opened', (e) => {
    anime({
      targets: `.js-${e.detail.drawer}-item-animate`,
      translateY: [100, 0],
      opacity: [0, 1],
      duration: 700,
      delay: anime.stagger(100),
      easing: 'easeInOutQuad',
    });
  });

  if (typeof nativeSearchEnabled === 'undefined') {
    window.addEventListener('search-performed', (e) => {
      if (!ghostApi) {
        return;
      }

      const fuseIndexSize = fuse.getIndex().size();

      if (!fuseIndexSize || fuseIndexSize < 1) {
        return;
      }

      let results = fuse.search(e.detail.query);

      results = results.reduce((acc, curr) => {
        if (curr.score <= 0.5) {
          const item = curr.item;

          if (
            item.feature_image &&
            item.feature_image.indexOf('/content/images/') > -1
          ) {
            item.feature_image = item.feature_image.replace(
              '/content/images/',
              '/content/images/size/w500/'
            );
          }

          acc.push(item);
        }
        return acc;
      }, []);

      e.detail.callback(results);
    });
  }

  const defaultLoadMoreConfig = {
    limit: paginationLimit,
    include: 'tags',
    fields: 'id, title, url, feature_image, featured, feature_image_alt, custom_excerpt',
  };

  window.addEventListener('load-more-performed', (e) => {
    if (ghostApi) {
      defaultLoadMoreConfig.filter = e.detail.filter;
      defaultLoadMoreConfig.page = e.detail.page;

      ghostApi.posts
        .browse({
          ...defaultLoadMoreConfig,
          ...(
            typeof customLoadMoreConfig !== 'undefined'
              ? customLoadMoreConfig
              : {}
            ),
        })
        .then((response) => {
          e.detail.callback(response);
        })
        .catch((error) => {
          e.detail.callback({ error });
        });
    }
  });

  const loadMoreListenerEvent = new CustomEvent('load-more-listener-ready', {
    bubbles: true,
  });
  window.dispatchEvent(loadMoreListenerEvent);

  window.addEventListener('scroll-to', (e) => {
    const element = document.querySelector(e.detail.element);
    const position = element.offsetTop;
    scrollTo(position);
  });

  prepareAnnouncementBar();
  prepareSearch();
});
