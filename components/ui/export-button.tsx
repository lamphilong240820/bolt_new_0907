'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportToCSV, exportAllData } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  data?: any[];
  formatData?: (data: any[]) => any;
  loading?: boolean;
  type?: 'products' | 'customers' | 'orders';
  className?: string;
}

export default function ExportButton({ 
  data = [], 
  formatData, 
  loading = false, 
  type,
  className = '' 
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (loading || exporting) return;

    setExporting(true);
    try {
      let exportData;

      // If type is specified, fetch all data from API
      if (type && exportAllData[type]) {
        exportData = await exportAllData[type]();
      } else if (formatData && data.length > 0) {
        // Use provided data and format function
        exportData = formatData(data);
      } else {
        toast({
          title: "Export Error",
          description: "No data available to export",
          variant: "destructive",
        });
        return;
      }

      exportToCSV(exportData);
      
      toast({
        title: "Export Successful",
        description: `${exportData.rows.length} records exported successfully`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading || exporting}
      variant="outline"
      size="sm"
      className={`hover:scale-105 transition-transform duration-300 ${className}`}
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {exporting ? 'Exporting...' : 'Export All CSV'}
    </Button>
  );
}