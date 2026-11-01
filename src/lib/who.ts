// "Which of you" questions (design refresh, item 12). Eighteen questions used
// to offer "Him / Her", which assumes genders and makes you work out which one
// is you. Their first two options are now the two of you by name — {A} the
// host, {B} the guest — in the same order on both phones, so "Mostly Sarah"
// reads the same from either side.
//
// Those two options are STORED as who was picked ("host" / "guest"), not as
// a position; every other option keeps its position (its text never changed).
// A stored 0 or 1 on one of these questions is an answer to the old Him/Her
// wording, which can't be mapped to a person; it reads as unknown. (The Oct
// 2026 fresh start, functions/src/migrateFresh.ts, cleared every old answer.)
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

/** Both first names by role, and whose phone this is (for {P}). */
export type Names = Record<Role, string> & { me?: Role };

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
    me: role,
  } as Names;
}

const first = (n: string) => n.trim().split(/\s+/)[0] || n;
const otherOf = (r: Role): Role => (r === "host" ? "guest" : "host");

// A placeholder can open a line ("{P} sees the surface"), so a fallback like
// "your partner" is capitalised there.
const fill = (o: string, key: string, name: string) => {
  const r = o.split(key).join(name);
  return o.startsWith(key) ? r.charAt(0).toUpperCase() + r.slice(1) : r;
};

/**
 * The question with its names filled in (who's speaking, Nov 2026).
 *
 * In the question, {P} is the viewer's partner: "How well do you feel Judah
 * understands you?". In a choice, "I" is whoever's answer it is and {P} is
 * their partner, so the same choice reads "When Judah makes time for me" as
 * yours and "When Sarah makes time for me" as Judah's. `owner` is whose answer
 * the choices are (the viewer by default); `asTheirs` gives the other one.
 * {A}/{B} on "which of you" questions are the host and the guest, the same on
 * both phones.
 */
export function withNames(q: Question, names: Names, owner?: Role): Question {
  const me = names.me ?? "host";
  const whose = owner ?? me;
  const partnerOf = (r: Role) => (names.me ? first(names[otherOf(r)]) : "your partner");
  const inQ = (x: string) => fill(x, "{P}", partnerOf(me));
  const inA = (x: string) => fill(x, "{P}", partnerOf(whose));
  const who = (x: string) => (isWho(q) ? fill(fill(x, "{A}", first(names.host)), "{B}", first(names.guest)) : x);
  const out: Question = {
    ...q,
    q: inQ(q.q),
    ...(q.qGuess ? { qGuess: inQ(q.qGuess) } : {}),
    ...(q.opts ? { opts: q.opts.map((o) => who(inA(o))) } : {}),
    ...(q.lo ? { lo: inA(q.lo) } : {}),
    ...(q.hi ? { hi: inA(q.hi) } : {}),
    ...(q.steps ? { steps: q.steps.map(inA) } : {}),
  };
  // The partner's version rides along, for showing their answer (asTheirs).
  return owner ? out : Object.assign(out, { them: withNames(q, names, otherOf(me)) });
}

/** The same question with the choices in your partner's words (their answer,
 *  or your guess at it). Falls back to the question itself. */
export const asTheirs = (q: Question): Question => (q as Question & { them?: Question }).them ?? q;

/** The guess screen: the question about your partner, with the choices as
 *  they'd say them. */
export const forGuess = (q: Question): Question => {
  const t = asTheirs(q);
  return { ...t, q: q.qGuess ?? q.q };
};

/** A who-question answer to the old Him/Her wording (needs asking again). */
export const isLegacyWho = (q: Question, v: AnswerValue | null | undefined): boolean =>
  isWho(q) && (v === 0 || v === 1);
