
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateCompany, deleteCompany } from '@/store/slices/companies/companiesSlice';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Building2, Globe, Calendar, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { InlineEditField } from '@/components/contacts/detail/InlineEditField';
import { useToast } from '@/hooks/use-toast';
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
import { Activity } from '@/types/activity';
import { AssociatedContacts } from '@/components/companies/detail/AssociatedContacts';

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
        <Card className="p-4 text-red-500">
          Company not found
        </Card>
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
      <div className="border-b border-purple-100/20 pb-6 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/home/contacts/companies')}
            className="mt-1 hover:bg-purple-50/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-purple-600" />
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Company
          </Button>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="p-4 bg-purple-100 rounded-lg">
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {company.name}
            </h1>
            <p className="text-sm text-purple-600/70 mt-1">
              {company.website}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Left Column (4/12 width) - Company Information */}
        <div className="lg:col-span-4 space-y-6">
          {/* Company Information Card */}
          <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
            <CardHeader className="border-b border-purple-100/20 pb-4">
              <CardTitle className="text-lg font-semibold text-purple-900">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
                    <Building2 className="h-4 w-4" />
                    <span>Company Name</span>
                  </div>
                  <InlineEditField
                    value={company.name}
                    contactId={company.id}
                    field="name"
                    label="Company Name"
                    validation={[{ type: 'required', value: '', message: 'Company name is required' }]}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                  </div>
                  <InlineEditField
                    value={company.website || ''}
                    contactId={company.id}
                    field="website"
                    label="Website"
                  />
                </div>

                {/* New Fields */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
                    <span>Industry</span>
                  </div>
                  <InlineEditField
                    value={company.industry || ''}
                    contactId={company.id}
                    field="industry"
                    label="Industry"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
                    <span>Employee Count</span>
                  </div>
                  <InlineEditField
                    value={String(company.employeeCount || '')}
                    contactId={company.id}
                    field="employeeCount"
                    label="Employee Count"
                    type="number"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
                    <Calendar className="h-4 w-4" />
                    <span>Created At</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-900/70">
                    <Calendar className="h-4 w-4" />
                    <span>Last Updated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(company.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (8/12 width) - Tabbed Content */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
              <TabsTrigger value="contacts">Manage Contacts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
                <CardHeader className="border-b border-purple-100/20 pb-4">
                  <CardTitle className="text-lg font-semibold text-purple-900">Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Building2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
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
