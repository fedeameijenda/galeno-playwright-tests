
import { test, expect } from '../fixtures/auth'

test('ir a credencial virtual', async ({ authenticatedPage }) => {

  const page = authenticatedPage

  await page.getByRole('button', { name: 'Credencial Virtual' }).click()

  await page.waitForURL('**/credencial_provisoria')

  await page.getByText('Credenciales virtuales').waitFor()

  await page.getByRole('button', { name: 'VER CÓDIGO QR' }).waitFor()
  await page.getByRole('button', { name: 'VER CÓDIGO QR' }).click()

  await page.waitForURL('**/qrCode')

  const qr = page.getByRole('button', { name: 'GENERAR NUEVO QR' }).locator('..').locator('svg')

  await expect(qr).toBeVisible()

  const qr1 = await qr.innerHTML()

  await page.getByRole('button', { name: 'GENERAR NUEVO QR' }).click()

  await expect.poll(
    async () => await qr.innerHTML(),
    { timeout: 10000 }
  ).not.toBe(qr1)
});

test('cambia QR para cada hijo', async ({ authenticatedPage }) => {

  const page = authenticatedPage

  // entrar a credencial
  await page.getByRole('button', { name: 'Credencial Virtual' }).click()

  await page.waitForURL('**/credencial_provisoria')

  // entrar al QR
  await page.getByRole('button', { name: 'VER CÓDIGO QR' }).click()

  await page.waitForURL('**/qrCode')

  await page.waitForSelector('.MuiChip-root')

  const chips = page.locator('[role="button"].MuiChip-root')
  const count = await chips.count()

  console.log(`Integrantes detectados: ${count}`)

  if (count <= 1) {
    console.log('Usuario sin hijos')
    return
  }

  for (let i = 1; i < count; i++) {

    const chip = chips.nth(i)
    const nombre = await chip.innerText()

    console.log(`--- Probando QR para ${nombre} ---`)

    // seleccionar hijo
    await chip.click()

    // esperar que se regenere el QR
    const qr = page.locator('svg').last()
    await expect(qr).toBeVisible()

    // QR actual
    const qrAnterior = await qr.innerHTML()

    // generar nuevo QR
    await page.getByRole('button', { name: 'GENERAR NUEVO QR' }).click()

    // esperar que cambie
    await expect.poll(
      async () => await qr.innerHTML(),
      { timeout: 10000 }
    ).not.toBe(qrAnterior)

    const qrNuevo = await qr.innerHTML()

    console.log(`QR actualizado correctamente para ${nombre}`)

  }

})