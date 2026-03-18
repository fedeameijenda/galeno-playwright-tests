import { Page, Locator, expect } from '@playwright/test'

export class CredencialCompartidaPage {

  readonly page: Page
  readonly inputDni: Locator
  readonly btnConfirmar: Locator
  readonly btnVerQR: Locator

  constructor(page: Page) {

    this.page = page

    this.inputDni = page.getByLabel('N° de documento')

    this.btnConfirmar = page.getByRole('button', { name: 'CONFIRMAR' })

    this.btnVerQR = page.getByRole('button', { name: 'VER CÓDIGO QR' })

  }

  async verificarPantallaIngreso() {

    await expect(
      this.page.getByText('Ingresá tu DNI para acceder a la credencial que te compartieron')
    ).toBeVisible()

  }

  async ingresarDni(dni: string) {

    await this.inputDni.fill(dni)

  }

  async confirmar() {

    await this.btnConfirmar.click()

  }

  async esperarQR() {

    await this.btnVerQR.waitFor({ state: 'visible', timeout: 30000 })

  }

  async abrirQR() {

    await this.btnVerQR.click()

  }

}