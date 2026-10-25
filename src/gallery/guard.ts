// The gallery must be unable to reach the network. These guards make any
// attempt fail loudly — a thrown GalleryFirebaseError, a console error, and a
// red banner in the gallery header — instead of quietly working (or quietly
// failing) like a real request would.
import { GalleryFirebaseError } from './mock/runtime'

export function installNetworkGuard(): void {
  const trip = (what: string): never => {
    throw new GalleryFirebaseError(what) // the constructor records it
  }

  window.fetch = (input: RequestInfo | URL) =>
    Promise.reject(
      (() => {
        try {
          trip(`fetch(${String(input instanceof Request ? input.url : input)})`)
        } catch (e) {
          return e
        }
      })(),
    )

  XMLHttpRequest.prototype.open = function (_method: string, url: string | URL) {
    trip(`XMLHttpRequest(${String(url)})`)
  } as typeof XMLHttpRequest.prototype.open

  navigator.sendBeacon = (url: string | URL) => trip(`sendBeacon(${String(url)})`)

  // `vite dev` needs its own HMR socket back to the page's origin; nothing else.
  const RealWS = window.WebSocket
  window.WebSocket = class extends RealWS {
    constructor(url: string | URL, protocols?: string | string[]) {
      const u = new URL(String(url), location.href)
      if (!(import.meta.env.DEV && u.host === location.host)) trip(`WebSocket(${u.href})`)
      super(url, protocols)
    }
  } as typeof WebSocket

  if ('EventSource' in window) {
    window.EventSource = class {
      constructor(url: string | URL) {
        trip(`EventSource(${String(url)})`)
      }
    } as unknown as typeof EventSource
  }
}
