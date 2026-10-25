import json, re, sys

import os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "twoagree-bank-final.md")
lines = open(SRC, encoding="utf-8").read().split("\n")

META = re.compile(r"^`([^`]+)` · (\w+) · Level (\d) \(([^)]+)\) · part \(advisory\): (.+?) · Guessable: (Yes|No) · (Approved|Draft)(?: · SCORING: ([a-z-]+))?(?: · replaces ([A-Z]+-\d+))?\s*$")

recs = []
section = None
cat = None
header = None
i = 0
while i < len(lines):
    ln = lines[i]
    if ln.startswith("## "):
        m = re.match(r"## (\d)\.", ln)
        section = int(m.group(1)) if m else None
    elif ln.startswith("### ") and section in (2, 3, 4):
        h = ln[4:].strip()
        if re.match(r"^.+ — \d+$", h) and not h.startswith(("Follows", "New")) and "**" not in h:
            cat = re.sub(r" — \d+$", "", h)
        else:
            header = h
    elif ln.startswith("`") and section in (2, 3, 4):
        m = META.match(ln)
        if not m:
            sys.exit(f"bad meta line {i+1}: {ln}")
        rid, typ, lvl, lvlname, part, gu, status, scoring, replaces = m.groups()
        # body: question text, options, Previously...
        j = i + 1
        body = []
        while j < len(lines) and not lines[j].startswith(("### ", "## ")):
            body.append(lines[j]); j += 1
        text = []; opts = []; prev = None; prevopts = None; extra = []
        for b in body:
            if b.startswith("- "):
                opts.append(b[2:].strip())
            elif b.startswith("Previously:"):
                prev = b[len("Previously:"):].strip().strip("*")
            elif b.startswith("Previous options:"):
                prevopts = b[len("Previous options:"):].strip()
            elif b.strip():
                if opts or prev:
                    extra.append(b.strip())
                else:
                    text.append(b.strip())
        r = dict(rid=rid, type=typ, level=int(lvl), cat=part, catHeading=cat,
                 guessable=gu == "Yes", status=status, scoring=scoring,
                 q=" ".join(text), opts=opts, replaces=replaces, section=section, header=header, line=i + 1)
        if prev: r["prev"] = prev
        if prevopts: r["prevopts"] = prevopts
        if extra: r["extra"] = extra
        if section == 2:
            r["keep"] = "KEEP ID" in header
            r["why"] = (re.search(r"\(([^)]+)\)\s*$", header) or [None, None])[1]
        if section == 3:
            mm = re.match(r"Follows `([^`]+)`(\s+\(re-parented\))?", header)
            r["parent"] = mm.group(1); r["reparented"] = bool(mm.group(2))
        if section == 4:
            mm = re.search(r"insert after `([^`]+)`", header)
            r["after"] = mm.group(1) if mm else None
        recs.append(r)
        i = j
        continue
    i += 1

# retired + unchanged
txt = "\n".join(lines)
ret = re.search(r"## 1\. Retire.*?\n(.*?)\n## 2", txt, re.S).group(1)
retired = re.findall(r"^- `([^`]+)`", ret, re.M)
unch = re.search(r"## 5\. Unchanged.*?\n(.*?)\n## Final", txt, re.S).group(1)
unchanged = re.findall(r"`([A-Z]+-\d+)`", unch)

out = dict(records=recs, retired=retired, unchanged=unchanged)
json.dump(out, open(sys.argv[1], "w"), indent=1, ensure_ascii=False)
from collections import Counter
print(len(recs), Counter(r["section"] for r in recs), len(retired), len(unchanged))
print(Counter(r["type"] for r in recs))
print([r["rid"] for r in recs if r.get("extra")][:20])
