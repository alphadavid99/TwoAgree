import { GalleryFirebaseError } from './runtime'
const fail = (m: string) => () => {
  throw new GalleryFirebaseError(`@capacitor-firebase/authentication.${m} was called`)
}
export const FirebaseAuthentication = {
  signInWithGoogle: fail('signInWithGoogle'),
  signInWithApple: fail('signInWithApple'),
}
