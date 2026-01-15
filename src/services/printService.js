/**
 * Print & Export Utility Service
 * Provides functions for printing documents and exporting data
 */

/**
 * Generate a printable HTML document
 * @param {string} title - Document title
 * @param {string} content - HTML content to print
 * @param {object} options - Print options
 */
export const printDocument = (title, content, options = {}) => {
    const {
        orientation = 'portrait',
        paperSize = 'A4',
        showPrintDialog = true,
    } = options;

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
        alert('Please allow pop-ups for printing');
        return;
    }

    const styles = `
        <style>
            @page {
                size: ${paperSize} ${orientation};
                margin: 15mm;
            }
            
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 12px;
                line-height: 1.5;
                color: #1a1a1a;
                background: white;
            }
            
            .print-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding-bottom: 15px;
                border-bottom: 2px solid #2D7A4F;
                margin-bottom: 20px;
            }
            
            .company-info h1 {
                font-size: 24px;
                color: #2D7A4F;
                margin-bottom: 5px;
            }
            
            .company-info p {
                font-size: 11px;
                color: #666;
            }
            
            .document-info {
                text-align: right;
            }
            
            .document-info h2 {
                font-size: 18px;
                color: #333;
                margin-bottom: 5px;
            }
            
            .document-info p {
                font-size: 11px;
                color: #666;
            }
            
            .section {
                margin-bottom: 20px;
            }
            
            .section-title {
                font-size: 14px;
                font-weight: 600;
                color: #2D7A4F;
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px solid #e5e5e5;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
            }
            
            .info-label {
                color: #666;
                font-size: 11px;
            }
            
            .info-value {
                font-weight: 500;
                text-align: right;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
            }
            
            th {
                background: #f8f8f8;
                padding: 10px;
                text-align: left;
                font-size: 11px;
                font-weight: 600;
                color: #333;
                border-bottom: 2px solid #e5e5e5;
            }
            
            td {
                padding: 10px;
                border-bottom: 1px solid #e5e5e5;
                font-size: 12px;
            }
            
            .text-right {
                text-align: right;
            }
            
            .text-center {
                text-align: center;
            }
            
            .total-row {
                font-weight: 600;
                background: #f0f9f4;
            }
            
            .total-row td {
                border-top: 2px solid #2D7A4F;
            }
            
            .status-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .status-pending { background: #FEF3CD; color: #856404; }
            .status-paid, .status-completed { background: #D4EDDA; color: #155724; }
            .status-overdue { background: #F8D7DA; color: #721C24; }
            .status-in_progress { background: #CCE5FF; color: #004085; }
            
            .print-footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 10px 15mm;
                border-top: 1px solid #e5e5e5;
                font-size: 10px;
                color: #666;
                display: flex;
                justify-content: space-between;
            }
            
            .signature-section {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 40px;
                margin-top: 40px;
                padding-top: 20px;
            }
            
            .signature-box {
                text-align: center;
            }
            
            .signature-line {
                border-bottom: 1px solid #333;
                margin-bottom: 5px;
                height: 60px;
            }
            
            .signature-label {
                font-size: 11px;
                color: #666;
            }
            
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .no-print { display: none !important; }
            }
        </style>
    `;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            ${styles}
        </head>
        <body>
            ${content}
        </body>
        </html>
    `);

    printWindow.document.close();

    if (showPrintDialog) {
        printWindow.onload = () => {
            printWindow.print();
        };
    }

    return printWindow;
};

/**
 * Format currency for printing
 */
export const formatPrintCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

/**
 * Format date for printing
 */
export const formatPrintDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename without extension
 * @param {Array} columns - Column definitions [{key, label}]
 */
export const exportToCSV = (data, filename, columns) => {
    const headers = columns.map(col => col.label);
    const rows = data.map(item =>
        columns.map(col => {
            const value = item[col.key];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
        })
    );

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
};

/**
 * Export data to JSON
 * @param {Array|Object} data - Data to export
 * @param {string} filename - Filename without extension
 */
export const exportToJSON = (data, filename) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
};

/**
 * Generate company header HTML for print documents
 */
export const getCompanyHeader = () => `
    <div class="company-info">
        <h1>🌾 Daya Padi Abadi</h1>
        <p>Jl. Raya Industri No. 123, Karawang</p>
        <p>Telp: (0267) 123-456 | Email: info@dayapadi.com</p>
    </div>
`;

/**
 * Generate print footer HTML
 */
export const getPrintFooter = () => `
    <div class="print-footer">
        <span>Dicetak pada: ${new Date().toLocaleString('id-ID')}</span>
        <span>ERP Daya Padi Abadi</span>
    </div>
`;
