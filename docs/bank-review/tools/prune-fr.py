"""Drop French translations that no longer match their English question.

  python3 docs/bank-review/tools/prune-fr.py <old questions.json>

A translation survives only when its ID is still in data/questions.json with
exactly the same English text, options and scale ends as in the old bank.
Anything else falls back to English (localizeQuestion) until retranslated.
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
old = {q["id"]: q for q in json.load(open(sys.argv[1]))}
new = {q["id"]: q for q in json.load(open(os.path.join(REPO, "data", "questions.json")))}
sig = lambda q: (q["q"], q.get("opts"), q.get("lo"), q.get("hi"))
p = os.path.join(REPO, "src", "lib", "questions.fr.ts")
lines = open(p, encoding="utf-8").read().split("\n")
entry = re.compile(r'^  "([A-Z]+-\d+)": \{')
kept = dropped = 0
out = []
for ln in lines:
    m = entry.match(ln)
    if m:
        i = m.group(1)
        if i in new and i in old and sig(new[i]) == sig(old[i]):
            kept += 1
        else:
            dropped += 1
            continue
    out.append(ln)
open(p, "w", encoding="utf-8").write("\n".join(out))
print(f"French: kept {kept}, dropped {dropped}")
