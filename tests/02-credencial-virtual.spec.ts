
import { test, expect } from '../fixtures/auth'
import { fechaHora } from '../utils/dateUtils'
import { CredencialPage } from '../pages/credencial.page'
import { users } from '../data/users'
import { credenciales } from '../data/credenciales'
import { CredencialCompartidaPage } from '../pages/credencialCompartida.page'


test('cambia QR para la credencial principal', async ({ authenticatedPage }) => {

  const page = authenticatedPage
  const credencialPage = new CredencialPage(page)

  await credencialPage.abrirCredencial()

  await credencialPage.esperarPantallaCredencial()

  await credencialPage.abrirQR()

  await expect(credencialPage.qr).toBeVisible()

  await credencialPage.generarNuevoQR()
});

test('cambia QR para cada hijo', async ({ authenticatedPage }) => {

  const page = authenticatedPage
  const credencialPage = new CredencialPage(page)

  await credencialPage.abrirCredencial()

  await page.getByRole('progressbar').waitFor({ state: 'hidden' })

  await credencialPage.abrirQR()

  await credencialPage.esperarIntegrantes()

  const count = await credencialPage.obtenerCantidadIntegrantes()

  console.log(`Integrantes detectados: ${count}`)

  if (count <= 1) {
    console.log('Usuario sin hijos')
    return
  }

  for (let i = 1; i < count; i++) {

    const nombre = await credencialPage.obtenerNombreIntegrante(i)

    console.log(`--- Probando QR para ${nombre} ---`)

    await credencialPage.seleccionarIntegrante(i)

    await credencialPage.generarNuevoQR()

    console.log(`QR actualizado correctamente para ${nombre}`)

  }

});
test('compartir credencial virtual por Whatsapp', async ({ authenticatedPage, context }) => {

  const page = authenticatedPage
  const credencialPage = new CredencialPage(page)

  await credencialPage.abrirCredencial()

  await credencialPage.asegurarCredencialesNoCompartidas()

  await credencialPage.iniciarCompartir()

  await credencialPage.completarFormularioCompartir(credenciales.dniCompartir)

  await credencialPage.compartirPorWhatsapp()

  await credencialPage.esperarFinCompartir()

  await credencialPage.esperarQRDisponible()

  await credencialPage.verificarMensajeCredencialCompartida()

  await credencialPage.verificarIconoCompartido()

})

test('compartir credencial virtual por link', async ({ authenticatedPage }) => {

  const page = authenticatedPage
  const credencialPage = new CredencialPage(page)

  await credencialPage.abrirCredencial()

  await credencialPage.asegurarCredencialesNoCompartidas()

  await credencialPage.iniciarCompartir()

  await credencialPage.completarFormularioCompartir(credenciales.dniCompartir)

await credencialPage.compartirPorLink()

})

test.describe('url de credencial compartida', () => {

  users.forEach(user => {

    test(`abrir credencial compartida - ${user.tipo}`, async ({ page }, testInfo) => {

      if (!testInfo.project.name.includes(user.tipo)) {
        test.skip()
      }

      const credencialCompartidaPage = new CredencialCompartidaPage(page)

      const { fecha, hora } = fechaHora()

      const url =
        `/credencial_compartida/formulario/` +
        `${user.share.id}/${user.share.correlativo}/${user.share.plan}/${fecha}/${hora}`

      await page.goto(url)

      await credencialCompartidaPage.verificarPantallaIngreso()

      await credencialCompartidaPage.ingresarDni(user.dni)

      await credencialCompartidaPage.confirmar()

      await credencialCompartidaPage.esperarQR()

      await credencialCompartidaPage.abrirQR()

    })

  })

})

test('dejar de compartir credencial virtual', async ({ authenticatedPage }) => {

  const page = authenticatedPage
  const credencialPage = new CredencialPage(page)

  await credencialPage.abrirCredencial()

  await credencialPage.asegurarCredencialesNoCompartidas()

  
})