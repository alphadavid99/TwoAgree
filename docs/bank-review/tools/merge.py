import json, collections
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.join(HERE, "..", "..", "..")
S = sys.argv[1].rstrip("/") + "/"  # work dir holding review.json; merged.json is written here
if not os.path.exists(S + "q271.json"):
    open(S + "q271.json", "w").write(subprocess.check_output(["git", "-C", REPO, "show", "42dab30^:data/questions.json"], text=True))
old = {x["id"]: x for x in json.load(open(S + "q271.json"))}
cur = {x["id"]: x for x in json.load(open(REPO + "/data/questions.json"))}
decks = json.load(open(REPO + "/data/decks.json"))
R = json.load(open(S + "review.json"))
LOYAL = dict(zip(["INT-004", "INT-006", "INT-011", "CONF-005", "CONF-006", "CONF-007", "CONF-010", "PAST-005"],
                 ["LOYAL-00%d" % i for i in range(1, 9)]))
DROP = set("DEAL-011 DEAL-015 DEAL-016 DEAL-018 DREAM-007 DREAM-009 DREAM-012 FUN-017 FUN-022 INLAW-008 INT-015 INT-022 LOYAL-014 NOW-004 NOW-008 NOW-014 NOW-016 NOW-018 ROLE-006 ROLE-008 ROLE-009 ROLE-010 US-047".split())
CAT = {
    "In the Home": "in-the-home", "Finances & Money": "finances-money",
    "Faith & Worship practice": "faith-worship-practice", "Theology & Beliefs": "theology-beliefs",
    "Family & Children": "family-children", "Parenting style": "parenting-style",
    "Intimacy & Physical": "intimacy-physical", "Roles & Responsibilities": "roles-responsibilities",
    "Conflict & Communication": "conflict-communication", "In-Laws & Extended Family": "in-laws-extended-family",
    "Fun & Icebreakers": "fun-icebreakers", "Deal-breakers": "deal-breakers", "Health & Lifestyle": "health-lifestyle",
    "Dreams & Future": "dreams-future", "Past & Baggage": "past-baggage", "Career & Ambition": "career-ambition",
    "Character & Self-Awareness": "character-self-awareness", "Us & Compatibility": "us-compatibility",
    "Values & Convictions": "values-convictions",
}
TYPE = {"MC": "mc", "SCALE": "scale", "RANK": "rank", "OPEN": "open", "HHB": "mc"}

def appid(rid):
    return LOYAL.get(rid, rid)

def deck_of_cat(c):
    return CAT[c.split(" · ")[0]]

items = []
recs = {r["rid"]: r for r in R["records"]}
for r in R["records"]:
    e = dict(key=r["rid"], q=r["q"], type=TYPE[r["type"]], opts=r["opts"], depth=r["level"],
             guessable=r["guessable"], status=r["status"], scoring=r["scoring"], hhb=r["type"] == "HHB")
    if r["section"] == 2:
        a = appid(r["rid"]); e["kind"] = "keep" if r["keep"] else "replace"; e["was"] = a
        e["deck"] = cur[a]["deck"]
    elif r["section"] == 3:
        e["kind"] = "fu"; e["parent"] = r["parent"]; e["reparented"] = r["reparented"]
    else:
        e["kind"] = "new"; e["after"] = r.get("after"); e["deck"] = deck_of_cat(r["cat"])
        e["subcat"] = r["cat"].split(" · ")[1] if " · " in r["cat"] else None
        if r.get("replaces"): e["replaces"] = r["replaces"]
    e["cat"] = r["cat"]
    items.append(e)
for u in R["unchanged"]:
    a = appid(u); x = cur[a]
    items.append(dict(key=u, was=a, kind="same", q=x["q"], type=x["type"], opts=x.get("opts"), lo=x.get("lo"), hi=x.get("hi"),
                      depth=x["depth"], guessable=x["guessable"], status="Approved", deck=x["deck"], who=x.get("who")))
for k, x in cur.items():
    if k in old or k in LOYAL.values() or k == "FUN-001":
        continue
    if k in DROP:
        continue
    items.append(dict(key=k, was=k, kind="july", q=x["q"], type=x["type"], opts=x.get("opts"), lo=x.get("lo"), hi=x.get("hi"),
                      depth=x["depth"], guessable=x["guessable"], status=x.get("status"), deck=x["deck"], who=x.get("who"),
                      subcat=x.get("subcat")))
# follow-up decks from parents (CONF-005 re-parented under CONF-006 etc.)
bykey = {e["key"]: e for e in items}
for e in items:
    if e["kind"] == "fu":
        p = bykey[e["parent"]]
        e["deck"] = p["deck"]
# FUN-001: review references it? check presence
missing = [k for k in ["FUN-001"] if k not in bykey]
print("missing", missing)
# legacy IDs that are neither in review nor current: sanity
covered = set(e.get("was") for e in items if e.get("was"))
lost = [k for k in cur if k not in covered and k not in DROP and appid(k) not in covered]
print("current ids with no entry:", lost)
print(len(items), collections.Counter(e["kind"] for e in items))
c = collections.Counter(e["deck"] for e in items)
for d in decks:
    print(f'{d["slug"]:28} {c[d["slug"]]:4}')
json.dump(items, open(S + "merged.json", "w"), indent=1, ensure_ascii=False)
