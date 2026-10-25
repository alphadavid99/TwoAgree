// The thick-card kit on one screen (design refresh, item 16), so it can be
// checked at a glance. Every piece is the real class from index.css; see
// docs/design-system.md for the spec.
import { Avatar } from '../components/Avatar'

export function KitSheet() {
  return (
    <section style={{ paddingBottom: 32 }}>
      <div className="eyebrow" style={{ marginTop: 16 }}>The kit</div>
      <h1 className="h1" style={{ margin: '4px 0 16px' }}>One design language</h1>

      <div className="card">
        <div className="eyebrow">Money · Sharing money</div>
        <div className="ktitle" style={{ marginTop: 6 }}>The thick card</div>
        <p className="helper" style={{ margin: '6px 0 0' }}>White, a 2px edge and a 5px base. 20px corners, 16px inside.</p>
      </div>
      <div className="kcard-claret" style={{ marginTop: 16 }}>
        <div className="eyebrow" style={{ color: 'var(--ta-honey)' }}>The important moment</div>
        <div className="ktitle" style={{ color: 'var(--ta-white)', marginTop: 6 }}>The claret card</div>
        <p className="helper" style={{ color: 'var(--ta-blush)', margin: '6px 0 0' }}>One per screen at most: scores, a ready reveal.</p>
      </div>

      <button className="btn pill" type="button">Continue</button>
      <button className="btn" type="button">Next →</button>
      <button className="btn out" type="button">Talk about this</button>
      <button className="btn red" type="button">Delete my account</button>
      <button className="btn ghost" type="button">Not now</button>

      <div className="opt sel" style={{ marginTop: 20 }}>Mostly Sarah<span className="dot" /></div>
      <div className="opt">Mostly Judah<span className="dot" /></div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
        <button className="fpill" type="button" aria-pressed="true">All 9</button>
        <button className="fpill" type="button" aria-pressed="false">Different 4</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <span className="kbadge agreed">Agreed</span>
        <span className="kbadge close">Close</span>
        <span className="kbadge chat">Worth a chat</span>
      </div>
      <div className="pair-apart" style={{ justifyContent: 'flex-start', marginTop: 20 }}>
        <Avatar name="Sarah" tone="berry" size={46} />
        <Avatar name="Judah" tone="honey" size={46} />
        <Avatar name="Judah" tone="honey" size={46} done />
        <Avatar name="Judah" size={46} pending />
      </div>

      <div style={{ marginTop: 8 }}>
        <div className="hero">Your shared stride</div>
        <div className="h1">The Table</div>
        <div className="qtext" style={{ marginTop: 4 }}>Who does most of the cooking?</div>
        <div className="ktitle">Step 4 · The Table</div>
        <p style={{ margin: '4px 0' }}>Mostly Sarah</p>
        <p className="helper" style={{ margin: 0 }}>Once you’ve both finished a part.</p>
        <div className="eyebrow">Money · Sharing money</div>
      </div>
    </section>
  )
}
