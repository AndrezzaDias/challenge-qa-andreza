import { Page, expect } from '@playwright/test';

export class SubscriptionPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/subscription');
  }

  async fillName(name: string) {
    await this.page.getByLabel('Nome').fill(name);
  }

  async fillEmail(email: string) {
    await this.page.getByLabel('E-mail').fill(email);
  }

  async selectPlan(plan: string) {
    await this.page.getByLabel('Plano').selectOption(plan);
  }

  async submit() {
    await this.page.getByRole('button', { name: /confirmar/i }).click();
  }

  async expectSuccess() {
    await expect(this.page.getByText(/sucesso/i)).toBeVisible();
  }

  async expectError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}