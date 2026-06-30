import { test, expect } from '@playwright/test';

test('click dropdown and take screenshot', async ({ page }) => {
    // Ubah ukuran browser menjadi tampilan smartphone (320 x 568)
    await page.setViewportSize({ width: 320, height: 500 });

    // 1. Arahkan ke halaman web yang diinginkan
    await page.goto('https://r.parkee.app/?l=164&ps=4BE0B9CF');

    // Tunggu loading overlay (MuiLinearProgress-root) hilang jika ada
    await page.waitForSelector('.MuiLinearProgress-root', { state: 'detached', timeout: 5000 }).catch(() => { });

    // 2. Klik tombol dropdown arrow (Accordion Header "Parking Details")
    await page.locator('#panel1a-header').click();

    // scroll dikit
    await page.evaluate(() => window.scrollBy(0, 110));

    // Tunggu animasi dropdown selesai terbuka
    await page.waitForTimeout(500);

    const date = new Date();
    const dateString = date.toISOString().split('T')[0]; // Contoh output: "2026-05-10"
    const fileName = `screenshot-${dateString}.png`;

    await page.screenshot({ path: `./screenshoots/${fileName}`, fullPage: false });
});
