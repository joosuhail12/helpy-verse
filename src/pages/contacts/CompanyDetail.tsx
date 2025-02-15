
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteCompany } from '@/store/slices/companies/companiesSlice';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '@/types/activity';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyDetailHeader } from '@/components/companies/detail/CompanyDetailHeader';
import { CompanyMainInfo } from '@/components/companies/detail/CompanyMainInfo';
import { CompanyActivityTimeline } from '@/components/companies/detail/CompanyActivityTimeline';
import { AssociatedContacts } from '@/components/companies/detail/AssociatedContacts';
import { CompanyCustomFields } from '@/components/companies/detail/CompanyCustomFields';
import { CompanyCustomObjectData } from '@/components/companies/detail/CompanyCustomObjectData';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const company = useAppSelector(state => 
    state.companies.companies.find(c => c.id === id)
  );

  const activities: Activity[] = [
    {
      id: '1',
      type: 'company_update',
      description: 'Updated company information',
      date: new Date().toISOString(),
      metadata: {
        category: 'update',
      },
    },
  ];

  if (!company) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-500">
          Company not found
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteCompany(company.id));
      toast({
        title: 'Success',
        description: 'Company has been deleted.',
      });
      navigate('/home/contacts/companies');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete company.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px]">
      <CompanyDetailHeader 
        company={company} 
        onDeleteClick={() => setShowDeleteDialog(true)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-4 space-y-6">
          <CompanyMainInfo company={company} />
          <CompanyCustomFields company={company} />
          <CompanyCustomObjectData company={company} />
        </div>

        <div className="lg:col-span-8">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
              <TabsTrigger value="contacts">Manage Contacts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              <CompanyActivityTimeline activities={activities} />
            </TabsContent>
            
            <TabsContent value="contacts">
              <AssociatedContacts company={company} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyDetail;
