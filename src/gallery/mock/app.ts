// Fake firebase/app: there is no app to initialise.
export const initializeApp = (_config?: unknown) => ({ name: '[gallery-fake-app]' })
export const getApp = () => ({ name: '[gallery-fake-app]' })
