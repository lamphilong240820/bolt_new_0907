// Export utilities for admin dashboard
export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  title: string;
  filename: string;
}

export const exportToCSV = (data: ExportData) => {
  if (typeof window === 'undefined') return;
  
  const csvContent = [
    data.headers.join(','),
    ...data.rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${data.filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (data: ExportData) => {
  if (typeof window === 'undefined') return;
  
  try {
    const jsPDF = (await import('jspdf')).default;
    await import('jspdf-autotable');
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(data.title, 14, 22);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
    
    // Add table
    (doc as any).autoTable({
      head: [data.headers],
      body: data.rows,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });
    
    doc.save(`${data.filename}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    // Fallback to CSV export
    exportToCSV(data);
  }
};

export const formatDataForExport = {
  products: (products: any[]) => ({
    headers: ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Created'],
    rows: products.map(product => [
      product.name,
      product.sku || 'N/A',
      product.category?.name || 'N/A',
      `$${Number(product.price).toFixed(2)}`,
      product.stock,
      product.status,
      new Date(product.createdAt).toLocaleDateString()
    ]),
    title: 'Products Report',
    filename: `products-${new Date().toISOString().split('T')[0]}`
  }),
  
  customers: (customers: any[]) => ({
    headers: ['Name', 'Email', 'Orders', 'Total Spent', 'Joined'],
    rows: customers.map(customer => [
      customer.name || 'N/A',
      customer.email,
      customer._count?.orders || 0,
      `$${(customer.orders?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0).toFixed(2)}`,
      new Date(customer.createdAt).toLocaleDateString()
    ]),
    title: 'Customers Report',
    filename: `customers-${new Date().toISOString().split('T')[0]}`
  }),
  
  orders: (orders: any[]) => ({
    headers: ['Order Number', 'Customer', 'Total', 'Status', 'Date'],
    rows: orders.map(order => [
      order.orderNumber,
      order.user?.name || order.user?.email || 'N/A',
      `$${Number(order.total).toFixed(2)}`,
      order.status,
      new Date(order.createdAt).toLocaleDateString()
    ]),
    title: 'Orders Report',
    filename: `orders-${new Date().toISOString().split('T')[0]}`
  })
};