const SPEEDCONTROLLER_ID = 'speedController';
const DEFAULT_SPEEDRATE = 1;
const CONSIDERABLE_DELAY = 500; // LOL
const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

/**
 * manifest.js 0.1
 * "permissions": ["tabs", "*://*.youtube.com/*"],
 */

const renderSpeedController = () => {
  const styles = `
  <style>
      .sp {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      .spContainter {
        height: auto;
        width: auto;
        list-style: none;
        display: inline;
        margin-left: 10px;
      }
      .spItem {
        display: inline;
        height: auto;
        width: auto;
        margin-left: 10px;
        font-size: 14px;
        cursor: pointer;
        transition: 250ms all ease;
        color: var(--yt-spec-text-secondary);
      }
      .spItem--selected, .spItem--default, .spItem:hover {
        color: var(--yt-button-icon-button-text-color);
      }
  </style>
  `;

  const speedController = document.createElement('div');
  speedController.setAttribute('id', 'speedController');
  speedController.classList.add('sp', 'spContainter');
  speedController.innerHTML = styles;

  for (let idx = 0; idx < SPEED_OPTIONS.length; idx++) {
    const spItem = document.createElement('li');
    const speed = SPEED_OPTIONS[idx];
    if (speed === 1) spItem.classList.add('spItem--default');
    spItem.classList.add('sp', 'spItem');
    spItem.innerHTML = `${speed}x`;
    spItem.addEventListener('click', () => {
      for (const el of document.getElementsByClassName('spItem')) {
        el.classList.remove('spItem--selected', 'spItem--default');
      }
      spItem.classList.toggle('spItem--selected');
      document.getElementsByClassName(
        'video-stream html5-main-video'
      )[0].playbackRate = speed;
    });
    speedController.appendChild(spItem);
  }

  const ytVideoDate = document.getElementsByClassName(
    'style-scope ytd-video-primary-info-renderer'
  )[14];
  ytVideoDate.appendChild(speedController);
  document.getElementsByClassName(
    'video-stream html5-main-video'
  )[0].playbackRate = DEFAULT_SPEEDRATE;
};

const removeSpeedController = () => {
  const sps = document.querySelectorAll(`#${SPEEDCONTROLLER_ID}`);
  for (const sp of sps) {
    const spParent = sp.parentNode;
    spParent.removeChild(sp);
  }
};

// once video page loaded
window.addEventListener('load', () => {
  removeSpeedController();
  renderSpeedController();
  console.log('load -> controller rendered');
});

// navigation on other videos started
window.addEventListener('yt-navigate-start', () => {
  removeSpeedController();
  console.log('yt-navigate-start -> controller removed');
});

// navigation end, data uploaded
window.addEventListener('yt-page-data-updated', () => {
  removeSpeedController();
  setTimeout(renderSpeedController, CONSIDERABLE_DELAY);
  console.log('yt-page-data-updated -> controller re-rendered');
});
