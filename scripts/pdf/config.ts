import { SIDEBAR } from '../../src/config';

export interface PDFSection {
    index: number;
    slug: string;
    title: string;
    link: string;
    filename: string;
}

export const PDF_CONFIG = {
    format: 'A4' as const,
    margins: {
        top: '15mm',
        bottom: '15mm',
        left: '12mm',
        right: '12mm'
    },
    baseUrl: 'http://localhost:4321/Continuum-Flow',
    outputDir: 'public/pdf',
    sectionsDir: 'public/pdf/sections',
    finalOutput: 'public/pdf/whitepaper.pdf',
    legacyOutput: 'public/whitepaper.pdf',
    serverTimeout: 15000,
    renderWait: 1000, // Wait for dynamic content
};

/**
 * Get all PDF sections from sidebar config
 */
export function getPDFSections(): PDFSection[] {
    let index = 0;

    return SIDEBAR
        .filter(item => item.link && !item.header)
        .map(item => {
            index++;
            const slug = item.link === '/'
                ? 'introduction'
                : item.link.replace(/^\//, '').replace(/\/$/, '');

            return {
                index,
                slug,
                title: item.text,
                link: item.link,
                filename: `${String(index).padStart(2, '0')}-${slug}.pdf`
            };
        });
}

/**
 * Get a single section by slug
 */
export function getSectionBySlug(slug: string): PDFSection | undefined {
    return getPDFSections().find(s => s.slug === slug);
}

/**
 * Get page URL for a section
 */
export function getPageUrl(section: PDFSection): string {
    const path = section.link === '/' ? '' : section.link.replace(/^\//, '');
    return `${PDF_CONFIG.baseUrl}/${path}`.replace(/\/$/, '');
}
