/**
 * Print-friendly CSS styles for PDF generation
 * Injected into pages before PDF capture for proper rendering
 */

export const PRINT_CSS = `
<style id="pdf-print-styles">
  /* ============================================
   * PDF PRINT OPTIMIZATION STYLES
   * ============================================ */

  /* Ensure background graphics are printed */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide navigation elements for clean PDF */
  nav,
  .sidebar,
  .nav-wrapper,
  .mobile-menu,
  .theme-toggle,
  header,
  [data-hide-print],
  .edit-on-github,
  .page-navigation {
    display: none !important;
  }

  /* Expand main content to full width */
  main,
  .main-content,
  .content-wrapper,
  article {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Page break control */
  h1 {
    page-break-before: always;
    page-break-after: avoid;
  }

  h1:first-of-type {
    page-break-before: avoid;
  }

  h2, h3, h4, h5, h6 {
    page-break-after: avoid;
  }

  /* Prevent orphaned content */
  p, li, blockquote {
    orphans: 3;
    widows: 3;
  }

  /* Avoid breaking inside code blocks, figures, tables */
  pre,
  code,
  figure,
  table,
  .code-block,
  .mermaid,
  svg {
    page-break-inside: avoid;
  }

  /* Typography Tweaks for Print */
  body {
    font-size: 11pt;
    line-height: 1.5;
  }

  /* Links - show URL for print? Maybe not if it's too messy. 
     Let's keep them as blue text but no URL expansion to keep it clean. */
  a {
    text-decoration: underline;
    color: #2563eb !important; /* Tailwind blue-600 */
  }

  /* Ensure text is dark on light background */
  body, p, li, h1, h2, h3, h4, h5, h6 {
    color: #000000;
  }

  /* Fix for light mode if there are forced white text elements */
  .text-white {
    color: #000000 !important;
  }

</style>
`;

/**
 * CSS for the cover page (Light Theme)
 */
export const COVER_PAGE_HTML = (title: string, subtitle: string, date: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 60px;
    }
    .container {
      border: 4px solid #1a1a1a;
      padding: 60px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .title {
      font-size: 54px;
      font-weight: 900;
      margin-bottom: 24px;
      color: #000000;
      letter-spacing: -1px;
    }
    .subtitle {
      font-size: 28px;
      color: #4b5563;
      margin-bottom: 48px;
      max-width: 700px;
      line-height: 1.4;
      font-weight: 300;
    }
    .date {
      font-size: 14px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: auto;
    }
    .logo {
      font-size: 64px;
      margin-bottom: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">📑</div>
    <h1 class="title">${title}</h1>
    <p class="subtitle">${subtitle}</p>
    <p class="date">${date}</p>
  </div>
</body>
</html>
`;

/**
 * CSS for section header pages (Light Theme)
 */
export const SECTION_HEADER_HTML = (sectionTitle: string, sectionNumber: number) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .divider {
      width: 100px;
      height: 4px;
      background: #000000;
      margin: 30px 0;
    }
    .section-number {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 4px;
      color: #6b7280;
    }
    .section-title {
      font-size: 48px;
      font-weight: 800;
      color: #000000;
    }
  </style>
</head>
<body>
  <div class="section-number">Section ${String(sectionNumber).padStart(2, '0')}</div>
  <div class="divider"></div>
  <h1 class="section-title">${sectionTitle}</h1>
</body>
</html>
`;

/**
 * Table of Contents HTML template
 */
export const TOC_HTML = (items: { title: string; page: number; isHeader: boolean }[]) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      padding: 60px;
    }
    h1 {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 40px;
      color: #000000;
      border-bottom: 4px solid #000000;
      padding-bottom: 10px;
    }
    .toc-list {
      list-style: none;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 12px 0;
      border-bottom: 1px dotted #e5e7eb;
    }
    .toc-item.header {
      font-weight: 800;
      font-size: 18px;
      color: #000000;
      margin-top: 32px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }
    .toc-item.subitem {
      padding-left: 24px;
      font-size: 15px;
      color: #374151;
    }
    .toc-title {
      flex: 1;
    }
    .toc-page {
      color: #6b7280;
      font-size: 14px;
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body>
  <h1>Table of Contents</h1>
  <ul class="toc-list">
    ${items.map(item => `
      <li class="toc-item ${item.isHeader ? 'header' : 'subitem'}">
        <span class="toc-title">${item.title}</span>
        ${!item.isHeader ? `<span class="toc-page">${item.page}</span>` : ''}
      </li>
    `).join('')}
  </ul>
</body>
</html>
`;
