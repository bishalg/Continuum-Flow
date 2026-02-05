import { PDFDocument, StandardFonts, rgb, PDFPage } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { PDF_CONFIG, getPDFSections, type PDFSection } from './config';

/**
 * Create a cover page for the whitepaper
 */
async function createCoverPage(doc: PDFDocument): Promise<void> {
    const page = doc.addPage([595.28, 841.89]); // A4 in points
    const { width, height } = page.getSize();

    const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await doc.embedFont(StandardFonts.Helvetica);

    // Title
    const title = 'Continuum Flow';
    page.drawText(title, {
        x: 50,
        y: height - 200,
        size: 42,
        font: helveticaBold,
        color: rgb(0.03, 0.09, 0.17) // Dark slate
    });

    // Subtitle
    const subtitle = 'AI-Driven Narrative to Video Architecture';
    page.drawText(subtitle, {
        x: 50,
        y: height - 250,
        size: 18,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4)
    });

    // Decorative line
    page.drawRectangle({
        x: 50,
        y: height - 280,
        width: 200,
        height: 3,
        color: rgb(0.03, 0.56, 0.70) // Cyan
    });

    // Description
    const description = [
        'A comprehensive architecture for maintaining context',
        'and character consistency in AI-generated video narratives.',
        '',
        'This whitepaper covers chunking strategies, context management,',
        'character consistency, differential state management,',
        'orchestration patterns, and agentic workflows.'
    ];

    let y = height - 350;
    for (const line of description) {
        page.drawText(line, {
            x: 50,
            y,
            size: 12,
            font: helvetica,
            color: rgb(0.3, 0.3, 0.3)
        });
        y -= 20;
    }

    // Footer with date
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    page.drawText(`Generated: ${date}`, {
        x: 50,
        y: 50,
        size: 10,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5)
    });
}

/**
 * Create table of contents page
 */
async function createTOC(
    doc: PDFDocument,
    sections: PDFSection[],
    pageOffsets: Map<number, number>
): Promise<void> {
    const page = doc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await doc.embedFont(StandardFonts.Helvetica);

    // Title
    page.drawText('Table of Contents', {
        x: 50,
        y: height - 80,
        size: 24,
        font: helveticaBold,
        color: rgb(0, 0, 0)
    });

    let y = height - 140;
    const lineHeight = 28;

    for (const section of sections) {
        const pageNum = pageOffsets.get(section.index) || 0;

        // Section title
        page.drawText(`${section.index}. ${section.title}`, {
            x: 50,
            y,
            size: 12,
            font: helvetica,
            color: rgb(0, 0, 0)
        });

        // Page number (right-aligned)
        const pageNumText = String(pageNum + 3); // +3 for cover and TOC pages
        const pageNumWidth = helvetica.widthOfTextAtSize(pageNumText, 12);
        page.drawText(pageNumText, {
            x: width - 50 - pageNumWidth,
            y,
            size: 12,
            font: helvetica,
            color: rgb(0.4, 0.4, 0.4)
        });

        // Dotted line
        const titleWidth = helvetica.widthOfTextAtSize(`${section.index}. ${section.title}`, 12);
        const dotsStart = 55 + titleWidth;
        const dotsEnd = width - 55 - pageNumWidth;
        const dotSpacing = 8;

        for (let x = dotsStart; x < dotsEnd; x += dotSpacing) {
            page.drawCircle({
                x,
                y: y + 3,
                size: 0.5,
                color: rgb(0.7, 0.7, 0.7)
            });
        }

        y -= lineHeight;

        // Handle page overflow
        if (y < 60) {
            // Would need to add another TOC page for very long docs
            break;
        }
    }
}

/**
 * Add page numbers to all pages
 */
async function addPageNumbers(doc: PDFDocument, startPage: number = 0): Promise<void> {
    const helvetica = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();

    for (let i = startPage; i < pages.length; i++) {
        const page = pages[i];
        const { width } = page.getSize();
        const pageNum = i + 1;

        page.drawText(String(pageNum), {
            x: width - 40,
            y: 25,
            size: 10,
            font: helvetica,
            color: rgb(0.4, 0.4, 0.4)
        });
    }
}

/**
 * Merge all section PDFs into a single whitepaper
 */
async function mergePDFs(): Promise<void> {
    console.log('🔗 Continuum Flow PDF Merger\n');

    const sections = getPDFSections();
    const mergedDoc = await PDFDocument.create();
    const pageOffsets = new Map<number, number>();

    // Track current page count
    let currentPage = 0;

    // Add cover page
    console.log('📖 Creating cover page...');
    await createCoverPage(mergedDoc);
    currentPage += 1;

    // Placeholder for TOC (we'll update page numbers after merging)
    const tocStartPage = currentPage;

    // Merge section PDFs
    console.log('\n📑 Merging section PDFs...\n');

    for (const section of sections) {
        const pdfPath = path.join(PDF_CONFIG.sectionsDir, section.filename);

        try {
            await fs.access(pdfPath);
        } catch {
            console.log(`  ⏭️  Skipping ${section.title} (not found)`);
            continue;
        }

        console.log(`  📄 [${section.index}] ${section.title}`);

        // Record page offset for TOC
        pageOffsets.set(section.index, currentPage);

        // Load and merge the section PDF
        const pdfBytes = await fs.readFile(pdfPath);
        const sectionDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedDoc.copyPages(
            sectionDoc,
            sectionDoc.getPageIndices()
        );

        for (const page of copiedPages) {
            mergedDoc.addPage(page);
            currentPage++;
        }

        console.log(`     ✅ Added ${copiedPages.length} page(s)`);
    }

    // Now create TOC with correct page numbers
    console.log('\n📋 Generating table of contents...');

    // Create a temporary doc for TOC
    const tocDoc = await PDFDocument.create();
    await createTOC(tocDoc, sections, pageOffsets);
    const tocPages = await mergedDoc.copyPages(tocDoc, tocDoc.getPageIndices());

    // Insert TOC after cover page
    for (let i = 0; i < tocPages.length; i++) {
        mergedDoc.insertPage(tocStartPage + i, tocPages[i]);
    }

    // Add page numbers to all pages (skip cover)
    console.log('🔢 Adding page numbers...');
    await addPageNumbers(mergedDoc, 1);

    // Save the merged PDF
    console.log('\n💾 Saving whitepaper...');
    const mergedPdfBytes = await mergedDoc.save();

    await fs.writeFile(PDF_CONFIG.finalOutput, mergedPdfBytes);
    console.log(`   ✅ Saved: ${PDF_CONFIG.finalOutput}`);

    // console.log(`   ✅ Copied: ${PDF_CONFIG.legacyOutput}`);

    // Summary
    const totalPages = mergedDoc.getPageCount();
    const fileSize = (mergedPdfBytes.length / 1024 / 1024).toFixed(2);

    console.log('\n' + '═'.repeat(50));
    console.log('📊 Whitepaper Summary');
    console.log('═'.repeat(50));
    console.log(`   Total Pages: ${totalPages}`);
    console.log(`   File Size: ${fileSize} MB`);
    console.log(`   Sections: ${sections.length}`);
    console.log('═'.repeat(50) + '\n');
}

mergePDFs().catch(error => {
    console.error('\n❌ PDF Merge Failed:', error);
    process.exit(1);
});
