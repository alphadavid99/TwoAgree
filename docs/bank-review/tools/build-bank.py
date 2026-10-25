"""Write the overhauled bank into data/questions.json + data/decks.json.

  python3 docs/bank-review/tools/build-bank.py <work dir holding merged.json>

Reads merged.json (merge.py) and grouping.json (Dave's approved placement and
decisions). IDs: a question keeps its current app ID when it is unchanged,
reworded in place (KEEP ID) or a July question, and still sits in the deck its
prefix names. Everything else gets a fresh number above every ID the bank has
ever used for that prefix, so no old ID is ever reused for a new question.
Then: npm run build:questions, and prune the French overlay (prune-fr.py).
"""
import json, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
W = sys.argv[1].rstrip("/") + "/"
TODAY = "2026-10-25"

items = json.load(open(W + "merged.json"))
old271 = json.load(open(W + "q271.json"))
G = json.load(open(os.path.join(HERE, "..", "grouping.json")))
cur = json.load(open(os.path.join(REPO, "data", "questions.json")))
decks = json.load(open(os.path.join(REPO, "data", "decks.json")))
curById = {q["id"]: q for q in cur}
prefix = {d["slug"]: d["prefix"] for d in decks}
DEC = G["decisions"]

by = {e["key"]: e for e in items}
kids = collections.defaultdict(list)
for e in items:
    if e["kind"] == "fu":
        kids[e["parent"]].append(e["key"])

def group(k):
    out = [k]
    for c in kids.get(k, []):
        out += group(c)
    return out

# Highest number ever used per prefix (today's bank + the 271 workbook).
top = collections.Counter()
for q in cur + old271:
    p, n = q["id"].split("-")
    top[p] = max(top[p], int(n))

KEEPS = ("same", "keep", "july")
placed = []  # (slug, part index, key)
for slug, parts in G["decks"].items():
    for i, p in enumerate(parts):
        for k in p["keys"]:
            for g in group(k):
                placed.append((slug, i, g))

newId = {}
for slug, i, k in placed:  # pass 1: kept IDs
    e = by[k]
    if e["kind"] in KEEPS and e["was"].split("-")[0] == prefix[slug]:
        newId[k] = e["was"]
for slug, i, k in placed:  # pass 2: fresh numbers, in deck/part order
    if k in newId:
        continue
    p = prefix[slug]
    top[p] += 1
    newId[k] = f"{p}-{top[p]:03d}"
assert len(set(newId.values())) == len(newId) == len(items), "ID clash"

SCALE_SHORT = re.compile(r"^1 = (.+?) \.\.\. 5 = (.+)$")
WHO_HIM_HER = {"Mostly him": "Mostly {A}", "Mostly her": "Mostly {B}"}
TOPIC_CHANGED = {"VAL-007", "HEALTH-003", "HEALTH-010", "FIN-014"}  # old ref/note/flags don't carry
mirror = set(DEC["scoring"]["mirror"])
toMc = set(DEC["scaleToMc"]["keys"])
coreTo = set(DEC["coreSuccessors"]["map"].values())
whoOpts = DEC["scoring"]["who"]

# No em dashes in anything a person reads (app-wide rule since #44): " — "
# becomes ": ", and the next word drops its capital unless it is "I…" or a name.
KEEP_CAP = re.compile(r"^(I\b|I'|God\b|Christ|Christian|Scripture|Bible|Him\b|His\b|Jesus|Holy\b)")
def nodash(t):
    def fix(m):
        nxt = m.group(1)
        return ": " + (nxt if KEEP_CAP.match(nxt) else nxt[:1].lower() + nxt[1:])
    return re.sub(r" — (\S+)", fix, t)

out = []
for slug, i, k in placed:
    e = by[k]
    typ = "mc" if k in toMc else e["type"]
    q = {"id": newId[k], "deck": slug, "type": typ, "depth": e["depth"], "q": e["q"]}
    prev = curById.get(e.get("was")) if e.get("was") else None
    if typ in ("mc", "rank"):
        q["opts"] = list(e["opts"])
    elif typ == "scale":
        if e["kind"] in KEEPS:
            q["lo"], q["hi"] = e["lo"], e["hi"]
        elif len(e["opts"]) == 1:
            m = SCALE_SHORT.match(e["opts"][0])
            q["lo"], q["hi"] = m.group(1), m.group(2)
        else:
            q["lo"], q["hi"] = e["opts"][0], e["opts"][-1]
            q["steps"] = list(e["opts"])  # the reviewed 5-step wording; not shown yet
    # The app can't score a guess on a rank question, so none is guessable.
    q["guessable"] = bool(e["guessable"]) and e["type"] not in ("open", "rank")
    if typ == "mc" and q["opts"][:2] == ["Mostly him", "Mostly her"]:
        q["opts"][:2] = [WHO_HIM_HER[o] for o in q["opts"][:2]]
        q["who"] = True
    if k in whoOpts:
        q["opts"] = list(whoOpts[k]); q["who"] = True
    if prev and prev.get("who") and e["kind"] in KEEPS:
        q["who"] = True
    if k in mirror:
        q["mirror"] = True
    # Carried metadata: kept questions keep everything; a reworded one keeps its
    # verse and its Core / Not yet flags unless its topic changed.
    if prev and (e["kind"] in KEEPS or (e["kind"] == "replace" and k not in TOPIC_CHANGED)):
        for f in ("ref", "core", "notYet"):
            if prev.get(f):
                q[f] = prev[f]
        if e["kind"] in KEEPS and prev.get("note"):
            q["note"] = prev["note"]
    if k in coreTo:
        q["core"] = True
    if typ == "open":
        q.pop("core", None)  # a written answer never scores, so it can't be Core
    if e["kind"] in KEEPS and prev:
        for f in ("subcat", "source", "dateAdded"):
            if prev.get(f):
                q[f] = prev[f]
        q["status"] = prev.get("status") or e.get("status") or "Draft"
    else:
        if e.get("subcat"):
            q["subcat"] = e["subcat"]
        q["status"] = e.get("status") or "Approved"
        q["source"] = "Bank review"
        q["dateAdded"] = TODAY
    if e["kind"] == "fu" or e.get("wasFollowUp"):
        q["followsId"] = newId[e.get("parent") or e["wasFollowUp"]] if e["kind"] == "fu" else None
        if q["followsId"] is None:
            del q["followsId"]
    q["q"] = nodash(q["q"])
    for f in ("lo", "hi"):
        if f in q:
            q[f] = nodash(q[f])
    for f in ("opts", "steps"):
        if f in q:
            q[f] = [nodash(o) for o in q[f]]
    out.append(q)

# decks.json: same decks and order, the approved parts, hooks remapped.
oldToNew = {by[k]["was"]: v for k, v in newId.items() if by[k].get("was")}
for k, v in newId.items():  # a replaced question's old id points at its successor
    oldToNew.setdefault(k, v)
partsOf = collections.defaultdict(lambda: collections.defaultdict(list))
for slug, i, k in placed:
    partsOf[slug][i].append(newId[k])
for d in decks:
    d["parts"] = [{"name": p["name"], "qids": partsOf[d["slug"]][i]} for i, p in enumerate(G["decks"][d["slug"]])]
    if d.get("hook"):
        h = oldToNew.get(d["hook"])
        if h and any(h in p["qids"] for p in d["parts"]):
            d["hook"] = h
        else:
            print(f"  hook {d['hook']} of {d['slug']} has no successor in the deck: dropped")
            del d["hook"]

json.dump(out, open(os.path.join(REPO, "data", "questions.json"), "w"), indent=2, ensure_ascii=False)
open(os.path.join(REPO, "data", "questions.json"), "a").write("\n")
json.dump(decks, open(os.path.join(REPO, "data", "decks.json"), "w"), indent=2, ensure_ascii=False)
open(os.path.join(REPO, "data", "decks.json"), "a").write("\n")
json.dump(newId, open(W + "idmap.json", "w"), indent=1)
kept = sum(1 for k, v in newId.items() if by[k].get("was") == v)
print(f"{len(out)} questions, {sum(len(d['parts']) for d in decks)} parts; {kept} kept their ID, {len(out) - kept} new")
