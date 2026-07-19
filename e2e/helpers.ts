import { test as base, expect, type Page } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  await page.waitForLoadState('networkidle')
  const signInButton = page.getByRole('button', { name: 'Sign in' })
  await signInButton.waitFor({ state: 'visible', timeout: 10000 })
  await signInButton.click()
  await page.waitForTimeout(500)
  const dialog = page.getByRole('dialog')
  await dialog.locator('#li-u').fill(username)
  await dialog.locator('#li-p').fill(password)
  await dialog.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.locator('a[aria-label="Profile"]')).toBeVisible({ timeout: 10000 })
}

export async function logout(page: Page) {
  const signOutIcon = page.locator('button[aria-label="Sign out"]')
  if (await signOutIcon.isVisible()) {
    await signOutIcon.click()
    await page.waitForTimeout(500)
    const confirmButton = page.getByRole('dialog').getByRole('button', { name: 'Sign out' })
    if (await confirmButton.isVisible()) {
      await confirmButton.click()
      await page.waitForTimeout(1000)
    }
  }
}

export const test = base.extend<{ testData: TestData }>({
  testData: async ({}, use) => {
    await use(getTestData())
  },
})

export { expect } from '@playwright/test'
