import { Page, Locator, expect } from '@playwright/test';

export class CredencialPage {

  readonly page: Page;
  readonly menuCredencial: Locator;
  readonly qr: Locator;
  readonly integrantesChips: Locator
  readonly snackbar: Locator
  readonly iconoCompartido: Locator

  constructor(page: Page) {

    this.page = page;

    this.menuCredencial = page.getByRole('button', { name: 'Credencial Virtual' });

    this.qr = page.locator('svg').last()

    this.integrantesChips = page.locator('[role="button"].MuiChip-root')

    this.snackbar = page.locator('#message-id-snackbar')

    this.iconoCompartido = page.locator('svg[data-icon="share-alt"]')

  }

  async abrirCredencial() {

    await this.page.waitForLoadState('domcontentloaded')

    await Promise.all([
      this.page.waitForURL('**/socio/credencial_provisoria'),
      this.menuCredencial.click()
    ]);

  }
async asegurarCredencialesNoCompartidas() {

  await this.page.getByText('Credenciales virtuales').waitFor()

  const verCompartidosBtn = this.page.getByRole('button', { name: 'VER COMPARTIDOS' })

  if (await verCompartidosBtn.count() === 0) {
    return
  }

  await verCompartidosBtn.click()

  await expect(this.page.getByText('Credencial compartida con')).toBeVisible()

  const checkboxes = this.page.locator('input[type="checkbox"]')

await expect(checkboxes.first()).toBeVisible()

const total = await checkboxes.count()

for (let i = 0; i < total; i++) {
  await checkboxes.nth(i).click()
}

  const dejarCompartirBtn = this.page.getByRole('button', { name: 'DEJAR DE COMPARTIR' })

  await expect(dejarCompartirBtn).toBeEnabled()

  await dejarCompartirBtn.click()

  await expect(
  this.page.getByText('Has dejado de compartir tu credencial')
).toBeVisible()

// esperar que la sección de credenciales termine de renderizar
await this.page.getByRole('button', { name: 'VER CÓDIGO QR' }).waitFor()

await expect(
  this.page.getByRole('button', { name: 'VER COMPARTIDOS' })
).toBeHidden()

await expect(
  this.page.getByRole('button', { name: 'COMPARTIR CREDENCIAL' })
).toBeVisible()
}

async esperarIntegrantes() {
  await this.integrantesChips.first().waitFor()
}
async obtenerCantidadIntegrantes() {
  return await this.integrantesChips.count()
}

async obtenerNombreIntegrante(index: number) {
  return await this.integrantesChips.nth(index).innerText()
}
async seleccionarIntegrante(index: number) {
  const chip = this.integrantesChips.nth(index)
  await chip.waitFor()
  await chip.click()
}

async verificarMensajeCredencialCompartida() {
  await expect(async () => {
  const text = await this.snackbar.textContent()

  expect(
    text?.includes('Tu credencial ha sido compartida correctamente') ||
    text?.includes('Enlace copiado')
  ).toBeTruthy()
}).toPass()
}

async verificarIconoCompartido() {
  await expect(this.iconoCompartido).toBeVisible()
}

async iniciarCompartir() {
  const compartirBtn = this.page.getByRole('button', { name: 'COMPARTIR CREDENCIAL' })

  await compartirBtn.waitFor({ state: 'visible' })
  await compartirBtn.click()

  await this.page.getByText('ACEPTAR').click()

  await this.page.waitForURL('**/compartirCredencialform/**')
}
async abrirQR() {

  const verQR = this.page.getByRole('button', { name: 'VER CÓDIGO QR' })

  await verQR.waitFor({ state: 'visible' })

  await Promise.all([
    this.page.waitForURL('**/qrCode'),
    verQR.click()
  ])
}
async generarNuevoQR() {

  const qr = this.page.locator('svg').last()

  await expect(qr).toBeVisible()

  const anterior = await qr.innerHTML()

  await this.page.getByRole('button', { name: 'GENERAR NUEVO QR' }).click()

  await expect.poll(
    async () => await qr.innerHTML(),
    { timeout: 10000 }
  ).not.toBe(anterior)
}
async esperarFinCompartir() {

  const spinner = this.page.locator('.MuiCircularProgress-root')

    if (await spinner.count() > 0) {
    await spinner.waitFor({ state: 'hidden' })
}
}
async esperarQRDisponible() {

  await this.page
    .getByRole('button', { name: 'VER CÓDIGO QR' })
    .waitFor({ state: 'visible', timeout: 60000 })
}
async esperarPantallaCredencial() {

  await this.page.getByRole('progressbar').waitFor({ state: 'hidden' })

  await this.page.getByText('Credenciales virtuales').waitFor()
}
async completarFormularioCompartir(dni: string) {

  await this.page.locator('#outlined-basic').fill(dni)

  await this.page.getByRole('button', { name: 'COMPARTIR' }).click()
}
async compartirPorLink() {

  const menu = this.page.locator('.MuiPopover-paper').filter({
    hasText: 'Copiar Link'
  })

  const copiarLink = menu.getByText('Copiar Link')

  await copiarLink.dispatchEvent('click')

  await expect(
  this.page.getByText(/Enlace copiado|Tu credencial ha sido compartida correctamente/)
).toBeVisible()
   
}



async compartirPorWhatsapp() {

  const whatsappLink = this.page.locator('a[target="_blank"]').filter({
    hasText: 'WhatsApp'
  })

  await expect(whatsappLink).toBeVisible()

  const [newPage] = await Promise.all([
    this.page.context().waitForEvent('page'),
    whatsappLink.click({ force: true })
  ])

  await expect(newPage).toHaveURL(/whatsapp\.com\/send/)
}



async abrirCompartidos() {

  const verCompartidosBtn = this.page.getByRole('button', { name: 'VER COMPARTIDOS' })

  await expect(verCompartidosBtn).toBeVisible()

  await verCompartidosBtn.click()

  await expect(this.page.getByText('Credencial compartida con')).toBeVisible()
}

async dejarDeCompartirPrimeraCredencial() {

  await expect(
    this.page.getByText('Credencial compartida con')
  ).toBeVisible()

  const checkbox = this.page.locator('input[type="checkbox"]:visible').first()
  await checkbox.waitFor({ state: 'visible' })
  await checkbox.check()

  const dejarCompartirBtn = this.page.getByRole('button', { name: 'DEJAR DE COMPARTIR' })

  await expect(dejarCompartirBtn).toBeEnabled()

  await dejarCompartirBtn.click()

  try {
  await expect(
    this.page.getByRole('button', { name: 'COMPARTIR CREDENCIAL' })
  ).toBeVisible({ timeout: 5000 })
} catch {
  // retry una vez
  await this.page.reload()
  await this.page.getByRole('button', { name: 'VER COMPARTIDOS' }).click()

  await expect(
    this.page.getByRole('button', { name: 'COMPARTIR CREDENCIAL' })
  ).toBeVisible()
}
}
}
