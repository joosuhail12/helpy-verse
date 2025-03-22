
import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface FormMessageProps {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit: (data: Record<string, string>) => void;
  isSubmitted?: boolean;
}

const FormMessage: React.FC<FormMessageProps> = ({
  title,
  description,
  fields,
  submitLabel = 'Submit',
  onSubmit,
  isSubmitted = false
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSubmitted, setLocalSubmitted] = useState(isSubmitted);

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setLocalSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (localSubmitted || isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Form Submitted</h3>
            <p className="text-xs text-green-600 mt-1">Thank you for your submission!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-3 border-b border-gray-200">
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-primary mr-2" />
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-3 space-y-3">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label 
              htmlFor={field.id} 
              className="block text-xs font-medium text-gray-700"
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                required={field.required}
                className="text-sm"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            ) : (
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="text-sm"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <Button 
          type="submit" 
          className="w-full mt-2" 
          disabled={isSubmitting}
          size="sm"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </form>
    </div>
  );
};

export default FormMessage;
