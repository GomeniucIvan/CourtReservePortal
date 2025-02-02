import { BROWSER_COMPATIBLE } from './constant';

const getScrollPosition = () => {
  const position = {
    x: document.documentElement.scrollLeft
    || document.body.scrollLeft
    || 0,
    y: document.documentElement.scrollTop
    || document.body.scrollTop
    || 0,
  };
  return position;
};

export const timePickerMousePosition = (e) => {
  const event = e || window.event;
  let xPos;
  const scrollPosition = getScrollPosition();

  if (event.pageX) {
    xPos = event.pageX;
  } else if ((event.clientX + scrollPosition.x) - document.body.clientLeft) {
    xPos = (event.clientX + scrollPosition.x) - document.body.clientLeft;
  } else if (event.touches[0]) {
    xPos = event.touches[0].clientX;
  } else {
    xPos = event.changedTouches[0].clientX;
  }
  let yPos;
  if (event.pageY) {
    yPos = event.pageY;
  } else if ((event.clientY + scrollPosition.y) - document.body.clientTop) {
    yPos = (event.clientY + scrollPosition.y) - document.body.clientTop;
  } else if (event.touches[0]) {
    yPos = event.touches[0].clientY;
  } else {
    yPos = event.changedTouches[0].clientY;
  }
  return {
    x: xPos,
    y: yPos,
  };
};

export const timePickerDisableMouseDown = (e) => {
  const event = e || window.event;
  event.preventDefault();
  event.stopPropagation();
};

const browserStyles = (type, style) => BROWSER_COMPATIBLE.reduce((dict, browser) => {
  const key = browser
    ? `${browser}${type[0].toUpperCase()}${type.slice(1)}`
    : type;
  dict[key] = style;
  return dict;
}, {});

//darg.rotateStyle
export const getTimePickerRotateStyle = degree =>
  browserStyles('transform', `rotate(${degree}deg)`);

export const getTimePickerInlineRotateStyle = degree =>
  browserStyles('transform', `translateX(-50%) rotate(${degree}deg)`);

//darg.initialPointerStyle
export const getTimePickerInitialPointerStyle = (height, top, degree) =>
  Object.assign({
    height: `${height}px`,
    top: `${top}px`,
  }, browserStyles('transform', `translateX(-50%) rotate(${degree}deg)`));

//darg.validatePosition
export const getTimePickerStandardAbsolutePosition = (position, minPosition, maxPosition) => {
  let p = position;
  if (p < minPosition) {
    p = minPosition;
  }
  if (p > maxPosition) {
    p = maxPosition;
  }
  return p;
};

export const timePickerDegree2Radian = degree => (degree * (2 * Math.PI)) / 360;
