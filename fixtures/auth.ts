import { test as base, expect, Page } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { users } from '../data/users'

type Fixtures = {
  authenticatedPage: Page
}

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use, testInfo) => {

    const tipo = testInfo.project.name.split('-')[1]
    const user = users.find(u => u.tipo === tipo)

    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.login(user!.dni, user!.password)

    // aseguro que el home realmente cargó
    await page.waitForURL('**/socio/home', { timeout: 60000 })

    await use(page)
  }
})

export { expect }