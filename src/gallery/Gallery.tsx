import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { Frame } from './Frame'
import { FLOWS, FRAMES } from './frames'
import { getViolations, subscribeViolations, GALLERY_MARKER } from './mock/runtime'
import { getLang, setLang, useLang } from '../lib/i18n'

const params = new URLSearchParams(location.search)

export default function Gallery() {
  const lang = useLang()
  const [calm, setCalm] = useState(false)
  const violations = useSyncExternalStore(subscribeViolations, () => getViolations().length)
  const only = params.get('frame')
  const flow = params.get('flow')
  const eager = params.has('all')

  useEffect(() => {
    document.documentElement.dataset.calm = calm ? '1' : '0'
  }, [calm])

  const frames = useMemo(
    () => FRAMES.filter((f) => (only ? f.id === only : flow ? f.flow === flow : true)),
    [only, flow],
  )
  const indexOf = (id: string) => FRAMES.findIndex((f) => f.id === id)
  const skipped = FRAMES.filter((f) => f.unrenderable)

  return (
    <div className="gallery">
      <header className="ghead">
        <div className="gtop">
          <h1>TwoAgree screen gallery</h1>
          <span className="gbadge">DEV ONLY · FICTIONAL DATA · NO NETWORK</span>
          <span className="gcount">{FRAMES.length - skipped.length} frames · {skipped.length} not rendered</span>
          <label className="gtoggle">
            <input type="checkbox" checked={calm} onChange={(e) => setCalm(e.target.checked)} /> Freeze CSS motion
          </label>
          <span className="glang" role="group" aria-label="Language">
            {(['en', 'fr'] as const).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </span>
        </div>
        {violations > 0 && (
          <div className="gviol" role="alert">
            ⚠ {violations} blocked network/Firebase attempt{violations === 1 ? '' : 's'}:
            <ul>
              {getViolations().slice(-5).map((v, i) => (
                <li key={i}><b>{v.frame}</b> {v.message}</li>
              ))}
            </ul>
          </div>
        )}
        <nav className="gnav">
          {FLOWS.map((f) => (
            <a key={f.id} href={`#flow-${f.id}`}>{f.title.replace(/^\d+ · /, '').replace(/ \(.*/, '')}</a>
          ))}
        </nav>
      </header>
      <main>
        {FLOWS.map((f) => {
          const inFlow = frames.filter((fr) => fr.flow === f.id)
          if (!inFlow.length) return null
          return (
            <section key={f.id} id={`flow-${f.id}`} className="gflow">
              <h2>{f.title}</h2>
              <div className="ggrid">
                {inFlow.map((def) => (
                  <Frame key={def.id} def={def} index={indexOf(def.id)} eager={eager} />
                ))}
              </div>
            </section>
          )
        })}
        {skipped.length > 0 && !only && !flow && (
          <section className="gflow" id="not-rendered">
            <h2>Not rendered</h2>
            <ul className="gskip">
              {skipped.map((f) => (
                <li key={f.id}><b>{f.title}</b>: {f.unrenderable}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <footer className="gfoot" data-marker={GALLERY_MARKER}>
        Language {getLang()} · every person, address and answer on this page is fictional fixture data.
      </footer>
    </div>
  )
}
