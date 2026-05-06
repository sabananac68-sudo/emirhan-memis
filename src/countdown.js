export const EVENT_START = new Date('2026-05-19T10:00:00-07:00');
export const EVENT_END = new Date('2026-05-20T18:00:00-07:00');

export function getCountdownParts(now) {
  const distance = EVENT_START.getTime() - now.getTime();

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, live: true };
  }

  const totalSeconds = Math.floor(distance / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    live: false,
  };
}
