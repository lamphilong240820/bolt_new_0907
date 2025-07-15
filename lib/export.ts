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


export const formatDataForExport = {
  products: (products: any[]) => ({
    headers: ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Created'],
    rows: products.map(product => [
      product.name,
      product.sku || 'N/A',
      product.category?.name || 'N/A',
      `$${Number(product.price).toFixed(2)}`,
      product.stock,
      product.status,
      product.featured ? 'Yes' : 'No',
      new Date(product.createdAt).toLocaleDateString()
    ]),
    filename: `products-${new Date().toISOString().split('T')[0]}`
  }),
  
  customers: (customers: any[]) => ({
    headers: ['Name', 'Email', 'Role', 'Orders', 'Total Spent', 'Email Verified', 'Joined'],
    rows: customers.map(customer => [
      customer.name || 'N/A',
      customer.email,
      customer.role,
      customer._count?.orders || 0,
      `$${(customer.orders?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0).toFixed(2)}`,
      customer.emailVerified ? 'Yes' : 'No',
      new Date(customer.createdAt).toLocaleDateString()
    ]),
    filename: `customers-${new Date().toISOString().split('T')[0]}`
  }),
  
  orders: (orders: any[]) => ({
    headers: ['Order Number', 'Customer', 'Customer Email', 'Items', 'Subtotal', 'Tax', 'Shipping', 'Total', 'Status', 'Payment Method', 'Date'],
    rows: orders.map(order => [
      order.orderNumber,
      order.user?.name || order.user?.email || 'N/A',
      order.user?.email || 'N/A',
      order.orderItems?.length || 0,
      `$${Number(order.subtotal || 0).toFixed(2)}`,
      `$${Number(order.tax || 0).toFixed(2)}`,
      `$${Number(order.shipping || 0).toFixed(2)}`,
      `$${Number(order.total).toFixed(2)}`,
      order.status,
      order.paymentMethod || 'N/A',
      new Date(order.createdAt).toLocaleDateString()
    ]),
    filename: `orders-${new Date().toISOString().split('T')[0]}`
  })
};