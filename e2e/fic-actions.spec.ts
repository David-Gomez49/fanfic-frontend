import { test, expect, login } from './helpers'

test.describe('Fic action flows', () => {
  test.beforeEach(async ({ page, testData }) => {
    await login(page, testData.user.username, testData.user.password)
  })

  test('add a new fanfic', async ({ page, testData }) => {
    await page.goto('/add')

    await page.getByRole('heading', { name: /add fanfiction/i })

    await page.getByLabel('Title').fill('E2E Test Fic')
    await page.getByLabel('Author').fill('E2E Author')
    await page.getByLabel('Description').fill('An E2E test fanfiction for testing purposes.')

    const fandomInput = page.getByLabel('Fandoms')
    await fandomInput.fill(testData.fandoms[0].name)
    await page.keyboard.press('Enter')

    const tagInput = page.getByLabel('Tags')
    await tagInput.fill('E2E-Test')
    await page.keyboard.press('Enter')

    await page.getByLabel('Language').click()
    await page.getByRole('option', { name: 'English' }).click()

    await page.getByLabel('Status').click()
    await page.getByRole('option', { name: 'Complete' }).click()

    await page.getByPlaceholder('e.g. 45000').fill('10000')
    await page.getByPlaceholder('e.g. 24').fill('5')

    await page.getByRole('button', { name: 'Publish' }).click()

    await expect(page).toHaveURL(/\/fic\//)
    await expect(page.getByText('E2E Test Fic')).toBeVisible({ timeout: 10000 })
  })

  test('rate a fanfic', async ({ page, testData }) => {
    const fic = testData.fics[1]
    await page.goto(`/fic/${fic.id}`)

    const rateButton = page.getByRole('button', { name: /rate/i })
    await expect(rateButton).toBeVisible()
    await rateButton.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const star4 = dialog.locator('button[aria-label="4 stars"]')
    await star4.click()

    await expect(page.getByText(/your rating/i)).toBeVisible({ timeout: 5000 })
  })

  test('post a comment on a fanfic', async ({ page, testData }) => {
    const fic = testData.fics[1]
    await page.goto(`/fic/${fic.id}`)

    const textarea = page.getByPlaceholder(/share what you thought/i)
    await expect(textarea).toBeVisible()
    await textarea.fill('E2E test comment - really enjoyed this fic!')

    await page.getByRole('button', { name: /post/i }).click()

    await expect(page.getByText('E2E test comment')).toBeVisible({ timeout: 5000 })
  })

  test('toggle favorite and read later', async ({ page, testData }) => {
    const fic = testData.fics[2]
    await page.goto(`/fic/${fic.id}`)

    const favButton = page.getByRole('button', { name: /favorite/i })
    await favButton.click()
    await expect(page.getByRole('button', { name: /saved/i }).first()).toBeVisible({ timeout: 5000 })

    const readLaterButton = page.getByRole('button', { name: /read later/i })
    await readLaterButton.click()
  })
})
