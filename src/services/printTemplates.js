/**
 * Print Templates
 * Pre-built HTML templates for printing various documents
 */

import { formatPrintCurrency, formatPrintDate, getCompanyHeader, getPrintFooter } from './printService';

/**
 * Generate Invoice Print Template
 * @param {Object} invoice - Invoice data
 * @returns {string} HTML content
 */
export const generateInvoicePrint = (invoice) => {
    const statusClass = `status-${invoice.status}`;

    return `
        <div class="print-header">
            ${getCompanyHeader()}
            <div class="document-info">
                <h2>INVOICE</h2>
                <p><strong>${invoice.number}</strong></p>
                <p>Tanggal: ${formatPrintDate(invoice.date)}</p>
            </div>
        </div>

        <div class="section">
            <div class="info-grid">
                <div>
                    <div class="section-title">Kepada</div>
                    <p><strong>${invoice.customerName}</strong></p>
                    <p>${invoice.customerAddress || 'Alamat tidak tersedia'}</p>
                </div>
                <div>
                    <div class="section-title">Detail Invoice</div>
                    <div class="info-item">
                        <span class="info-label">No. Invoice:</span>
                        <span class="info-value">${invoice.number}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">No. SO:</span>
                        <span class="info-value">${invoice.soNumber || '-'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tanggal Jatuh Tempo:</span>
                        <span class="info-value">${formatPrintDate(invoice.dueDate)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value"><span class="status-badge ${statusClass}">${invoice.status}</span></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Rincian Pembayaran</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 50%">Keterangan</th>
                        <th class="text-right" style="width: 25%">Subtotal</th>
                        <th class="text-right" style="width: 25%">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pembayaran untuk ${invoice.soNumber || 'Penjualan'}</td>
                        <td class="text-right">${formatPrintCurrency(invoice.amount)}</td>
                        <td class="text-right">${formatPrintCurrency(invoice.amount)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2"><strong>TOTAL</strong></td>
                        <td class="text-right"><strong>${formatPrintCurrency(invoice.amount)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Catatan</div>
            <p>${invoice.notes || 'Tidak ada catatan'}</p>
        </div>

        <div class="section">
            <p style="font-size: 11px; color: #666;">
                <strong>Informasi Pembayaran:</strong><br>
                Bank Mandiri | No. Rekening: 123-456-7890 | a.n. PT Daya Padi Abadi
            </p>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Dibuat Oleh</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Diperiksa Oleh</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Disetujui Oleh</div>
            </div>
        </div>

        ${getPrintFooter()}
    `;
};

/**
 * Generate Worksheet Print Template
 * @param {Object} worksheet - Worksheet data
 * @returns {string} HTML content
 */
export const generateWorksheetPrint = (worksheet) => {
    const achievement = worksheet.targetProduction > 0
        ? ((worksheet.actualProduction / worksheet.targetProduction) * 100).toFixed(1)
        : 0;

    const downtimeRows = worksheet.downtimes.length > 0
        ? worksheet.downtimes.map(dt => `
            <tr>
                <td>${dt.startTime} - ${dt.endTime}</td>
                <td>${dt.category}</td>
                <td>${dt.description}</td>
            </tr>
        `).join('')
        : '<tr><td colspan="3" class="text-center">Tidak ada downtime</td></tr>';

    return `
        <div class="print-header">
            ${getCompanyHeader()}
            <div class="document-info">
                <h2>WORKSHEET PRODUKSI</h2>
                <p><strong>${worksheet.worksheetNumber}</strong></p>
                <p>Tanggal: ${formatPrintDate(worksheet.productionDate)}</p>
            </div>
        </div>

        <div class="section">
            <div class="info-grid">
                <div>
                    <div class="section-title">Informasi Shift</div>
                    <div class="info-item">
                        <span class="info-label">Shift:</span>
                        <span class="info-value">Shift ${worksheet.shift}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Ketua Shift:</span>
                        <span class="info-value">${worksheet.shiftLead}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Jumlah Operator:</span>
                        <span class="info-value">${worksheet.operatorCount} orang</span>
                    </div>
                </div>
                <div>
                    <div class="section-title">Waktu Kerja</div>
                    <div class="info-item">
                        <span class="info-label">Mulai:</span>
                        <span class="info-value">${worksheet.workStartTime}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Istirahat:</span>
                        <span class="info-value">${worksheet.breakTime}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Selesai:</span>
                        <span class="info-value">${worksheet.workEndTime}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Informasi Mesin</div>
            <div class="info-item">
                <span class="info-label">Mesin:</span>
                <span class="info-value">${worksheet.machineName}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Hasil Produksi</div>
            <table>
                <thead>
                    <tr>
                        <th>Target (kg)</th>
                        <th>Aktual (kg)</th>
                        <th>Pencapaian</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-center">${worksheet.targetProduction.toLocaleString()}</td>
                        <td class="text-center"><strong>${worksheet.actualProduction.toLocaleString()}</strong></td>
                        <td class="text-center" style="color: ${achievement >= 100 ? '#22c55e' : achievement >= 80 ? '#eab308' : '#ef4444'}">
                            <strong>${achievement}%</strong>
                        </td>
                        <td class="text-center">
                            <span class="status-badge status-${worksheet.status}">${worksheet.status}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Downtime</div>
            <table>
                <thead>
                    <tr>
                        <th>Waktu</th>
                        <th>Kategori</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    ${downtimeRows}
                </tbody>
            </table>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Ketua Shift</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Supervisor</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Manager Produksi</div>
            </div>
        </div>

        ${getPrintFooter()}
    `;
};

/**
 * Generate Attendance Report Print Template
 * @param {Array} attendanceData - Array of attendance records
 * @param {Object} options - Report options { startDate, endDate }
 * @returns {string} HTML content
 */
export const generateAttendanceReportPrint = (attendanceData, options = {}) => {
    const { startDate, endDate } = options;

    const attendanceRows = attendanceData.map(record => `
        <tr>
            <td>${record.employeeName}</td>
            <td class="text-center">${formatPrintDate(record.date)}</td>
            <td class="text-center">${record.clockIn || '-'}</td>
            <td class="text-center">${record.clockOut || '-'}</td>
            <td class="text-center">
                <span class="status-badge status-${record.status === 'present' ? 'completed' : record.status === 'late' ? 'pending' : 'overdue'}">
                    ${record.status}
                </span>
            </td>
            <td class="text-center">${record.overtime || 0} jam</td>
        </tr>
    `).join('');

    const summary = {
        present: attendanceData.filter(a => a.status === 'present').length,
        late: attendanceData.filter(a => a.status === 'late').length,
        sick: attendanceData.filter(a => a.status === 'sick').length,
        absent: attendanceData.filter(a => a.status === 'absent').length,
    };

    return `
        <div class="print-header">
            ${getCompanyHeader()}
            <div class="document-info">
                <h2>LAPORAN KEHADIRAN</h2>
                <p>${startDate ? `${formatPrintDate(startDate)} - ${formatPrintDate(endDate)}` : 'Semua Periode'}</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Ringkasan</div>
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div style="padding: 10px 20px; background: #d4edda; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #155724;">${summary.present}</div>
                    <div style="font-size: 11px; color: #155724;">Hadir</div>
                </div>
                <div style="padding: 10px 20px; background: #fff3cd; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #856404;">${summary.late}</div>
                    <div style="font-size: 11px; color: #856404;">Terlambat</div>
                </div>
                <div style="padding: 10px 20px; background: #cce5ff; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #004085;">${summary.sick}</div>
                    <div style="font-size: 11px; color: #004085;">Sakit</div>
                </div>
                <div style="padding: 10px 20px; background: #f8d7da; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #721c24;">${summary.absent}</div>
                    <div style="font-size: 11px; color: #721c24;">Tidak Hadir</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Detail Kehadiran</div>
            <table>
                <thead>
                    <tr>
                        <th>Nama Karyawan</th>
                        <th class="text-center">Tanggal</th>
                        <th class="text-center">Masuk</th>
                        <th class="text-center">Pulang</th>
                        <th class="text-center">Status</th>
                        <th class="text-center">Lembur</th>
                    </tr>
                </thead>
                <tbody>
                    ${attendanceRows || '<tr><td colspan="6" class="text-center">Tidak ada data</td></tr>'}
                </tbody>
            </table>
        </div>

        ${getPrintFooter()}
    `;
};

/**
 * Generate Expense Report Print Template
 * @param {Array} expenses - Array of expense records
 * @param {Object} options - Report options
 * @returns {string} HTML content
 */
export const generateExpenseReportPrint = (expenses, options = {}) => {
    const { startDate, endDate } = options;

    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const byCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    const expenseRows = expenses.map(exp => `
        <tr>
            <td>${formatPrintDate(exp.date)}</td>
            <td>${exp.category}</td>
            <td>${exp.description}</td>
            <td>${exp.vendor || '-'}</td>
            <td class="text-right">${formatPrintCurrency(exp.amount)}</td>
        </tr>
    `).join('');

    const categoryRows = Object.entries(byCategory).map(([cat, amount]) => `
        <tr>
            <td>${cat}</td>
            <td class="text-right">${formatPrintCurrency(amount)}</td>
            <td class="text-right">${((amount / totalAmount) * 100).toFixed(1)}%</td>
        </tr>
    `).join('');

    return `
        <div class="print-header">
            ${getCompanyHeader()}
            <div class="document-info">
                <h2>LAPORAN PENGELUARAN</h2>
                <p>${startDate ? `${formatPrintDate(startDate)} - ${formatPrintDate(endDate)}` : 'Semua Periode'}</p>
            </div>
        </div>

        <div class="section">
            <div style="padding: 15px; background: linear-gradient(135deg, #2D7A4F, #22c55e); border-radius: 8px; color: white; text-align: center; margin-bottom: 20px;">
                <div style="font-size: 14px; opacity: 0.9;">Total Pengeluaran</div>
                <div style="font-size: 28px; font-weight: bold;">${formatPrintCurrency(totalAmount)}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Pengeluaran per Kategori</div>
            <table>
                <thead>
                    <tr>
                        <th>Kategori</th>
                        <th class="text-right">Jumlah</th>
                        <th class="text-right">Persentase</th>
                    </tr>
                </thead>
                <tbody>
                    ${categoryRows}
                    <tr class="total-row">
                        <td><strong>TOTAL</strong></td>
                        <td class="text-right"><strong>${formatPrintCurrency(totalAmount)}</strong></td>
                        <td class="text-right"><strong>100%</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Detail Pengeluaran</div>
            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Kategori</th>
                        <th>Keterangan</th>
                        <th>Vendor</th>
                        <th class="text-right">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    ${expenseRows || '<tr><td colspan="5" class="text-center">Tidak ada data</td></tr>'}
                </tbody>
            </table>
        </div>

        ${getPrintFooter()}
    `;
};
