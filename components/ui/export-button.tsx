'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  formatData: (data: any[]) => {
    headers: string[];
    rows: (string | number)[][];
    filename: string;
  };
  loading: boolean;
}

export default function ExportButton({ data, formatData, loading }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = async () => {
    if (data.length === 0) return;
    
    setExporting(true);
    try {
      const { headers, rows, filename } = formatData(data);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToCSV}
      disabled={loading || data.length === 0 || exporting}
      className="hover:scale-105 transition-transform duration-300"
    >
      <Download className="w-4 h-4 mr-2" />
      {exporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  );
}