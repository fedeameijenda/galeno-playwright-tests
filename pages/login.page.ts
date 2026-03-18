import { Page, expect } from '@playwright/test'
import { esperarCarga } from '../utils/waits'

export class LoginPage {

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('https://portal-test.galeno.com.ar/login')
  }
async login(dni: string, password: string) {

  const dniInput = this.page.getByLabel('Número')
  const passInput = this.page.getByLabel('Contraseña')
  const loginButton = this.page.getByRole('button', { name: 'INGRESÁ' })

  await this.page.waitForLoadState('networkidle')

  await dniInput.fill(dni)
  await passInput.fill(password)

  await expect(loginButton).toBeEnabled()

  await loginButton.click()

  await esperarCarga(this.page)
}
}