import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
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
      const snapshot = await getDoc(doc(db, ADMINS_COLLECTION, next.uid))
      // Ignore a slow answer for someone who has since signed out or switched.
      if (user.value?.uid === next.uid) isAdmin.value = snapshot.exists()
    } catch {
      if (user.value?.uid === next.uid) isAdmin.value = false
    }
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
