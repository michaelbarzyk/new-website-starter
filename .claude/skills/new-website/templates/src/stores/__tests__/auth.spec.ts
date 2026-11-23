import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '../auth'

interface FakeUser {
  uid: string
  email: string
}

interface TestState {
  signedIn: FakeUser | null
  docExists: boolean
  setDocError: unknown
  docExistsAfterFailedClaim: boolean
  setDocCalls: number
}

const state = vi.hoisted<TestState>(() => ({
  signedIn: null,
  docExists: false,
  setDocError: null,
  docExistsAfterFailedClaim: false,
  setDocCalls: 0,
}))

vi.mock('../../firebase', () => ({ auth: {}, db: {}, ADMINS_COLLECTION: 'admins' }))
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class {},
  onAuthStateChanged: vi.fn<(a: unknown, next: (u: FakeUser | null) => void) => void>((_a, next) =>
    next(state.signedIn),
  ),
  signInWithPopup: vi.fn<() => Promise<void>>(async () => undefined),
  signOut: vi.fn<() => Promise<void>>(async () => undefined),
}))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn<() => object>(() => ({})),
  getDoc: vi.fn<() => Promise<{ exists: () => boolean }>>(async () => ({
    exists: () => state.docExists,
  })),
  setDoc: vi.fn<() => Promise<void>>(async () => {
    state.setDocCalls += 1
    if (state.setDocError !== null) {
      state.docExists = state.docExistsAfterFailedClaim
      throw state.setDocError
    }
    state.docExists = true
  }),
}))

describe('auth store admin check', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    state.signedIn = { uid: 'u1', email: 'owner@example.com' }
    state.docExists = false
    state.setDocError = null
    state.docExistsAfterFailedClaim = false
    state.setDocCalls = 0
  })

  it('is admin when the admins doc already exists, without claiming', async () => {
    state.docExists = true
    const auth = useAuthStore()
    auth.init()
    await flushPromises()
    expect(auth.isAdmin).toBe(true)
    expect(state.setDocCalls).toBe(0)
  })

  it('lets an owner claim admin on first sign-in', async () => {
    const auth = useAuthStore()
    auth.init()
    await flushPromises()
    expect(auth.ready).toBe(true)
    expect(auth.isAdmin).toBe(true)
  })

  it('leaves a non-owner as a visitor and shows no error when the rules refuse', async () => {
    state.setDocError = { code: 'permission-denied' }
    const auth = useAuthStore()
    auth.init()
    await flushPromises()
    expect(auth.isAdmin).toBe(false)
    expect(auth.error).toBeNull()
  })

  it('is admin when another tab claimed first and this claim was refused', async () => {
    state.setDocError = { code: 'permission-denied' }
    state.docExistsAfterFailedClaim = true
    const auth = useAuthStore()
    auth.init()
    await flushPromises()
    expect(auth.isAdmin).toBe(true)
  })

  it('shows an error when the claim fails for a reason other than permissions', async () => {
    state.setDocError = new Error('network down')
    const auth = useAuthStore()
    auth.init()
    await flushPromises()
    expect(auth.isAdmin).toBe(false)
    expect(auth.error).toBe('network down')
  })

  it('does nothing for a signed-out visitor', async () => {
    state.signedIn = null
    const auth = useAuthStore()
    auth.init()
    await flushPromises()
    expect(auth.ready).toBe(true)
    expect(auth.isAdmin).toBe(false)
    expect(state.setDocCalls).toBe(0)
  })
})
