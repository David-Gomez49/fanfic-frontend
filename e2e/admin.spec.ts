import { test, expect, login } from './helpers'

test.describe('Admin flows', () => {
  test('admin dashboard displays stats', async ({ page, testData }) => {
    await login(page, testData.admin.username, testData.admin.password)

    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible()

    await expect(page.getByText('Users')).toBeVisible()
    await expect(page.getByText('Fanfics')).toBeVisible()
    await expect(page.getByText('Comments')).toBeVisible()
    await expect(page.getByText('Tags')).toBeVisible()
    await expect(page.getByText('Fandoms')).toBeVisible()
  })

  test('admin can view users section', async ({ page, testData }) => {
    await login(page, testData.admin.username, testData.admin.password)

    await page.goto('/admin')
    await page.getByRole('button', { name: /users/i }).click()

    await expect(page.getByText(testData.user.username)).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(testData.admin.username)).toBeVisible()
  })

  test('non-admin user is denied access', async ({ page, testData }) => {
    await login(page, testData.user.username, testData.user.password)

    await page.goto('/admin')
    await expect(page.getByText(/access denied/i)).toBeVisible()
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
