import { Page } from '@playwright/test'

export async function esperarCarga(page: Page) {
  await page
    .getByRole('progressbar')
    .waitFor({ state: 'hidden', timeout: 15000 })
    .catch(() => {})
}