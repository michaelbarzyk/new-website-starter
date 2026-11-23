import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import App from '../App.vue'

vi.mock('../firebase', () => ({ auth: {}, db: {}, ADMINS_COLLECTION: 'admins' }))
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class {},
  onAuthStateChanged: vi.fn<(auth: unknown, next: (user: null) => void) => void>((_auth, next) =>
    next(null),
  ),
  signInWithPopup: vi.fn<() => Promise<void>>(async () => undefined),
  signOut: vi.fn<() => Promise<void>>(async () => undefined),
}))

describe('App', () => {
  it('shows the project title and an admin sign-in', async () => {
    const wrapper = mount(App, { global: { plugins: [createPinia()] } })
    await flushPromises()
    expect(wrapper.find('h1').text()).toBe('__TITLE__')
    expect(wrapper.text()).toContain('Admin sign-in')
  })
})
