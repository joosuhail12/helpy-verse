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
import { CompanyInformation } from '@/components/companies/detail/CompanyInformation';
import { CompanyTimeline } from '@/components/companies/detail/CompanyTimeline';
import { CompanyDetailSidebar } from '@/components/companies/detail/CompanyDetailSidebar';
import { CompanyCustomObjectData } from '@/components/companies/detail/CompanyCustomObjectData';
import { CompanyRelated } from '@/components/companies/detail/CompanyRelated';
import { CompanyDeals } from '@/components/companies/detail/CompanyDeals';
import { CompanyActivity } from '@/components/companies/detail/CompanyActivity';
import { CompanyNotes } from '@/components/companies/detail/CompanyNotes';
import { CompanyTickets } from '@/components/companies/detail/CompanyTickets';
import { Card } from '@/components/ui/card';
import { Building2, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Activity } from '@/types/activity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');

  const company = useAppSelector(selectCompanyDetails);
  const loading = useAppSelector(selectCompanyLoading);
  const error = useAppSelector(selectCompanyError);

  const loadCompanyDetails = async () => {
    if (id) {
      try {
        setIsRetrying(true);
        await dispatch(fetchCompanyById(id)).unwrap();
        setIsRetrying(false);
      } catch (error) {
        setIsRetrying(false);
        toast({
          title: "Error",
          description: "Failed to fetch company details. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    loadCompanyDetails();
  }, [id, dispatch]);

  useEffect(() => {
    if (error && retryCount < 1 && !isRetrying) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        loadCompanyDetails();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, isRetrying]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadCompanyDetails();
  };

  const handleGoBack = () => {
    navigate('/home/contacts/companies');
  };
  
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      navigate('/home/contacts/companies');
    }
  };

  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      description: 'Sent follow-up email',
      date: new Date().toISOString(),
      metadata: {
        category: 'positive',
      },
    },
  ];

  if (loading || isRetrying) {
    return (
      <div className="p-6">
        <Card className="p-6 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading company details...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold text-gray-800">Unable to load company</h2>
          <p className="text-muted-foreground text-center max-w-md">
            There was a problem loading this company's details. This may be due to a network issue or the company may not exist.
          </p>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
            <Button variant="outline" onClick={handleGoBack}>
              Return to Companies
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6">
        <Card className="p-6 flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800">Company Not Found</h2>
          <p className="text-muted-foreground text-center">
            The company you're looking for doesn't exist or has been deleted.
          </p>
          <Button variant="default" onClick={handleGoBack} className="mt-4">
            Return to Companies
          </Button>
        </Card>
      </div>
    );
  }

  const needsAttention = company.status === 'inactive';

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px]">
      <CompanyDetailHeader company={company} onDeleteClick={handleDeleteClick} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-4">
          {needsAttention && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-yellow-700">This company needs attention</p>
            </div>
          )}

          <CompanyDetailSidebar company={company} />
          <div className="mt-4 space-y-4">
            <CompanyInformation company={company} activities={activities} />
            <CompanyRelated company={company} />
            <CompanyCustomObjectData company={company} />
          </div>
        </div>

        <div className="lg:col-span-8">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activities">Activity Timeline</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
            </TabsList>

            <TabsContent value="activities">
              <CompanyTimeline company={company} />
            </TabsContent>

            <TabsContent value="tickets">
              <CompanyTickets companyId={company.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
