import { test, expect, login, logout } from './helpers'

test.describe('Auth flows', () => {
  test('register a new user', async ({ page }) => {
    const ts = Date.now()
    const username = `e2enew_${ts}`
    const password = 'NewTestPass1'

    await page.goto('/')

    const signInButton = page.locator('header button', { hasText: 'Sign in' })
    await signInButton.click()

    await page.getByRole('tab', { name: 'Sign up' }).click()

    await page.locator('#su-u').fill(username)
    await page.locator('#su-p').fill(password)
    await page.locator('#su-cp').fill(password)

    await page.getByRole('dialog').getByRole('button', { name: 'Sign up' }).click()

    await expect(page.locator('a[aria-label="Profile"]')).toBeVisible({ timeout: 10000 })
  })

  test('login and logout with existing user', async ({ page, testData }) => {
    await login(page, testData.user.username, testData.user.password)

    await expect(page.locator('a[aria-label="Profile"]')).toBeVisible()

    await logout(page)

    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/')

    await page.locator('header button', { hasText: 'Sign in' }).click()

    await page.locator('#li-u').fill('nonexistent_user')
    await page.locator('#li-p').fill('WrongPass1')
    await page.getByRole('dialog').getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })
})
