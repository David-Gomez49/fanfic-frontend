import { test as base, type Page } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

export interface TestData {
  runId: string
  user: { id: string; username: string; password: string; email: string }
  admin: { id: string; username: string; password: string; email: string }
  fics: Array<{ id: string; title: string; author: string; status: string; fandom: string; tag: string }>
  fandoms: Array<{ id: string; name: string }>
  tags: Array<{ id: string; name: string }>
}

let _testData: TestData | null = null

export function getTestData(): TestData {
  if (!_testData) {
    const dataPath = path.resolve(__dirname, '.test-data.json')
    _testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as TestData
  }
  return _testData
}

export async function login(page: Page, username: string, password: string) {
  await page.goto('/')
  const signInButton = page.locator('button', { hasText: 'Sign in' })
  if (await signInButton.isVisible()) {
    await signInButton.click()
  }
  const dialog = page.getByRole('dialog')
  await dialog.locator('#li-u').fill(username)
  await dialog.locator('#li-p').fill(password)
  await dialog.locator('button', { hasText: 'Sign in' }).click()
  await page.waitForTimeout(1000)
}

export async function logout(page: Page) {
  const profileLink = page.locator('a[aria-label="Profile"]')
  if (await profileLink.isVisible()) {
    await profileLink.click()
    const signOutButton = page.locator('button', { hasText: 'Sign out' })
    if (await signOutButton.isVisible()) {
      await signOutButton.click()
      await page.waitForTimeout(500)
    }
  }
}

export const test = base.extend<{ testData: TestData }>({
  testData: async ({}, use) => {
    await use(getTestData())
  },
})

export { expect } from '@playwright/test'
