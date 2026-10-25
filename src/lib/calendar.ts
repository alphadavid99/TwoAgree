// "Add a time to your calendar" (item 1): opens the phone's own calendar with
// the part filled in, so either of you can invite the other. No storage, no
// reminders — the event has no alarm, and the time is a suggestion to change.
const pad = (n: number) => String(n).padStart(2, "0");
// Floating local time (no Z): the calendar app reads it in the phone's zone.
const stamp = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const escapeText = (s: string) => s.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

/** An iCalendar file for one conversation, tomorrow at 7pm, for an hour. */
export function talkEventIcs(title: string, description: string, now = new Date()): string {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TwoAgree//Conversation//EN",
    "BEGIN:VEVENT",
    `UID:${now.getTime()}-${Math.random().toString(36).slice(2)}@twoagree.app`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export const icsHref = (ics: string) => `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
