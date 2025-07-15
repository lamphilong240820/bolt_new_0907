import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportToCSV, exportAllData, ExportData } from '@/lib/export';

interface ExportButtonProps {
  data?: any[];
  formatData?: (data: any[]) => ExportData;
  loading?: boolean;
  endpoint?: 'products' | 'customers' | 'orders';
  className?: string;
}

export default function ExportButton({ 
  data = [], 
  formatData, 
  loading = false, 
  endpoint,
  className = "" 
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting) return;
    
    setExporting(true);
    try {
      let exportData: ExportData;

      if (endpoint && exportAllData[endpoint]) {
        // Fetch all data from API
        exportData = await exportAllData[endpoint]();
      } else if (formatData && data.length > 0) {
        // Use provided data and formatter
        exportData = formatData(data);
      } else {
        console.error('No data source provided for export');
        return;
      }

      exportToCSV(exportData);
    } catch (error) {
      console.error('Export failed:', error);
      // You could add a toast notification here
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading || exporting || (data.length === 0 && !endpoint)}
      variant="outline"
      size="sm"
      className={`hover:scale-105 transition-transform duration-300 ${className}`}
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {exporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  );
}