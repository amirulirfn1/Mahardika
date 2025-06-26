import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

interface KpiData {
  agencyName: string;
  reportType: string;
  periodStart: string;
  periodEnd: string;
  renewalRate?: number;
  totalPremium?: number;
  avgResponseMs?: number;
  totalPolicies?: number;
  newCustomers?: number;
  customerSatisfaction?: number;
}

interface ChartData {
  labels: string[];
  values: number[];
  title: string;
}

const MAHARDIKA_COLORS = {
  navy: '#0D1B2A',
  gold: '#F4B400',
  lightGray: '#F8F9FA',
  darkGray: '#6C757D',
};

export class KpiPdfGenerator {
  private doc: PDFDocument;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true,
    });
    this.pageWidth = this.doc.page.width;
    this.pageHeight = this.doc.page.height;
    this.margin = 50;
  }

  async generateKpiReport(
    data: KpiData,
    charts?: ChartData[]
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const buffers: Buffer[] = [];

        this.doc.on('data', buffers.push.bind(buffers));
        this.doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Generate the PDF content
        this.addHeader(data);
        this.addExecutiveSummary(data);
        this.addKpiMetrics(data);

        if (charts && charts.length > 0) {
          this.addChartsSection(charts);
        }

        this.addFooter();
        this.doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addHeader(data: KpiData) {
    // Mahardika Logo Area (text-based since we don't have logo file)
    this.doc
      .fillColor(MAHARDIKA_COLORS.navy)
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('MAHARDIKA', this.margin, this.margin, { align: 'left' })
      .fontSize(12)
      .font('Helvetica')
      .fillColor(MAHARDIKA_COLORS.gold)
      .text('Insurance Platform', this.margin, this.margin + 35);

    // Title Section
    this.doc
      .fillColor(MAHARDIKA_COLORS.navy)
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('KPI PERFORMANCE REPORT', this.margin, this.margin + 70, {
        align: 'center',
      })
      .fontSize(14)
      .font('Helvetica')
      .fillColor(MAHARDIKA_COLORS.darkGray)
      .text(data.agencyName, this.margin, this.margin + 105, {
        align: 'center',
      })
      .text(
        `${data.periodStart} - ${data.periodEnd}`,
        this.margin,
        this.margin + 125,
        { align: 'center' }
      );

    // Gold accent line
    this.doc
      .strokeColor(MAHARDIKA_COLORS.gold)
      .lineWidth(3)
      .moveTo(this.margin, this.margin + 150)
      .lineTo(this.pageWidth - this.margin, this.margin + 150)
      .stroke();

    // Current Y position for next content
    this.doc.y = this.margin + 170;
  }

  private addExecutiveSummary(data: KpiData) {
    const startY = this.doc.y + 20;

    // Section Title
    this.doc
      .fillColor(MAHARDIKA_COLORS.navy)
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Executive Summary', this.margin, startY);

    // Summary content
    let summaryText = `This report provides a comprehensive overview of ${data.agencyName}'s performance metrics for the period ${data.periodStart} to ${data.periodEnd}. `;

    if (data.renewalRate !== undefined) {
      summaryText += `The agency achieved a renewal rate of ${data.renewalRate.toFixed(1)}%. `;
    }

    if (data.totalPremium !== undefined) {
      summaryText += `Total premium collected reached $${data.totalPremium.toLocaleString()}. `;
    }

    if (data.customerSatisfaction !== undefined) {
      summaryText += `Customer satisfaction maintained at ${data.customerSatisfaction.toFixed(1)}/5.0. `;
    }

    summaryText +=
      "Key performance indicators demonstrate the agency's commitment to excellence and customer service.";

    this.doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#333333')
      .text(summaryText, this.margin, startY + 30, {
        width: this.pageWidth - this.margin * 2,
        align: 'justify',
        lineGap: 2,
      });

    this.doc.y += 40;
  }

  private addKpiMetrics(data: KpiData) {
    const startY = this.doc.y + 20;
    const cardWidth = (this.pageWidth - this.margin * 2 - 20) / 2;
    const cardHeight = 80;

    // Section Title
    this.doc
      .fillColor(MAHARDIKA_COLORS.navy)
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Key Performance Indicators', this.margin, startY);

    const metrics = [
      {
        title: 'Renewal Rate',
        value:
          data.renewalRate !== undefined
            ? `${data.renewalRate.toFixed(1)}%`
            : 'N/A',
        icon: '🔄',
      },
      {
        title: 'Total Premium',
        value:
          data.totalPremium !== undefined
            ? `$${data.totalPremium.toLocaleString()}`
            : 'N/A',
        icon: '💰',
      },
      {
        title: 'Avg Response Time',
        value:
          data.avgResponseMs !== undefined ? `${data.avgResponseMs}ms` : 'N/A',
        icon: '⚡',
      },
      {
        title: 'Total Policies',
        value:
          data.totalPolicies !== undefined
            ? data.totalPolicies.toLocaleString()
            : 'N/A',
        icon: '📋',
      },
      {
        title: 'New Customers',
        value:
          data.newCustomers !== undefined
            ? data.newCustomers.toLocaleString()
            : 'N/A',
        icon: '👥',
      },
      {
        title: 'Customer Satisfaction',
        value:
          data.customerSatisfaction !== undefined
            ? `${data.customerSatisfaction.toFixed(1)}/5.0`
            : 'N/A',
        icon: '⭐',
      },
    ];

    let currentY = startY + 40;
    let currentX = this.margin;

    metrics.forEach((metric, index) => {
      // Move to next row after every 2 cards
      if (index > 0 && index % 2 === 0) {
        currentY += cardHeight + 15;
        currentX = this.margin;
      }

      // Draw card background
      this.doc
        .fillColor(MAHARDIKA_COLORS.lightGray)
        .rect(currentX, currentY, cardWidth, cardHeight)
        .fill();

      // Add gold accent
      this.doc
        .fillColor(MAHARDIKA_COLORS.gold)
        .rect(currentX, currentY, cardWidth, 4)
        .fill();

      // Add metric title
      this.doc
        .fillColor(MAHARDIKA_COLORS.darkGray)
        .fontSize(10)
        .font('Helvetica')
        .text(metric.title, currentX + 15, currentY + 15);

      // Add metric value
      this.doc
        .fillColor(MAHARDIKA_COLORS.navy)
        .fontSize(20)
        .font('Helvetica-Bold')
        .text(metric.value, currentX + 15, currentY + 35);

      // Add icon (if we had actual icon fonts, but we'll use text for now)
      this.doc
        .fontSize(24)
        .text(metric.icon, currentX + cardWidth - 45, currentY + 25);

      // Move to next column
      currentX += cardWidth + 20;
    });

    this.doc.y = currentY + cardHeight + 30;
  }

  private addChartsSection(charts: ChartData[]) {
    const startY = this.doc.y + 20;

    // Section Title
    this.doc
      .fillColor(MAHARDIKA_COLORS.navy)
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Performance Charts', this.margin, startY);

    let currentY = startY + 40;

    charts.forEach((chart, index) => {
      if (currentY > this.pageHeight - 200) {
        this.doc.addPage();
        currentY = this.margin;
      }

      this.addSimpleBarChart(chart, this.margin, currentY);
      currentY += 180;
    });

    this.doc.y = currentY;
  }

  private addSimpleBarChart(chart: ChartData, x: number, y: number) {
    const chartWidth = this.pageWidth - this.margin * 2;
    const chartHeight = 120;
    const maxValue = Math.max(...chart.values);

    // Chart title
    this.doc
      .fillColor(MAHARDIKA_COLORS.navy)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(chart.title, x, y);

    // Chart background
    this.doc
      .fillColor(MAHARDIKA_COLORS.lightGray)
      .rect(x, y + 25, chartWidth, chartHeight)
      .fill();

    // Draw bars
    const barWidth = (chartWidth / chart.labels.length) * 0.6;
    const barSpacing = chartWidth / chart.labels.length;

    chart.values.forEach((value, index) => {
      const barHeight = (value / maxValue) * (chartHeight - 20);
      const barX = x + index * barSpacing + (barSpacing - barWidth) / 2;
      const barY = y + chartHeight + 25 - barHeight - 10;

      // Draw bar
      this.doc
        .fillColor(
          index % 2 === 0 ? MAHARDIKA_COLORS.navy : MAHARDIKA_COLORS.gold
        )
        .rect(barX, barY, barWidth, barHeight)
        .fill();

      // Add value label on top of bar
      this.doc
        .fillColor('#333333')
        .fontSize(9)
        .font('Helvetica')
        .text(value.toString(), barX, barY - 15, {
          width: barWidth,
          align: 'center',
        });

      // Add x-axis label
      this.doc
        .fontSize(8)
        .text(chart.labels[index], barX, y + chartHeight + 30, {
          width: barWidth,
          align: 'center',
        });
    });
  }

  private addFooter() {
    const footerY = this.pageHeight - this.margin;

    // Add page numbers and footer info
    this.doc
      .fillColor(MAHARDIKA_COLORS.darkGray)
      .fontSize(9)
      .font('Helvetica')
      .text(
        `Generated on ${new Date().toLocaleDateString()}`,
        this.margin,
        footerY
      )
      .text(
        'Powered by Mahardika Platform',
        this.pageWidth - this.margin - 150,
        footerY
      );

    // Add gold accent line at bottom
    this.doc
      .strokeColor(MAHARDIKA_COLORS.gold)
      .lineWidth(2)
      .moveTo(this.margin, footerY - 10)
      .lineTo(this.pageWidth - this.margin, footerY - 10)
      .stroke();
  }
}

/**
 * Generate a KPI report PDF buffer
 */
export async function generateKpiPdf(
  data: KpiData,
  charts?: ChartData[]
): Promise<Buffer> {
  const generator = new KpiPdfGenerator();
  return generator.generateKpiReport(data, charts);
}

/**
 * Generate a simple test PDF to verify PDFKit is working
 */
export async function generateTestPdf(): Promise<Buffer> {
  const testData: KpiData = {
    agencyName: 'Test Insurance Agency',
    reportType: 'monthly',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-31',
    renewalRate: 85.5,
    totalPremium: 125000,
    avgResponseMs: 120,
    totalPolicies: 250,
    newCustomers: 45,
    customerSatisfaction: 4.2,
  };

  const testCharts: ChartData[] = [
    {
      title: 'Monthly Performance Trend',
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [20, 35, 45, 40],
    },
  ];

  return generateKpiPdf(testData, testCharts);
}
