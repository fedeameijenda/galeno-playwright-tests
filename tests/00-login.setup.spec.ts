import { test } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { users } from '../data/users'
import fs from 'fs'

test.setTimeout(120000)

test('guardar sesiones', async ({ page }, testInfo) => {

  const projectName = testInfo.project.name
  const user = users.find(u => projectName.includes(u.tipo))

  if (!user) return

  const loginPage = new LoginPage(page)

  await loginPage.goto()
  await loginPage.login(user.dni, user.password)

// asegurarse que realmente está logueado
await page.waitForURL('**/socio/home')

// capturar el estado de redux persist
const persist = await page.evaluate(() => {
  return localStorage.getItem('persist:root')
})

// guardarlo para reutilizar luego
fs.writeFileSync(`.playwright/${user.tipo}-persist.json`, persist || '')

// recién ahora guardar sesión
await page.context().storageState({
  path: `.playwright/${user.tipo}.json`
})

})