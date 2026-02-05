import fs from 'fs/promises';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import {
    PDF_CONFIG,
    getPDFSections,
    getPageUrl,
    getSectionBySlug,
    type PDFSection
} from './config';
import {
    launchBrowser,
    generateSinglePdf,
    waitForServer
} from './core';

/**
 * Ensure output directories exist
 */
async function ensureDirectories(): Promise<void> {
    await fs.mkdir(PDF_CONFIG.sectionsDir, { recursive: true });
}

/**
 * Generate PDF for a single section
 */
async function generateSection(
    section: PDFSection,
    browser: Awaited<ReturnType<typeof launchBrowser>>
): Promise<string> {
    const page = await browser.newPage();
    const url = getPageUrl(section);
    const outputPath = path.join(PDF_CONFIG.sectionsDir, section.filename);

    console.log(`  📄 [${section.index}] ${section.title}`);
    console.log(`     URL: ${url}`);

    try {
        const pdfBuffer = await generateSinglePdf(page, url);
        await fs.writeFile(outputPath, pdfBuffer);
        console.log(`     ✅ Saved: ${section.filename}`);
        return outputPath;
    } catch (error) {
        console.error(`     ❌ Failed: ${error}`);
        throw error;
    } finally {
        await page.close();
    }
}

/**
 * Generate all section PDFs
 */
async function generateAllSections(): Promise<string[]> {
    const sections = getPDFSections();
    const generatedPaths: string[] = [];

    console.log(`\n📑 Generating ${sections.length} section PDFs...\n`);

    const browser = await launchBrowser();

    try {
        for (const section of sections) {
            try {
                const outputPath = await generateSection(section, browser);
                generatedPaths.push(outputPath);
            } catch {
                // Continue with other sections even if one fails
                console.log(`     ⏭️  Skipping ${section.title}`);
            }
        }
    } finally {
        await browser.close();
    }

    return generatedPaths;
}

/**
 * Main generator entry point
 */
async function main(): Promise<void> {
    console.log('🚀 Continuum Flow PDF Generator\n');

    // Parse arguments
    const args = process.argv.slice(2);
    const singlePage = args.includes('--page') ? args[args.indexOf('--page') + 1] : null;

    let serverProcess: ChildProcess | null = null;
    let serverStartedByScript = false;

    try {
        // Check if server is running
        console.log('🔍 Checking for development server...');
        const isServerUp = await waitForServer(PDF_CONFIG.baseUrl, 3000);

        if (!isServerUp) {
            console.log('⚠️  Server not running. Starting preview server...');
            // Use npx astro preview directly with detached process
            serverProcess = spawn('npx', ['astro', 'preview', '--port', '4321'], {
                stdio: 'ignore',
                shell: true,
                cwd: process.cwd(),
                detached: true
            });
            serverProcess.unref();
            serverStartedByScript = true;

            // Wait longer for server to start
            console.log('⏳ Waiting for server to start...');
            const ready = await waitForServer(PDF_CONFIG.baseUrl, 20000);
            if (!ready) {
                console.error('❌ Failed to start server automatically.');
                console.log('\n💡 Please start the server manually in another terminal:');
                console.log('   npm run preview');
                console.log('\nThen run this command again.');
                process.exit(1);
            }
            console.log('✅ Server is ready!\n');
        } else {
            console.log('✅ Server already running.\n');
        }

        // Ensure directories exist
        await ensureDirectories();

        if (singlePage) {
            // Generate single page
            const section = getSectionBySlug(singlePage);
            if (!section) {
                console.error(`❌ Unknown section: ${singlePage}`);
                console.log('\nAvailable sections:');
                getPDFSections().forEach(s => console.log(`  - ${s.slug}`));
                process.exit(1);
            }

            console.log(`\n📄 Generating single section: ${section.title}\n`);
            const browser = await launchBrowser();
            try {
                await generateSection(section, browser);
            } finally {
                await browser.close();
            }
        } else {
            // Generate all sections
            const paths = await generateAllSections();
            console.log(`\n✅ Generated ${paths.length} section PDFs`);
            console.log(`📁 Output directory: ${PDF_CONFIG.sectionsDir}`);
        }

    } catch (error) {
        console.error('\n❌ PDF Generation Failed:', error);
        process.exit(1);
    } finally {
        if (serverStartedByScript && serverProcess) {
            console.log('\n🛑 Stopping preview server...');
            serverProcess.kill();
        }
    }
}

main().catch(console.error);
