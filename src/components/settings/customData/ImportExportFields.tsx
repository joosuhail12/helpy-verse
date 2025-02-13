
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Import, FileDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { exportFieldsToCSV, exportFieldsToJSON, parseImportedCSV, parseImportedJSON } from './utils/importExportUtils';
import type { CustomField } from '@/types/customField';

interface ImportExportFieldsProps {
  fields: CustomField[];
  table: string;
  onImport: (fields: CustomField[]) => void;
}

const ImportExportFields = ({ fields, table, onImport }: ImportExportFieldsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let importedFields: CustomField[];
      
      if (file.name.endsWith('.csv')) {
        importedFields = await parseImportedCSV(file);
      } else if (file.name.endsWith('.json')) {
        importedFields = await parseImportedJSON(file);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

      onImport(importedFields);
      toast({
        title: "Import successful",
        description: `${importedFields.length} fields were imported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An error occurred during import",
        variant: "destructive",
      });
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".csv,.json"
        className="hidden"
      />
      
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        <Import className="w-4 h-4 mr-2" />
        Import Fields
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Export Fields
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => exportFieldsToCSV(fields, table)}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportFieldsToJSON(fields, table)}>
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImportExportFields;
