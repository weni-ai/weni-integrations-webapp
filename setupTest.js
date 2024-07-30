// setupTest.js
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

beforeEach(() => {
  const pinia = createTestingPinia()
  setActivePinia(pinia)
})
