// "Which of you" questions (design refresh, item 12). Eighteen questions used
// to offer "Him / Her", which assumes genders and makes you work out which one
// is you. Their first two options are now the two of you by name — {A} the
// host, {B} the guest — in the same order on both phones, so "Mostly Sarah"
// reads the same from either side.
//
// Those two options are STORED as who was picked ("host" / "guest"), not as
// a position; every other option keeps its position (its text never changed).
// A stored 0 or 1 on one of these questions is an answer to the old Him/Her
// wording, which can't be mapped to a person; it reads as unknown, and the
// one-off migration (functions/src/migrateWho.ts) clears it to be asked again.
import type { Question } from "./questions";
import type { AnswerValue, Role } from "./scoring";

export const isWho = (q: Question): boolean => q.who === true && q.type === "mc";

/** The value to store when option `i` is picked. */
export function optValue(q: Question, i: number): AnswerValue {
  if (!isWho(q)) return i;
  return i === 0 ? "host" : i === 1 ? "guest" : i;
}

/** Which option a stored value means, or null when it can't be read. */
export function optIndex(q: Question, v: AnswerValue | null | undefined): number | null {
  if (v == null) return null;
  if (isWho(q)) {
    if (v === "host") return 0;
    if (v === "guest") return 1;
    return typeof v === "number" && v >= 2 ? v : null;
  }
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

/** The option's words for a stored value (names already filled in). */
export function optText(q: Question, v: AnswerValue | null | undefined): string | undefined {
  const i = optIndex(q, v);
  return i == null ? undefined : q.opts?.[i];
}

export type Names = Record<Role, string>;

/** Both names by role, from the session's members and the viewer's own role. */
export function namesFor(
  members: Partial<Record<Role, { name?: string }>> | undefined,
  role: Role,
  myName: string,
  partnerName: string,
): Names {
  const other: Role = role === "host" ? "guest" : "host";
  return {
    [role]: members?.[role]?.name ?? myName,
    [other]: members?.[other]?.name ?? partnerName,
  } as Names;
}

const first = (n: string) => n.trim().split(/\s+/)[0] || n;

/** The question with {A}/{B} replaced by the two first names. */
export function withNames(q: Question, names: Names): Question {
  if (!isWho(q) || !q.opts) return q;
  // A placeholder can open the option ("{A}"), so a fallback like "your
  // partner" is capitalised there.
  const fill = (o: string, key: string, name: string) =>
    o.replace(key, o.startsWith(key) ? name.charAt(0).toUpperCase() + name.slice(1) : name);
  return {
    ...q,
    opts: q.opts.map((o) => fill(fill(o, "{A}", first(names.host)), "{B}", first(names.guest))),
  };
}

/** A who-question answer to the old Him/Her wording (needs asking again). */
export const isLegacyWho = (q: Question, v: AnswerValue | null | undefined): boolean =>
  isWho(q) && (v === 0 || v === 1);
