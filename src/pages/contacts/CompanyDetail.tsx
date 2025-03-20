
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  fetchCompanyById, 
  selectCompanyDetails, 
  selectCompanyLoading, 
  selectCompanyError 
} from '@/store/slices/companies/companiesSlice';
import { CompanyDetailHeader } from '@/components/companies/detail/CompanyDetailHeader';
import { CompanyMainInfo } from '@/components/companies/detail/CompanyMainInfo';
import { CompanyDeals } from '@/components/companies/detail/CompanyDeals';
import { CompanyActivity } from '@/components/companies/detail/CompanyActivity';
import { CompanyNotes } from '@/components/companies/detail/CompanyNotes';
import { CompanyTickets } from '@/components/companies/detail/CompanyTickets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  const company = useAppSelector(selectCompanyDetails);
  const loading = useAppSelector(selectCompanyLoading);
  const error = useAppSelector(selectCompanyError);

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id]);

  const handleDeleteCompany = () => {
    // Add delete functionality
    toast({
      title: "Not implemented",
      description: "Delete company functionality is not yet implemented",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={() => navigate('/home/contacts/companies')}
            className="text-red-700 underline mt-2"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Company not found</p>
          <button 
            onClick={() => navigate('/home/contacts/companies')}
            className="text-yellow-700 underline mt-2"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-3 flex-none">
        <CompanyDetailHeader 
          company={company} 
          onDeleteClick={handleDeleteCompany} 
        />
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-6 border-b">
          <TabsList className="h-10">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <TabsContent value="info" className="mt-0">
                <CompanyMainInfo company={company} />
              </TabsContent>
              
              <TabsContent value="contacts" className="mt-0">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Associated Contacts</h2>
                  <p className="text-muted-foreground">No contacts associated with this company.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="deals" className="mt-0">
                <CompanyDeals company={company} />
              </TabsContent>
              
              <TabsContent value="activities" className="mt-0">
                <CompanyActivity company={company} />
              </TabsContent>
              
              <TabsContent value="tickets" className="mt-0">
                <CompanyTickets companyId={company.id} />
              </TabsContent>
              
              <TabsContent value="notes" className="mt-0">
                <CompanyNotes company={company} />
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;
