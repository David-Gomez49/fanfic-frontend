import { test, expect } from './helpers'

test.describe('Browse flows', () => {
  test('homepage loads with hero and navigation', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /literary obsession/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /browse catalog/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /add a fic/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /browse/i }).first()).toBeVisible()
  })

  test('browse page displays seeded fics and basic filtering', async ({ page, testData }) => {
    await page.goto('/browse')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('heading', { name: /browse/i })).toBeVisible()

    for (const fic of testData.fics) {
      await expect(page.getByText(fic.title)).toBeVisible()
    }

    const searchInput = page.getByPlaceholder('Title, author, fandom…')
    await expect(searchInput).toBeVisible()
    await searchInput.fill('The Lost Artifact')
    await page.waitForTimeout(1500)
    await expect(page.getByText('The Lost Artifact')).toBeVisible()
  })

  test('fic detail page shows full information', async ({ page, testData }) => {
    const fic = testData.fics[0]
    await page.goto(`/fic/${fic.id}`)

    await expect(page.getByRole('heading', { name: fic.title })).toBeVisible()
    await expect(page.getByText(`by ${fic.author}`)).toBeVisible()
    await expect(page.getByText(fic.status, { exact: false })).toBeVisible()

    await expect(page.getByRole('button', { name: /favorite/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /read later/i })).toBeVisible()

    await expect(page.getByPlaceholder(/share what you thought/i)).toBeVisible()
  })

  test('browse page pagination controls are visible', async ({ page }) => {
    await page.goto('/browse')
    const nextButton = page.getByRole('button', { name: /next page/i })
    if (await nextButton.isVisible()) {
      await expect(page.getByRole('button', { name: /previous page/i })).toBeVisible()
    } else {
      console.log('Only one page of results — pagination hidden as expected')
    }
  })
})
