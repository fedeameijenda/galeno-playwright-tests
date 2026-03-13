import { Page, Locator } from '@playwright/test';

export class CredencialPage {

  readonly page: Page;
  readonly menuCredencial: Locator;

  constructor(page: Page) {

    this.page = page;

    // el click debe hacerse sobre el botón contenedor
    this.menuCredencial = page.getByRole('button', { name: 'Credencial Virtual' });

  }

  async abrirCredencial() {

    await this.menuCredencial.scrollIntoViewIfNeeded();

    await Promise.all([
      this.page.waitForURL('**/socio/credencial_provisoria'),
      this.menuCredencial.click()
    ]);

  }

}