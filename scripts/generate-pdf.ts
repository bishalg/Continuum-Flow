import puppeteer from 'puppeteer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { SIDEBAR, SITE } from '../src/config';
import { PRINT_CSS, COVER_PAGE_HTML, SECTION_HEADER_HTML, TOC_HTML } from './print-styles';

const BASE_URL = 'http://localhost:4321/Context-Snoopiest';
const OUTPUT_PATH = path.join(process.cwd(), 'public/whitepaper.pdf');
const TEMP_DIR = path.join(process.cwd(), 'public/chapters');

// Types
interface TOCItem {
    title: string;
    page: number;
    isHeader: boolean;
}

// 1. Helper to wait for server
const waitForServer = async (url: string, timeout = 10000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            const res = await fetch(url);
            if (res.ok) return true;
        } catch (e) {
            // ignore
        }
        await new Promise(r => setTimeout(r, 500));
    }
    return false;
};

// 2. Ensure temp directory exists
const ensureTempDir = async () => {
    try {
        await fs.rm(TEMP_DIR, { recursive: true, force: true });
        await fs.mkdir(TEMP_DIR, { recursive: true });
    } catch (e) {
        console.error('Error creating temp dir:', e);
    }
};

async function generatePDF() {
    console.log('🚀 Starting Robust PDF Generation...');
    let serverProcess: ChildProcess | null = null;
    let serverStartedByScript = false;

    // --- SETUP SERVER ---
    const isServerUp = await waitForServer(BASE_URL, 1000);
    if (!isServerUp) {
        console.log('⚠️ Server seems down. Starting `npm run preview`...');
        serverProcess = spawn('npm', ['run', 'preview'], {
            stdio: 'inherit',
            shell: true,
            detached: false
        });
        serverStartedByScript = true;
        console.log('⏳ Waiting for server to be ready...');
        const ready = await waitForServer(BASE_URL, 15000);
        if (!ready) {
            console.error('❌ Failed to start server.');
            if (serverProcess) serverProcess.kill();
            process.exit(1);
        }
        console.log('✅ Server is up!');
    }

    await ensureTempDir();

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });

    try {
        const tocItems: TOCItem[] = [];
        const pdfFiles: string[] = []; // Track order of generated PDFs
        let currentPageCount = 0;

        // --- 1. GENERATE COVER PAGE ---
        console.log('📑 Generating Cover Page...');
        const coverPage = await browser.newPage();
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        await coverPage.setContent(COVER_PAGE_HTML(SITE.title, SITE.description, dateStr));
        const coverPath = path.join(TEMP_DIR, '000_cover.pdf');
        
        await coverPage.pdf({
            path: coverPath,
            format: 'A4',
            printBackground: true,
            margin: { top: 0, bottom: 0, left: 0, right: 0 }
        });
        pdfFiles.push(coverPath);
        currentPageCount += 1; // Cover is page 1, but we usually skip page numbering on cover
        await coverPage.close();


        // --- 2. PROCESS CHAPTERS ---
        console.log(`📚 Processing ${SIDEBAR.length} items from sidebar...`);
        
        let sectionCounter = 0;
        let chapterCounter = 0;
        
        // We need to keep a running buffer of PDFs to merge later
        // But we need to know page counts for TOC.
        // So we generate all PDFs first, but we won't know exact page numbers for TOC 
        // until we know how many pages each previous PDF has.
        // Strategy: Generate all Content PDFs -> Calculate Page Counts -> Generate TOC -> Merge All
        
        const contentPdfInfos: { path: string, isHeader: boolean, title: string }[] = [];

        // Skip TOC placeholders for now, we'll calculate real page numbers after generation
        
        for (const item of SIDEBAR) {
            if (item.header) {
                // Generate Section Header
                sectionCounter++;
                console.log(`🔹 Processing Section: ${item.text}`);
                
                const sectionPage = await browser.newPage();
                await sectionPage.setContent(SECTION_HEADER_HTML(item.text, sectionCounter));
                const sectionPath = path.join(TEMP_DIR, `sec_${sectionCounter}_${item.text.replace(/\s+/g, '_')}.pdf`);
                
                await sectionPage.pdf({
                    path: sectionPath,
                    format: 'A4',
                    printBackground: true,
                    margin: { top: 0, bottom: 0, left: 0, right: 0 }
                });
                await sectionPage.close();
                
                contentPdfInfos.push({ path: sectionPath, isHeader: true, title: item.text });
                
            } else if (item.link) {
                // Generate Chapter Content
                chapterCounter++;
                console.log(`📄 Processing Chapter: ${item.text}`);
                
                const page = await browser.newPage();
                const url = `${BASE_URL}${item.link.replace(/\/$/, '')}`;
                
                try {
                    await page.goto(url, { waitUntil: 'networkidle0' });
                    
                    // Inject Print CSS
                    await page.addStyleTag({ content: PRINT_CSS });

                    // FORCE LIGHT MODE: Remove 'dark' class from html element
                    await page.evaluate(() => {
                        document.documentElement.classList.remove('dark');
                    });
                    
                    // Wait for any client-side rendering or animations to settle
                    await new Promise(r => setTimeout(r, 500)); 

                    const chapterPath = path.join(TEMP_DIR, `chap_${chapterCounter}_${item.text.replace(/\s+/g, '_')}.pdf`);
                    
                    await page.pdf({
                        path: chapterPath,
                        format: 'A4',
                        printBackground: true, // Crucial for colorful backgrounds
                        margin: {
                            top: '20mm',
                            bottom: '20mm',
                            left: '20mm',
                            right: '20mm'
                        }
                    });
                    
                    contentPdfInfos.push({ path: chapterPath, isHeader: false, title: item.text });
                    
                } catch (e) {
                    console.error(`❌ Failed to process ${item.text}:`, e);
                } finally {
                    await page.close();
                }
            }
        }

        // --- 3. CALCULATE TOC & GENERATE TOC PDF ---
        console.log('🧮 Calculating Table of Contents...');
        
        // Load all generated PDFs to count pages
        // Start after Cover Page (1 page)
        // TOC itself will likely be 1-2 pages. We'll anticipate 2 pages for TOC for safety?
        // Or better: Generate TOC at the end, but insert it after cover.
        
        // Let's assume Cover is Page 1 (hidden number).
        // TOC will start at Page 2.
        // We need to count pages of everything AFTER TOC to determine "Page X" values.
        
        // Actually standard practice:
        // Cover: no number
        // TOC: roman numerals or no number
        // Content: starts at Page 1 (Arabic)
        
        // Let's go with:
        // Cover (1 page)
        // TOC (generated last, injected second)
        // Content (Page 1 starts here)
        
        let runningPageCount = 1; // Reset for content (Content starts at page 1)
        const contentPagesMap: { path: string, pageCount: number }[] = [];
        
        for (const info of contentPdfInfos) {
            const pdfBytes = await fs.readFile(info.path);
            const doc = await PDFDocument.load(pdfBytes);
            const count = doc.getPageCount();
            
            contentPagesMap.push({ path: info.path, pageCount: count });
            
            tocItems.push({
                title: info.title,
                isHeader: info.isHeader,
                page: runningPageCount
            });
            
            runningPageCount += count;
        }

        console.log('📑 Generating Table of Contents PDF...');
        const tocPage = await browser.newPage();
        await tocPage.setContent(TOC_HTML(tocItems));
        const tocPath = path.join(TEMP_DIR, '001_toc.pdf');
        await tocPage.pdf({
            path: tocPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
        });
        await tocPage.close();
        
        // --- 4. MERGE EVERYTHING ---
        console.log('🔗 Merging all PDFs...');
        const mergedPdf = await PDFDocument.create();
        
        // 1. Add Cover
        const coverBytes = await fs.readFile(coverPath);
        const coverDoc = await PDFDocument.load(coverBytes);
        const [coverPageCopied] = await mergedPdf.copyPages(coverDoc, [0]);
        mergedPdf.addPage(coverPageCopied);
        
        // 2. Add TOC
        const tocBytes = await fs.readFile(tocPath);
        const tocDoc = await PDFDocument.load(tocBytes);
        const tocIndices = tocDoc.getPageIndices();
        const tocPagesCopied = await mergedPdf.copyPages(tocDoc, tocIndices);
        tocPagesCopied.forEach(p => mergedPdf.addPage(p));
        
        // 3. Add Content
        for (const info of contentPdfInfos) {
            const bytes = await fs.readFile(info.path);
            const doc = await PDFDocument.load(bytes);
            const indices = doc.getPageIndices();
            const copied = await mergedPdf.copyPages(doc, indices);
            copied.forEach(p => mergedPdf.addPage(p));
        }
        
        // --- 5. ADD PAGE NUMBERS ---
        console.log('🔢 Adding page numbers...');
        const helveticaFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
        const pages = mergedPdf.getPages();
        const totalPages = pages.length;
        
        // Start numbering after Cover(1) + TOC(variable)
        // Let's just number everything from the first content page
        const coverPageCount = 1;
        const tocPageCount = tocPagesCopied.length;
        const startNumberingIndex = coverPageCount + tocPageCount;
        
        for (let i = startNumberingIndex; i < totalPages; i++) {
            const page = pages[i];
            const { width } = page.getSize();
            const pageNum = i - startNumberingIndex + 1;
            
            page.drawText(`${pageNum}`, {
                x: width - 50,
                y: 20,
                size: 10,
                font: helveticaFont,
                color: rgb(0.2, 0.2, 0.2), // Dark grey
            });
        }

        // --- 6. SAVE ---
        const mergedPdfBytes = await mergedPdf.save();
        await fs.writeFile(OUTPUT_PATH, mergedPdfBytes);
        
        console.log(`✅ Robust PDF Generated Successfully at: ${OUTPUT_PATH}`);
        
        // Cleanup
        // await fs.rm(TEMP_DIR, { recursive: true, force: true });
        console.log(`📂 Chapter PDFs kept in: ${TEMP_DIR}`);

    } catch (error) {
        console.error('❌ PDF Generation Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
        if (serverStartedByScript && serverProcess) {
            console.log('🛑 Stopping server...');
            serverProcess.kill();
            process.exit(0);
        }
    }
}

generatePDF().catch(console.error);
