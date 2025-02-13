
import { CustomField, CustomFields } from '@/types/customField';
import Papa from 'papaparse';

// Validate imported fields to ensure they match our data structure
const validateImportedField = (field: any): boolean => {
  const requiredFields = ['name', 'type', 'required', 'description'];
  return requiredFields.every(f => field.hasOwnProperty(f)) &&
    typeof field.name === 'string' &&
    typeof field.type === 'string' &&
    typeof field.required === 'boolean' &&
    typeof field.description === 'string';
};

// Convert CustomField to CSV format
const fieldToCSV = (field: CustomField) => ({
  name: field.name,
  type: field.type,
  required: field.required,
  description: field.description,
  options: field.options?.join(';') || '',
});

export const exportFieldsToCSV = (fields: CustomField[], table: string) => {
  const csvData = fields.map(fieldToCSV);
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${table}_custom_fields.csv`;
  link.click();
};

export const exportFieldsToJSON = (fields: CustomField[], table: string) => {
  const jsonStr = JSON.stringify(fields, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${table}_custom_fields.json`;
  link.click();
};

export const parseImportedCSV = (file: File): Promise<CustomField[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const fields = results.data.map((field: any) => ({
          id: Math.random().toString(),
          name: field.name,
          type: field.type,
          required: field.required === 'true',
          description: field.description,
          options: field.options ? field.options.split(';') : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: [{
            id: Math.random().toString(),
            timestamp: new Date().toISOString(),
            userId: 'system',
            userName: 'System Import',
            action: 'created',
            changes: []
          }]
        }));

        if (fields.every(validateImportedField)) {
          resolve(fields);
        } else {
          reject(new Error('Invalid field format in CSV'));
        }
      },
      error: (error) => reject(error)
    });
  });
};

export const parseImportedJSON = async (file: File): Promise<CustomField[]> => {
  const text = await file.text();
  const fields = JSON.parse(text);
  
  if (!Array.isArray(fields) || !fields.every(validateImportedField)) {
    throw new Error('Invalid JSON format');
  }

  return fields.map(field => ({
    ...field,
    id: Math.random().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [{
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      userId: 'system',
      userName: 'System Import',
      action: 'created',
      changes: []
    }]
  }));
};
