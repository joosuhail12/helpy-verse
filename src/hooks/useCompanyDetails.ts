
import { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  fetchCompanyById, 
  selectCompanyDetails, 
  selectCompanyLoading, 
  selectCompanyError 
} from '@/store/slices/companies/companiesSlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '@/types/activity';

export const useCompanyDetails = (id?: string) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

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

  // Sample activities for the timeline
  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      description: 'Sent quarterly review email',
      date: new Date().toISOString(),
      metadata: {
        category: 'positive',
        responseTime: 15
      },
    },
    {
      id: '2',
      type: 'call',
      description: 'Sales call with procurement team',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        category: 'neutral',
        responseTime: 0
      },
    },
    {
      id: '3',
      type: 'meeting',
      description: 'Quarterly business review',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        category: 'positive',
        responseTime: 0
      },
    },
    {
      id: '4',
      type: 'note',
      description: 'Updated company information',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        category: 'update',
        responseTime: 0
      },
    },
    {
      id: '5',
      type: 'ticket',
      description: 'Support ticket #1234 created',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        category: 'neutral',
        status: 'open',
        responseTime: 45
      },
    },
    {
      id: '6',
      type: 'company_update',
      description: 'Company status changed to Active',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        category: 'update',
        responseTime: 0
      },
    }
  ];

  return {
    company,
    loading,
    error,
    isRetrying,
    retryCount,
    activities,
    loadCompanyDetails,
    handleRetry,
    handleGoBack,
    handleDeleteClick,
  };
};
