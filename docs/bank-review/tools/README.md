# Bank overhaul tools

Throwaway helpers for the one-off bank overhaul. Run from anywhere, with a scratch dir:

```bash
W=$(mktemp -d)
python3 docs/bank-review/tools/parse.py $W/review.json   # change-set markdown -> structured records
python3 docs/bank-review/tools/merge.py $W                # + the 105 kept July questions -> merged.json (561)
python3 docs/bank-review/tools/check.py $W                # grouping.json: every question in exactly one part, sizes 6-8
```

`merged.json` keys are change-set IDs (`PARENT#fuN`, `NEW-xxxx`); real IDs are minted at build.
Delete this folder once the new bank has shipped.
