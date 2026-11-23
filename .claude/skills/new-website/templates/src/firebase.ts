import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase web config is public by design; access is controlled by firestore.rules.
const firebaseConfig = __FIREBASE_CONFIG__

/** admins/{uid}: an existing doc grants admin. Created by hand in the console only. */
export const ADMINS_COLLECTION = 'admins'

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
