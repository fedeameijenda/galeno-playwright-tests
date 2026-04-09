import { test, expect } from '../fixtures/auth'
import { GuardiaInteligentePage } from '../pages/guardiaInteligente.page'

test('Navegar a Guardia Inteligente', async ({ authenticatedPage: page }) => {

  const guardiaPage = new GuardiaInteligentePage(page)

  // Abre Guardia Inteligente desde el menú lateral
  await guardiaPage.abrirGuardiaInteligente()

  // Verificar que está en la URL correcta
  expect(page.url()).toContain('https://portal-test.galeno.com.ar/socio/guardia_inteligente')
})