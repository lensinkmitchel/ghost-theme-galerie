if (
  typeof disableImagesGallery === 'undefined' || !disableImagesGallery
) {
  const postContent = document.querySelector('.js-post-content');
  const images = postContent.querySelectorAll('img');

  images.forEach((image) => {
    const closest = image.closest('figure');

    if (image.classList.contains('js-disable-zoom')) {
      return;
    }

    if (
      closest &&
      (
        closest.classList.contains('kg-bookmark-card') ||
        closest.classList.contains('kg-nft-card')
      ) ||
      (
        image.classList.contains('kg-product-card-image') ||
        image.classList.contains('kg-audio-thumbnail') ||
        image.classList.contains('kg-signup-card-image') ||
        image.classList.contains('kg-header-card-image')
      )
    ) {
      return;
    }

    if (image.parentElement.nodeName === 'A') {
      return;
    }

    image.classList.add('gallery-image');

    const anchor = document.createElement('a');
    anchor.href = image.src;
    anchor.classList.add('anchor-gallery-image', 'js-gallery-image');
    anchor.setAttribute('data-srcset', image.srcset);
    anchor.setAttribute('data-sizes', image.sizes);

    image.parentNode.replaceChild(anchor, image);
    anchor.appendChild(image);
  })

  const defaultLightGalleryPlugins = [lgZoom, lgFullscreen];

  const defaultLightGalleryConfig = {
    plugins: [
      ...defaultLightGalleryPlugins,
      ...(typeof customLightGalleryPlugins !== 'undefined')
        ? customLightGalleryPlugins
        : []
    ],
    selector: '.js-gallery-image',
    download: false,
    showZoomInOutIcons: true,
    actualSizeIcons: {
      zoomIn: 'lg-actual-size',
      zoomOut: 'lg-zoom-out',
    },
    scale: 0.5,
    mode: 'lg-lollipop',
    counter: false,
    mobileSettings: {
      controls: true,
      showCloseIcon: true,
    },
    licenseKey: '3EC763CD-6504457E-B755982E-B82098DD',
  };

  lightGallery(postContent, {
    ...defaultLightGalleryConfig,
    ...(
      typeof customLightGalleryConfig !== 'undefined'
        ? customLightGalleryConfig
        : {}
    ),
  });

  postContent.addEventListener('lgBeforeOpen', () => {
    document.body.classList.add('no-scroll-y');
  })

  postContent.addEventListener('lgAfterClose', () => {
    document.body.classList.remove('no-scroll-y');
  })
}
