
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useThemeContext } from '@/context/ThemeContext';
import { HttpClient } from '@/api/services/http';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactInfoFormProps {
  workspaceId: string;
  onSuccess: (contactId: string) => void;
  onCancel?: () => void;
}

/**
 * Form component to collect contact information
 * Creates a new contact if one doesn't exist, or verifies and associates with the session
 */
const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ workspaceId, onSuccess, onCancel }) => {
  const { colors } = useThemeContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Try to find or create contact in the database
      const response = await HttpClient.apiClient.post('/contact/identify', {
        workspace_id: workspaceId,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        phone: data.phone,
      });

      if (response.data?.contact?.id) {
        // Store contact ID in local storage
        localStorage.setItem('contactId', response.data.contact.id);
        localStorage.setItem('contactEmail', data.email);
        
        // Encrypt and store some basic contact info for display
        const contactInfo = {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
        };
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
        
        onSuccess(response.data.contact.id);
      } else {
        setError('Failed to process contact information');
      }
    } catch (err: any) {
      console.error('Error identifying contact:', err);
      setError(err.message || 'An error occurred while processing your information');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4" style={{ background: colors.background, color: colors.foreground }}>
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Your Information</h2>
        <p className="text-sm mt-1" style={{ color: colors.foreground }}>
          Please provide your details to continue
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="First name" 
                      {...field} 
                      style={{ 
                        borderColor: colors.border, 
                        background: colors.inputBackground,
                        color: colors.foreground
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Last name" 
                      {...field} 
                      style={{ 
                        borderColor: colors.border, 
                        background: colors.inputBackground,
                        color: colors.foreground
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email address" 
                    {...field} 
                    style={{ 
                      borderColor: colors.border, 
                      background: colors.inputBackground,
                      color: colors.foreground
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="Phone number" 
                    {...field} 
                    style={{ 
                      borderColor: colors.border, 
                      background: colors.inputBackground,
                      color: colors.foreground
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-2 pt-2">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
                style={{ 
                  borderColor: colors.border, 
                  color: colors.foreground 
                }}
              >
                Skip
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1"
              style={{ background: colors.primary, color: colors.primaryForeground }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactInfoForm;
