import { Page } from '@playwright/test'

export class LoginPage {

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('https://portal-test.galeno.com.ar/login')
  }

  async login(dni: string, password: string) {

  await this.page.getByLabel('Número').fill(dni)
  await this.page.getByLabel('Contraseña').fill(password)

  await this.page.getByRole('button', { name: 'INGRESÁ' }).click()

  // esperar hasta que deje de estar en login
  await this.page.waitForFunction(() => {
    return !window.location.href.includes('/login')
  }, { timeout: 60000 })

}
}