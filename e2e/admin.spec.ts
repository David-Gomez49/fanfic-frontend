import { test, expect, login } from './helpers'

test.describe('Admin flows', () => {
  test('admin dashboard displays stats', async ({ page, testData }) => {
    await login(page, testData.admin.username, testData.admin.password)

    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible()

    await expect(page.getByText('Users').first()).toBeVisible()
    await expect(page.getByText('Fanfics').first()).toBeVisible()
    await expect(page.getByText('Comments').first()).toBeVisible()
    await expect(page.getByText('Tags').first()).toBeVisible()
    await expect(page.getByText('Fandoms').first()).toBeVisible()
  })

  test('admin can view users section', async ({ page, testData }) => {
    await login(page, testData.admin.username, testData.admin.password)

    await page.goto('/admin')
    await page.getByRole('button', { name: /users/i }).click()

    await expect(page.getByText(testData.user.username).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(testData.admin.username).first()).toBeVisible()
  })

  test('non-admin user is denied access', async ({ page, testData }) => {
    await login(page, testData.user.username, testData.user.password)

    await page.goto('/admin')
    // Admin page redirects non-admin users to homepage
    await expect(page).toHaveURL(/\//)
    await expect(page.getByText(/sign in/i)).toBeVisible()
  })

  test('admin can view fics section', async ({ page, testData }) => {
    await login(page, testData.admin.username, testData.admin.password)

    await page.goto('/admin')
    await page.getByRole('button', { name: /fics/i }).click()

    for (const fic of testData.fics) {
      await expect(page.getByText(fic.title).first()).toBeVisible({ timeout: 5000 })
    }
  })
})
