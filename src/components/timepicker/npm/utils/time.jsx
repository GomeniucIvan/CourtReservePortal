
import moment from 'moment-timezone';
import { head, last, is } from './func';

/**
 * Create a time data object using moment.
 * If a time is provided, just format it; if not, use the current time.
 *
 * @function getValidTimeData
 * @param  {string} time          a time; defaults to now
 * @param  {string} meridiem      AM or PM; defaults to AM via moment
 * @param  {Number} timeMode      12 or 24-hour mode
 * @param  {string} tz            a timezone name; defaults to guessing a user's tz or GMT
 * @return {Object}               a key-value representation of time data
 */
const getValidTimeData = (options = {}) => {
  const {
    time,
    timeMode,
    meridiem = null,
  } = options;

  const validMeridiem = getValidMeridiem(meridiem);
  // when we only have a valid meridiem, that implies a 12h mode
  const mode = (validMeridiem && !timeMode) ? 12 : timeMode || 24;

  const validMode = getValidateTimeMode(mode);

  let time24;
  let time12;
  
  if (time) {
    let time12hourStart = time.split(':')[0] > 12 ? `0${time.split(':')[0] - 12}` : time.split(':')[0];
    time24 = [time.split(':')[0], time.split(':')[1]];
    time12 = [time12hourStart, time.split(':')[1]];
  } else {
    time24 = ['24', '00']; 
    time12 = ['12', '00'];
  }

  let fullTime = validMode === 12 ?
      `${head(time12).replace(/^0/, '')}:${last(time24).slice(0, 2)} ${last(time12).slice(2)}` :
      `${head(time24)}:${last(time24).slice(0, 2)}`;
  
  const timeData = {
    mode: validMode,
    hour24: head(time24),
    minute: last(time24).slice(0, 2),
    hour12: head(time12).replace(/^0/, ''),
    meridiem: validMode === 12 ? last(time12).slice(2) : null,
    time: hourFormatter(fullTime),
    hour: validMode === 12 ?head(time12).replace(/^0/, '') : head(time24)
  };

  return timeData;
};

/**
 * Format the current time as a string
 * @function getCurrentTime
 * @return {string}
 */
const getCurrentTime = () => {
  const time = getValidTimeData();
  return `${time.hour24}:${time.minute}`;
};

/**
 * Get an integer representation of a time.
 * @function getValidateIntTime
 * @param  {string} time
 * @return {Number}
 */
const getValidateIntTime = (time) => {
  if (isNaN(parseInt(time, 10))) { return 0; }
  return parseInt(time, 10);
};

/**
 * Validate, set a default for, and stringify time data.
 * @function getValidateTime
 * @param {string}
 * @return {string}
 */
const getValidateTime = (time) => {
  let result = time;
  if (is.undefined(result)) { result = '00'; }
  if (isNaN(parseInt(result, 10))) { result = '00'; }
  if (parseInt(result, 10) < 10) { result = `0${parseInt(result, 10)}`; }
  return `${result}`;
};

/**
 * Given a time and meridiem, produce a time string to pass to moment
 * @function getValidTimeString
 * @param  {string} time
 * @param  {string} meridiem
 * @return {string}
 */
const getValidTimeString = (time, meridiem) => {
  if (is.string(time)) {
    let validTime = (time && time.indexOf(':').length >= 0)
      ? time.split(/:/).map(t => getValidateTime(t)).join(':')
      : time;
    const hourAsInt = parseInt(head(validTime.split(/:/)), 10);
    const is12hTime = (hourAsInt > 0 && hourAsInt <= 12);

    validTime = (validTime && meridiem && is12hTime)
      ? `${validTime} ${meridiem}`
      : validTime;

    return validTime;
  }

  return time;
};

/**
 * Given a meridiem, try to ensure that it's formatted for use with moment
 * @function getValidMeridiem
 * @param  {string} meridiem
 * @return {string}
 */
const getValidMeridiem = (meridiem) => {
  if (is.string(meridiem)) {
    return (meridiem && meridiem.match(/am|pm/i)) ? meridiem.toLowerCase() : null;
  }

  return meridiem;
};

/**
 * Ensure that a meridiem passed as a prop has a valid value
 * @function getValidateMeridiem
 * @param  {string} time
 * @param  {string|Number} timeMode
 * @return {string|null}
 */
const getValidateMeridiem = (time, timeMode) => {
  const validateTime = time || getCurrentTime();
  const mode = parseInt(timeMode, 10);
  // eslint-disable-next-line no-unused-vars
  let hour = validateTime.split(/:/)[0];
  hour = getValidateIntTime(hour);

  if (mode === 12) return (hour > 12) ? 'PM' : 'AM';

  return null;
};

/**
 * Validate and set a sensible default for time modes.
 *
 * @function getValidateTimeMode
 * @param  {string|Number} timeMode
 * @return {Number}
 */
const getValidateTimeMode = (timeMode) => {
  const mode = parseInt(timeMode, 10);

  if (isNaN(mode)) { return 24; }
  if (mode !== 24 && mode !== 12) { return 24; }

  return mode;
};

const hourFormatter = (hour, defaultTime = '00:00') => {
  if (!hour) return defaultTime;

  let [h, m, meridiem] = `${hour}`.split(/[:|\s]/);
  
  if (meridiem && meridiem.toLowerCase() === 'pm') meridiem = 'PM';
  if (meridiem && meridiem.toLowerCase() === 'am') meridiem = 'AM';
  if (meridiem && meridiem !== 'AM' && meridiem !== 'PM') meridiem = 'AM';

  if (!h || isNaN(h)) h = '0';
  if (!meridiem && Number(h > 24)) h = Number(h) - 24;
  if (meridiem && Number(h > 12)) h = Number(h) - 12;
  if (!m || isNaN(m) || Number(m) >= 60) m = '0';

  if (Number(h) < 10) h = `0${Number(h)}`;
  if (Number(m) < 10) m = `0${Number(m)}`;

  return meridiem ? `${h}:${m} ${meridiem}` : `${h}:${m}`;
};

const withoutMeridiem = hour => hour.replace(/\s[P|A]M$/, '');

const getStartAndEnd = (from, to) => {
  const current = moment();
  const date = current.format('YYYY-MM-DD');
  const nextDate = current.add(1, 'day').format('YYYY-MM-DD');

  const f = hourFormatter(from, '00:00');
  const t = hourFormatter(to, '23:30');

  let start = `${date} ${withoutMeridiem(f)}`;
  const endTmp = withoutMeridiem(t);
  let end = moment(`${date} ${endTmp}`) <= moment(start)
    ? `${nextDate} ${endTmp}`
    : `${date} ${endTmp}`;

  if (/PM$/.test(f)) start = moment(start).add(12, 'hours').format('YYYY-MM-DD HH:mm');
  if (/PM$/.test(t)) end = moment(end).add(12, 'hours').format('YYYY-MM-DD HH:mm');

  return {
    start,
    end
  };
};

const get12ModeTimes = ({ from, to, step = 30, unit = 'minutes' }) => {
  const {
    start,
    end
  } = getStartAndEnd(from, to);

  const times = [];
  let time = moment(start);
  while (time <= moment(end)) {
    const hour = Number(time.format('HH'));
    times.push(`${time.format('hh:mm')} ${hour >= 12 ? 'PM' : 'AM'}`);
    time = time.add(step, unit);
  }
  return times;
};

const get24ModeTimes = ({ from, to, step = 30, unit = 'minutes' }) => {
  const {
    start,
    end
  } = getStartAndEnd(from, to);

  const times = [];
  let time = moment(start);
  while (time <= moment(end)) {
    times.push(time.format('HH:mm'));
    time = time.add(step, unit);
  }
  return times;
};

export default {
  hourFormatter,
  getStartAndEnd,
  get12ModeTimes,
  get24ModeTimes,
  withoutMeridiem,
  time: getValidTimeData,
  current: getCurrentTime,
  validate: getValidateTime,
  validateInt: getValidateIntTime,
  validateMeridiem: getValidateMeridiem,
  validateTimeMode: getValidateTimeMode,
};
