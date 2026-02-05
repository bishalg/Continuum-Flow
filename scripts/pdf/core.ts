import puppeteer, { Browser, Page } from 'puppeteer';
import { PDF_CONFIG } from './config';

/**
 * Launch a configured Puppeteer browser instance
 */
export async function launchBrowser(): Promise<Browser> {
    return puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    });
}

/**
 * Wait for all content to render (fonts, images, charts)
 */
export async function waitForRender(page: Page): Promise<void> {
    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Wait for images
    await page.evaluate(async () => {
        const images = Array.from(document.querySelectorAll('img'));
        await Promise.all(
            images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve, reject) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', reject);
                });
            })
        );
    });

    // Wait for Chart.js canvases if present
    await page.evaluate(() => {
        return new Promise<void>((resolve) => {
            const canvases = document.querySelectorAll('canvas');
            if (canvases.length === 0) {
                resolve();
                return;
            }
            // Give charts time to animate/render
            setTimeout(resolve, 500);
        });
    });

    // Additional wait for any async content
    await new Promise(r => setTimeout(r, PDF_CONFIG.renderWait));
}

/**
 * Inject print-specific CSS to ensure clean PDF output
 */
export async function injectPrintStyles(page: Page): Promise<void> {
    await page.addStyleTag({
        content: `
            /* Force print mode styles */
            @media screen {
                /* Disable all animations */
                *, *::before, *::after {
                    animation: none !important;
                    animation-duration: 0s !important;
                    transition: none !important;
                    transition-duration: 0s !important;
                }
                
                /* Hide navigation */
                nav, aside, #sidebar, #overlay, button, .print\\:hidden {
                    display: none !important;
                }
                
                /* Full width content */
                main {
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 2rem !important;
                    margin: 0 !important;
                }
                
                /* Container adjustments */
                .max-w-4xl, .max-w-6xl {
                    max-width: 100% !important;
                }
                
                /* Force light theme */
                html, body {
                    background: white !important;
                    color: black !important;
                }
                
                /* Gradient text fix */
                .bg-clip-text,
                .text-transparent {
                    -webkit-background-clip: unset !important;
                    background-clip: unset !important;
                    color: black !important;
                    background: none !important;
                }
                
                /* Glass panel fix */
                .glass-panel {
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: none !important;
                }
            }
        `
    });
}

/**
 * Generate a single page PDF
 */
export async function generateSinglePdf(
    page: Page,
    url: string
): Promise<Buffer> {
    // Force light mode preference
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);

    // Navigate to page
    await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Enforce light theme in DOM (remove dark class from HTML)
    await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
        try {
            // Dispatch event to force re-render components if they listen
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('theme-change'));
        } catch (e) { }
    });

    // Set print media type
    await page.emulateMediaType('print');

    // Inject additional print styles
    await injectPrintStyles(page);

    // Wait for full render
    await waitForRender(page);

    // Generate PDF
    const pdfBuffer = await page.pdf({
        format: PDF_CONFIG.format,
        printBackground: true,
        margin: PDF_CONFIG.margins,
        displayHeaderFooter: false,
        preferCSSPageSize: false
    });

    return Buffer.from(pdfBuffer);
}

/**
 * Wait for development server to be ready
 */
export async function waitForServer(
    url: string,
    timeout: number = PDF_CONFIG.serverTimeout
): Promise<boolean> {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        try {
            const controller = new AbortController();
            const fetchTimeout = setTimeout(() => controller.abort(), 2000);

            const res = await fetch(url, {
                signal: controller.signal,
                method: 'GET'
            });

            clearTimeout(fetchTimeout);
            if (res.ok) return true;
        } catch {
            // Server not ready yet
        }
        await new Promise(r => setTimeout(r, 500));
    }

    return false;
}
