import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
import json,collections
items=json.load(open(sys.argv[1].rstrip("/") + "/merged.json"))
G=json.load(open('/home/user/TwoAgree/docs/bank-review/grouping.json'))
by={e['key']:e for e in items}
kids=collections.defaultdict(list)
for e in items:
  if e['kind']=='fu': kids[e['parent']].append(e['key'])
def group(k):
  out=[k]
  for c in kids.get(k,[]): out+=group(c)
  return out
seen=collections.Counter(); bad=[]
for d,parts in G['decks'].items():
  for p in parts:
    n=0
    for k in p['keys']:
      if k not in by: bad.append(('unknown',k)); continue
      if by[k]['kind']=='fu': bad.append(('fu listed as main',k))
      exp=by[k]['deck'] if k not in G['moves'] else G['moves'][k][1]
      if exp!=d: bad.append(('deck mismatch',k,exp,d))
      for g in group(k): seen[g]+=1; n+=1
    flag='' if 6<=n<=8 else '  <-- size'
    print(f"{d:26} {p['name']:38} {n}{flag}")
missing=[k for k in by if seen[k]==0]; dup=[k for k,c in seen.items() if c>1]
print('bad',bad); print('missing',missing); print('dup',dup); print('total',sum(seen.values()))
