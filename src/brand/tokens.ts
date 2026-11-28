/** TwoAgree brand tokens. Mirrors tokens.css — keep the two in sync. */
export const brand = {
  claret:       '#3E1A2E',
  claretDeep:   '#2A1120',
  claretHover:  '#5C2E45',
  honey:        '#C6913C',
  honeyRaised:  '#DCB265',
  white:        '#FFFFFF',
  paper:        '#FBF6F0',
  blush:        '#F3DED6',
  ink:          '#2A1120',
  grey:         '#6B5A61',
  line:         '#EADFD8',
} as const;

export type BrandColour = keyof typeof brand;

/** The reveal ceremony's canvas palette. Mirrors tokens.css (--ce-gold,
 *  --app-glint, --ce-blush, --app-rose-light, --ta-honey, --app-spark): a
 *  canvas can't read a CSS variable per pixel, so these are the same values. */
export const ceremony = {
  gold:    '#DCB265',
  light:   '#FFE9BD',
  blush:   '#F3DED6',
  rose:    '#E7B9CB',
  deep:    '#C6913C',
  lantern: '#F6C46B',
  gildLight: '#F3DCA4',  // --rc-gild-light
  gildShine: '#F6E3B4',  // --rc-gild-shine
  roomTop:   '#4A2138',  // --ce-ground-top
} as const;

/** The one colour rule: honey gold only ever sits on a claret ground.
 *  On paper it measures 2.6:1, on blush 2.1:1 — both fail. */
export const HONEY_GROUNDS: readonly string[] = [brand.claret, brand.claretDeep];
