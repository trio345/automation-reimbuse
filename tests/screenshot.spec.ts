import { test } from '@playwright/test';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';


test('click dropdown and take screenshot', async ({ page }) => {
    // Ubah ukuran browser menjadi tampilan smartphone (320 x 568)
    await page.setViewportSize({ width: 320, height: 500 });

    // 1. Arahkan ke halaman web yang diinginkan
    await page.goto('https://r.parkee.app/?l=164&ps=427592CF');

    // Tunggu loading overlay (MuiLinearProgress-root) hilang jika ada
    await page.waitForSelector('.MuiLinearProgress-root', { state: 'detached', timeout: 5000 }).catch(() => { });

    // 2. Klik tombol dropdown arrow (Accordion Header "Parking Details")
    await page.locator('#panel1a-header').click();

    // scroll dikit
    await page.evaluate(() => window.scrollBy(0, 110));

    // Tunggu animasi dropdown selesai terbuka
    await page.waitForTimeout(500);

    const elEntryDate = await page.locator('#receipt-entryTime').textContent();

    dayjs.extend(customParseFormat);

    const dateString = dayjs(elEntryDate, 'DD MMM YYYY, HH:mm').format('YYYY-MM-DD');

    const fileName = `screenshot-${dateString}.png`;

    await page.screenshot({ path: `./screenshoots/${fileName}`, fullPage: false });
});
