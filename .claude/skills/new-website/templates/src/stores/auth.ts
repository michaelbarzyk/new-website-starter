import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { ADMINS_COLLECTION, auth, db } from '../firebase'
import { errorMessage } from '../utils/errorMessage'

/**
 * Plain snapshot of the signed-in user. Never store the Firebase User itself in
 * reactive state: Vue deep-traverses it and hits the cross-origin sign-in popup
 * window, throwing a SecurityError.
 */
export interface SignedInUser {
  uid: string
  email: string | null
}

function isPermissionDenied(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 'permission-denied'
}

function toSignedInUser(next: User | null): SignedInUser | null {
  return next === null ? null : { uid: next.uid, email: next.email }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SignedInUser | null>(null)
  const isAdmin = ref(false)
  /** False until Firebase has restored (or ruled out) a saved session. */
  const ready = ref(false)
  const error = ref<string | null>(null)

  let started = false

  /** Starts listening for sign-in changes. Safe to call more than once. */
  function init(): void {
    if (started) return
    started = true
    onAuthStateChanged(auth, (next) => {
      user.value = toSignedInUser(next)
      void refreshAdmin(user.value).finally(() => {
        ready.value = true
      })
    })
  }

  async function refreshAdmin(next: SignedInUser | null): Promise<void> {
    // Never show admin tools for a new user until their own check comes back.
    isAdmin.value = false
    if (next === null) return
    try {
      // Rules let a signed-in user read only their own admins/{uid} doc.
      const ref = doc(db, ADMINS_COLLECTION, next.uid)
      const exists = (await getDoc(ref)).exists()
      // Ignore a slow answer for someone who has since signed out or switched.
      if (user.value?.uid !== next.uid) return
      isAdmin.value = exists
      // The page is usable now; an owner's first-time claim finishes in the background.
      if (!exists) void claimOwner(next)
    } catch {
      if (user.value?.uid === next.uid) isAdmin.value = false
    }
  }

  /**
   * Owners listed in firestore.rules can create their own admins doc; for anyone else the rules
   * refuse, which is expected and ignored. If another tab claimed first, the write is an update and
   * is refused too, so read the doc again instead of trusting the failure.
   */
  async function claimOwner(next: SignedInUser): Promise<void> {
    const ref = doc(db, ADMINS_COLLECTION, next.uid)
    let granted = false
    try {
      await setDoc(ref, { role: 'admin' })
      granted = true
    } catch (err: unknown) {
      try {
        granted = (await getDoc(ref)).exists()
      } catch {
        granted = false
      }
      if (!granted && !isPermissionDenied(err)) error.value = errorMessage(err)
    }
    if (granted && user.value?.uid === next.uid) isAdmin.value = true
  }

  async function signInWithGoogle(): Promise<void> {
    error.value = null
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (err: unknown) {
      error.value = errorMessage(err)
    }
  }

  async function signOutUser(): Promise<void> {
    await signOut(auth)
  }

  return { user, isAdmin, ready, error, init, signInWithGoogle, signOutUser }
})
