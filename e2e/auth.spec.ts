import { test, expect, login, logout } from './helpers'

test.describe('Auth flows', () => {
  test('register a new user', async ({ page }) => {
    const ts = Date.now()
    const username = `e2enew_${ts}`
    const password = 'NewTestPass1'

    await page.goto('/')

    const signInButton = page.locator('button', { hasText: 'Sign in' })
    await signInButton.click()

    const signUpTab = page.getByRole('tab', { name: 'Sign up' })
    await signUpTab.click()

    await page.locator('#su-u').fill(username)
    await page.locator('#su-p').fill(password)
    await page.locator('#su-cp').fill(password)

    await page.locator('button', { hasText: 'Sign up' }).click()

    await expect(page.getByText(username)).toBeVisible()
  })

  test('login and logout with existing user', async ({ page, testData }) => {
    await login(page, testData.user.username, testData.user.password)

    await expect(page.getByText(testData.user.username)).toBeVisible()

    await logout(page)

    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/')

    const signInButton = page.locator('button', { hasText: 'Sign in' })
    await signInButton.click()

    await page.locator('#li-u').fill('nonexistent_user')
    await page.locator('#li-p').fill('WrongPass1')
    await page.locator('button', { hasText: 'Sign in' }).click()

    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })
})
