
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createCannedResponse } from '@/store/slices/cannedResponses/actions';
import { ResponsePreview } from '@/components/settings/cannedResponses/form/ResponsePreview';
import { BasicInformationSection } from './cannedResponses/form/BasicInformationSection';
import { OrganizationSection } from './cannedResponses/form/OrganizationSection';
import SharingSettingsSection from './cannedResponses/form/SharingSettingsSection';
import { formSchema, type FormValues } from './cannedResponses/formSchema';
import type { CannedResponse } from '@/mock/cannedResponses';

const CreateCannedResponse = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      shortcut: '',
      category: '',
      isShared: false,
      createdBy: 'Current User',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(createCannedResponse(data as Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>)).unwrap();
      toast({
        title: "Success",
        description: "Canned response created successfully",
      });
      navigate('/home/settings/canned-responses');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create canned response",
        variant: "destructive",
      });
    }
  };

  const watchTitle = form.watch('title');
  const watchContent = form.watch('content');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/home/settings/canned-responses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Canned Response</h1>
          <p className="text-muted-foreground">
            Create a new canned response for quick replies
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <BasicInformationSection form={form} />
              <OrganizationSection form={form} />
              <SharingSettingsSection />
            </div>

            <div className="space-y-6">
              <div className="sticky top-6">
                <ResponsePreview
                  title={watchTitle}
                  content={watchContent}
                />
              </div>
            </div>
          </div>

          <Button type="submit">Create Response</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCannedResponse;
